'use strict';

// Vercel Serverless Function — POST /api/contact
// Valid submissions are delivered independently to Resend and, for contact
// enquiries, to a private Google Sheet through the Apps Script webhook in
// integrations/google-sheets. One unavailable provider must not block the other.

const { createHash, randomUUID } = require('crypto');

const TO = 'info@eleverbadminton.com';
const DEFAULT_FROM = 'Elever Website <noreply@eleverbadminton.com>';
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_FIELD_LENGTH = 10000;
const MAX_RESEND_IDEMPOTENCY_KEY_LENGTH = 256;

const CONTACT_FIELDS = [
  'Name', 'Email', 'Country code', 'Mobile', 'Topic',
  'Name of student', 'Age of student', 'Preferred class type', 'Preferred area',
  'Organisation', 'Event type', 'Estimated number of participants',
  'Age', 'Role of interest', 'Experience and qualifications', 'Availability',
  'CV or profile URL', 'Message'
];
const FIELDS_BY_FORM = {
  contact: CONTACT_FIELDS,
  'camp-waitlist': ['Email', 'Child age', 'Holiday'],
  newsletter: ['Email'],
};
const FIELDS = Array.from(new Set(
  Object.keys(FIELDS_BY_FORM).reduce(function (all, formType) {
    return all.concat(FIELDS_BY_FORM[formType]);
  }, [])
));
const FORM_TYPES = {
  contact: 'Website enquiry',
  'camp-waitlist': 'Camp waitlist signup',
  newsletter: 'Newsletter signup',
};
const REQUIRED_BY_TOPIC = {
  Classes: ['Name of student', 'Age of student', 'Preferred class type', 'Preferred area'],
  Events: ['Organisation', 'Event type'],
  Careers: ['Age', 'Role of interest', 'Experience and qualifications', 'Availability'],
  Others: ['Message'],
};
const ALLOWED_VALUES = {
  'Preferred class type': new Set(['Group Classes', 'Private Classes', 'Holiday Camps']),
  'Preferred area': new Set(['Central', 'East', 'West', 'North', 'North-East']),
  'Event type': new Set(['Carnival', 'Clinic', 'Competition']),
  'Role of interest': new Set(['Badminton Coach', 'Assistant Coach', 'Operations & Events', 'Internship', 'Other']),
  Availability: new Set(['Immediately', 'Within one month', 'Within one to three months', 'Flexible']),
  Holiday: new Set(['Any', 'March', 'June', 'September', 'December']),
};
const ALLOWED_ORIGINS = new Set([
  'https://www.eleverbadminton.com',
  'https://eleverbadminton.com',
]);
const COUNTRY_CODES = new Set([
  '+65', '+60', '+62', '+66', '+63', '+84', '+673', '+855', '+856', '+95',
  '+86', '+852', '+853', '+886', '+81', '+82', '+91', '+880', '+94', '+977',
  '+92', '+971', '+966', '+974', '+64', '+61', '+1', '+52', '+55', '+44',
  '+353', '+33', '+49', '+39', '+34', '+31', '+41', '+46', '+47', '+45',
  '+358', '+27'
]);
const REQUEST_ID = /^[A-Za-z0-9._:-]{8,64}$/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function timeoutMs() {
  const configured = Number(process.env.ENQUIRY_DELIVERY_TIMEOUT_MS);
  return Number.isFinite(configured) && configured >= 6000 && configured <= 15000
    ? configured
    : DEFAULT_TIMEOUT_MS;
}

async function withDeliveryTimeout(work) {
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, timeoutMs());
  try {
    return await work(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

function normalizedFields(body) {
  const fields = {};
  FIELDS.forEach(function (field) {
    fields[field] = String(body[field] == null ? '' : body[field]).trim();
  });
  if (!fields.Mobile) fields['Country code'] = '';
  return fields;
}

function fieldsForForm(formType, fields) {
  return FIELDS_BY_FORM[formType].reduce(function (selected, field) {
    selected[field] = fields[field];
    return selected;
  }, {});
}

function deliveryId(requestId, formType, fields) {
  const fingerprint = createHash('sha256')
    .update(requestId + '\n' + formType + '\n' + JSON.stringify(fields))
    .digest('hex')
    .slice(0, 16);
  return requestId + ':' + fingerprint;
}

function validate(body, fields) {
  const formType = String(body.formType || '').trim();
  if (!Object.prototype.hasOwnProperty.call(FORM_TYPES, formType)) {
    return 'A valid form type is required.';
  }
  if (body.consent !== true) return 'Consent is required.';

  const oversized = FIELDS.find(function (field) {
    return fields[field].length > MAX_FIELD_LENGTH;
  });
  if (oversized) return oversized + ' is too long.';

  if (!fields.Email) return 'Email is required.';
  if (fields.Email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.Email)) {
    return 'Please enter a valid email address.';
  }

  if (formType === 'contact') {
    if (!fields.Name || !REQUIRED_BY_TOPIC[fields.Topic]) {
      return 'Name and a valid enquiry type are required.';
    }
    if (fields.Mobile && !fields['Country code']) {
      return 'A country code is required with a mobile number.';
    }
    if (fields['Country code'] && !COUNTRY_CODES.has(fields['Country code'])) {
      return 'Please select a valid country code.';
    }
    const missingTopicField = REQUIRED_BY_TOPIC[fields.Topic].find(function (field) {
      return !fields[field];
    });
    if (missingTopicField) {
      return missingTopicField + ' is required for ' + fields.Topic.toLowerCase() + ' enquiries.';
    }
    const activeAllowedFields = fields.Topic === 'Classes'
      ? ['Preferred class type', 'Preferred area']
      : fields.Topic === 'Events'
        ? ['Event type']
        : fields.Topic === 'Careers'
          ? ['Role of interest', 'Availability']
          : [];
    const invalidChoice = activeAllowedFields.find(function (field) {
      return !ALLOWED_VALUES[field].has(fields[field]);
    });
    if (invalidChoice) return 'Please select a valid ' + invalidChoice.toLowerCase() + '.';

    const numberRules = fields.Topic === 'Classes'
      ? [['Age of student', 3, 99]]
      : fields.Topic === 'Events'
        ? [['Estimated number of participants', 1, Number.MAX_SAFE_INTEGER]]
        : fields.Topic === 'Careers'
          ? [['Age', 16, 99]]
          : [];
    const invalidNumber = numberRules.find(function (rule) {
      const value = fields[rule[0]];
      if (!value && rule[0] === 'Estimated number of participants') return false;
      const numeric = Number(value);
      return !/^\d+$/.test(value) || !Number.isSafeInteger(numeric) || numeric < rule[1] || numeric > rule[2];
    });
    if (invalidNumber) return 'Please enter a valid ' + invalidNumber[0].toLowerCase() + '.';

    if (fields['CV or profile URL']) {
      try {
        const profileUrl = new URL(fields['CV or profile URL']);
        if (profileUrl.protocol !== 'https:' && profileUrl.protocol !== 'http:') throw new Error('Invalid protocol');
      } catch (error) {
        return 'Please enter a valid CV or profile URL.';
      }
    }
  } else if (formType === 'camp-waitlist') {
    if (fields.Holiday && !ALLOWED_VALUES.Holiday.has(fields.Holiday)) {
      return 'Please select a valid holiday.';
    }
    if (fields['Child age']) {
      const childAge = Number(fields['Child age']);
      if (!/^\d+$/.test(fields['Child age']) || !Number.isSafeInteger(childAge) || childAge < 3 || childAge > 18) {
        return 'Please enter a valid child age.';
      }
    }
  }

  return null;
}

function emailContent(fields) {
  const populated = Object.keys(fields).filter(function (field) { return fields[field]; });
  const rows = populated.map(function (field) {
    return '<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">' +
      escapeHtml(field) + '</td><td style="padding:4px 0">' +
      escapeHtml(fields[field]).replace(/\n/g, '<br>') + '</td></tr>';
  }).join('');

  return {
    html: '<div style="font-family:Arial,Helvetica,sans-serif;color:#111">' +
      '<h2 style="margin:0 0 12px">New website submission</h2>' +
      '<table style="border-collapse:collapse;font-size:14px">' + rows + '</table></div>',
    text: populated.map(function (field) { return field + ': ' + fields[field]; }).join('\n'),
  };
}

async function sendEmail(submission) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Enquiry delivery: Resend is not configured', submission.submissionId);
    return 'not_configured';
  }

  const content = emailContent(submission.fields);
  try {
    const response = await withDeliveryTimeout(function (signal) {
      return fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
          'Idempotency-Key': ('elever-' + submission.formType + '-' + submission.submissionId)
            .slice(0, MAX_RESEND_IDEMPOTENCY_KEY_LENGTH),
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || DEFAULT_FROM,
          to: [TO],
          reply_to: submission.fields.Email,
          subject: submission.subject,
          html: content.html,
          text: content.text,
        }),
        signal: signal,
      });
    });

    if (!response.ok) {
      console.error('Enquiry delivery: Resend failed', submission.submissionId, response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error('Enquiry delivery: Resend request failed', submission.submissionId, error.name || 'Error');
    return 'failed';
  }
}

async function saveEnquiryBackup(submission) {
  if (submission.formType !== 'contact') return 'not_applicable';

  const url = process.env.ENQUIRY_WEBHOOK_URL;
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error('Enquiry delivery: Google Sheets backup is not configured', submission.submissionId);
    return 'not_configured';
  }

  try {
    const backupResult = await withDeliveryTimeout(async function (signal) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secret, submission: submission }),
        signal: signal,
      });
      return {
        response: response,
        // Keep response parsing inside the timeout. Apps Script returns errors
        // as JSON with HTTP 200, so both the status and body are significant.
        result: response.ok ? await response.json() : null,
      };
    });
    const response = backupResult.response;
    if (!response.ok) {
      console.error('Enquiry delivery: Google Sheets backup failed', submission.submissionId, response.status);
      return 'failed';
    }

    const result = backupResult.result;
    if (!result || result.ok !== true) {
      console.error('Enquiry delivery: Google Sheets backup rejected the request', submission.submissionId);
      return 'failed';
    }
    return result.duplicate === true ? 'duplicate' : 'saved';
  } catch (error) {
    console.error('Enquiry delivery: Google Sheets request failed', submission.submissionId, error.name || 'Error');
    return 'failed';
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const contentType = String(req.headers && req.headers['content-type'] || '').toLowerCase();
  if (!/^application\/json(?:\s*;|$)/.test(contentType)) {
    return res.status(415).json({ error: 'Content-Type must be application/json.' });
  }
  const origin = String(req.headers && req.headers.origin || '').trim();
  const forwardedHost = String(req.headers && (req.headers['x-forwarded-host'] || req.headers.host) || '')
    .split(',')[0].trim().toLowerCase();
  const isPreviewOrigin = origin && forwardedHost && origin === 'https://' + forwardedHost &&
    /(?:^|\.)vercel\.app$/.test(forwardedHost);
  const isLocalOrigin = origin && forwardedHost &&
    /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(forwardedHost) &&
    origin === 'http://' + forwardedHost;
  if (origin && !ALLOWED_ORIGINS.has(origin) && !isPreviewOrigin && !isLocalOrigin) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }

  // Vercel parses JSON bodies automatically; fall back to manual parsing for
  // direct tests and other compatible serverless runtimes.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (error) { body = {}; }
  }
  body = body && typeof body === 'object' && !Array.isArray(body) ? body : {};

  const fields = normalizedFields(body);
  const validationError = validate(body, fields);
  if (validationError) return res.status(400).json({ error: validationError });

  const formType = String(body.formType).trim();
  const formFields = fieldsForForm(formType, fields);
  const suppliedId = String(body.submissionId || '').trim();
  const requestId = REQUEST_ID.test(suppliedId) ? suppliedId : randomUUID();
  // Bind idempotency to both the browser's retry ID and the canonical payload.
  // An unchanged retry resolves to the same delivery ID; edited content cannot
  // be mistaken for an already-saved Sheet row under the old ID.
  const submissionId = deliveryId(requestId, formType, formFields);
  const submission = {
    submissionId: submissionId,
    submittedAt: new Date().toISOString(),
    formType: formType,
    subject: FORM_TYPES[formType],
    fields: formFields,
  };

  // Always settle both promises. In particular, a Resend outage must never
  // prevent the independent Google Sheets copy from being attempted.
  const results = await Promise.all([sendEmail(submission), saveEnquiryBackup(submission)]);
  const delivery = { email: results[0], backup: results[1] };
  const emailDelivered = delivery.email === 'sent';
  const backupDelivered = delivery.backup === 'saved' || delivery.backup === 'duplicate';
  const delivered = formType === 'contact' ? emailDelivered || backupDelivered : emailDelivered;

  if (!delivered) {
    return res.status(502).json({
      error: 'Could not deliver your message. Please try again.',
      submissionId: submissionId,
      delivery: delivery,
    });
  }

  return res.status(200).json({ ok: true, submissionId: submissionId, delivery: delivery });
};
