/* =====================================================================
   ÉLEVER BADMINTON — SHARED SITE CHROME
   Injects the nav and footer into every page so there is exactly one
   copy to maintain.

   Each page sets  <body data-page="classes">  to light its nav item.
   ===================================================================== */
(function () {
  'use strict';

  var BOOK_URL = 'https://app.eleverbadminton.com/';
  var WHATSAPP = 'https://wa.me/6589214221';
  var EMAIL = 'info@eleverbadminton.com';
  var LOGO_BLACK = 'assets/img/brand/eb-logo-black.png';
  var LOGO_WHITE = 'assets/img/brand/eb-logo-white.png';

  /* A nav item with `children` renders as a hover/focus dropdown
     (ElevenLabs-style). `key` matches <body data-page> to mark current.

     NAV sits on the LEFT, immediately beside the logo. NAV_END sits on the
     right, next to the "Book a class" button.

     SG Hub is hidden for now — the page (hub.html) is untouched and still
     works if opened directly. To bring it back, restore this entry:
         { key: 'hub', href: 'hub.html', label: 'SG Hub' }
     and the footer link + sitemap entry that went with it. */
  var NAV = [
    {
      key: 'classes', href: 'classes.html', label: 'Classes',
      children: [
        { key: 'classes', href: 'classes.html', label: 'Regular Classes' },
        { key: 'camps', href: 'camps.html', label: 'Camps' }
      ]
    },
    { key: 'events', href: 'events.html', label: 'Events' },
    { key: 'news', href: 'news.html', label: 'News' },
    { key: 'about', href: 'about.html', label: 'About' },
    { key: 'contact', href: 'contact.html', label: 'Contact' }
  ];

  var NAV_END = [
    { key: 'lab', href: 'lab.html', label: 'Élever Performance Lab' }
  ];

  var SOCIALS = [
    { label: 'Instagram', href: 'https://www.instagram.com/eleverbadminton/' },
    { label: 'Facebook', href: 'https://www.facebook.com/eleverbadminton/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@eleverbadminton' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/eleverbadminton' }
  ];

  // Pages live either at the root or in /coaches/ — fix relative links.
  var base = document.body.getAttribute('data-base') || '';
  function url(href) {
    return /^(https?:|mailto:|#)/.test(href) ? href : base + href;
  }

  function brandLogo(className) {
    return '<span class="' + className + '__mark" aria-hidden="true">' +
      '<img class="' + className + '__img ' + className + '__img--dark" src="' + url(LOGO_BLACK) + '" alt="" decoding="async">' +
      '<img class="' + className + '__img ' + className + '__img--light" src="' + url(LOGO_WHITE) + '" alt="" decoding="async">' +
    '</span>' +
    '<span class="' + className + '__text">ÉLEVER<span aria-hidden="true">·</span>BADMINTON</span>';
  }

  var page = document.body.getAttribute('data-page') || '';

  function isCurrent(item) {
    if (item.key === page) return true;
    return !!(item.children && item.children.some(function (c) { return c.key === page; }));
  }

  function navLinks(items) {
    return items.map(function (item) {
      var active = isCurrent(item);
      var cls = 'nav__link' + (active ? ' is-current' : '');

      if (!item.children) {
        return '<a href="' + url(item.href) + '" class="' + cls + '"' +
          (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
      }

      return '<div class="nav__group">' +
        '<a href="' + url(item.href) + '" class="' + cls + ' nav__link--parent"' +
          (active ? ' aria-current="page"' : '') + '>' + item.label +
          '<svg class="nav__chev" viewBox="0 0 12 8" width="10" height="7" aria-hidden="true">' +
            '<path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</a>' +
        '<div class="nav__menu">' +
          item.children.map(function (c) {
            // `note` is optional — a child without one renders as a plain label.
            return '<a href="' + url(c.href) + '" class="nav__menu-item' +
              (c.key === page ? ' is-current' : '') + '">' +
              '<b>' + c.label + '</b>' +
              (c.note ? '<small>' + c.note + '</small>' : '') + '</a>';
          }).join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  var header = document.getElementById('siteHeader');
  if (header) {
    header.className = 'nav';
    header.id = 'nav';
    header.innerHTML =
      '<a href="' + url('index.html') + '" class="nav__logo" aria-label="Élever Badminton — home">' + brandLogo('nav__logo') + '</a>' +
      /* One container for every link so the mobile burger panel stays a single
         scrolling list; .nav__end is only pushed right on desktop. */
      '<nav class="nav__links" id="navLinks" aria-label="Primary">' +
        navLinks(NAV) +
        '<div class="nav__end">' +
          navLinks(NAV_END) +
          '<a href="' + BOOK_URL + '" target="_blank" rel="noopener" class="nav__cta">Book a class</a>' +
        '</div>' +
      '</nav>' +
      '<button class="nav__burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>';
  }

  var footer = document.getElementById('siteFooter');
  if (footer) {
    footer.className = 'footer';
    footer.innerHTML =
      '<div class="footer__inner">' +
        '<div class="footer__col footer__col--brand">' +
          '<div class="footer__brand">' + brandLogo('footer__brand') + '</div>' +
          '<p class="footer__tag">Enhance your skills.<br>Enjoy the process.<br>Elevate your experience.</p>' +
          '<div class="footer__socials">' +
            SOCIALS.map(function (s) {
              return '<a href="' + s.href + '" target="_blank" rel="noopener">' + s.label + '</a>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="footer__col">' +
          '<h4>Train</h4>' +
          '<a href="' + url('classes.html') + '">Regular Classes</a>' +
          '<a href="' + url('camps.html') + '">Camps</a>' +
          '<a href="' + BOOK_URL + '" target="_blank" rel="noopener">Book a class</a>' +
        '</div>' +

        '<div class="footer__col">' +
          '<h4>Élever</h4>' +
          '<a href="' + url('events.html') + '">Events</a>' +
          '<a href="' + url('lab.html') + '">Performance Lab</a>' +
          '<a href="' + url('about.html') + '">About</a>' +
          '<a href="' + url('news.html') + '">News</a>' +
          /* SG Badminton Hub hidden for now — restore this line to bring it back:
             '<a href="' + url('hub.html') + '">SG Badminton Hub</a>' */
        '</div>' +

        '<div class="footer__col">' +
          '<h4>Contact</h4>' +
          '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
          '<a href="' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp +65 8921 4221</a>' +
          '<address class="footer__addr">767 Upper Serangoon Road<br>#01-03<br>Singapore 534635</address>' +
        '</div>' +
      '</div>' +

      '<div class="footer__base">' +
        '<p>Elever Sports Pte. Ltd. · UEN 202501591C</p>' +
        '<p><a href="' + url('privacy.html') + '">Privacy notice</a> · <a href="' + url('privacy.html') + '#terms">Terms &amp; conditions</a></p>' +
        '<p>© ' + new Date().getFullYear() + ' Élever Badminton. Photography © Élever Badminton.</p>' +
      '</div>';
  }

  /* Interior pages opt into the solid nav via  <body data-nav="solid">.
     Where the page opens on a dark .phead band the nav starts transparent
     over it and only turns solid once scrolled past — same as the home
     hero. Burger + scroll behaviour stay in main.js — one owner. */
  var navEl = document.getElementById('nav');
  if (navEl && document.body.getAttribute('data-nav') === 'solid') {
    navEl.classList.add('nav--solid');
    if (document.querySelector('.phead')) {
      document.body.classList.add('has-dark-head');
    } else {
      navEl.classList.add('scrolled');
    }
  }

  /* Mobile: tapping a parent item opens its submenu rather than navigating. */
  if (navEl) {
    navEl.addEventListener('click', function (e) {
      var parent = e.target.closest ? e.target.closest('.nav__link--parent') : null;
      if (!parent) return;
      if (!window.matchMedia('(max-width:900px)').matches) return;
      var group = parent.parentElement;
      if (!group.classList.contains('is-open')) {
        e.preventDefault();
        group.classList.add('is-open');
      }
    });
  }

  window.ELEVER_SITE = { bookUrl: BOOK_URL, whatsapp: WHATSAPP, email: EMAIL, base: base, url: url };
})();
