#!/usr/bin/env node
'use strict';

/*
 * Refresh the badminton directory from ActiveSG's official facility listing.
 *
 * The site is static, so this build step snapshots the official directory
 * rather than depending on a cross-origin browser request at page load. Each
 * venue detail page supplies its public hours and direct badminton-booking URL.
 * Run with: node tools/build-activesg-venues.js
 */

const fs = require('fs');
const path = require('path');

const LIST_URL = 'https://www.activesgcircle.gov.sg/facilities/badminton';
const OUTPUT = path.join(__dirname, '..', 'assets', 'js', 'activesg-venues.js');
const CONCURRENCY = 10;
const DIRECTORY_BOOKING_URL = 'https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues';

function decode(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function text(value) {
  return decode(String(value || ''))
    .replace(/<br\s*\/?\s*>/gi, ' · ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s*·\s*·\s*/g, ' · ')
    .replace(/\s+/g, ' ')
    .trim();
}

function match(value, pattern) {
  const found = String(value || '').match(pattern);
  return found ? text(found[1]) : '';
}

function slugFromUrl(url) {
  return new URL(url).pathname.split('/').filter(Boolean).pop();
}

function to24Hour(hour, minute, meridiem) {
  let h = Number(hour);
  const suffix = meridiem.toLowerCase();
  if (suffix === 'am' && h === 12) h = 0;
  if (suffix === 'pm' && h !== 12) h += 12;
  return String(h).padStart(2, '0') + ':' + String(minute || '00').padStart(2, '0');
}

function normaliseTimes(value) {
  return String(value || '')
    .replace(/\bmidnight\b/gi, '00:00')
    .replace(/\bnoon\b/gi, '12:00')
    .replace(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/gi, (_, hour, minute, suffix) =>
      to24Hour(hour, minute, suffix)
    )
    .replace(/\s+(?:to|-)\s+/gi, '–')
    .replace(/\s*·\s*/g, ' · ')
    .trim();
}

async function get(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'EleverBadmintonDirectory/1.0 (+https://www.eleverbadminton.com/)' }
  });
  if (!response.ok) throw new Error(response.status + ' ' + response.statusText + ': ' + url);
  return response.text();
}

function parseListingSummary(html) {
  const found = String(html || '').match(/Showing\s+(\d+)-(\d+)\s+of\s+(\d+)\s+results/i);
  if (!found) throw new Error('Could not read the ActiveSG listing result count.');
  return { start: Number(found[1]), end: Number(found[2]), total: Number(found[3]) };
}

function parseListPage(html, pageNumber) {
  return html.split('<div class="cst-list-item">').slice(1).map((chunk, index) => {
    const url = decode((chunk.match(/<a class="view-page-link" href="([^"]+)/) || [])[1]);
    const name = match(chunk, /<div class="cst-cnt">[\s\S]*?<h2>\s*([^<]+?)\s*<\/h2>/);
    const region = match(chunk, /<div class="cst-direction">[\s\S]*?<span>([^<]+)/)
      .replace(/^Northeast$/, 'North-East');
    const address = match(chunk, /<div class="cst-address">([\s\S]*?)<\/div>/)
      .replace(/\s+Singapore\s+(\d{6})$/, ', S$1');
    let facilityType = match(chunk, /<div class="cst-type-of-facility">\s*([^<]+?)\s*<\/div>/);
    if (!facilityType) facilityType = /School Hall/i.test(name) ? 'School Sport Hall' : 'Sport Hall';
    if (!url || !name || !region || !address) {
      throw new Error('Incomplete facility card at listing page ' + pageNumber + ', card ' + (index + 1) + '.');
    }
    return { url, name, region, address, facilityType, sourcePage: pageNumber };
  });
}

function parseDetails(html) {
  const hoursMarkup = (html.match(/<div class="cst-cnt operating-hours-content">([\s\S]*?)<div class="cst-ph-no">/i) || [])[1] || '';
  const publishedHours = text(hoursMarkup).replace(/^Operating Hours\s*/i, '').split(/Please refer to/i)[0].replace(/[ ·]+$/, '');
  const addressMarkup = (html.match(/<div class="cst-add">([\s\S]*?)<div class="directions_buttons-container">/i) || [])[1] || '';
  const address = text(addressMarkup).replace(/^Address\s*/i, '').replace(/\s+,/g, ',').replace(/\s+Singapore\s+(\d{6})$/, ', S$1');
  const bookingTag = (html.match(/<a\b(?=[^>]*aria-label="[^"]*Badminton Court[^"]*")[^>]*>/i) || [])[0] || '';
  const booking = decode((bookingTag.match(/href="([^"]+)/i) || [])[1]);
  const name = match(html, /<h1[^>]*>\s*([^<]+?)\s*<\/h1>/i);
  return {
    name: name,
    hours: normaliseTimes(publishedHours),
    book: booking,
    address: address
  };
}

async function mapLimit(items, limit, fn) {
  const output = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      output[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return output;
}

async function main() {
  const firstPage = await get(LIST_URL + '?page_num=1');
  const firstSummary = parseListingSummary(firstPage);
  const pageSize = firstSummary.end - firstSummary.start + 1;
  if (firstSummary.start !== 1 || pageSize < 1) {
    throw new Error('Unexpected first-page range from ActiveSG: ' + JSON.stringify(firstSummary));
  }
  const pageCount = Math.ceil(firstSummary.total / pageSize);
  const pages = [firstPage].concat(await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) =>
    get(LIST_URL + '?page_num=' + (index + 2))
  )));
  const listed = pages.flatMap((html, index) => {
    const pageNumber = index + 1;
    const summary = parseListingSummary(html);
    const expectedStart = index * pageSize + 1;
    const expectedEnd = Math.min(pageNumber * pageSize, firstSummary.total);
    if (summary.start !== expectedStart || summary.end !== expectedEnd || summary.total !== firstSummary.total) {
      throw new Error('Unexpected result range on ActiveSG page ' + pageNumber + ': ' + JSON.stringify(summary));
    }
    const venues = parseListPage(html, pageNumber);
    if (venues.length !== expectedEnd - expectedStart + 1) {
      throw new Error('ActiveSG page ' + pageNumber + ' declares ' + (expectedEnd - expectedStart + 1) +
        ' facilities but yielded ' + venues.length + ' cards.');
    }
    return venues;
  });
  const unique = Array.from(new Map(listed.map(venue => [venue.url, venue])).values());
  if (listed.length !== firstSummary.total || unique.length !== firstSummary.total) {
    throw new Error('ActiveSG declares ' + firstSummary.total + ' facilities, but the scrape found ' +
      listed.length + ' cards and ' + unique.length + ' unique URLs.');
  }

  const venues = await mapLimit(unique, CONCURRENCY, async venue => {
    const details = parseDetails(await get(venue.url));
    if (details.name !== venue.name) {
      throw new Error('Facility detail mismatch: expected "' + venue.name + '" but opened "' + details.name + '" (' + venue.url + ').');
    }
    if (!details.address || !details.hours) {
      throw new Error('Missing address or operating hours on ' + venue.url + '.');
    }
    return {
      id: 'activesg-' + slugFromUrl(venue.url),
      name: venue.name,
      area: venue.region,
      region: venue.region,
      type: venue.facilityType === 'School Sport Hall' ? 'dus' : 'activesg',
      addr: details.address || venue.address,
      meta: venue.facilityType === 'School Sport Hall' ? 'ActiveSG DUS school hall' : 'ActiveSG badminton venue',
      hours: details.hours,
      hoursSource: venue.url,
      book: details.book || DIRECTORY_BOOKING_URL,
      bookLabel: 'Book on ActiveSG'
    };
  });

  venues.sort((a, b) => a.name.localeCompare(b.name, 'en-SG'));
  const counts = venues.reduce((result, venue) => {
    result[venue.type] = (result[venue.type] || 0) + 1;
    return result;
  }, {});
  const directBookingLinks = venues.filter(venue => venue.book !== DIRECTORY_BOOKING_URL).length;
  const audit = {
    listPages: pageCount,
    listedFacilities: firstSummary.total,
    detailPagesChecked: venues.length,
    activesg: counts.activesg || 0,
    dus: counts.dus || 0,
    directBookingLinks: directBookingLinks,
    directoryFallbacks: venues.length - directBookingLinks
  };
  const generated =
    "/* Generated by tools/build-activesg-venues.js from the official ActiveSG\n" +
    "   badminton facilities directory. Do not edit this file by hand. */\n" +
    "window.ACTIVESG_BADMINTON_SOURCE = " + JSON.stringify(LIST_URL) + ";\n" +
    "window.ACTIVESG_BADMINTON_AUDIT = " + JSON.stringify(audit, null, 2) + ";\n" +
    "window.ACTIVESG_BADMINTON_VENUES = " + JSON.stringify(venues, null, 2) + ";\n";
  fs.writeFileSync(OUTPUT, generated);
  console.log('Audited ' + pageCount + ' list pages and ' + venues.length + ' facility detail pages.');
  console.log('Wrote ' + venues.length + ' venues (' + (counts.activesg || 0) + ' ActiveSG sport venues, ' +
    (counts.dus || 0) + ' DUS school halls) to ' + OUTPUT);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
