'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const receiverPath = path.resolve(
  __dirname,
  '../integrations/google-sheets/Code.gs'
);
const receiverSource = fs.readFileSync(receiverPath, 'utf8');

const FIELD_KEYS = [
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
  'Message',
];

const HEADERS = [
  'Submission ID',
  'Submitted at',
  'Form type',
  'Subject',
  ...FIELD_KEYS,
];

class TextFinderMock {
  constructor(range, searchText) {
    this.range = range;
    this.searchText = searchText;
    this.isRegex = undefined;
    this.isCaseSensitive = undefined;
    this.isWholeCell = undefined;
  }

  useRegularExpression(value) {
    this.isRegex = value;
    return this;
  }

  matchCase(value) {
    this.isCaseSensitive = value;
    return this;
  }

  matchEntireCell(value) {
    this.isWholeCell = value;
    return this;
  }

  findNext() {
    assert.equal(this.isRegex, false);
    assert.equal(this.isCaseSensitive, true);
    assert.equal(this.isWholeCell, true);

    const found = this.range.getDisplayValues()
      .some(row => row.some(value => value === this.searchText));
    return found ? { value: this.searchText } : null;
  }
}

class RangeMock {
  constructor(sheet, row, column, rowCount, columnCount) {
    this.sheet = sheet;
    this.row = row;
    this.column = column;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
  }

  getDisplayValues() {
    return Array.from({ length: this.rowCount }, (_, rowOffset) => (
      Array.from({ length: this.columnCount }, (_, columnOffset) => {
        const row = this.sheet.cells[this.row - 1 + rowOffset] || [];
        const value = row[this.column - 1 + columnOffset];
        return value === undefined || value === null ? '' : String(value);
      })
    ));
  }

  setValues(values) {
    assert.equal(values.length, this.rowCount);
    for (let rowOffset = 0; rowOffset < this.rowCount; rowOffset += 1) {
      assert.equal(values[rowOffset].length, this.columnCount);
      const rowIndex = this.row - 1 + rowOffset;
      if (!this.sheet.cells[rowIndex]) this.sheet.cells[rowIndex] = [];
      for (let columnOffset = 0; columnOffset < this.columnCount; columnOffset += 1) {
        this.sheet.cells[rowIndex][this.column - 1 + columnOffset] =
          values[rowOffset][columnOffset];
      }
    }
    return this;
  }

  setNumberFormat(format) {
    this.sheet.numberFormats.push({
      row: this.row,
      column: this.column,
      rowCount: this.rowCount,
      columnCount: this.columnCount,
      format,
    });
    return this;
  }

  createTextFinder(searchText) {
    this.sheet.textFinderSearches.push(searchText);
    return new TextFinderMock(this, searchText);
  }
}

class SheetMock {
  constructor(name, cells = []) {
    this.name = name;
    this.cells = cells.map(row => row.slice());
    this.maxColumns = 26;
    this.frozenRows = 0;
    this.numberFormats = [];
    this.textFinderSearches = [];
  }

  getMaxColumns() {
    return this.maxColumns;
  }

  insertColumnsAfter(afterColumn, count) {
    assert.equal(afterColumn, this.maxColumns);
    this.maxColumns += count;
  }

  getRange(row, column, rowCount = 1, columnCount = 1) {
    return new RangeMock(this, row, column, rowCount, columnCount);
  }

  getLastRow() {
    let lastRow = this.cells.length;
    while (lastRow > 0) {
      const row = this.cells[lastRow - 1] || [];
      if (row.some(value => value !== '' && value !== undefined && value !== null)) break;
      lastRow -= 1;
    }
    return lastRow;
  }

  getLastColumn() {
    let lastColumn = 0;
    for (const row of this.cells) {
      for (let index = row.length - 1; index >= 0; index -= 1) {
        if (row[index] !== '' && row[index] !== undefined && row[index] !== null) {
          lastColumn = Math.max(lastColumn, index + 1);
          break;
        }
      }
    }
    return lastColumn;
  }

  setFrozenRows(count) {
    this.frozenRows = count;
  }
}

class SpreadsheetMock {
  constructor(initialSheets = {}) {
    this.sheets = { ...initialSheets };
  }

  getSheetByName(name) {
    return this.sheets[name] || null;
  }

  insertSheet(name) {
    assert.equal(this.sheets[name], undefined, 'sheet already exists');
    const sheet = new SheetMock(name);
    this.sheets[name] = sheet;
    return sheet;
  }
}

function createHarness(options = {}) {
  const spreadsheet = options.spreadsheet || new SpreadsheetMock();
  const properties = {
    ENQUIRY_WEBHOOK_SECRET: 'receiver-test-secret',
    SPREADSHEET_ID: 'spreadsheet-test-id',
    ...(options.properties || {}),
  };
  const calls = {
    openedSpreadsheetIds: [],
    lockAttempts: [],
    lockReleases: 0,
    errors: [],
  };

  const context = vm.createContext({
    console: {
      error(...args) {
        calls.errors.push(args);
      },
    },
    PropertiesService: {
      getScriptProperties() {
        return {
          getProperty(name) {
            return Object.prototype.hasOwnProperty.call(properties, name)
              ? properties[name]
              : null;
          },
        };
      },
    },
    LockService: {
      getScriptLock() {
        return {
          tryLock(timeout) {
            calls.lockAttempts.push(timeout);
            return options.lockAvailable !== false;
          },
          releaseLock() {
            calls.lockReleases += 1;
          },
        };
      },
    },
    SpreadsheetApp: {
      openById(id) {
        calls.openedSpreadsheetIds.push(id);
        if (options.openError) throw options.openError;
        return spreadsheet;
      },
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(text) {
        return {
          text,
          mimeType: null,
          setMimeType(mimeType) {
            this.mimeType = mimeType;
            return this;
          },
        };
      },
    },
  });

  vm.runInContext(receiverSource, context, { filename: receiverPath });
  return { context, spreadsheet, calls };
}

function fields(overrides = {}) {
  return Object.fromEntries(FIELD_KEYS.map(key => [key, overrides[key] || '']));
}

function submission(overrides = {}) {
  return {
    submissionId: '123e4567-e89b-42d3-a456-426614174000',
    submittedAt: '2026-09-16T01:02:03.000Z',
    formType: 'contact',
    subject: 'Website enquiry',
    fields: fields({
      Name: 'Synthetic Test',
      Email: 'synthetic@example.invalid',
      Topic: 'Others',
      Message: 'Synthetic test message',
    }),
    ...overrides,
  };
}

function postEvent(payload) {
  return {
    postData: {
      type: 'application/json; charset=utf-8',
      contents: typeof payload === 'string' ? payload : JSON.stringify(payload),
    },
  };
}

function invoke(harness, payload) {
  const output = harness.context.doPost(postEvent(payload));
  assert.equal(output.mimeType, 'application/json');
  return JSON.parse(output.text);
}

function authenticatedPayload(overrides = {}) {
  return {
    secret: 'receiver-test-secret',
    submission: submission(),
    ...overrides,
  };
}

test('inserts one valid submission with the fixed header row', () => {
  const harness = createHarness();

  const result = invoke(harness, authenticatedPayload());

  assert.deepEqual(result, { ok: true, duplicate: false });
  const sheet = harness.spreadsheet.sheets.Enquiries;
  assert.ok(sheet);
  assert.deepEqual(sheet.cells[0], HEADERS);
  assert.deepEqual(sheet.cells[1], [
    '123e4567-e89b-42d3-a456-426614174000',
    '2026-09-16T01:02:03.000Z',
    'contact',
    'Website enquiry',
    'Synthetic Test',
    'synthetic@example.invalid',
    '',
    '',
    'Others',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Synthetic test message',
  ]);
  assert.equal(sheet.frozenRows, 1);
  assert.deepEqual(sheet.numberFormats, [{
    row: 2,
    column: 1,
    rowCount: 1,
    columnCount: HEADERS.length,
    format: '@',
  }]);
  assert.deepEqual(harness.calls.openedSpreadsheetIds, ['spreadsheet-test-id']);
  assert.deepEqual(harness.calls.lockAttempts, [3000]);
  assert.equal(harness.calls.lockReleases, 1);
});

test('returns duplicate and does not append a second row for the same submission ID', () => {
  const harness = createHarness();
  const payload = authenticatedPayload();

  assert.deepEqual(invoke(harness, payload), { ok: true, duplicate: false });
  assert.deepEqual(invoke(harness, payload), { ok: true, duplicate: true });

  const sheet = harness.spreadsheet.sheets.Enquiries;
  assert.equal(sheet.cells.length, 2);
  assert.deepEqual(sheet.textFinderSearches, [
    '123e4567-e89b-42d3-a456-426614174000',
  ]);
  assert.equal(harness.calls.lockReleases, 2);
});

test('rejects an unauthorized request before locking or opening the spreadsheet', () => {
  const harness = createHarness();
  const payload = authenticatedPayload({ secret: 'wrong-secret' });

  assert.deepEqual(invoke(harness, payload), { ok: false, error: 'unauthorized' });
  assert.deepEqual(harness.calls.lockAttempts, []);
  assert.deepEqual(harness.calls.openedSpreadsheetIds, []);
  assert.equal(harness.calls.lockReleases, 0);
});

test('rejects malformed JSON before locking or opening the spreadsheet', () => {
  const harness = createHarness();

  assert.deepEqual(invoke(harness, '{"secret":'), {
    ok: false,
    error: 'invalid_json_request',
  });
  assert.deepEqual(harness.calls.lockAttempts, []);
  assert.deepEqual(harness.calls.openedSpreadsheetIds, []);
  assert.equal(harness.calls.lockReleases, 0);
});

test('requires the exact payload, submission, and canonical fields schemas', async t => {
  const cases = [
    ['extra payload key', payload => { payload.extra = true; }, 'invalid_payload'],
    ['missing submission key', payload => { delete payload.submission.subject; }, 'invalid_submission'],
    ['extra submission key', payload => { payload.submission.extra = true; }, 'invalid_submission'],
    ['missing canonical field', payload => { delete payload.submission.fields.Message; }, 'invalid_submission'],
    ['extra canonical field', payload => { payload.submission.fields.Holiday = ''; }, 'invalid_submission'],
    ['non-string canonical field', payload => { payload.submission.fields.Age = 12; }, 'invalid_submission'],
    ['non-contact form type', payload => { payload.submission.formType = 'newsletter'; }, 'invalid_submission'],
  ];

  for (const [name, mutate, expectedError] of cases) {
    await t.test(name, () => {
      const harness = createHarness();
      const payload = authenticatedPayload();
      mutate(payload);

      assert.deepEqual(invoke(harness, payload), { ok: false, error: expectedError });
      assert.deepEqual(harness.calls.lockAttempts, []);
      assert.deepEqual(harness.calls.openedSpreadsheetIds, []);
      assert.equal(harness.calls.lockReleases, 0);
    });
  }
});

test('preserves a populated sheet with mismatched headers and rejects the write', () => {
  const originalCells = [
    ['Legacy ID', 'Legacy value'],
    ['legacy-1', 'must remain unchanged'],
  ];
  const sheet = new SheetMock('Enquiries', originalCells);
  const spreadsheet = new SpreadsheetMock({ Enquiries: sheet });
  const harness = createHarness({ spreadsheet });

  assert.deepEqual(invoke(harness, authenticatedPayload()), {
    ok: false,
    error: 'sheet_header_mismatch',
  });
  assert.deepEqual(sheet.cells, originalCells);
  assert.equal(harness.calls.lockReleases, 1);
});

test('returns receiver_busy without opening the sheet or releasing an unacquired lock', () => {
  const harness = createHarness({ lockAvailable: false });

  assert.deepEqual(invoke(harness, authenticatedPayload()), {
    ok: false,
    error: 'receiver_busy',
  });
  assert.deepEqual(harness.calls.lockAttempts, [3000]);
  assert.deepEqual(harness.calls.openedSpreadsheetIds, []);
  assert.equal(harness.calls.lockReleases, 0);
});

test('neutralizes formula-leading values while preserving ordinary text', () => {
  const harness = createHarness();
  const payload = authenticatedPayload({
    submission: submission({
      subject: '=HYPERLINK("https://example.invalid")',
      fields: fields({
        Name: '=IMPORTDATA("https://example.invalid")',
        Email: '+synthetic@example.invalid',
        'Country code': '-1',
        Mobile: '   @dangerous',
        Topic: 'Others',
        Message: 'ordinary text',
      }),
    }),
  });

  assert.deepEqual(invoke(harness, payload), { ok: true, duplicate: false });
  const row = harness.spreadsheet.sheets.Enquiries.cells[1];
  assert.equal(row[3], '\'=HYPERLINK("https://example.invalid")');
  assert.equal(row[4], '\'=IMPORTDATA("https://example.invalid")');
  assert.equal(row[5], '\'+synthetic@example.invalid');
  assert.equal(row[6], '\'-1');
  assert.equal(row[7], '\'   @dangerous');
  assert.equal(row[21], 'ordinary text');
});

test('releases an acquired lock when spreadsheet work throws', () => {
  const harness = createHarness({ openError: new Error('simulated Sheets failure') });

  assert.deepEqual(invoke(harness, authenticatedPayload()), {
    ok: false,
    error: 'internal_error',
  });
  assert.deepEqual(harness.calls.lockAttempts, [3000]);
  assert.equal(harness.calls.lockReleases, 1);
  assert.equal(harness.calls.errors.length, 1);
});
