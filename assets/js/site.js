/* =====================================================================
   ÉLEVER BADMINTON — SHARED SITE CHROME
   Injects the nav and footer into every page so there is exactly one
   copy to maintain. Runs before i18n.js so injected markup still gets
   translated on first paint.

   Each page sets  <body data-page="classes">  to light its nav item.
   ===================================================================== */
(function () {
  'use strict';

  var BOOK_URL = 'https://app.eleverbadminton.com/';

  var NAV = [
    { key: 'about', href: 'about.html', label: 'About', i18n: 'nav.about' },
    { key: 'classes', href: 'classes.html', label: 'Classes', i18n: 'nav.classes' },
    { key: 'camps', href: 'camps.html', label: 'Camps', i18n: 'nav.camps' },
    { key: 'events', href: 'events.html', label: 'Events', i18n: 'nav.events' },
    { key: 'hub', href: 'hub.html', label: 'SG Hub', i18n: 'nav.hub' },
    { key: 'news', href: 'news.html', label: 'News', i18n: 'nav.news' },
    { key: 'play', href: 'play.html', label: 'Play', i18n: 'nav.play' },
    { key: 'contact', href: 'contact.html', label: 'Contact', i18n: 'nav.contact' },
  ];

  // Pages live either at the root or in /coaches/ — fix relative links.
  var base = document.body.getAttribute('data-base') || '';
  function url(href) {
    return /^(https?:|mailto:|#)/.test(href) ? href : base + href;
  }

  var page = document.body.getAttribute('data-page') || '';

  function navLinks() {
    return NAV.map(function (item) {
      var active = item.key === page;
      return '<a href="' + url(item.href) + '" class="nav__link' + (active ? ' is-current' : '') + '"' +
        (active ? ' aria-current="page"' : '') +
        (item.i18n ? ' data-i18n="' + item.i18n + '"' : '') +
        '>' + item.label + '</a>';
    }).join('');
  }

  var LANG_MENU =
    '<div class="lang" id="langMenu">' +
      '<button class="lang__toggle" id="langToggle" aria-haspopup="true" aria-expanded="false" aria-label="Language">' +
        '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9S9.5 5.6 12 3z"/></svg>' +
        '<span id="langCurrent">EN</span><span class="lang__chev" aria-hidden="true">&#9662;</span>' +
      '</button>' +
      '<ul class="lang__list" role="menu" aria-label="Choose language">' +
        '<li role="none"><button class="lang__opt is-active" role="menuitemradio" aria-checked="true" data-lang="en" lang="en">English</button></li>' +
        '<li role="none"><button class="lang__opt" role="menuitemradio" aria-checked="false" data-lang="zh" lang="zh">中文</button></li>' +
        '<li role="none"><button class="lang__opt" role="menuitemradio" aria-checked="false" data-lang="hi" lang="hi">हिन्दी</button></li>' +
        '<li role="none"><button class="lang__opt" role="menuitemradio" aria-checked="false" data-lang="ta" lang="ta">தமிழ்</button></li>' +
        '<li role="none"><button class="lang__opt" role="menuitemradio" aria-checked="false" data-lang="ms" lang="ms">Bahasa Melayu</button></li>' +
      '</ul>' +
    '</div>';

  var header = document.getElementById('siteHeader');
  if (header) {
    header.className = 'nav';
    header.id = 'nav';
    header.innerHTML =
      '<a href="' + url('index.html') + '" class="nav__logo" aria-label="Élever Badminton — home">ÉLEVER<span aria-hidden="true">·</span>BADMINTON</a>' +
      '<nav class="nav__links" id="navLinks" aria-label="Primary">' +
        navLinks() +
        '<a href="' + BOOK_URL + '" target="_blank" rel="noopener" class="nav__cta magnetic" data-i18n="nav.book">Book a class</a>' +
        LANG_MENU +
      '</nav>' +
      '<button class="nav__burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>';
  }

  var footer = document.getElementById('siteFooter');
  if (footer) {
    footer.className = 'footer';
    footer.innerHTML =
      '<div class="footer__brand">ÉLEVER<span aria-hidden="true">·</span>BADMINTON</div>' +
      '<p class="footer__tag" data-i18n="footer.tag">To build. To raise. To rise higher.</p>' +
      '<nav class="footer__links" aria-label="Footer">' +
        '<a href="' + url('about.html') + '" data-i18n="nav.about">About</a>' +
        '<a href="' + url('classes.html') + '" data-i18n="nav.classes">Classes</a>' +
        '<a href="' + url('camps.html') + '" data-i18n="nav.camps">Camps</a>' +
        '<a href="' + url('events.html') + '" data-i18n="nav.events">Events</a>' +
        '<a href="' + url('hub.html') + '" data-i18n="nav.hub">SG Hub</a>' +
        '<a href="' + url('news.html') + '" data-i18n="nav.news">News</a>' +
        '<a href="' + url('contact.html') + '" data-i18n="nav.contact">Contact</a>' +
        '<a href="https://www.instagram.com/eleverbadminton/" target="_blank" rel="noopener" data-i18n="footer.instagram">Instagram</a>' +
      '</nav>' +
      '<p class="footer__note" data-i18n="footer.note">Concept redesign · Built for Élever Badminton. Photography © Élever Badminton.</p>';
  }

  /* Interior pages have no dark hero behind the nav, so they opt into the
     solid treatment permanently via  <body data-nav="solid">.
     Burger + scroll behaviour stay in main.js (section 4) — one owner. */
  var navEl = document.getElementById('nav');
  if (navEl && document.body.getAttribute('data-nav') === 'solid') {
    navEl.classList.add('nav--solid', 'scrolled');
  }

  window.ELEVER_SITE = { bookUrl: BOOK_URL, base: base, url: url };
})();
