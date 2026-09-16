# Google Sheets enquiry receiver

This Google Apps Script is the private receiving end of the website enquiry
webhook. Vercel sends a server-to-server JSON request; the script authenticates
it with a shared secret and appends one row to an Enquiries tab. Repeating a
request with the same submissionId does not append another row.

The receiver accepts this exact JSON shape and rejects missing or additional
keys. Every field value is a string; fields unused by a particular enquiry are
sent as blank strings. Consent is enforced by Vercel and is intentionally not
stored here.

~~~json
{
  "secret": "shared secret",
  "submission": {
    "submissionId": "unique submission ID",
    "submittedAt": "2026-09-16T01:02:03.000Z",
    "formType": "contact",
    "subject": "Website enquiry",
    "fields": {
      "Name": "",
      "Email": "",
      "Country code": "",
      "Mobile": "",
      "Topic": "",
      "Name of student": "",
      "Age of student": "",
      "Preferred class type": "",
      "Preferred area": "",
      "Organisation": "",
      "Event type": "",
      "Estimated number of participants": "",
      "Age": "",
      "Role of interest": "",
      "Experience and qualifications": "",
      "Availability": "",
      "CV or profile URL": "",
      "Message": ""
    }
  }
}
~~~

## Set up the private Sheet and script

1. Create a Google Sheet owned by the account that should receive enquiries.
   Keep it private and do not publish it to the web.
2. Copy its spreadsheet ID from the URL. It is the text between **/d/** and
   **/edit** in https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit.
3. In that Sheet, open **Extensions > Apps Script**. This creates a script bound
   to the Sheet. Replace the editor's Code.gs contents with this directory's
   Code.gs, then save the project.
4. Generate a strong secret locally, for example with **openssl rand -hex 32**.
5. In Apps Script, open **Project Settings > Script Properties** and add:

   - **SPREADSHEET_ID**: the ID copied in step 2 (required).
   - **ENQUIRY_WEBHOOK_SECRET**: the generated secret (required).
   - **ENQUIRY_SHEET_NAME**: the destination tab name (optional; defaults to
     Enquiries).

   The destination tab and its fixed header row are created on the first valid
   request if the tab does not exist or is completely blank. If a non-empty
   tab's header differs from the required columns, the receiver returns
   **{"ok":false,"error":"sheet_header_mismatch"}** and does not overwrite
   the header or append data. Use a new blank tab or restore the exact headers.
6. Select **Deploy > New deployment > Web app**. Set **Execute as** to **Me**
   (the Sheet owner) and **Who has access** to **Anyone**. Authorize the script
   when prompted, then deploy it.
7. Copy the deployed URL ending in **/exec**. In the Vercel project, set:

   - **ENQUIRY_WEBHOOK_URL** to that /exec URL.
   - **ENQUIRY_WEBHOOK_SECRET** to the same secret stored in Script Properties.

   Apply them to the intended Vercel environments and redeploy the Vercel site
   so the new environment variables are available to its serverless function.

The web app must be reachable by **Anyone** because Vercel cannot complete a
Google sign-in flow. The shared secret is the authentication control, so never
put it in browser-side JavaScript, commit it, or send it in email or chat.

## Safe smoke test

The following test uses only synthetic data (example.invalid can never be a
real email domain). It prompts for the secret without echoing it or saving it in
shell history, and sends the same ID twice to exercise deduplication.

~~~bash
read -r -p "Apps Script /exec URL: " ENQUIRY_TEST_URL
read -r -s -p "Shared secret: " ENQUIRY_TEST_SECRET
printf '\n'
ENQUIRY_TEST_ID="smoke-test-$(date -u +%Y%m%dT%H%M%SZ)"
ENQUIRY_TEST_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

for ENQUIRY_TEST_ATTEMPT in 1 2; do
  curl --silent --show-error --location \
    --header 'Content-Type: application/json' \
    --data-binary @- "$ENQUIRY_TEST_URL" <<JSON
{
  "secret": "$ENQUIRY_TEST_SECRET",
  "submission": {
    "submissionId": "$ENQUIRY_TEST_ID",
    "submittedAt": "$ENQUIRY_TEST_AT",
    "formType": "contact",
    "subject": "Webhook smoke test",
    "fields": {
      "Name": "Synthetic Test",
      "Email": "smoke-test@example.invalid",
      "Country code": "",
      "Mobile": "",
      "Topic": "Others",
      "Name of student": "",
      "Age of student": "",
      "Preferred class type": "",
      "Preferred area": "",
      "Organisation": "",
      "Event type": "",
      "Estimated number of participants": "",
      "Age": "",
      "Role of interest": "",
      "Experience and qualifications": "",
      "Availability": "",
      "CV or profile URL": "",
      "Message": "Synthetic webhook smoke test; safe to delete."
    }
  }
}
JSON
  printf '\n'
done

unset ENQUIRY_TEST_URL ENQUIRY_TEST_SECRET ENQUIRY_TEST_ID ENQUIRY_TEST_AT
~~~

The first response should be **{"ok":true,"duplicate":false}** and the second
should be **{"ok":true,"duplicate":true}**. Only one synthetic row should appear
in the destination tab. Google Apps Script ContentService responses are JSON
but do not expose application-controlled HTTP status codes, so callers should
inspect the **ok** value rather than relying only on the HTTP status.

## Operations and data handling

- Code.gs tries for a script-wide lock for up to three seconds while checking the
  submission ID and appending, preventing concurrent deliveries from creating
  duplicate rows while staying below the sender's allowed request timeouts
  (6–15 seconds; 10 seconds by default). If the lock
  remains busy, it returns **{"ok":false,"error":"receiver_busy"}** so the
  sender can treat that delivery as unsuccessful.
- Deduplication performs an exact, case-sensitive whole-cell search of the
  Submission ID column using the Sheets TextFinder API; it does not load the
  full ID column into Apps Script memory.
- Values that could start a spreadsheet formula (=, +, -, or @, including after
  whitespace) are stored as literal text.
- Limit Sheet and Apps Script access to people who need enquiry data. Review
  access periodically and remove exports, test rows, and old enquiries according
  to the organisation's approved retention policy.
- After changing Code.gs, use **Deploy > Manage deployments**, edit the web-app
  deployment, select a new version, and deploy again. Saving code alone does not
  update an existing versioned /exec deployment. Keep the same /exec URL unless
  Google issues a new deployment URL; if it changes, update Vercel and redeploy
  there too.
