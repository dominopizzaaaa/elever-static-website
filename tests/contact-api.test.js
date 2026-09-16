'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const handlerPath = path.resolve(__dirname, '../api/contact.js');
const RESEND_URL = 'https://api.resend.com/emails';
const WEBHOOK_URL = 'https://example.test/enquiries';
const SUBMISSION_ID = '123e4567-e89b-42d3-a456-426614174000';

const CONTACT_FIELDS = {
  Name: 'Jamie <Admin> & Co',
  Email: 'jamie@example.com',
  'Country code': '+65',
  Mobile: '81234567',
  Topic: 'Others',
  'Name of student': '',
  'Age of student': '',
  'Preferred class type': '',
  'Preferred area': '',
  Organisation: '',
  'Event type': '',
  'Estimated number of participants': '',
  Age: '',
  'Role of interest': '',
  'Experience and qualifications': '',
  Availability: '',
  'CV or profile URL': '',
  Message: '<script>alert("no")</script> & follow up',
};

function response(ok, body, status) {
  return {
    ok,
    status: status || (ok ? 200 : 500),
    text: async () => typeof body === 'string' ? body : JSON.stringify(body || {}),
    json: async () => typeof body === 'string' ? JSON.parse(body) : (body || {}),
  };
}

function makeRes() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function loadHandler() {
  delete require.cache[require.resolve(handlerPath)];
  return require(handlerPath);
}

async function invoke(body, options = {}) {
  const req = {
    method: options.method || 'POST',
    headers: options.headers === undefined
      ? { 'content-type': 'application/json' }
      : options.headers,
    body,
  };
  const res = makeRes();
  await loadHandler()(req, res);
  return res;
}

function contactPayload(overrides = {}) {
  return {
    formType: 'contact',
    consent: true,
    submissionId: SUBMISSION_ID,
    ...CONTACT_FIELDS,
    ...overrides,
  };
}

function fetchRecorder(routes) {
  const calls = [];
  const fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    const route = routes[String(url)];
    if (!route) throw new Error('Unexpected fetch: ' + url);
    return typeof route === 'function' ? route(url, options, calls) : route;
  };
  return { fetch, calls };
}

function callFor(calls, url) {
  const matches = calls.filter(call => call.url === url);
  assert.equal(matches.length, 1, 'expected exactly one request to ' + url);
  return matches[0];
}

function parseRequest(call) {
  return JSON.parse(call.options.body);
}

function derivedIdPattern(requestIdPattern) {
  return new RegExp('^' + requestIdPattern + ':[0-9a-f]{16}$', 'i');
}

const UUID_PATTERN = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL,
  ENQUIRY_WEBHOOK_URL: process.env.ENQUIRY_WEBHOOK_URL,
  ENQUIRY_WEBHOOK_SECRET: process.env.ENQUIRY_WEBHOOK_SECRET,
  ENQUIRY_DELIVERY_TIMEOUT_MS: process.env.ENQUIRY_DELIVERY_TIMEOUT_MS,
};
const originalFetch = global.fetch;
const originalConsoleError = console.error;

test.beforeEach(() => {
  process.env.RESEND_API_KEY = 'resend-test-key';
  process.env.FROM_EMAIL = 'Elever Test <test@eleverbadminton.com>';
  process.env.ENQUIRY_WEBHOOK_URL = WEBHOOK_URL;
  process.env.ENQUIRY_WEBHOOK_SECRET = 'webhook-test-secret';
  console.error = () => {};
});
test.afterEach(() => {
  for (const [name, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  global.fetch = originalFetch;
  console.error = originalConsoleError;
  delete require.cache[require.resolve(handlerPath)];
});

test('rejects non-POST methods without making an outbound request', async () => {
  const recorder = fetchRecorder({});
  global.fetch = recorder.fetch;

  const res = await invoke(undefined, { method: 'GET' });

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'POST');
  assert.deepEqual(res.body, { error: 'Method not allowed' });
  assert.equal(recorder.calls.length, 0);
});

test('rejects POST requests without an application/json content type', async t => {
  for (const [name, headers] of [
    ['text/plain', { 'content-type': 'text/plain' }],
    ['missing content type', {}],
  ]) {
    await t.test(name, async () => {
      const recorder = fetchRecorder({});
      global.fetch = recorder.fetch;

      const res = await invoke(contactPayload(), { headers });

      assert.equal(res.statusCode, 415);
      assert.equal(typeof res.body.error, 'string');
      assert.equal(recorder.calls.length, 0);
    });
  }
});

test('rejects unexpected browser origins before delivery', async () => {
  const recorder = fetchRecorder({});
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload(), {
    headers: { 'content-type': 'application/json', origin: 'https://attacker.example' },
  });

  assert.equal(res.statusCode, 403);
  assert.equal(typeof res.body.error, 'string');
  assert.equal(recorder.calls.length, 0);
});

test('allows the production and matching Vercel preview browser origins', async t => {
  for (const [name, headers] of [
    ['production', { 'content-type': 'application/json', origin: 'https://www.eleverbadminton.com' }],
    ['preview', { 'content-type': 'application/json', origin: 'https://elever-git-test.vercel.app',
      'x-forwarded-host': 'elever-git-test.vercel.app' }],
    ['local vercel dev', { 'content-type': 'application/json', origin: 'http://localhost:3000',
      host: 'localhost:3000' }],
  ]) {
    await t.test(name, async () => {
      const recorder = fetchRecorder({
        [RESEND_URL]: response(true, { id: 'email-id' }),
        [WEBHOOK_URL]: response(true, { ok: true, duplicate: false }),
      });
      global.fetch = recorder.fetch;
      const res = await invoke(contactPayload(), { headers });
      assert.equal(res.statusCode, 200);
    });
  }
});

test('rejects missing consent and invalid form data without delivery', async t => {
  const invalidCases = [
    ['missing consent', contactPayload({ consent: false })],
    ['unknown form type', contactPayload({ formType: 'unknown' })],
    ['invalid email', contactPayload({ Email: 'not-an-email' })],
    ['missing contact topic field', contactPayload({ Message: '' })],
  ];

  for (const [name, payload] of invalidCases) {
    await t.test(name, async () => {
      const recorder = fetchRecorder({});
      global.fetch = recorder.fetch;
      const res = await invoke(payload);
      assert.equal(res.statusCode, 400);
      assert.equal(typeof res.body.error, 'string');
      assert.equal(recorder.calls.length, 0);
    });
  }
});

test('rejects invalid select, number, URL, and camp fields without delivery', async t => {
  const invalidCases = [
    ['class type', contactPayload({
      Topic: 'Classes', 'Name of student': 'Alex', 'Age of student': '9',
      'Preferred class type': 'Unknown', 'Preferred area': 'East', Message: '',
    })],
    ['student age', contactPayload({
      Topic: 'Classes', 'Name of student': 'Alex', 'Age of student': '2',
      'Preferred class type': 'Group Classes', 'Preferred area': 'East', Message: '',
    })],
    ['event participant count', contactPayload({
      Topic: 'Events', Organisation: 'Example', 'Event type': 'Clinic',
      'Estimated number of participants': '-1', Message: '',
    })],
    ['career URL', contactPayload({
      Topic: 'Careers', Age: '24', 'Role of interest': 'Badminton Coach',
      'Experience and qualifications': 'Two years', Availability: 'Flexible',
      'CV or profile URL': 'javascript:alert(1)', Message: '',
    })],
    ['camp holiday', {
      formType: 'camp-waitlist', consent: true, Email: 'parent@example.com',
      Holiday: 'Neveruary',
    }],
  ];

  for (const [name, payload] of invalidCases) {
    await t.test(name, async () => {
      const recorder = fetchRecorder({});
      global.fetch = recorder.fetch;
      const res = await invoke(payload);
      assert.equal(res.statusCode, 400);
      assert.equal(recorder.calls.length, 0);
    });
  }
});

test('delivers a contact enquiry to Resend and backup concurrently with exact requests', async () => {
  let releaseEmail;
  let releaseBackup;
  const emailResponse = new Promise(resolve => { releaseEmail = resolve; });
  const backupResponse = new Promise(resolve => { releaseBackup = resolve; });
  const recorder = fetchRecorder({
    [RESEND_URL]: () => emailResponse,
    [WEBHOOK_URL]: () => backupResponse,
  });
  global.fetch = recorder.fetch;

  const invocation = invoke(contactPayload({ subject: 'Client-controlled subject' }));
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(new Set(recorder.calls.map(call => call.url)), new Set([RESEND_URL, WEBHOOK_URL]),
    'both independent delivery requests should start before either finishes');
  releaseEmail(response(true, { id: 'email-id' }));
  releaseBackup(response(true, { ok: true, duplicate: false }));
  const res = await invocation;

  assert.equal(res.statusCode, 200);
  assert.match(res.body.submissionId, derivedIdPattern(SUBMISSION_ID));
  assert.deepEqual(res.body, {
    ok: true,
    submissionId: res.body.submissionId,
    delivery: { email: 'sent', backup: 'saved' },
  });

  const emailCall = callFor(recorder.calls, RESEND_URL);
  assert.deepEqual(emailCall.options.headers, {
    Authorization: 'Bearer resend-test-key',
    'Content-Type': 'application/json',
    'Idempotency-Key': 'elever-contact-' + res.body.submissionId,
  });
  assert.equal(emailCall.options.method, 'POST');
  assert.ok(emailCall.options.signal instanceof AbortSignal);
  const email = parseRequest(emailCall);
  assert.equal(email.from, 'Elever Test <test@eleverbadminton.com>');
  assert.deepEqual(email.to, ['info@eleverbadminton.com']);
  assert.equal(email.reply_to, 'jamie@example.com');
  assert.equal(email.subject, 'Website enquiry');
  assert.match(email.text, /Name: Jamie <Admin> & Co/);
  assert.match(email.html, /Jamie &lt;Admin&gt; &amp; Co/);
  assert.match(email.html, /&lt;script&gt;alert\(&quot;no&quot;\)&lt;\/script&gt; &amp; follow up/);
  assert.doesNotMatch(email.html, /<script>/);

  const webhookCall = callFor(recorder.calls, WEBHOOK_URL);
  assert.equal(webhookCall.options.method, 'POST');
  assert.ok(webhookCall.options.signal instanceof AbortSignal);
  assert.deepEqual(webhookCall.options.headers, { 'Content-Type': 'application/json' });
  const webhook = parseRequest(webhookCall);
  assert.deepEqual(webhook, {
    secret: 'webhook-test-secret',
    submission: {
      submissionId: res.body.submissionId,
      submittedAt: webhook.submission.submittedAt,
      formType: 'contact',
      subject: 'Website enquiry',
      fields: CONTACT_FIELDS,
    },
  });
  assert.equal(new Date(webhook.submission.submittedAt).toISOString(), webhook.submission.submittedAt);
});

test('reports duplicate backup delivery as success', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(true, { id: 'email-id' }),
    [WEBHOOK_URL]: response(true, { ok: true, duplicate: true }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.delivery, { email: 'sent', backup: 'duplicate' });
});

test('returns success when email succeeds and backup fails', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(true, { id: 'email-id' }),
    [WEBHOOK_URL]: response(true, { ok: false, error: 'internal_error' }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.delivery, { email: 'sent', backup: 'failed' });
});

test('returns success when email fails and backup succeeds', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(false, 'resend unavailable', 503),
    [WEBHOOK_URL]: response(true, { ok: true, duplicate: false }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.delivery, { email: 'failed', backup: 'saved' });
});

test('isolates transport rejections and preserves partial success', async t => {
  await t.test('email rejects and backup succeeds', async () => {
    const recorder = fetchRecorder({
      [RESEND_URL]: () => Promise.reject(new Error('email transport failed')),
      [WEBHOOK_URL]: response(true, { ok: true, duplicate: false }),
    });
    global.fetch = recorder.fetch;

    const res = await invoke(contactPayload());

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.delivery, { email: 'failed', backup: 'saved' });
  });

  await t.test('backup rejects and email succeeds', async () => {
    const recorder = fetchRecorder({
      [RESEND_URL]: response(true, { id: 'email-id' }),
      [WEBHOOK_URL]: () => Promise.reject(new Error('backup transport failed')),
    });
    global.fetch = recorder.fetch;

    const res = await invoke(contactPayload());

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.delivery, { email: 'sent', backup: 'failed' });
  });

  await t.test('both transports reject', async () => {
    const recorder = fetchRecorder({
      [RESEND_URL]: () => Promise.reject(new Error('email transport failed')),
      [WEBHOOK_URL]: () => Promise.reject(new Error('backup transport failed')),
    });
    global.fetch = recorder.fetch;

    const res = await invoke(contactPayload());

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body.delivery, { email: 'failed', backup: 'failed' });
  });
});

test('treats invalid webhook JSON and provider rejection as backup failures', async t => {
  for (const [name, webhookResponse] of [
    ['invalid JSON', response(true, 'not-json')],
    ['provider ok false', response(true, { ok: false, error: 'receiver_busy' })],
  ]) {
    await t.test(name, async () => {
      const recorder = fetchRecorder({
        [RESEND_URL]: response(true, { id: 'email-id' }),
        [WEBHOOK_URL]: webhookResponse,
      });
      global.fetch = recorder.fetch;

      const res = await invoke(contactPayload());

      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.body.delivery, { email: 'sent', backup: 'failed' });
    });
  }
});

test('returns 502 when both contact delivery channels fail', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(false, 'resend unavailable', 503),
    [WEBHOOK_URL]: response(false, 'gateway unavailable', 503),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 502);
  assert.match(res.body.submissionId, derivedIdPattern(SUBMISSION_ID));
  assert.deepEqual(res.body.delivery, { email: 'failed', backup: 'failed' });
});

test('uses backup successfully when Resend is not configured', async () => {
  delete process.env.RESEND_API_KEY;
  const recorder = fetchRecorder({
    [WEBHOOK_URL]: response(true, { ok: true, duplicate: false }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.delivery, { email: 'not_configured', backup: 'saved' });
  assert.deepEqual(recorder.calls.map(call => call.url), [WEBHOOK_URL]);
});

test('uses email successfully when the contact backup is not configured', async () => {
  delete process.env.ENQUIRY_WEBHOOK_URL;
  delete process.env.ENQUIRY_WEBHOOK_SECRET;
  const recorder = fetchRecorder({
    [RESEND_URL]: response(true, { id: 'email-id' }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.delivery, { email: 'sent', backup: 'not_configured' });
  assert.deepEqual(recorder.calls.map(call => call.url), [RESEND_URL]);
});

test('returns 502 without fetching when both contact channels are unconfigured', async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.ENQUIRY_WEBHOOK_URL;
  delete process.env.ENQUIRY_WEBHOOK_SECRET;
  const recorder = fetchRecorder({});
  global.fetch = recorder.fetch;

  const res = await invoke(contactPayload());

  assert.equal(res.statusCode, 502);
  assert.match(res.body.submissionId, derivedIdPattern(SUBMISSION_ID));
  assert.deepEqual(res.body.delivery, { email: 'not_configured', backup: 'not_configured' });
  assert.equal(recorder.calls.length, 0);
});

test('returns 502 for a non-contact form when Resend is not configured', async () => {
  delete process.env.RESEND_API_KEY;
  const recorder = fetchRecorder({});
  global.fetch = recorder.fetch;

  const res = await invoke({
    formType: 'newsletter',
    consent: true,
    submissionId: SUBMISSION_ID,
    Email: 'reader@example.com',
  });

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body.delivery, { email: 'not_configured', backup: 'not_applicable' });
  assert.equal(recorder.calls.length, 0);
});

test('newsletter maps its subject server-side and never calls the contact backup', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(true, { id: 'email-id' }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke({
    formType: 'newsletter',
    consent: true,
    submissionId: SUBMISSION_ID,
    subject: 'Injected subject',
    Email: 'reader@example.com',
  });

  assert.equal(res.statusCode, 200);
  assert.match(res.body.submissionId, derivedIdPattern(SUBMISSION_ID));
  assert.deepEqual(res.body, {
    ok: true,
    submissionId: res.body.submissionId,
    delivery: { email: 'sent', backup: 'not_applicable' },
  });
  assert.deepEqual(recorder.calls.map(call => call.url), [RESEND_URL]);
  assert.equal(parseRequest(recorder.calls[0]).subject, 'Newsletter signup');
});

test('accepts a JSON string body and generates an ID when one is omitted', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(true, { id: 'email-id' }),
  });
  global.fetch = recorder.fetch;

  const res = await invoke(JSON.stringify({
    formType: 'camp-waitlist',
    consent: true,
    Email: 'parent@example.com',
    'Child age': '9',
    Holiday: 'June',
  }));

  assert.equal(res.statusCode, 200);
  assert.match(res.body.submissionId, derivedIdPattern(UUID_PATTERN));
  assert.deepEqual(res.body.delivery, { email: 'sent', backup: 'not_applicable' });
  assert.equal(parseRequest(callFor(recorder.calls, RESEND_URL)).subject, 'Camp waitlist signup');
});

test('replaces malformed and oversized request IDs with a generated UUID prefix', async t => {
  for (const [name, suppliedId] of [
    ['malformed ID', 'bad id!'],
    ['oversized ID', 'a'.repeat(129)],
  ]) {
    await t.test(name, async () => {
      const recorder = fetchRecorder({
        [RESEND_URL]: response(true, { id: 'email-id' }),
      });
      global.fetch = recorder.fetch;

      const res = await invoke({
        formType: 'newsletter',
        consent: true,
        submissionId: suppliedId,
        Email: 'reader@example.com',
      });

      assert.equal(res.statusCode, 200);
      assert.notEqual(res.body.submissionId, suppliedId);
      assert.match(res.body.submissionId, derivedIdPattern(UUID_PATTERN));
      assert.equal(
        callFor(recorder.calls, RESEND_URL).options.headers['Idempotency-Key'],
        'elever-newsletter-' + res.body.submissionId
      );
    });
  }
});

test('derives stable IDs for unchanged retries and distinct IDs for edited payloads', async () => {
  const recorder = fetchRecorder({
    [RESEND_URL]: response(true, { id: 'email-id' }),
  });
  global.fetch = recorder.fetch;
  const basePayload = {
    formType: 'newsletter',
    consent: true,
    submissionId: SUBMISSION_ID,
    Email: 'reader@example.com',
  };

  const first = await invoke(basePayload);
  const retry = await invoke({ ...basePayload });
  const edited = await invoke({ ...basePayload, Email: 'updated@example.com' });

  assert.match(first.body.submissionId, derivedIdPattern(SUBMISSION_ID));
  assert.equal(retry.body.submissionId, first.body.submissionId);
  assert.notEqual(edited.body.submissionId, first.body.submissionId);
  assert.match(edited.body.submissionId, derivedIdPattern(SUBMISSION_ID));
});
