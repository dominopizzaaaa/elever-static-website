/**
 * Google Apps Script receiver for website enquiry submissions.
 *
 * Required Script Properties:
 *   ENQUIRY_WEBHOOK_SECRET - shared with the Vercel serverless function
 *   SPREADSHEET_ID          - ID of the private destination spreadsheet
 *
 * Optional Script Property:
 *   ENQUIRY_SHEET_NAME      - destination tab (defaults to "Enquiries")
 */

var ENQUIRY_DEFAULT_SHEET_NAME = 'Enquiries';
var ENQUIRY_SECRET_PROPERTY = 'ENQUIRY_WEBHOOK_SECRET';
var ENQUIRY_SPREADSHEET_ID_PROPERTY = 'SPREADSHEET_ID';
var ENQUIRY_SHEET_NAME_PROPERTY = 'ENQUIRY_SHEET_NAME';

var ENQUIRY_FIELD_KEYS = [
  'Name',
  'Email',
  'Country code',
  'Mobile',
  'Topic',
  'Name of student',
  'Age of student',
  'Preferred class type',
  'Preferred area',
  'Organisation',
  'Event type',
  'Estimated number of participants',
  'Age',
  'Role of interest',
  'Experience and qualifications',
  'Availability',
  'CV or profile URL',
  'Message'
];

var ENQUIRY_HEADERS = [
  'Submission ID',
  'Submitted at',
  'Form type',
  'Subject'
].concat(ENQUIRY_FIELD_KEYS);

/**
 * Receives the Vercel webhook. Google Apps Script dispatches POST requests to
 * this function; no other verb has a write handler.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents ||
        String(e.postData.type || '').toLowerCase().split(';')[0] !== 'application/json') {
      return enquiryJson_({ ok: false, error: 'invalid_json_request' });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return enquiryJson_({ ok: false, error: 'invalid_json_request' });
    }

    if (!enquiryIsObject_(payload) ||
        !enquiryHasExactKeys_(payload, ['secret', 'submission']) ||
        typeof payload.secret !== 'string' ||
        !enquiryIsObject_(payload.submission)) {
      return enquiryJson_({ ok: false, error: 'invalid_payload' });
    }

    var properties = PropertiesService.getScriptProperties();
    var configuredSecret = properties.getProperty(ENQUIRY_SECRET_PROPERTY);
    var spreadsheetId = properties.getProperty(ENQUIRY_SPREADSHEET_ID_PROPERTY);
    var configuredSheetName = properties.getProperty(ENQUIRY_SHEET_NAME_PROPERTY);
    var sheetName = configuredSheetName && configuredSheetName.trim()
      ? configuredSheetName.trim()
      : ENQUIRY_DEFAULT_SHEET_NAME;

    if (typeof configuredSecret !== 'string' || configuredSecret.length === 0 ||
        typeof spreadsheetId !== 'string' || spreadsheetId.trim().length === 0) {
      return enquiryJson_({ ok: false, error: 'receiver_not_configured' });
    }

    if (!enquirySecretsMatch_(payload.secret, configuredSecret)) {
      return enquiryJson_({ ok: false, error: 'unauthorized' });
    }

    if (!enquiryIsValidSubmission_(payload.submission)) {
      return enquiryJson_({ ok: false, error: 'invalid_submission' });
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(3000)) {
      return enquiryJson_({ ok: false, error: 'receiver_busy' });
    }

    try {
      var spreadsheet = SpreadsheetApp.openById(spreadsheetId.trim());
      var sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
      }

      enquiryEnsureHeaders_(sheet);

      if (enquiryHasSubmissionId_(sheet, payload.submission.submissionId)) {
        return enquiryJson_({ ok: true, duplicate: true });
      }

      enquiryAppendSubmission_(sheet, payload.submission);
      return enquiryJson_({ ok: true, duplicate: false });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('Enquiry receiver failed: ' +
      (error && error.message ? error.message : String(error)));
    return enquiryJson_({
      ok: false,
      error: error && error.publicCode ? error.publicCode : 'internal_error'
    });
  }
}

/**
 * A browser visit must not expose data or perform a write. Apps Script rejects
 * unsupported HTTP verbs before invoking this script.
 */
function doGet() {
  return enquiryJson_({ ok: false, error: 'method_not_allowed' });
}

function enquiryIsValidSubmission_(submission) {
  var submissionKeys = [
    'submissionId',
    'submittedAt',
    'formType',
    'subject',
    'fields'
  ];

  if (!enquiryHasExactKeys_(submission, submissionKeys) ||
      typeof submission.submissionId !== 'string' ||
      submission.submissionId.trim().length === 0 ||
      typeof submission.submittedAt !== 'string' ||
      !enquiryIsIsoTimestamp_(submission.submittedAt) ||
      submission.formType !== 'contact' ||
      typeof submission.subject !== 'string' ||
      submission.subject.trim().length === 0 ||
      !enquiryIsObject_(submission.fields) ||
      !enquiryHasExactKeys_(submission.fields, ENQUIRY_FIELD_KEYS)) {
    return false;
  }

  for (var i = 0; i < ENQUIRY_FIELD_KEYS.length; i += 1) {
    if (typeof submission.fields[ENQUIRY_FIELD_KEYS[i]] !== 'string') {
      return false;
    }
  }

  return true;
}

function enquiryIsIsoTimestamp_(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    !isNaN(Date.parse(value));
}

function enquiryEnsureHeaders_(sheet) {
  if (sheet.getMaxColumns() < ENQUIRY_HEADERS.length) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      ENQUIRY_HEADERS.length - sheet.getMaxColumns()
    );
  }

  var headerRange = sheet.getRange(1, 1, 1, ENQUIRY_HEADERS.length);
  if (sheet.getLastRow() === 0) {
    headerRange.setValues([ENQUIRY_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  var headerWidth = Math.max(ENQUIRY_HEADERS.length, sheet.getLastColumn());
  var currentHeaders = sheet.getRange(1, 1, 1, headerWidth).getDisplayValues()[0];
  var headersMatch = true;

  for (var i = 0; i < ENQUIRY_HEADERS.length; i += 1) {
    if (currentHeaders[i] !== ENQUIRY_HEADERS[i]) {
      headersMatch = false;
      break;
    }
  }

  for (var j = ENQUIRY_HEADERS.length; headersMatch && j < currentHeaders.length; j += 1) {
    if (currentHeaders[j] !== '') {
      headersMatch = false;
    }
  }

  if (!headersMatch) {
    var headerError = new Error(
      'Destination sheet header row does not match the required enquiry headers.'
    );
    headerError.publicCode = 'sheet_header_mismatch';
    throw headerError;
  }

  sheet.setFrozenRows(1);
}

function enquiryHasSubmissionId_(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return false;
  }

  return sheet.getRange(2, 1, lastRow - 1, 1)
    .createTextFinder(submissionId)
    .useRegularExpression(false)
    .matchCase(true)
    .matchEntireCell(true)
    .findNext() !== null;
}

function enquiryAppendSubmission_(sheet, submission) {
  var row = [
    submission.submissionId,
    submission.submittedAt,
    submission.formType,
    submission.subject
  ];

  for (var i = 0; i < ENQUIRY_FIELD_KEYS.length; i += 1) {
    row.push(submission.fields[ENQUIRY_FIELD_KEYS[i]]);
  }

  for (var j = 0; j < row.length; j += 1) {
    row[j] = enquiryNeutralizeFormula_(row[j]);
  }

  var nextRow = Math.max(sheet.getLastRow() + 1, 2);
  var destination = sheet.getRange(nextRow, 1, 1, ENQUIRY_HEADERS.length);
  destination.setNumberFormat('@');
  destination.setValues([row]);
}

/**
 * A leading apostrophe makes formula-like input literal text in Sheets. The
 * apostrophe is an input marker and is not displayed as part of the cell value.
 */
function enquiryNeutralizeFormula_(value) {
  var text = String(value);
  return /^\s*[=+\-@]/.test(text) ? "'" + text : text;
}

function enquiryHasExactKeys_(value, expectedKeys) {
  if (!enquiryIsObject_(value)) {
    return false;
  }

  var actualKeys = Object.keys(value).sort();
  var sortedExpected = expectedKeys.slice().sort();

  if (actualKeys.length !== sortedExpected.length) {
    return false;
  }

  for (var i = 0; i < actualKeys.length; i += 1) {
    if (actualKeys[i] !== sortedExpected[i]) {
      return false;
    }
  }

  return true;
}

function enquiryIsObject_(value) {
  return value !== null &&
    Object.prototype.toString.call(value) === '[object Object]';
}

function enquirySecretsMatch_(provided, configured) {
  if (provided.length !== configured.length) {
    return false;
  }

  var difference = 0;
  for (var i = 0; i < configured.length; i += 1) {
    difference |= provided.charCodeAt(i) ^ configured.charCodeAt(i);
  }

  return difference === 0;
}

function enquiryJson_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
