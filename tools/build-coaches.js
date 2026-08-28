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
  const bioParagraphs = Array.isArray(c.bio) ? c.bio : [c.bio || ''];
  const bio = bioParagraphs.join(' ');
  const excerpt = bio.length > 130 ? bio.slice(0, 130).replace(/\s+\S*$/, '') + '...' : bio;
  const desc = `${c.name}, ${c.role} at Élever Badminton Singapore. ${excerpt}`;
  const canonical = `https://www.eleverbadminton.com/coaches/${c.slug}.html`;
  const image = `https://www.eleverbadminton.com/${c.photo}`;
  const sample = c.placeholder
    ? ' <span class="sample" title="Sample content — replace in assets/js/data.js">sample bio</span>' : '';
  const achievements = Array.isArray(c.achievements) ? c.achievements : [];
  const bioHtml = bioParagraphs
    .filter(Boolean)
    .map(p => `<p class="profile__bio">${esc(p)}</p>`)
    .join('\n          ');
  const achievementHtml = achievements.length
    ? `<h2 style="font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin:2.4rem 0 1rem">Achievements</h2>
          <ul class="profile__achievements">
            ${achievements.map(a => `<li>${esc(a)}</li>`).join('\n            ')}
          </ul>`
    : '';

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person',
    name: c.name, jobTitle: c.role, worksFor: { '@type': 'Organization', name: 'Élever Badminton' },
    url: canonical, image, knowsLanguage: c.languages
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
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  <link rel="icon" type="image/png" href="../assets/img/brand/eb-icon-black.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/style.css?v=14" />
  <link rel="stylesheet" href="../assets/css/pages.css?v=14" />
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
            <img src="../${esc(c.photo)}" alt="${esc(c.name)}, ${esc(c.role)} at Élever Badminton" width="640" height="640" loading="lazy" decoding="async" />
          </figure>
          <ul class="profile__meta">
            <li><span>Role</span><b>${esc(c.role)}</b></li>
            ${c.cert ? `<li><span>Certification</span><b>${esc(c.cert)}</b></li>` : ''}
            <li><span>Coaches</span><b>${esc(c.coaching.join(', '))}</b></li>
            <li><span>Languages</span><b>${esc(c.languages.join(', '))}</b></li>
          </ul>
        </div>
        <div>
          <h2 style="font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:.9rem">About ${esc(c.name.split(' ')[0])}${sample}</h2>
          ${bioHtml}
          ${achievementHtml}

          <h2 style="font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin:2.4rem 0 1rem">On court</h2>
          <div class="gallery">
            <div class="gallery__ph">Add action photos for ${esc(c.name)}<br>to <code>assets/img/coaches/${esc(c.slug)}/</code></div>
            <div class="gallery__ph">Photo 2</div>
            <div class="gallery__ph">Photo 3</div>
          </div>

          <div style="margin-top:2.4rem;display:flex;gap:.8rem;flex-wrap:wrap">
            <a class="btn btn--primary" href="../classes.html#locations">See classes</a>
            <a class="btn btn--ghost" href="../about.html">All coaches</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer id="siteFooter"></footer>

  <script src="../assets/js/data.js?v=14"></script>
  <script src="../assets/js/site.js?v=14"></script>
  <script src="../assets/js/pages.js?v=14"></script>
  <script src="../assets/js/main.js?v=14"></script>
</body>
</html>
`;
}

const outDir = path.join(root, 'coaches');
fs.mkdirSync(outDir, { recursive: true });
COACHES.filter(c => c.profilePage !== false).forEach(c => {
  fs.writeFileSync(path.join(outDir, c.slug + '.html'), page(c));
});
console.log(`Generated ${COACHES.filter(c => c.profilePage !== false).length} coach pages in coaches/`);
