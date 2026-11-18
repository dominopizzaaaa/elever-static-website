#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const origin = 'https://www.eleverbadminton.com';
const imagePath = '/assets/img/social/elever-badminton-share.jpg';
const imageUrl = origin + imagePath + '?v=20261118';
const imageAlt = '\u00c9lever Badminton';
const excludedDirectories = fs.readFileSync(path.join(root, '.vercelignore'), 'utf8')
  .split(/\r?\n/).map(line => line.trim()).filter(line => line.endsWith('/'));

function allPageFiles(directory = root, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
    if (entry.isDirectory()) {
      if (excludedDirectories.includes(relative + '/')) return [];
      return allPageFiles(path.join(directory, entry.name), relative + '/');
    }
    return entry.name.endsWith('.html') ? [relative] : [];
  }).sort();
}

function attributes(tag) {
  return Object.fromEntries(Array.from(tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs),
    match => [match[1].toLowerCase(), match[3]]));
}

function verifyMetadata(html, label) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  assert.ok(head, label + ': missing static head');
  const tags = Array.from(head[1].matchAll(/<meta\b[^>]*>/gi), match => attributes(match[0]));
  const expected = {
    'og:image': imageUrl,
    'og:image:secure_url': imageUrl,
    'og:image:type': 'image/jpeg',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': imageAlt,
    'twitter:card': 'summary_large_image',
    'twitter:image': imageUrl,
    'twitter:image:alt': imageAlt
  };
  for (const [key, value] of Object.entries(expected)) {
    const matches = tags.filter(tag => (tag.property || tag.name) === key);
    assert.equal(matches.length, 1, label + ': missing or duplicate ' + key);
    assert.equal(matches[0].content, value, label + ': incorrect ' + key);
  }
  for (const key of ['og:title', 'og:description', 'og:type', 'og:url',
    'twitter:title', 'twitter:description']) {
    const matches = tags.filter(tag => (tag.property || tag.name) === key);
    assert.equal(matches.length, 1, label + ': missing or duplicate ' + key);
    assert.ok(matches[0].content, label + ': empty ' + key);
  }
  for (const tag of tags) {
    if (['og:image:url', 'twitter:image:src', 'image'].includes(tag.property || tag.name || tag.itemprop)) {
      assert.equal(tag.content, imageUrl, label + ': conflicting fallback image');
    }
  }
  const links = Array.from(head[1].matchAll(/<link\b[^>]*>/gi), match => attributes(match[0]));
  const canonical = links.filter(link => link.rel === 'canonical');
  assert.equal(canonical.length, 1, label + ': missing or duplicate canonical');
  assert.equal(tags.find(tag => tag.property === 'og:url').content, canonical[0].href,
    label + ': og:url differs from canonical');
  assert.ok(canonical[0].href.startsWith(origin + '/'), label + ': unexpected canonical origin');
  for (const link of links.filter(link => link.rel === 'image_src')) {
    assert.equal(link.href, imageUrl, label + ': conflicting legacy share image');
  }
  for (const script of head[1].matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const data = JSON.parse(script[1]);
    if (data.image) assert.equal(data.image, imageUrl, label + ': conflicting page structured-data image');
    if (data['@type'] === 'NewsArticle') {
      assert.equal(data.image, imageUrl, label + ': article needs its share image in structured data');
    }
  }
}

function shareRoutes(files) {
  const routes = new Set(['/index', '/index.html']);
  for (const file of files) {
    const clean = file === 'index.html' ? '/' : '/' + file.replace(/\.html$/, '');
    routes.add(clean);
    routes.add('/' + file);
    if (clean !== '/') routes.add(clean + '/');
    routes.add(clean + '?preview=20261118');
  }
  for (const route of [
    '/hub#local', '/hub#international', '/hub#play', '/hub#shops', '/hub#tournaments',
    '/courts?type=private#halls', '/courts?type=official#halls', '/courts?type=cc#halls',
    '/news?category=Features', '/news?category=BWF%20World%20Tour',
    '/events#past-clinic', '/events#past-carnival', '/contact#contact-form'
  ]) routes.add(route);
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = new URL(match[1]);
    routes.add(url.pathname + url.search + url.hash);
  }
  return Array.from(routes).sort();
}

async function verifyLive(baseUrl, files = allPageFiles()) {
  const base = new URL(baseUrl);
  const headers = { 'user-agent': 'WhatsApp/2.26.0', 'cache-control': 'no-cache' };
  const routes = shareRoutes(files);
  // Small batches keep a complete route audit from flooding the production site.
  for (let i = 0; i < routes.length; i += 4) {
    await Promise.all(routes.slice(i, i + 4).map(async route => {
      const url = new URL(route, base);
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200, url.href + ': unexpected response');
      assert.match(response.headers.get('content-type') || '', /text\/html/i, url.href + ': not HTML');
      verifyMetadata(await response.text(), url.href);
    }));
  }
  const response = await fetch(new URL(imagePath + '?v=20261118', base),
    { headers, signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, 'Share image must be publicly fetchable');
  assert.match(response.headers.get('content-type') || '', /^image\/jpeg\b/i);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.ok(bytes.equals(fs.readFileSync(path.join(root, imagePath.slice(1)))),
    'Deployed share image differs from the chosen local asset');
  console.log(`Verified ${routes.length} share URL variants and the JPEG at ${base.origin}`);
}

async function main() {
  const files = allPageFiles();
  assert.ok(files.length, 'No shareable pages found');
  for (const file of files) {
    verifyMetadata(fs.readFileSync(path.join(root, file), 'utf8'), file);
  }
  const bytes = fs.readFileSync(path.join(root, imagePath.slice(1)));
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'Share asset must be a real JPEG');
  assert.ok(bytes.length < 5 * 1024 * 1024, 'Share asset must be below 5 MB');
  console.log(`Verified static social metadata on all ${files.length} pages`);
  if (process.env.ELEVER_BASE_URL) await verifyLive(process.env.ELEVER_BASE_URL, files);
}

module.exports = { allPageFiles, imageUrl, shareRoutes, verifyMetadata };

if (require.main === module) {
  main().catch(error => {
    console.error(error.stack || error);
    process.exitCode = 1;
  });
}
