#!/usr/bin/env node
/* Generates coaches/<slug>.html — one static page per coach, from
   assets/js/data.js. Static pages (rather than one ?slug= page) so each
   coach is separately indexable.

   Run after editing the coach list:   node tools/build-coaches.js        */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
global.window = {};
require(path.join(root, 'assets/js/data.js'));
const COACHES = global.window.ELEVER_DATA.coaches;

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(c) {
  const title = `${c.name} — Coach at Élever Badminton`;
  const desc = `${c.name}, ${c.role} at Élever Badminton Singapore. ${String(c.bio).slice(0, 110)}…`;
  const sample = c.placeholder
    ? ' <span class="sample" title="Sample content — replace in assets/js/data.js">sample bio</span>' : '';

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person',
    name: c.name, jobTitle: c.role, worksFor: { '@type': 'Organization', name: 'Élever Badminton' },
    image: '../' + c.photo, knowsLanguage: c.languages
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:type" content="profile" />
  <link rel="icon" type="image/x-icon" href="../assets/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/style.css" />
  <link rel="stylesheet" href="../assets/css/pages.css" />
  <script type="application/ld+json">${jsonld}</script>
</head>
<body data-page="about" data-nav="solid" data-base="../">

  <a href="#main" class="skip-link">Skip to main content</a>
  <header id="siteHeader"></header>

  <main id="main">
    <section class="phead">
      <div class="phead__inner">
        <p class="phead__crumbs"><a href="../index.html">Home</a> · <a href="../about.html">About</a> · Coaches</p>
        <h1>${esc(c.name)}</h1>
        <p class="phead__lead">${esc(c.role)}${c.cert ? ' · ' + esc(c.cert) : ''}</p>
      </div>
    </section>

    <section class="psec">
      <div class="profile">
        <div>
          <figure class="profile__photo">
            <img src="../${esc(c.photo)}" alt="${esc(c.name)}, ${esc(c.role)} at Élever Badminton" />
          </figure>
          <ul class="profile__meta">
            <li><span>Role</span><b>${esc(c.role)}</b></li>
            ${c.cert ? `<li><span>Certification</span><b>${esc(c.cert)}</b></li>` : ''}
            <li><span>Coaches</span><b>${esc(c.coaching.join(', '))}</b></li>
            <li><span>Languages</span><b>${esc(c.languages.join(', '))}</b></li>
          </ul>
        </div>
        <div>
          <h2 style="font-size:.8rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:.9rem">About ${esc(c.name.split(' ')[0])}${sample}</h2>
          <p class="profile__bio">${esc(c.bio)}</p>

          <h2 style="font-size:.8rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin:2.4rem 0 1rem">On court</h2>
          <div class="gallery">
            <div class="gallery__ph">Add action photos for ${esc(c.name)}<br>to <code>assets/img/coaches/${esc(c.slug)}/</code></div>
            <div class="gallery__ph">Photo 2</div>
            <div class="gallery__ph">Photo 3</div>
          </div>

          <div style="margin-top:2.4rem;display:flex;gap:.8rem;flex-wrap:wrap">
            <a class="btn btn--primary magnetic" href="../classes.html#schedule">See classes</a>
            <a class="btn btn--ghost" href="../about.html">All coaches</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer id="siteFooter"></footer>

  <script src="../assets/js/data.js"></script>
  <script src="../assets/js/site.js"></script>
  <script src="../assets/js/i18n.js"></script>
  <script src="../assets/js/pages.js"></script>
  <script src="../assets/js/main.js"></script>
</body>
</html>
`;
}

const outDir = path.join(root, 'coaches');
fs.mkdirSync(outDir, { recursive: true });
COACHES.forEach(c => {
  fs.writeFileSync(path.join(outDir, c.slug + '.html'), page(c));
});
console.log(`Generated ${COACHES.length} coach pages in coaches/`);
