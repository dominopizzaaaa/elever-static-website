// Vercel Serverless Function — POST /api/contact
// Receives the contact form, sends the enquiry to info@eleverbadminton.com via Resend.
// The Resend API key lives in the RESEND_API_KEY environment variable (set in Vercel),
// never in client-side code.

const TO = 'info@eleverbadminton.com';
// FROM must be an address on a domain verified in Resend. Until eleverbadminton.com
// is verified, this will fail — that is expected. Override with the FROM_EMAIL env var
// if you use a different verified sender.
const FROM = process.env.FROM_EMAIL || 'Elever Website <noreply@eleverbadminton.com>';

const FIELDS = [
  'Name', 'Email', 'Country code', 'Mobile', 'Topic',
  'Name of student', 'Age of student', 'Preferred class type', 'Preferred area',
  'Organisation', 'Event type', 'Estimated number of participants',
  'Age', 'Role of interest', 'Experience and qualifications', 'Availability',
  'CV or profile URL', 'Child age', 'Holiday', 'Message'
];
const REQUIRED_BY_TOPIC = {
  Classes: ['Name of student', 'Age of student', 'Preferred class type', 'Preferred area'],
  Events: ['Organisation', 'Event type'],
  Careers: ['Age', 'Role of interest', 'Experience and qualifications', 'Availability'],
  Others: ['Message'],
};
const COUNTRY_CODES = new Set([
  '+65', '+60', '+62', '+66', '+63', '+84', '+673', '+855', '+856', '+95',
  '+86', '+852', '+853', '+886', '+81', '+82', '+91', '+880', '+94', '+977',
  '+92', '+971', '+966', '+974', '+64', '+61', '+1', '+52', '+55', '+44',
  '+353', '+33', '+49', '+39', '+34', '+31', '+41', '+46', '+47', '+45',
  '+358', '+27'
]);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email is not configured yet.' });
  }

  // Vercel parses JSON bodies automatically; fall back to manual parse just in case.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const name = String(body.Name || '').trim();
  const email = String(body.Email || '').trim();
  const countryCode = String(body['Country code'] || '').trim();
  const mobile = String(body.Mobile || '').trim();
  const topic = String(body.Topic || '').trim();
  const subject = String(body.subject || 'Website enquiry');
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  // Basic email sanity check.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (topic || subject === 'Website enquiry') {
    if (!name || !REQUIRED_BY_TOPIC[topic]) {
      return res.status(400).json({ error: 'Name and a valid enquiry type are required.' });
    }
    if (mobile && !countryCode) {
      return res.status(400).json({ error: 'A country code is required with a mobile number.' });
    }
    if (countryCode && !COUNTRY_CODES.has(countryCode)) {
      return res.status(400).json({ error: 'Please select a valid country code.' });
    }
    const missingTopicField = REQUIRED_BY_TOPIC[topic].find(function (field) {
      return !String(body[field] || '').trim();
    });
    if (missingTopicField) {
      return res.status(400).json({ error: missingTopicField + ' is required for ' + topic.toLowerCase() + ' enquiries.' });
    }
  }

  const rows = FIELDS
    .filter(function (k) { return String(body[k] || '').trim(); })
    .map(function (k) {
      return '<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">' +
        escapeHtml(k) + '</td><td style="padding:4px 0">' +
        escapeHtml(body[k]).replace(/\n/g, '<br>') + '</td></tr>';
    })
    .join('');

  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#111">' +
    '<h2 style="margin:0 0 12px">New website enquiry</h2>' +
    '<table style="border-collapse:collapse;font-size:14px">' + rows + '</table>' +
    '</div>';

  const text = FIELDS
    .filter(function (k) { return String(body[k] || '').trim(); })
    .map(function (k) { return k + ': ' + body[k]; })
    .join('\n');

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: subject,
        html: html,
        text: text,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error('Resend error', resp.status, detail);
      return res.status(502).json({ error: 'Could not send your message. Please email us directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send failed', err);
    return res.status(500).json({ error: 'Could not send your message. Please email us directly.' });
  }
};
