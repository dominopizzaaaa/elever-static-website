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

const V = '75'; // must match the shared asset cache key used across the site
const PAGES_V = '75'; // cache key for the coach-layout stylesheet
const FAVICON_V = '66';

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(c) {
  const title = `${c.name} — Coach at Élever Badminton`;
  const bioParagraphs = Array.isArray(c.bio) ? c.bio : [c.bio || ''];
  const bio = bioParagraphs.join(' ');
  const excerpt = bio.length > 130 ? bio.slice(0, 130).replace(/\s+\S*$/, '') + '...' : bio;
  const desc = `${c.name}, ${c.role} at Élever Badminton Singapore. ${excerpt}`;
  const canonical = `https://www.eleverbadminton.com/coaches/${c.slug}`;
  const image = `https://www.eleverbadminton.com/${c.photo}`;
  const sample = c.placeholder
    ? ' <span class="sample" title="Sample content — replace in assets/js/data.js">sample bio</span>' : '';
  const achievements = Array.isArray(c.achievements) ? c.achievements : [];
  const certifications = Array.isArray(c.certifications)
    ? c.certifications.filter(certification => certification && certification.name && certification.href)
    : [];
  const profileGallery = c.profileGallery && Array.isArray(c.profileGallery.photos)
    ? c.profileGallery : null;
  const bioHtml = bioParagraphs
    .filter(Boolean)
    .map(p => `<p class="profile__bio">${esc(p)}</p>`)
    .join('\n          ');
  const achievementHtml = achievements.length
    ? `<section class="profile__section profile__section--achievements">
            <h2 class="edetail__subhead edetail__subhead--plain profile__heading">Achievements</h2>
            <ul class="profile__achievements">
              ${achievements.map(a => `<li>${esc(a)}</li>`).join('\n              ')}
            </ul>
          </section>`
    : '';
  const certificationHtml = certifications.length
    ? `<div class="profile__certifications">
          <p class="profile__label">Certifications</p>
          <div class="profile__certs">
            ${certifications.map(certification => `<a class="profile__cert" href="${esc(certification.href)}" target="_blank" rel="noopener">${esc(certification.name)}</a>`).join('\n            ')}
          </div>
        </div>`
    : '';
  const certificationBlock = certificationHtml ? '\n          ' + certificationHtml : '';
  const profileGalleryPhotos = profileGallery
    ? profileGallery.photos.filter(photo => photo && photo.src && photo.alt && photo.width && photo.height)
    : [];
  const profileGalleryHtml = profileGallery && profileGallery.heading && profileGalleryPhotos.length
    ? `<section class="profile__section profile__section--gallery">
            <h2 class="edetail__subhead edetail__subhead--plain profile__heading">${esc(profileGallery.heading)}</h2>
            <div class="profile__gallery">
              ${profileGalleryPhotos.map(photo => `<figure class="profile__gallery-item">
                <img src="../${esc(photo.src)}" alt="${esc(photo.alt)}" width="${esc(photo.width)}" height="${esc(photo.height)}" loading="lazy" decoding="async" />
              </figure>`).join('\n              ')}
            </div>
          </section>`
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
  <link rel="icon" href="/favicon.ico?v=${FAVICON_V}" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/brand/favicon-32x32.png?v=${FAVICON_V}" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/brand/favicon-16x16.png?v=${FAVICON_V}" />
  <link rel="apple-touch-icon" href="/assets/img/brand/apple-touch-icon.png?v=${FAVICON_V}" />
  <link rel="manifest" href="/site.webmanifest?v=${FAVICON_V}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/style.css?v=${V}" />
  <link rel="stylesheet" href="../assets/css/pages.css?v=${PAGES_V}" />
  <script type="application/ld+json">${jsonld}</script>
</head>
<body data-page="about" data-nav="solid" data-base="../">

  <a href="#main" class="skip-link">Skip to main content</a>
  <header id="siteHeader"></header>

  <main id="main">
    <section class="phead phead--coach-profile">
      <div class="phead__inner">
        <h1>${esc(c.name)}</h1>
        <p class="phead__lead">${esc(c.role)}</p>
      </div>
    </section>

    <section class="psec">
      <div class="profile profile--coach">
        <aside class="profile__aside">
          <figure class="profile__photo">
            <img src="../${esc(c.photo)}" alt="${esc(c.name)}, ${esc(c.role)} at Élever Badminton" width="640" height="640" loading="lazy" decoding="async" />
          </figure>${certificationBlock}
        </aside>
        <div class="profile__content">
          <h2 class="edetail__subhead edetail__subhead--plain profile__heading">About${sample}</h2>
          ${bioHtml}
          ${achievementHtml}${profileGalleryHtml ? `\n          ${profileGalleryHtml}` : ''}

          <div class="profile__actions">
            <a class="btn btn--contact-send profile__team-link" href="../about.html#coaches">View the team</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer id="siteFooter"></footer>

  <script src="../assets/js/data.js?v=${V}"></script>
  <script src="../assets/js/site.js?v=${V}"></script>
  <script src="../assets/js/pages.js?v=${V}"></script>
  <script src="../assets/js/main.js?v=${V}"></script>
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
