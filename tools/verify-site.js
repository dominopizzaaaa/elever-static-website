#!/usr/bin/env node
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

function loadPlaywright() {
  if (process.env.ELEVER_PLAYWRIGHT) return require(process.env.ELEVER_PLAYWRIGHT);
  try { return require('playwright'); } catch (_) {
    const codexRuntime = path.join(os.homedir(),
      '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
    if (fs.existsSync(codexRuntime)) return require(codexRuntime);
  }
  throw new Error('Playwright was not found. Install it locally or set ELEVER_PLAYWRIGHT to its module directory.');
}

const { chromium } = loadPlaywright();

const base = process.env.ELEVER_BASE_URL || 'http://localhost:8080';
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath = process.env.ELEVER_CHROME || (fs.existsSync(macChrome) ? macChrome : null);
const outDir = process.env.ELEVER_SCREENSHOT_DIR || '/tmp/elever-release-review';
const repoRoot = path.resolve(__dirname, '..');
const consoleErrors = [];
const pageErrors = [];
const failedResponses = [];

function attachDiagnostics(page, label) {
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(label + ': ' + message.text());
  });
  page.on('pageerror', error => pageErrors.push(label + ': ' + error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) {
      failedResponses.push(label + ': ' + response.status() + ' ' + response.url());
    }
  });
}

async function checkNoOverflow(page, label) {
  const dims = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth
  }));
  assert.ok(dims.scroll <= dims.client + 1,
    label + ' overflows horizontally (' + dims.scroll + ' > ' + dims.client + ')');
}

async function open(page, route, label) {
  const response = await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.ok(response && response.ok(), label + ' did not load');
  await checkNoOverflow(page, label);
}

async function checkContact(page, viewport, name) {
  await open(page, '/contact.html', name + ' Contact');
  const form = page.locator('#contact-form');
  const topic = form.locator('[name="Topic"]');

  assert.equal(await page.locator('.phead h1').getByText('Get in touch', { exact: true }).count(), 1);
  assert.equal(await form.getByRole('heading', { name: 'Enquiry Form' }).count(), 1);
  assert.equal(await page.getByText('Tell us what you need', { exact: true }).count(), 0);
  assert.equal(await page.getByText(/Usually replies within one working day/i).count(), 0);
  assert.equal(await page.getByText('Player details, if relevant', { exact: true }).count(), 0);
  assert.equal(await page.getByText('01', { exact: true }).count(), 0);
  assert.equal(await page.getByText('02', { exact: true }).count(), 0);
  assert.deepEqual(await topic.locator('option').allTextContents(),
    ['Choose an enquiry type', 'Classes', 'Events', 'Careers', 'Others']);
  assert.equal(await form.locator('[name="Country code"]').inputValue(), '+65');
  assert.equal(await form.locator('[name="Country code"] option').count(), 43);
  const countryNames = await form.locator('[name="Country code"] option').evaluateAll(options =>
    options.map(option => option.dataset.country));
  assert.equal(countryNames[0], 'Singapore');
  assert.deepEqual(countryNames.slice(1), countryNames.slice(1).sort((a, b) => a.localeCompare(b, 'en')));
  const countryCombo = form.locator('.country-combobox__input');
  assert.equal(await countryCombo.count(), 1);
  assert.equal(await countryCombo.getAttribute('role'), 'combobox');
  assert.equal(await countryCombo.inputValue(), 'SG +65');
  assert.equal(await form.locator('.country-combobox__flag').textContent(), '🇸🇬');
  await countryCombo.click();
  assert.deepEqual(await countryCombo.evaluate(node => ({
    start: node.selectionStart, end: node.selectionEnd, length: node.value.length
  })), { start: 0, end: 6, length: 6 });
  await countryCombo.fill('malay');
  assert.equal(await form.locator('.country-combobox__flag').textContent(), '');
  assert.deepEqual(await form.locator('.country-combobox__option').allTextContents(), ['🇲🇾 Malaysia (MY) +60']);
  await page.keyboard.press('Enter');
  assert.equal(await form.locator('[name="Country code"]').inputValue(), '+60');
  assert.equal(await countryCombo.inputValue(), 'MY +60');
  assert.equal(await form.locator('.country-combobox__flag').textContent(), '🇲🇾');
  await countryCombo.fill('+65');
  await page.keyboard.press('Enter');
  assert.equal(await form.locator('[name="Country code"]').inputValue(), '+65');
  assert.equal(await form.locator('[name="Mobile"]').getAttribute('required'), null);
  assert.equal(await form.locator('[data-contact-panel]:visible').count(), 0);
  assert.equal(await form.locator('.cta-chevron').textContent(), '›');
  const sendButtonStyle = await form.getByRole('button', { name: 'Send message' }).evaluate(node => ({
    background: getComputedStyle(node).backgroundColor,
    border: getComputedStyle(node).borderTopColor,
    borderWidth: getComputedStyle(node).borderTopWidth,
    radius: getComputedStyle(node).borderRadius,
    weight: getComputedStyle(node).fontWeight,
    color: getComputedStyle(node).color
  }));
  assert.deepEqual(sendButtonStyle, {
    background: 'rgba(0, 0, 0, 0)', border: 'rgb(33, 81, 209)', borderWidth: '1px',
    radius: '8px', weight: '600', color: 'rgb(33, 81, 209)'
  });
  const mobileControl = await form.locator('#contact-mobile').boundingBox();
  const topicControl = await topic.boundingBox();
  assert.ok(mobileControl && topicControl && Math.abs(mobileControl.height - topicControl.height) < 1,
    name + ' Mobile and Enquiry type controls do not have matching heights');
  if (viewport.width > 640) {
    const mobileField = await form.locator('.contact-mobile-field').boundingBox();
    const topicField = await form.locator('.contact-topic-field').boundingBox();
    assert.ok(mobileField && topicField && mobileField.x < topicField.x && Math.abs(mobileField.y - topicField.y) < 2,
      name + ' Mobile and Enquiry type are not side by side');
  }

  const expectations = {
    Classes: {
      panel: '#contact-fields-classes',
      names: ['Name of student', 'Age of student', 'Preferred class type', 'Preferred area'],
      optional: ['Message'],
      values: { 'Name of student': 'Alex Tan', 'Age of student': '12',
        'Preferred class type': 'Group Classes', 'Preferred area': 'East', Message: 'Weekend mornings.' }
    },
    Events: {
      panel: '#contact-fields-events',
      names: ['Organisation', 'Event type'],
      optional: ['Estimated number of participants', 'Message'],
      values: { Organisation: 'Example School', 'Event type': 'Clinic',
        'Estimated number of participants': '80', Message: 'A school holiday clinic.' }
    },
    Careers: {
      panel: '#contact-fields-careers',
      names: ['Age', 'Role of interest', 'Experience and qualifications', 'Availability'],
      optional: ['CV or profile URL', 'Message'],
      values: { Age: '24', 'Role of interest': 'Badminton Coach',
        'Experience and qualifications': 'Two years of assistant coaching.', Availability: 'Within one month',
        'CV or profile URL': 'https://example.com/cv', Message: 'Available on weekday evenings.' }
    },
    Others: {
      panel: '#contact-fields-others', names: ['Message'], optional: [],
      values: { Message: 'I have another question.' }
    }
  };

  for (const [value, expected] of Object.entries(expectations)) {
    await topic.selectOption({ label: value });
    assert.equal(await form.locator('[data-contact-panel]:visible').count(), 1,
      name + ' Contact should show exactly one conditional section for ' + value);
    assert.equal(await form.locator(expected.panel).isVisible(), true);
    assert.deepEqual(await form.locator(expected.panel + ' [required]').evaluateAll(nodes => nodes.map(node => node.name)),
      expected.names);
    assert.deepEqual(await form.locator('[data-contact-panel][hidden] input:not([disabled]), ' +
      '[data-contact-panel][hidden] select:not([disabled]), [data-contact-panel][hidden] textarea:not([disabled])')
      .allTextContents(), []);
    for (const [fieldName, fieldValue] of Object.entries(expected.values)) {
      const field = form.locator(expected.panel + ' [name="' + fieldName + '"]');
      if (await field.evaluate(node => node.tagName === 'SELECT')) await field.selectOption({ label: fieldValue });
      else await field.fill(fieldValue);
    }
  }

  await topic.selectOption({ label: 'Classes' });
  await form.locator('[name="Name"]').fill('Jamie Lim');
  await form.locator('[name="Email"]').fill('jamie@example.com');
  await form.locator('[name="Mobile"]').fill('81234567');
  await form.locator('[name="consent"]').check();
  await form.locator('#contact-student-name').fill('');
  await form.getByRole('button', { name: 'Send message' }).click();
  assert.equal(await form.locator('#contact-student-name').getAttribute('aria-invalid'), 'true');
  assert.ok((await form.locator('.lead__status').textContent()).includes('highlighted fields'));

  await form.locator('#contact-student-name').fill('Alex Tan');
  const requestPromise = page.waitForRequest(request => request.url().endsWith('/api/contact') && request.method() === 'POST');
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await form.getByRole('button', { name: 'Send message' }).click();
  const request = await requestPromise;
  await page.waitForFunction(() => document.querySelector('#contact-form .lead__status').textContent
    .includes('message has been sent'));
  const payload = request.postDataJSON();
  assert.deepEqual(payload, {
    subject: 'Website enquiry', Name: 'Jamie Lim', Email: 'jamie@example.com',
    'Country code': '+65', Mobile: '81234567', Topic: 'Classes',
    'Name of student': 'Alex Tan', 'Age of student': '12', 'Preferred class type': 'Group Classes',
    'Preferred area': 'East', Message: 'Weekend mornings.'
  });
  assert.equal(await form.locator('[data-contact-panel]:visible').count(), 0,
    name + ' Contact did not reset its conditional fields after submission');

  await page.getByRole('link', { name: /Start an event brief/ }).click();
  assert.equal(await topic.inputValue(), 'Events');
  assert.equal(await form.locator('#contact-fields-events').isVisible(), true);
  await page.waitForTimeout(450);
  const anchorPosition = await page.evaluate(() => ({
    headingTop: document.querySelector('#contact-form h2').getBoundingClientRect().top,
    navBottom: document.querySelector('.nav').getBoundingClientRect().bottom
  }));
  assert.ok(anchorPosition.headingTop >= anchorPosition.navBottom + 8,
    name + ' Contact form heading is hidden under the fixed navigation after an anchor jump');
  await page.waitForFunction(() => document.querySelector('#contact-form [name="Name"]') === document.activeElement);
  assert.ok(await form.locator('[name="Name"]').evaluate(node => node === document.activeElement),
    name + ' contextual Events shortcut did not focus Name');
  await checkNoOverflow(page, name + ' Contact interactions');
  if (viewport.width <= 640) {
    const phoneParts = await form.locator('.country-combobox, #contact-mobile').evaluateAll(nodes =>
      nodes.map(node => ({ y: node.getBoundingClientRect().y, width: node.getBoundingClientRect().width })));
    assert.equal(phoneParts.length, 2);
    assert.ok(Math.abs(phoneParts[0].y - phoneParts[1].y) < 1, name + ' country code is not left of Mobile');
    assert.ok(phoneParts[0].width >= 100 && phoneParts[1].width >= phoneParts[0].width,
      name + ' phone fields are not proportioned correctly');
  }
  await page.screenshot({ path: path.join(outDir, name + '-contact-events.png'), fullPage: true });
}

async function runViewport(browser, viewport, name) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  attachDiagnostics(page, name);

  await open(page, '/', name + ' Home');
  assert.equal(await page.locator('.hero__slides, .hero__slide, .hero__tint, .hero__overlay').count(), 0,
    name + ' Home must retain the approved static cover, not the retired slideshow');
  assert.deepEqual(await page.locator('.hero__link').allTextContents(), ['CLASSES', 'EVENTS']);
  const actionBoxes = await page.locator('.hero__link').evaluateAll(nodes =>
    nodes.map(node => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y,
      width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
  assert.equal(actionBoxes.length, 2);
  assert.ok(Math.abs(actionBoxes[0].width - actionBoxes[1].width) < 1, name + ' Home CTA widths differ');
  assert.ok(Math.abs(actionBoxes[0].y - actionBoxes[1].y) < 1, name + ' Home CTAs are not side by side');
  assert.ok(actionBoxes.every(box => box.height >= 44), name + ' Home CTA is below 44px');
  const promiseBoxes = await page.locator('.hero__promise span').evaluateAll(nodes =>
    nodes.map(node => ({ y: node.getBoundingClientRect().y })));
  if (viewport.width <= 560) {
    assert.ok(promiseBoxes[0].y < promiseBoxes[1].y && promiseBoxes[1].y < promiseBoxes[2].y,
      name + ' promise is not three rows');
  } else {
    assert.ok(Math.max(...promiseBoxes.map(box => box.y)) - Math.min(...promiseBoxes.map(box => box.y)) < 2,
      name + ' promise is not one row');
  }
  await page.screenshot({ path: path.join(outDir, name + '-home.png'), fullPage: true });

  await open(page, '/classes.html', name + ' Classes');
  const privateLink = page.locator('a.btn--primary', { hasText: 'Enquire more' });
  assert.equal(await privateLink.count(), 1);
  assert.equal(new URL(await privateLink.getAttribute('href')).searchParams.get('text'),
    'Hi, I am interested in the private classes and would like to enquire more. Please let me know how I can arrange the sessions. Thank you!');
  const firstArea = (await page.locator('.vcard h3').first().textContent()).trim();
  assert.equal(new URL(await page.locator('.vcard__book').first().getAttribute('href')).searchParams.get('text'),
    'Hi, I am interested in the group classes at ' + firstArea + ' and would like to enquire more. Please let me know if there’s availability. Thank you!');
  const groupMessages = await page.locator('.vcard').evaluateAll(cards => cards.map(card => ({
    location: card.querySelector('h3').textContent.trim(),
    message: new URL(card.querySelector('.vcard__book').href).searchParams.get('text')
  })));
  groupMessages.forEach(item => assert.equal(item.message,
    'Hi, I am interested in the group classes at ' + item.location +
    ' and would like to enquire more. Please let me know if there’s availability. Thank you!'));
  const rowBox = await page.locator('.vcard__sessions li').first().boundingBox();
  const chipBox = await page.locator('.vcard__sessions li').first().locator('.vcard__lvl').boundingBox();
  assert.ok(rowBox && chipBox && chipBox.x + chipBox.width > rowBox.x + rowBox.width - 8,
    name + ' class type is not right aligned');

  await open(page, '/events.html', name + ' Events');
  const workLink = page.getByRole('link', { name: 'Work with us' }).first();
  assert.equal(new URL(await workLink.getAttribute('href')).searchParams.get('text'),
    'Hi, I am interested in working with Élever Badminton to organise an event. Could you share more about the options available and how we can get started? Thank you!');
  assert.deepEqual(await page.locator('#eventPartners img').evaluateAll(nodes =>
    nodes.slice(0, 4).map(node => node.alt)),
    ['ASICS', 'People’s Association', 'Singapore Badminton Association', 'SingHealth Community Hospitals']);
  await page.waitForFunction(() => Array.from(document.querySelectorAll('#eventPartners img'))
    .every(image => image.complete && image.naturalWidth > 0));
  const partnerBoxes = await page.locator('#eventPartners .logorail__item').evaluateAll(nodes =>
    nodes.map(node => {
      const image = node.querySelector('img');
      const box = image.getBoundingClientRect();
      return { key: node.dataset.partner, width: box.width, height: box.height };
    }));
  assert.deepEqual(partnerBoxes.map(item => item.key), ['asics', 'pa', 'sba', 'singhealth']);
  assert.ok(partnerBoxes.every(item => item.width >= 70 && item.height >= 45),
    name + ' a Trusted By logo renders materially undersized: ' + JSON.stringify(partnerBoxes));
  const sbaBox = partnerBoxes.find(item => item.key === 'sba');
  const asicsBox = partnerBoxes.find(item => item.key === 'asics');
  assert.ok(sbaBox.width >= asicsBox.width * 0.7,
    name + ' SBA logo is still visually too narrow beside ASICS: ' + JSON.stringify(partnerBoxes));
  await page.locator('.trusted-inline').screenshot({ path: path.join(outDir, name + '-trusted-by.png') });
  assert.equal(await page.locator('.ecov').first().evaluate(node => getComputedStyle(node).borderRadius), '8px');
  const eventStories = {
    'SingHealth President’s Challenge Sports Day 2026': {
      description: 'We partnered with SingHealth Community Hospitals to plan and deliver their Badminton & Pickleball corporate competition from concept to event-day execution. From tournament management and certified officials to coaching clinics, our team managed every aspect of the event to create a complete corporate racket sports experience that brought together competitive play, skills development and meaningful team bonding.',
      services: ['Tournament Format & Scheduling', 'Venue & Court Setup',
        'Match Operations & Participant Management', 'Certified Badminton & Pickleball Umpires',
        'Clinics Programme Planning & Execution', 'Professional Badminton and Pickleball Coaches',
        'Event Emcee', 'Backdrop Production & Setup']
    },
    'ASICS Badminton Summit 2026': {
      description: 'In celebration of World Badminton Day, we partnered with ASICS to create a one-of-a-kind Badminton Summit, bringing their Speed and Control shoes to life on court. From curating participants to designing targeted badminton drills for each style of play, followed by a yoga session inspired by ASICS’ “Sound Mind, Sound Body” philosophy, we delivered an immersive experience connecting product, performance, community and brand.',
      services: ['Event Conceptualisation & Experience Design',
        'Product-Focused Programme Planning and Drill Design',
        'Professional Badminton Coaches & On-Court Facilitation', 'Participant Curation & Management',
        'Brand & Product Integration', 'Yoga Programme Coordination']
    },
    'Joo Chiat Badminton Carnival 2026': {
      description: 'Our largest scale event to date, the Joo Chiat Badminton Carnival 2026 was strategically held ahead of the Singapore Badminton Open to build on the excitement surrounding badminton in Singapore. We brought together Guest of Honour Mr Edwin Tong and top national shuttlers Loh Kean Yew, Yeo Jia Min, Wesley Koh and Kubo Junsuke for exhibition matches and autograph sessions. With clinics for all ages, branded game booths supported by our sponsors, and a unique 3v3 tournament to close the day, the carnival offered something for everyone while bringing the community closer to the sport and its biggest names.',
      services: ['Event Conceptualisation, Planning & Execution',
        'National Athlete & Guest-of-Honour Engagement', 'Sponsor Sourcing & Partnership Management',
        'Programme Planning & Participant Experience Design',
        'Exhibition Matches & Autograph Session Management',
        'Branded Activations & Participant Engagement', 'Tournament Format, Registration & Operations',
        'Crowd Management & On-Ground Event Operations']
    },
    'Serangoon-Paya Lebar Badminton Clinic 2026': {
      description: 'We delivered three consecutive sessions for youths aged 15 to 35 at the Serangoon-Paya Lebar Badminton Clinic 2026, with tailored programmes for different playing levels. Beginners focused on building strong foundations and confidence on court, while experienced players sharpened their doubles skills, positioning and gameplay. Each session was structured to provide purposeful coaching while keeping the experience engaging and enjoyable for all participants.',
      services: ['Clinic Programme Planning & Execution', 'Skill-Level Based Programme Design',
        'Professional Badminton Coaches', 'Participant Management & On-Ground Event Operations']
    },
    'Bukit Gombak Sports Clinic 2026': {
      description: 'Following the strong response to our first edition, we returned to Bukit Gombak for a second year with our multi-sport clinic for young participants. Kids rotated through dedicated badminton and table tennis stations, followed by agility exercises designed to support both sports. The programme gave participants a fun and engaging way to experience both sports, learn their fundamentals and discover new interests through structured coaching and play.',
      services: ['Multi-Sport Clinic Programme Planning & Execution',
        'Professional Badminton & Table Tennis Coaches', 'Kids Sports Programme Design',
        'Participant & On-Ground Management']
    },
    'Bukit Gombak Sports Clinic 2025': {
      description: 'We designed and delivered a multi-sport clinic for young participants to experience both badminton and table tennis in one programme. Kids rotated across sport-specific coaching stations and agility exercises, gaining first-hand exposure to the fundamentals of both sports. The experience concluded with a sharing by current and former national players, giving participants the opportunity to learn on court while drawing inspiration from those who have competed at the highest level.',
      services: ['Multi-Sport Clinic Programme Planning & Execution',
        'Professional Badminton & Table Tennis Coaches', 'Athlete Sharing & Engagement',
        'Participant & On-Site Management']
    },
    'ÉB @ Northbrooks Secondary School': {
      description: 'We partnered with Northbrooks Secondary School to deliver an engaging badminton experience combining inspiration with on-court action. Our Co-Founder and Technical Director, Loh Kean Hean, shared his journey and experiences as a professional badminton player, followed by group training drills where students put their skills into practice. The session concluded with exhibition matches alongside the students, giving them the opportunity to interact, learn and experience badminton up close with a professional athlete.',
      services: ['Athlete Sharing & Student Engagement', 'Badminton Training & Group Drills']
    },
    'ÉB @ KFF Singapore Badminton Open 2025': {
      description: 'At the KFF Singapore Badminton Open 2025, we took our passion beyond the academy to create a carnival experience that brought the community closer to badminton. From complimentary clinics and masterclass to signed giveaways from Loh Kean Yew and Yeo Jia Min, as well as an autograph session with Alex Lanier, we brought together our expertise and connections to create memorable experiences that reflect our community-first mission of sharing the joy of badminton.',
      services: ['Event Conceptualisation, Planning & Execution', 'National Athlete Engagement',
        'Professional Badminton Coaches & On-Court Facilitation',
        'Games, Giveaways & Participant Engagement', 'Autograph Session Management',
        'On-Site Event Operations']
    }
  };
  async function assertEventStory(dialog, title) {
    const expected = eventStories[title];
    assert.equal((await dialog.locator('.edetail__desc').textContent()).trim(), expected.description,
      name + ' event description differs for ' + title);
    assert.deepEqual(await dialog.locator('.edetail__servicelist li').allTextContents(), expected.services,
      name + ' services differ for ' + title);
    assert.equal(await dialog.getByRole('heading', { name: 'Services provided', exact: true }).count(), 1);
    assert.ok(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1),
      name + ' event details overflow for ' + title);
    /* A short list stacks into one column at every width, not just on phone, so
       two-or-fewer items never read as a stray row (client, Sep 2026:
       Northbrooks). */
    if (expected.services.length <= 2) {
      assert.equal(await dialog.locator('.edetail__servicelist').evaluate(node =>
        getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length), 1,
      name + ' short event services should be one column for ' + title);
    }
    if (viewport.width <= 620) {
      assert.equal(await dialog.locator('.edetail__servicelist').evaluate(node =>
        getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length), 1,
      name + ' event services are not one column on phone for ' + title);
    }
  }
  const eventTrigger = page.locator('.ecov__open').first();
  await eventTrigger.click();
  const firstEventDialog = page.locator('.edetail:not([hidden])');
  await firstEventDialog.waitFor();
  await assertEventStory(firstEventDialog, 'SingHealth President’s Challenge Sports Day 2026');
  await page.screenshot({ path: path.join(outDir, name + '-events-modal.png'), fullPage: false });
  const galleryItem = page.locator('.edetail:not([hidden]) .edetail__tile').first();
  if (await galleryItem.count()) {
    await galleryItem.click();
    const lightbox = page.locator('.lightbox:not([hidden])');
    await lightbox.waitFor();
    assert.equal(await page.locator('.edetail:not([hidden])').getAttribute('aria-hidden'), 'true',
      name + ' event popup remains exposed to assistive technology beneath the lightbox');
    assert.ok(await page.locator('.edetail:not([hidden])').evaluate(node => node.hasAttribute('inert')),
      name + ' event popup is not inert beneath the lightbox');
    await page.waitForFunction(() => {
      const image = document.querySelector('.lightbox:not([hidden]) .lightbox__img');
      return image && image.complete && image.naturalWidth > 0 &&
        image.getBoundingClientRect().width > 0 && image.getBoundingClientRect().height > 0;
    });
    await page.screenshot({ path: path.join(outDir, name + '-events-lightbox.png'), fullPage: false });
    const lightboxStage = await lightbox.locator('.lightbox__stage').boundingBox();
    const lightboxImage = await lightbox.locator('.lightbox__img').boundingBox();
    assert.ok(lightboxStage && lightboxStage.x >= 0 &&
      lightboxStage.x + lightboxStage.width <= viewport.width + 1,
      name + ' lightbox stage overflows the viewport');
    assert.ok(lightboxImage && lightboxImage.width > 0 && lightboxImage.height > 0,
      name + ' lightbox image did not render');
    const closeBox = await lightbox.locator('.lightbox__close').boundingBox();
    assert.ok(closeBox && closeBox.x >= 0 && closeBox.y >= 0 &&
      closeBox.x + closeBox.width <= viewport.width && closeBox.y + closeBox.height <= viewport.height,
      name + ' lightbox close is offscreen');
    await lightbox.locator('.lightbox__close').click();
    assert.equal(await page.locator('.edetail:not([hidden])').count(), 1,
      name + ' event popup did not remain after closing photo');
    assert.equal(await page.locator('.edetail:not([hidden])').getAttribute('aria-hidden'), null,
      name + ' event popup remained hidden from assistive technology after closing photo');
    assert.equal(await page.locator('.edetail:not([hidden])').evaluate(node => node.hasAttribute('inert')), false,
      name + ' event popup remained inert after closing photo');
  }
  await page.keyboard.press('Escape');
  await page.locator('.ecov__open', { hasText: 'Joo Chiat Badminton Carnival 2026' }).click();
  const sponsorDialog = page.locator('.edetail:not([hidden])');
  await sponsorDialog.waitFor();
  await assertEventStory(sponsorDialog, 'Joo Chiat Badminton Carnival 2026');
  await sponsorDialog.locator('img[alt="Cuckoo"], img[alt="noomoo"]').evaluateAll(images =>
    Promise.all(images.map(image => image.decode ? image.decode() : Promise.resolve())));
  const logoSizes = await sponsorDialog.locator('.edetail__partner img').evaluateAll(nodes =>
    nodes.map(node => {
      const box = node.parentElement.getBoundingClientRect();
      const image = node.getBoundingClientRect();
      return { alt: node.alt.toLowerCase(), width: box.width, height: box.height,
        objectFit: getComputedStyle(node).objectFit,
        contained: image.left >= box.left - 1 && image.top >= box.top - 1 &&
          image.right <= box.right + 1 && image.bottom <= box.bottom + 1 };
    }));
  const cuckoo = logoSizes.find(item => item.alt === 'cuckoo');
  const noomoo = logoSizes.find(item => item.alt === 'noomoo');
  assert.ok(cuckoo && noomoo, name + ' Cuckoo/Noomoo sponsor logos are missing');
  assert.ok(Math.abs(cuckoo.width - noomoo.width) < 1 && Math.abs(cuckoo.height - noomoo.height) < 1,
    name + ' Cuckoo/Noomoo logo containers are inconsistent');
  assert.equal(cuckoo.objectFit, 'contain');
  assert.equal(noomoo.objectFit, 'contain');
  assert.ok(logoSizes.every(item => item.contained), name + ' event logo escaped its bounding box');
  await page.screenshot({ path: path.join(outDir, name + '-events-sponsors.png'), fullPage: false });
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('.ecov__open', { hasText: 'Joo Chiat Badminton Carnival 2026' })
    .evaluate(node => node === document.activeElement), name + ' event focus did not return');
  for (const title of ['ASICS Badminton Summit 2026', 'Serangoon-Paya Lebar Badminton Clinic 2026',
    'Bukit Gombak Sports Clinic 2026', 'ÉB @ Northbrooks Secondary School',
    'ÉB @ KFF Singapore Badminton Open 2025',
    'Bukit Gombak Sports Clinic 2025']) {
    const trigger = page.locator('.ecov__open', { hasText: title });
    assert.ok((await trigger.getAttribute('aria-label')).includes('and details'),
      name + ' event card is not marked as having details for ' + title);
    await trigger.click();
    const dialog = page.locator('.edetail:not([hidden])');
    await dialog.waitFor();
    await assertEventStory(dialog, title);
    if (title === 'Bukit Gombak Sports Clinic 2026') {
      assert.equal(await dialog.getByRole('heading', { name: 'Partners', exact: true }).count(), 1,
        name + ' Bukit Gombak 2026 should list its Partners');
      const bgPartners = await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.map(node => node.alt));
      assert.deepEqual(bgPartners,
        ['People\u2019s Association', 'Bukit Gombak', 'Community Sports Network @ Bukit Gombak'],
        name + ' Bukit Gombak 2026 partner logos are missing or out of order');
      await dialog.locator('.edetail__partner img').evaluateAll(images =>
        Promise.all(images.map(image => image.decode ? image.decode() : Promise.resolve())));
      assert.ok(await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.every(node => node.naturalWidth > 0)),
        name + ' Bukit Gombak 2026 partner logo failed to load');
    }
    if (title === 'ÉB @ Northbrooks Secondary School') {
      assert.equal(await dialog.getByRole('heading', { name: 'Partner', exact: true }).count(), 1,
        name + ' Northbrooks should list its Partner');
      const nbPartners = await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.map(node => node.alt));
      assert.deepEqual(nbPartners, ['Northbrooks Secondary School'],
        name + ' Northbrooks partner logo is missing');
      await dialog.locator('.edetail__partner img').evaluateAll(images =>
        Promise.all(images.map(image => image.decode ? image.decode() : Promise.resolve())));
      assert.ok(await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.every(node => node.naturalWidth > 0)),
        name + ' Northbrooks partner logo failed to load');
    }
    if (title === 'ÉB @ KFF Singapore Badminton Open 2025') {
      assert.equal(await dialog.getByRole('heading', { name: 'Partner', exact: true }).count(), 1,
        name + ' KFF Singapore Open should list its Partner');
      const kffPartners = await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.map(node => node.alt));
      assert.deepEqual(kffPartners, ['Singapore Badminton Association'],
        name + ' KFF Singapore Open partner logo is missing');
      await dialog.locator('.edetail__partner img').evaluateAll(images =>
        Promise.all(images.map(image => image.decode ? image.decode() : Promise.resolve())));
      assert.ok(await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.every(node => node.naturalWidth > 0)),
        name + ' KFF Singapore Open partner logo failed to load');
    }
    if (title === 'Bukit Gombak Sports Clinic 2025') {
      assert.equal((await dialog.locator('.edetail__title').textContent()).trim(), title);
      assert.deepEqual(await dialog.locator('.edetail__meta > span').allTextContents(),
        ['26 Jan 2025', '|', 'Hillview Community Club']);
      assert.equal(await dialog.getByRole('heading', { name: 'Highlights', exact: true }).count(), 1,
        name + ' Bukit Gombak 2025 should now render its Highlights gallery');
      assert.equal(await dialog.locator('.edetail__tile').count(), 12,
        name + ' Bukit Gombak 2025 should show its twelve photos');
      assert.equal(await trigger.locator('.ecov__placeholder').count(), 0,
        name + ' Bukit Gombak 2025 should no longer use the branded placeholder');
      assert.equal(await trigger.locator('.ecov__media img').count(), 1,
        name + ' Bukit Gombak 2025 should show a cover photo');
      const bg25Partners = await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.map(node => node.alt));
      assert.deepEqual(bg25Partners,
        ['People\u2019s Association', 'Bukit Gombak', 'Community Sports Network @ Bukit Gombak'],
        name + ' Bukit Gombak 2025 partner logos are missing or out of order');
      await dialog.locator('.edetail__partner img').evaluateAll(images =>
        Promise.all(images.map(image => image.decode ? image.decode() : Promise.resolve())));
      assert.ok(await dialog.locator('.edetail__partner img').evaluateAll(nodes =>
        nodes.every(node => node.naturalWidth > 0)),
        name + ' Bukit Gombak 2025 partner logo failed to load');
      await page.screenshot({ path: path.join(outDir, name + '-bukit-gombak-2025.png'), fullPage: false });
    }
    await page.keyboard.press('Escape');
  }

  await open(page, '/news.html', name + ' News');
  const filterBoxes = await page.locator('#articleFilters .sched__filter').evaluateAll(nodes =>
    nodes.map(node => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y,
      width: node.getBoundingClientRect().width })));
  assert.ok(filterBoxes.length > 1);
  assert.ok(filterBoxes[1].x - (filterBoxes[0].x + filterBoxes[0].width) >= 7 || filterBoxes[1].y > filterBoxes[0].y,
    name + ' News filters have no gap');
  const secondFilter = page.locator('#articleFilters .sched__filter').nth(1);
  await secondFilter.click();
  assert.ok(await secondFilter.evaluate(node => node.classList.contains('is-active')),
    name + ' News filter did not become active');
  await page.keyboard.press('Tab');
  const keyboardFilter = page.locator('#articleFilters .sched__filter').nth(2);
  assert.ok(await keyboardFilter.evaluate(node => node === document.activeElement && node.matches(':focus-visible')),
    name + ' News filters are not keyboard focusable');
  assert.notEqual(await keyboardFilter.evaluate(node => getComputedStyle(node).outlineStyle), 'none',
    name + ' News filter has no focus indicator');

  await open(page, '/about.html', name + ' About');
  assert.deepEqual(await page.locator('.psec__kicker', { hasText: 'Our story' })
    .locator('xpath=../following-sibling::div[contains(@class, "prose")]//p').allTextContents(), [
    'Founded in June 2023 by Loh Kean Hean and Eng Chin An, Élever Badminton was created to enrich the badminton experience for all. Driven by a shared love for the sport, we are building a vibrant community where everyone is supported to unlock their potential.',
    'Our coaching philosophy centres on building strong foundations through a structured development pathway. In a positive and motivating environment, we support players in developing their skills systematically and progressing towards their individual aspirations.',
    'Beyond coaching, we bring badminton experiences to organisations and communities through corporate and community events. From conceptualisation to on-site execution, we create engaging experiences that promote active living, strengthen connections, and bring people together through badminton.',
    'Whether you’re a parent building your child’s foundations, an adult refining your game, or an organisation looking to engage your community, we invite you to join us and elevate your badminton experience.'
  ], name + ' About page does not show the supplied Our Story copy');
  const coachGroupGaps = await page.locator('.coachgroup').evaluateAll(groups => groups.map(group => {
    const label = group.querySelector('.teamlabel').getBoundingClientRect();
    const cards = group.querySelector('.coachgrid').getBoundingClientRect();
    return Math.round(cards.top - label.bottom);
  }));
  assert.equal(coachGroupGaps.length, 2, name + ' coach groups are missing');
  assert.ok(coachGroupGaps.every(gap => gap >= 30),
    name + ' coach headings need more space before their card panels');
  assert.equal(await page.locator('.coach__certs, .coach__cert').count(), 0,
    name + ' About coach cards still show certifications');
  assert.ok(await page.locator('.coach__more', { hasText: 'View more' }).count() >= 1);
  const coachTrigger = page.locator('[data-coach="loh-kean-hean"]');
  await coachTrigger.click();
  const coachDialog = page.locator('.edetail--coach:not([hidden])');
  await coachDialog.waitFor();
  await page.screenshot({ path: path.join(outDir, name + '-coach-modal.png'), fullPage: false });
  assert.equal(await coachDialog.getByText('BWF Level 1', { exact: true }).count(), 1);
  assert.equal(await coachDialog.getByText('Languages', { exact: true }).count(), 0);
  assert.equal(await coachDialog.getByText('Coaches', { exact: true }).count(), 0);
  assert.equal(await coachDialog.getByRole('link', { name: 'See classes' }).count(), 0);
  assert.equal(await coachDialog.getByRole('heading', { name: 'About', exact: true }).count(), 1);
  assert.equal(await coachDialog.locator('.edetail__desc').count(), 4,
    name + ' coach popup does not show the full supplied description');
  assert.equal(await coachDialog.getByText(/represented Singapore for over 12 years/).count(), 1);
  const profileLink = coachDialog.getByRole('link', { name: /View full profile/ });
  assert.equal(await profileLink.count(), 1);
  assert.equal(await profileLink.locator('.cta-chevron').textContent(), '›');
  if (viewport.width <= 620) {
    const dialogBody = await coachDialog.locator('.cdetail').boundingBox();
    const dialogPhoto = await coachDialog.locator('.cdetail__photo').boundingBox();
    assert.ok(dialogBody && dialogPhoto &&
      Math.abs((dialogPhoto.x + dialogPhoto.width / 2) - (dialogBody.x + dialogBody.width / 2)) < 2,
    name + ' coach popup photo is not centred on phone');
  }
  await page.keyboard.press('Escape');
  assert.ok(await coachTrigger.evaluate(node => node === document.activeElement), name + ' coach focus did not return');

  const chinAnTrigger = page.locator('[data-coach="eng-chin-an"]');
  assert.equal(await chinAnTrigger.evaluate(node => node.tagName), 'BUTTON',
    name + ' Chin An should open a popup without linking to a profile page');
  assert.equal(await chinAnTrigger.getAttribute('type'), 'button');
  await chinAnTrigger.click();
  await coachDialog.waitFor();
  assert.equal((await coachDialog.locator('.edetail__title').textContent()).trim(), 'Eng Chin An');
  assert.deepEqual(await coachDialog.locator('.edetail__desc').allTextContents(), [
    'Chin An is the Co-Founder of Élever Badminton, where he oversees business operations, marketing, and events, while shaping the academy’s efforts to grow the sport and bring communities together.',
    'Having played badminton since the age of seven, Chin An was the key player at Raffles Institution and later captained the NUS Badminton Team, while also representing Singapore at several overseas tournaments. Known for his technical and skilful playing style, he competed at a high level locally in singles before developing strong proficiency in mixed doubles.',
    'Chin An believes that strong foundations and the right skills are essential to the development of every player. Shaped by his own journey, he hopes to make quality badminton experiences accessible while encouraging players to enjoy learning and progressing through the sport.',
    'Beyond the court, he drives Élever Badminton’s corporate and community initiatives, creating opportunities for people to connect through sport and building a stronger community around the game.'
  ], name + ' Chin An popup does not show the supplied description');
  assert.equal(await coachDialog.getByRole('link', { name: /View full profile/ }).count(), 0,
    name + ' Chin An should not link to a standalone profile page');
  await page.keyboard.press('Escape');
  assert.ok(await chinAnTrigger.evaluate(node => node === document.activeElement),
    name + ' Chin An popup focus did not return');

  const robinCard = page.locator('.coach', { hasText: 'Robin Chio' });
  assert.equal(await robinCard.evaluate(node => node.tagName), 'DIV',
    name + ' unfinished Robin coach card should remain static');
  assert.equal(await robinCard.getAttribute('data-coach'), null);
  assert.equal(await robinCard.locator('.coach__more').count(), 0);

  await open(page, '/coaches/ong-keng-yang.html', name + ' Coach profile');
  assert.equal(await page.getByText('HOME · ABOUT · COACHES', { exact: true }).count(), 0);
  assert.equal(await page.getByRole('link', { name: 'See classes' }).count(), 0);
  assert.equal(await page.getByRole('link', { name: 'View the team' }).count(), 1);
  assert.equal(await page.getByRole('link', { name: 'ASCA Level 1' }).count(), 1);
  assert.equal(await page.getByRole('link', { name: 'Level 1 Sports Trainer' }).count(), 1);
  assert.equal(await page.getByRole('heading', { name: 'About', exact: true }).count(), 1);
  assert.equal(await page.getByRole('heading', { name: 'Building Stronger Players', exact: true }).count(), 1);
  const trainingPhotos = page.locator('.profile__gallery img');
  assert.equal(await trainingPhotos.count(), 2, name + ' coach training photos are missing');
  assert.deepEqual(await trainingPhotos.evaluateAll(images => images.map(image => image.getAttribute('src'))), [
    '../assets/img/coaches/ong-keng-yang-training-1.jpg',
    '../assets/img/coaches/ong-keng-yang-training-2.jpg'
  ]);
  assert.ok((await trainingPhotos.evaluateAll(images => images.map(image => image.getAttribute('alt'))))
    .every(Boolean), name + ' coach training photos lack alt text');
  for (let i = 0; i < await trainingPhotos.count(); i += 1) {
    const trainingPhoto = trainingPhotos.nth(i);
    await trainingPhoto.scrollIntoViewIfNeeded();
    await trainingPhoto.evaluate(image => image.complete && image.naturalWidth > 0
      ? true
      : new Promise((resolve, reject) => {
        image.addEventListener('load', () => resolve(true), { once: true });
        image.addEventListener('error', () => reject(new Error('Training photo failed to load')), { once: true });
      }));
  }
  assert.equal(
    await page.locator('.profile__gallery').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length),
    viewport.width <= 620 ? 1 : 2,
    name + ' coach training photo layout has the wrong column count'
  );
  assert.equal(
    await page.locator('.profile__bio').first().evaluate(node => getComputedStyle(node).textAlign),
    viewport.width <= 620 ? 'left' : 'justify'
  );
  const coachHeader = await page.locator('.phead--coach-profile .phead__inner').boundingBox();
  const coachHeading = await page.locator('.phead--coach-profile h1').boundingBox();
  assert.ok(coachHeader && coachHeading && Math.abs(coachHeading.x - coachHeader.x) < 2,
    name + ' coach heading is not left aligned');
  if (viewport.width <= 620) {
    const coachRole = await page.locator('.phead--coach-profile .phead__lead').boundingBox();
    const coachProfile = await page.locator('.profile--coach').boundingBox();
    const coachPhoto = await page.locator('.profile--coach .profile__photo').boundingBox();
    const coachCertifications = await page.locator('.profile--coach .profile__certifications').boundingBox();
    const coachContent = await page.locator('.profile--coach .profile__content').boundingBox();
    const coachBiography = await page.locator('.profile--coach .profile__bio').first().boundingBox();
    const teamAction = await page.locator('.profile--coach .profile__actions').boundingBox();
    const teamButton = await page.getByRole('link', { name: 'View the team' }).boundingBox();
    assert.ok(coachRole && Math.abs(coachRole.x - coachHeader.x) < 2,
      name + ' coach role is not left aligned on phone');
    assert.equal(await page.locator('.profile--coach .profile__content').evaluate(node => getComputedStyle(node).textAlign),
      'left', name + ' coach content is not left aligned on phone');
    assert.equal(await page.locator('.profile--coach .profile__bio').first().evaluate(node => getComputedStyle(node).textAlign),
      'left', name + ' coach biography is not left aligned on phone');
    assert.ok(coachProfile && coachPhoto && coachCertifications && coachContent && coachBiography,
      name + ' coach profile alignment blocks are missing on phone');
    const profileLeft = coachProfile.x;
    const profileRight = coachProfile.x + coachProfile.width;
    [coachPhoto, coachCertifications, coachContent, coachBiography].forEach(box => {
      assert.ok(Math.abs(box.x - profileLeft) < 1,
        name + ' coach profile blocks do not share the exact left edge on phone');
      assert.ok(Math.abs(box.x + box.width - profileRight) < 1,
        name + ' coach profile blocks do not share the exact right edge on phone');
    });
    assert.ok(Math.abs(coachPhoto.width - coachBiography.width) < 1,
      name + ' coach photo and description are not exactly the same width on phone');
    assert.ok(teamAction && teamButton &&
      Math.abs((teamButton.x + teamButton.width / 2) - (teamAction.x + teamAction.width / 2)) < 2,
    name + ' View the team button is not centred on phone');
  }
  await page.screenshot({ path: path.join(outDir, name + '-coach-profile.png'), fullPage: true });

  await open(page, '/hub.html', name + ' Hub');
  assert.equal(await page.locator('#hubTabs .hub__tab').count(), 2);
  assert.equal(await page.locator('#tab-local').getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('#panel-international').isVisible(), false);
  await page.locator('#tab-international').click();
  assert.equal((await page.locator('.hub-hero__by').textContent()).trim(), 'BY ÉLEVER BADMINTON');
  const hubType = await page.evaluate(() => {
    const byline = document.querySelector('.hub-hero__by');
    const description = document.querySelector('.phead--hub .phead__lead');
    return {
      bylineSize: parseFloat(getComputedStyle(byline).fontSize),
      bylineColor: getComputedStyle(byline).color,
      descriptionSize: parseFloat(getComputedStyle(description).fontSize),
      description: description.textContent
    };
  });
  assert.ok(hubType.bylineSize > hubType.descriptionSize, name + ' Hub byline is not larger than its description');
  assert.equal(hubType.bylineColor, 'rgb(143, 171, 245)');
  assert.ok(hubType.description.includes('Singapore Shuttlers Hub'));
  assert.equal(await page.locator('#newsTimeline .ncard').count(), 1);
  assert.ok((await page.locator('#newsTimeline').textContent()).includes('YONEX SUNRISE Vietnam Open 2026'));
  assert.ok((await page.locator('#newsTimeline').textContent()).includes('Jason Teh Jia Heng'));
  assert.ok((await page.locator('#newsTimeline a', { hasText: 'Official event page' }).getAttribute('href'))
    .includes('/tournament/5220/'));
  assert.ok((await page.locator('#newsTimeline a', { hasText: 'Full BWF calendar' }).getAttribute('href'))
    .includes('/calendar/2026/'));
  assert.ok(await page.locator('#externalNewsGrid .article--external').count() >= 4);
  assert.equal(await page.getByText('Singapore Junior International Series 2026', { exact: true }).count(), 0);
  await page.locator('#tab-local').click();
  assert.equal(await page.locator('#panel-local[hidden]').count(), 0);
  assert.ok(await page.getByRole('link', { name: /Singapore court directory/ }).count());
  const localOrder = await page.locator('.hub-local-row').evaluateAll(nodes =>
    nodes.map(node => ({ id: node.id, y: node.getBoundingClientRect().y })));
  assert.deepEqual(localOrder.map(item => item.id), ['play', 'shops', 'tournaments']);
  assert.ok(localOrder.every((item, index) => !index || item.y > localOrder[index - 1].y),
    name + ' Local Hub sections are out of order');
  assert.equal(await page.locator('#groupPreview li').count(), 3);
  assert.deepEqual(await page.locator('#groupPreview .hub-session__name strong').allTextContents(),
    ['Racket Ratings', 'Meetup', 'OnePA']);
  assert.equal(await page.locator('#groupPreview .hub-session__dot').count(), 0);
  assert.equal(await page.getByText(/Élever ·/).count(), 0);
  assert.equal(await page.locator('.hub-court-types a').count(), 3);
  assert.deepEqual(await page.locator('.hub-court-types a > span:first-child').allTextContents(),
    ['ActiveSG Facilities', 'Community Clubs', 'Private Halls']);
  assert.ok(await page.getByRole('link', { name: 'Book a class', exact: true }).count() >= 1);
  assert.equal(await page.getByRole('link', { name: 'Book A Class', exact: true }).count(), 0);
  if (viewport.width > 1050) {
    const groups = await page.locator('#groups').boundingBox();
    const halls = await page.locator('#halls').boundingBox();
    const label = await page.locator('#play .hub-local-label').boundingBox();
    assert.ok(label.x < groups.x && groups.x < halls.x && Math.abs(groups.y - halls.y) < 1,
      name + ' Play does not match the label / groups / courts sketch layout');
    for (const id of ['shopsPhysical', 'shopsOnline']) {
      const boxes = await page.locator('#' + id + ' article').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y };
      }));
      assert.ok(boxes[0].y === boxes[1].y && boxes[0].x < boxes[1].x && boxes[2].y > boxes[0].y,
        name + ' ' + id + ' is not a two-column card grid');
    }
  }
  assert.equal(await page.getByRole('link', { name: /List your group/ }).count(), 1);
  await checkNoOverflow(page, name + ' group directory');
  assert.equal(await page.locator('#shopsPhysical article').count(), 3);
  assert.equal(await page.locator('#shopsOnline article').count(), 3);
  await page.locator('#shopFilters').getByRole('button', { name: 'Stringing', exact: true }).click();
  assert.equal(await page.locator('#shopFilters [data-category="stringing"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#shopsPhysical article').count(), 1);
  assert.equal(await page.locator('#shopsOnline article').count(), 1);
  await page.locator('#shopSearch').fill('  BEDOK  ');
  assert.equal(await page.locator('#shopsPhysical article').count(), 1);
  assert.equal(await page.locator('#shopsOnline article').count(), 0);
  await page.locator('#shopSearch').fill('no-such-shop');
  assert.ok((await page.locator('#shopCount').textContent()).startsWith('0 listings'));
  assert.equal(await page.locator('#shops .hub__empty').count(), 2);
  await page.locator('#shopSearch').fill('');
  await page.locator('#shopFilters').getByRole('button', { name: 'All', exact: true }).click();
  assert.equal(await page.locator('#shopsPhysical article, #shopsOnline article').count(), 6);
  assert.equal(await page.locator('#localEvents article').count(), 2);
  assert.equal(await page.locator('#localEvents .hub-discovery__register').count(), 2);
  await checkNoOverflow(page, name + ' Local Hub interactions');
  await page.mouse.move(viewport.width - 5, viewport.height - 5);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: path.join(outDir, name + '-hub-local.png'), fullPage: true });
  if (viewport.width > 1050) {
    await page.locator('#play').evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.screenshot({ path: path.join(outDir, name + '-hub-layout.png'), fullPage: false });
  }
  for (const [type, expected] of [['private', 10], ['official', 147], ['cc', 1]]) {
    await page.locator('.hub-court-types a[href*="type=' + type + '"]').click();
    await page.waitForURL('**/courts.html?type=' + type + '#halls');
    assert.equal(await page.locator('#hallGrid .hcard').count(), expected);
    if (type === 'official') {
      assert.deepEqual(await page.locator('#hallFilters input:checked').evaluateAll(nodes => nodes.map(node => node.value)),
        ['activesg', 'dus']);
    } else {
      assert.equal(await page.locator('#hallFilters input[value="' + type + '"]').isChecked(), true);
    }
    await page.locator('#hallClear').click();
    assert.equal(await page.locator('#hallGrid .hcard').count(), 160);
    await open(page, '/hub.html#local', name + ' return to Local Hub');
  }
  await page.goto(base + '/hub.html#shops');
  assert.equal(await page.locator('#tab-local').getAttribute('aria-selected'), 'true');
  await page.goto(base + '/hub.html#international');
  assert.equal(await page.locator('#tab-international').getAttribute('aria-selected'), 'true');
  await page.locator('#tab-international').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#tab-local').getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('#tab-local').evaluate(node => node === document.activeElement), true);
  await page.keyboard.press('Home');
  assert.equal(await page.locator('#tab-international').getAttribute('aria-selected'), 'true');

  await open(page, '/courts.html', name + ' Courts');
  assert.deepEqual(
    await page.locator('#hallFilters [data-group="type"] .fdrop__opt span').allTextContents(),
    ['ActiveSG Sport Halls', 'ActiveSG DUS School Halls', 'Community Clubs', 'Private Halls']
  );
  assert.deepEqual(await page.evaluate(() => window.ACTIVESG_BADMINTON_AUDIT), {
    listPages: 15, listedFacilities: 147, detailPagesChecked: 147, activesg: 19, dus: 128,
    directBookingLinks: 127, directoryFallbacks: 20
  });
  assert.equal(await page.locator('#statOfficial').textContent(), '147');
  assert.equal(await page.getByText('Cereza Sports Hall', { exact: true }).count(), 0);
  assert.equal(await page.getByText('Kovan Sports Centre', { exact: true }).count(), 0);
  assert.ok(await page.getByText('Bishan Clubhouse', { exact: true }).count());
  assert.ok(await page.locator('.hcard__addr').first().evaluate(node =>
    getComputedStyle(node).textDecorationLine.includes('underline')));
  assert.equal(await page.locator('#hallGrid .hcard').count(), 160);
  assert.equal(await page.locator('#hallGrid .hcard__hours').count(), 160);
  assert.equal(await page.locator('#hallGrid .hcard__hours > a').count(), 0);
  const courtHours = await page.locator('#hallGrid .hcard').evaluateAll(cards => cards.map(card => {
    const venue = card.querySelector('.hcard__name').textContent.trim();
    const row = card.querySelector('.hcard__hours');
    const value = row && row.querySelector('.hcard__hours-value');
    return { venue, label: row && row.querySelector('.hcard__hours-label').textContent.trim(),
      hours: value && value.textContent.trim() };
  }));
  courtHours.forEach(item => {
    assert.equal(item.label, 'Hours', name + ' hours label missing for ' + item.venue);
    assert.ok(item.hours && item.hours.length >= 12, name + ' hours missing for ' + item.venue);
  });
  assert.ok(await page.locator('#hallGrid .hcard__tag--dus').count() >= 128,
    name + ' DUS halls are not distinguished');
  assert.ok(courtHours.every(item => !/\b(?:[0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm)|midnight|noon)\b/i.test(item.hours)),
    name + ' a court time is not in 24-hour HH:MM format');
  assert.ok(courtHours.some(item => item.hours.includes('no public court hire')),
    name + ' school access is not distinguished from public hours');
  await page.locator('#hallGrid .hcard').first().screenshot({
    path: path.join(outDir, name + '-court-hours.png')
  });
  const courtTypes = await page.locator('#hallGrid .hcard__tag').evaluateAll(tags => tags.reduce((counts, tag) => {
    const className = Array.from(tag.classList).find(name => name.indexOf('hcard__tag--') === 0);
    const type = className.replace('hcard__tag--', '');
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {}));
  assert.deepEqual(courtTypes, { private: 10, elever: 2, cc: 1, dus: 128, activesg: 19 });
  const activeSgRoutes = await page.locator('#hallGrid .hcard').evaluateAll(cards => cards
    .filter(card => card.querySelector('.hcard__tag--activesg, .hcard__tag--dus'))
    .map(card => Array.from(card.querySelectorAll('a')).map(link => link.href)));
  const directActiveSgRoutes = activeSgRoutes.filter(routes =>
    routes.some(url => url.includes('activesg.gov.sg/venues/')));
  const directoryFallbackRoutes = activeSgRoutes.filter(routes =>
    routes.some(url => url.includes('activesg.gov.sg/facility-bookings/activities/')));
  assert.equal(directActiveSgRoutes.length, 127,
    name + ' direct ActiveSG booking route count changed');
  assert.equal(directoryFallbackRoutes.length, 20,
    name + ' ActiveSG directory fallback count changed');
  assert.ok(activeSgRoutes.every(routes => routes.some(url => /^https:\/\/activesg\.gov\.sg\//.test(url))),
    name + ' an ActiveSG venue lacks an official booking route');
  const courtActions = await page.locator('#hallGrid .hcard__actions a').allTextContents();
  ['Book on ActiveSG', 'Book on Rezerv', 'Book on Playtomic', 'Public courts on OnePA']
    .forEach(label => assert.ok(courtActions.includes(label), name + ' court action is missing: ' + label));
  await page.locator('#hallSearch').fill('Bishan');
  assert.deepEqual(await page.locator('#hallGrid .hcard__name').allTextContents(),
    ['Bishan Clubhouse', 'Bishan Sport Hall', 'Kuo Chuan Presbyterian Primary School Hall',
      'Whitley Secondary School Hall']);
  await page.locator('#hallSearch').fill('');

  await checkContact(page, viewport, name);

  for (const route of ['/camps.html', '/lab.html', '/privacy.html']) {
    await open(page, route, name + ' ' + route);
  }
  await context.close();
}

async function checkEventLandscape(browser) {
  const viewport = { width: 844, height: 390 };
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  attachDiagnostics(page, 'phone-landscape');
  await open(page, '/events.html', 'phone-landscape Events');
  await page.locator('.ecov__open').first().click();
  await page.locator('.edetail:not([hidden]) .edetail__tile').first().click();
  const lightbox = page.locator('.lightbox:not([hidden])');
  await page.waitForFunction(() => {
    const image = document.querySelector('.lightbox:not([hidden]) .lightbox__img');
    return image && image.complete && image.naturalWidth > 0 &&
      image.getBoundingClientRect().width > 0 && image.getBoundingClientRect().height > 0;
  });
  const closeBox = await lightbox.locator('.lightbox__close').boundingBox();
  const imageBox = await lightbox.locator('.lightbox__img').boundingBox();
  assert.ok(closeBox && closeBox.x >= 0 && closeBox.y >= 0 &&
    closeBox.x + closeBox.width <= viewport.width && closeBox.y + closeBox.height <= viewport.height,
    'phone-landscape lightbox close is offscreen');
  assert.ok(imageBox && imageBox.width > 0 && imageBox.height > 0,
    'phone-landscape lightbox image did not render');
  await page.screenshot({ path: path.join(outDir, 'phone-landscape-events-lightbox.png'), fullPage: false });
  await lightbox.locator('.lightbox__close').click();
  assert.equal(await page.locator('.edetail:not([hidden])').count(), 1,
    'phone-landscape event popup did not remain after closing photo');
  await context.close();
}

function allHtmlRoutes() {
  const roots = fs.readdirSync(repoRoot)
    .filter(name => name.endsWith('.html'));
  const nested = ['coaches', 'news'].flatMap(directory =>
    fs.readdirSync(path.join(repoRoot, directory))
      .filter(name => name.endsWith('.html'))
      .map(name => directory + '/' + name));
  return roots.concat(nested).sort().map(file => '/' + file);
}

async function crawlAllPages(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  attachDiagnostics(page, 'full-crawl');
  const checked = new Set();
  const headingSizes = new Map();

  for (const route of allHtmlRoutes()) {
    await open(page, route, 'full-crawl ' + route);
    const icons = await page.locator('link[rel~="icon"]').count();
    assert.ok(icons >= 1, route + ' does not expose a favicon');
    const iconHrefs = await page.locator('link[rel~="icon"]').evaluateAll(nodes => nodes.map(node => node.href));
    assert.ok(iconHrefs.some(href => href.includes('/assets/img/brand/eb-icon-blue.png?v=64')),
      route + ' is missing the requested blue-background PNG favicon');
    assert.ok(iconHrefs.some(href => href.includes('/favicon.ico?v=64')),
      route + ' is missing the versioned ICO fallback');
    if (route === '/about.html' || route === '/contact.html') {
      headingSizes.set(route, await page.locator('.phead h1').evaluate(node => getComputedStyle(node).fontSize));
    }

    if (route.startsWith('/coaches/')) {
      assert.equal(await page.locator('.phead__crumbs').count(), 0, route + ' still has breadcrumbs');
      assert.equal(await page.locator('.profile__meta').count(), 0, route + ' still has pathway/language metadata');
      assert.equal(await page.getByRole('link', { name: 'See classes' }).count(), 0, route + ' still has See classes');
      assert.equal(await page.getByRole('link', { name: 'View the team' }).count(), 1,
        route + ' is missing View the team');
      assert.equal(await page.locator('.profile--coach').count(), 1, route + ' is not a coach profile grid');
      assert.equal(await page.getByRole('heading', { name: 'About', exact: true }).count(), 1,
        route + ' should use the heading About without the coach name');
      assert.equal(await page.locator('.profile__bio').first().evaluate(node => getComputedStyle(node).textAlign),
        'justify', route + ' biography is not justified');
      const certificationLinks = await page.locator('.profile__cert').evaluateAll(nodes =>
        nodes.map(node => ({ name: node.textContent.trim(), href: node.href })));
      certificationLinks.forEach(link => {
        const expected = {
          'BWF Level 1': 'https://development.bwfbadminton.com/coaches/level-1',
          'ASCA Level 1': 'https://www.strengthandconditioning.org/courses-accreditation/level-01',
          'Level 1 Sports Trainer': 'https://sma.org.au/safer-sport-courses/level-1-sports-trainer/'
        }[link.name];
        assert.equal(link.href, expected, route + ' has an incorrect certification link for ' + link.name);
      });
    }

    const cappedRules = await page.locator('.psec--alt').evaluateAll(nodes => nodes.map(node => {
      const before = getComputedStyle(node, '::before');
      const after = getComputedStyle(node, '::after');
      return { before: parseFloat(before.width), after: parseFloat(after.width), viewport: innerWidth };
    }));
    cappedRules.forEach(rule => {
      assert.ok(rule.before <= 1181 && rule.after <= 1181,
        route + ' has a section separator wider than the shared content width');
      if (rule.viewport > 1181) assert.ok(rule.before < rule.viewport && rule.after < rule.viewport,
        route + ' has a full-viewport section separator');
    });
    const references = await page.locator('a[href], img[src], script[src], link[href], source[src], form[action]')
      .evaluateAll(nodes => nodes.map(node =>
        node.getAttribute('href') || node.getAttribute('src') || node.getAttribute('action'))
        .filter(Boolean));

    for (const reference of references) {
      if (/^(?:mailto:|tel:|javascript:|data:)/i.test(reference) || reference === '#') continue;
      const target = new URL(reference, page.url());
      if (target.origin !== new URL(base).origin) continue;
      target.hash = '';
      if (checked.has(target.href)) continue;
      checked.add(target.href);
      const response = await context.request.get(target.href, { maxRedirects: 5 });
      assert.ok(response.status() < 400,
        route + ' references missing local resource ' + target.pathname + ' (' + response.status() + ')');
    }
  }
  assert.equal(headingSizes.get('/contact.html'), headingSizes.get('/about.html'),
    'Contact and About page headings should use the same font size');
  await context.close();
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const launchOptions = { headless: true };
  if (executablePath) launchOptions.executablePath = executablePath;
  const browser = await chromium.launch(launchOptions);
  try {
    await runViewport(browser, { width: 1440, height: 1000 }, 'desktop');
    await runViewport(browser, { width: 768, height: 1024 }, 'tablet');
    await runViewport(browser, { width: 390, height: 844 }, 'phone-390');
    await runViewport(browser, { width: 320, height: 568 }, 'phone-320-short');
    await checkEventLandscape(browser);
    await crawlAllPages(browser);
  } finally {
    await browser.close();
  }
  assert.deepEqual(pageErrors, [], 'Page errors:\n' + pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], 'Console errors:\n' + consoleErrors.join('\n'));
  assert.deepEqual(failedResponses, [], 'Failed local responses:\n' + failedResponses.join('\n'));
  console.log('Browser verification passed. Screenshots: ' + outDir);
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
