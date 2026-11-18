'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const test = require('node:test');
const { allPageFiles, imageUrl, shareRoutes, verifyMetadata } =
  require('../tools/verify-social-previews');

const root = path.resolve(__dirname, '..');
const readPage = file => fs.readFileSync(path.join(root, file), 'utf8');

test('all public HTML pages have exactly one consistent static share image', async t => {
  assert.equal(imageUrl,
    'https://www.eleverbadminton.com/assets/img/social/elever-badminton-share.jpg?v=20261118');
  const files = allPageFiles();
  assert.ok(files.includes('privacy.html'), 'Noindex pages can still be shared');
  assert.ok(files.some(file => file.startsWith('news/')), 'Nested articles must be checked');
  for (const file of files) {
    await t.test(file, () => verifyMetadata(readPage(file), file));
  }
});

test('metadata verification rejects stale, missing and conflicting images', async t => {
  const html = readPage('index.html');
  const invalid = {
    'old Twitter image': html.replace(imageUrl,
      'https://www.eleverbadminton.com/assets/img/hero-action.jpg'),
    'duplicate Open Graph image': html.replace('</head>',
      `<meta property="og:image" content="${imageUrl}" /></head>`),
    'missing image dimensions': html.replace(/<meta property="og:image:width"[^>]*>/, ''),
    'wrong MIME type': html.replace('content="image/jpeg"', 'content="image/webp"'),
    'stale structured-data image': html.replace(`"image": "${imageUrl}"`,
      '"image": "https://www.eleverbadminton.com/assets/img/lab/facility.jpg"'),
    'conflicting fallback image': html.replace('</head>',
      '<link rel="image_src" href="/assets/img/hero-action.jpg" /></head>')
  };
  for (const [label, markup] of Object.entries(invalid)) {
    await t.test(label, () => assert.throws(() => verifyMetadata(markup, label)));
  }
});

test('URL audit includes every sitemap page, aliases and shareable filter states', () => {
  const routes = shareRoutes(allPageFiles());
  for (const route of ['/', '/index', '/index.html', '/about', '/about.html', '/about/',
    '/privacy', '/lab', '/news?category=Features', '/hub#international',
    '/courts?type=official#halls', '/contact#contact-form',
    '/shpc26badmintonprospectus', '/shpc26pickleballprospectus']) {
    assert.ok(routes.includes(route), 'Missing share URL variant: ' + route);
  }
  for (const match of fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
    .matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = new URL(match[1]);
    assert.ok(routes.includes(url.pathname), 'Missing sitemap URL: ' + url.href);
  }
});

test('regenerated news pages retain the universal share image', t => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'elever-social-news-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  fs.mkdirSync(path.join(temporary, 'tools'));
  fs.mkdirSync(path.join(temporary, 'assets/js'), { recursive: true });
  fs.copyFileSync(path.join(root, 'tools/build-news.js'), path.join(temporary, 'tools/build-news.js'));
  fs.copyFileSync(path.join(root, 'assets/js/data.js'), path.join(temporary, 'assets/js/data.js'));
  execFileSync(process.execPath, [path.join(temporary, 'tools/build-news.js')]);
  const files = fs.readdirSync(path.join(temporary, 'news'));
  assert.ok(files.length > 0);
  for (const file of files) {
    const generated = fs.readFileSync(path.join(temporary, 'news', file), 'utf8');
    verifyMetadata(generated, 'regenerated news/' + file);
    assert.equal(generated, readPage('news/' + file), 'Committed article differs from its generator');
  }
});

test('prospectus short URLs expose our preview and preserve document navigation', async t => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const destinations = {
    shpc26badmintonprospectus:
      'https://docs.google.com/document/d/1dGYKSrpPPSBj7nxp3qd4VhH8-ub1xC9lXx7Xa0wj_b4/edit?usp=share_link',
    shpc26pickleballprospectus:
      'https://docs.google.com/document/d/1kjM8TElVF5-ogQ1g91Eh0zozHVCHKmxvkFhiwlYKZmg/edit?usp=sharing'
  };
  for (const [slug, destination] of Object.entries(destinations)) {
    await t.test(slug, () => {
      assert.ok(!(config.redirects || []).some(redirect => redirect.source === '/' + slug),
        'Server redirects must not bypass the branded preview page');
      const html = readPage(slug + '.html');
      verifyMetadata(html, slug);
      assert.doesNotMatch(html, /http-equiv=["']refresh["']/i,
        'Meta refresh could redirect share crawlers away from our preview');
      const link = html.match(/<a\b[^>]*id="prospectus-link"[^>]*href="([^"]+)"/);
      assert.ok(link, 'A direct document link must work without JavaScript');
      assert.equal(link[1], destination);
      const script = html.match(/<script>([\s\S]*?)<\/script>/);
      assert.ok(script, 'Browsers must still navigate automatically');
      let navigated;
      vm.runInNewContext(script[1], {
        window: { location: { replace: url => { navigated = url; } } },
        document: {
          getElementById: id => {
            assert.equal(id, 'prospectus-link');
            return { href: link[1] };
          }
        }
      }, { timeout: 1000 });
      assert.equal(navigated, destination);
    });
  }
});
