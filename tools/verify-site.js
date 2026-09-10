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
  assert.equal(await form.locator('[name="Mobile"]').getAttribute('required'), null);
  assert.equal(await form.locator('[data-contact-panel]:visible').count(), 0);
  const sendButtonStyle = await form.getByRole('button', { name: 'Send message' }).evaluate(node => ({
    background: getComputedStyle(node).backgroundColor,
    border: getComputedStyle(node).borderTopColor,
    color: getComputedStyle(node).color
  }));
  assert.deepEqual(sendButtonStyle, {
    background: 'rgba(0, 0, 0, 0)', border: 'rgb(33, 81, 209)', color: 'rgb(33, 81, 209)'
  });

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
    const phoneParts = await form.locator('.contact-phone > *').evaluateAll(nodes =>
      nodes.map(node => ({ y: node.getBoundingClientRect().y, width: node.getBoundingClientRect().width })));
    assert.equal(phoneParts.length, 2);
    assert.ok(Math.abs(phoneParts[0].y - phoneParts[1].y) < 1, name + ' country code is not left of Mobile');
    assert.ok(phoneParts[0].width >= 100 && phoneParts[1].width > phoneParts[0].width,
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
  const eventTrigger = page.locator('.ecov__open').first();
  await eventTrigger.click();
  await page.locator('.edetail:not([hidden])').waitFor();
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
  assert.equal(await coachDialog.getByRole('link', { name: 'View full profile' }).count(), 1);
  await page.keyboard.press('Escape');
  assert.ok(await coachTrigger.evaluate(node => node === document.activeElement), name + ' coach focus did not return');

  await open(page, '/coaches/ong-keng-yang.html', name + ' Coach profile');
  assert.equal(await page.getByText('HOME · ABOUT · COACHES', { exact: true }).count(), 0);
  assert.equal(await page.getByRole('link', { name: 'See classes' }).count(), 0);
  assert.equal(await page.getByRole('link', { name: 'View all coaches' }).count(), 1);
  assert.equal(await page.getByRole('link', { name: 'ASCA Level 1' }).count(), 1);
  assert.equal(await page.getByRole('link', { name: 'Level 1 Sports Trainer' }).count(), 1);
  assert.equal(await page.locator('.profile__bio').first().evaluate(node => getComputedStyle(node).textAlign), 'justify');
  const coachHeading = await page.locator('.phead--coach h1').boundingBox();
  assert.ok(coachHeading && Math.abs((coachHeading.x + coachHeading.width / 2) - viewport.width / 2) < 2,
    name + ' coach heading is not centred');
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
  assert.equal(await page.locator('.hub-court-types a').count(), 5);
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
  await page.locator('#groupMore summary').click();
  assert.equal(await page.getByRole('link', { name: /See all venues, levels and weekly sessions/ }).isVisible(), true);
  await checkNoOverflow(page, name + ' expanded groups');
  await page.locator('#groupMore summary').click();
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
  for (const [type, expected] of [['private', 10], ['official', 147], ['activesg', 19], ['dus', 128], ['cc', 1]]) {
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
  assert.equal(await page.locator('#hallGrid .hcard__hours > a').count(), 160);
  const courtHours = await page.locator('#hallGrid .hcard').evaluateAll(cards => cards.map(card => {
    const venue = card.querySelector('.hcard__name').textContent.trim();
    const row = card.querySelector('.hcard__hours');
    const source = row && row.querySelector('a');
    return { venue, label: row && row.querySelector('span').textContent.trim(),
      hours: source && source.textContent.trim(), source: source && source.href };
  }));
  courtHours.forEach(item => {
    assert.equal(item.label, 'Hours', name + ' hours label missing for ' + item.venue);
    assert.ok(item.hours && item.hours.length >= 12, name + ' hours missing for ' + item.venue);
    assert.ok(item.source && /^(https?:|file:)/.test(item.source),
      name + ' hours source missing for ' + item.venue);
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

  for (const route of allHtmlRoutes()) {
    await open(page, route, 'full-crawl ' + route);
    const icons = await page.locator('link[rel~="icon"]').count();
    assert.ok(icons >= 2, route + ' does not expose both primary and fallback favicons');
    const iconHrefs = await page.locator('link[rel~="icon"]').evaluateAll(nodes => nodes.map(node => node.href));
    assert.ok(iconHrefs.some(href => href.includes('/assets/img/brand/eb-icon-blue.png?v=61')),
      route + ' is missing the requested blue-background PNG favicon');
    assert.ok(iconHrefs.some(href => href.includes('/favicon.ico?v=61')),
      route + ' is missing the versioned ICO fallback');

    if (route.startsWith('/coaches/')) {
      assert.equal(await page.locator('.phead__crumbs').count(), 0, route + ' still has breadcrumbs');
      assert.equal(await page.locator('.profile__meta').count(), 0, route + ' still has pathway/language metadata');
      assert.equal(await page.getByRole('link', { name: 'See classes' }).count(), 0, route + ' still has See classes');
      assert.equal(await page.getByRole('link', { name: 'View all coaches' }).count(), 1,
        route + ' is missing View all coaches');
      assert.equal(await page.locator('.profile--single').count(), 1, route + ' is not a centred single-column profile');
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
