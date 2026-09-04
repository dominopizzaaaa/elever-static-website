#!/usr/bin/env node
/* Generates news/<slug>.html — one static page per article, from
   assets/js/data.js. Static pages (rather than one ?slug= page) so each
   article is separately indexable, same as the coach pages.

   Run after editing the article list:   node tools/build-news.js          */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
global.window = {};
require(path.join(root, 'assets/js/data.js'));
const ARTICLES = global.window.ELEVER_DATA.articles;

const V = '36'; // must match the ?v= cache-busting string used across the site

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(d) {
  const p = String(d).split('-');
  return p.length === 3 ? `${Number(p[2])} ${MONTHS[Number(p[1]) - 1]} ${p[0]}` : d;
}

/* The closing line points readers at the social accounts — link them. */
const SOCIAL = {
  Instagram: 'https://www.instagram.com/eleverbadminton/',
  Facebook: 'https://www.facebook.com/eleverbadminton/'
};
function linkSocials(html) {
  return html.replace(/\b(Instagram|Facebook)\b/g, (m) =>
    `<a href="${SOCIAL[m]}" target="_blank" rel="noopener">${m}</a>`);
}

/* Consecutive quote blocks belong to one blockquote, so a quote that runs
   over two paragraphs is not split into two quote marks. */
function bodyHtml(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'h2') {
      out.push(`<h2>${esc(b.text)}</h2>`);
    } else if (b.type === 'quote') {
      const run = [];
      while (i < blocks.length && blocks[i].type === 'quote') run.push(blocks[i++].text);
      i--;
      out.push(`<blockquote>${run.map(t => `<p>${esc(t)}</p>`).join('\n            ')}</blockquote>`);
    } else {
      let p = esc(b.text);
      if (/follow Élever Badminton on/.test(b.text)) p = linkSocials(p);
      out.push(`<p>${p}</p>`);
    }
  }
  return out.join('\n          ');
}

function page(a) {
  const title = `${a.title} — Élever Badminton`;
  const canonical = `https://www.eleverbadminton.com/news/${a.slug}`;
  const image = 'https://www.eleverbadminton.com/assets/img/hero-action.jpg';

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: a.title, description: a.excerpt, datePublished: a.date,
    author: a.author ? { '@type': 'Person', name: a.author } : undefined,
    publisher: { '@type': 'Organization', name: 'Élever Badminton', url: 'https://www.eleverbadminton.com/' },
    mainEntityOfPage: canonical, articleSection: a.category
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(a.excerpt)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(a.excerpt)}" />
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content="${esc(a.date)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(a.excerpt)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  <link rel="icon" type="image/png" href="../assets/img/brand/eb-icon-black.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/style.css?v=${V}" />
  <link rel="stylesheet" href="../assets/css/pages.css?v=${V}" />
  <script type="application/ld+json">${jsonld}</script>
</head>
<body data-page="news" data-nav="solid" data-base="../">

  <a href="#main" class="skip-link">Skip to main content</a>
  <header id="siteHeader"></header>

  <main id="main">
    <section class="phead">
      <div class="phead__inner">
        <h1>${esc(a.title)}</h1>
      </div>
    </section>

    <section class="psec">
      <article class="post">
        <div class="post__meta">
          <span class="post__cat">${esc(a.category)}</span>
          <span>${esc(fmtDate(a.date))}</span>
          ${a.author ? `<span>Written by ${esc(a.author)}</span>` : ''}
          <span>${esc(a.read)} read</span>
        </div>
        ${bodyHtml(a.body)}
        <a class="post__back" href="../news.html">&lsaquo; All articles</a>
      </article>
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

const outDir = path.join(root, 'news');
fs.mkdirSync(outDir, { recursive: true });
ARTICLES.forEach(a => {
  fs.writeFileSync(path.join(outDir, `${a.slug}.html`), page(a), 'utf8');
});
console.log(`Generated ${ARTICLES.length} article pages in news/`);
