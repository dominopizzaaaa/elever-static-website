/* =====================================================================
   ÉLEVER BADMINTON — SHARED SITE CHROME
   Injects the nav and footer into every page so there is exactly one
   copy to maintain.

   Each page sets  <body data-page="classes">  to light its nav item.
   ===================================================================== */
(function () {
  'use strict';

  var BOOK_URL = 'https://wa.me/6589214221';
  var WHATSAPP = 'https://wa.me/6589214221';
  var EMAIL = 'info@eleverbadminton.com';
  var LOGO_BLACK = 'assets/img/brand/eb-logo-black.png';
  var LOGO_WHITE = 'assets/img/brand/eb-logo-white.png';

  /* A nav item with `children` renders as a hover/focus dropdown
     (ElevenLabs-style). `key` matches <body data-page> to mark current.

     NAV sits on the LEFT, immediately beside the logo. NAV_END sits on the
     right, next to the "Book a class" button, and is empty by default.

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
    /* The Lab sits directly beside Classes and goes by "Lab" (client, Sep
       2026). The page <title> and the footer keep the full name. */
    { key: 'lab', href: 'lab.html', label: 'Lab' },
    { key: 'events', href: 'events.html', label: 'Events' },
    { key: 'news', href: 'news.html', label: 'News' },
    { key: 'about', href: 'about.html', label: 'About' },
    { key: 'contact', href: 'contact.html', label: 'Contact' }
  ];

  /* Right-hand end of the bar. Only the booking CTA lives there now — add an
     entry here to put a link back beside it. */
  var NAV_END = [];

  /* Socials render as marks rather than words (client, Sep 2026). Each icon is
     drawn on a 24x24 grid so the row stays even; the platform name lives in
     the link's aria-label so screen readers still hear it. */
  var SOCIAL_ICONS = {
    Instagram: '<rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
      '<circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
      '<circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/>',
    Facebook: '<path d="M13.9 21v-7.6h2.55l.38-2.96H13.9V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46a21 21 0 0 0-2.29-.12c-2.26 0-3.81 1.38-3.81 3.92v2.18H8.28v2.96h2.56V21z" fill="currentColor"/>',
    TikTok: '<path d="M14.9 3h-2.62v12.27a2.3 2.3 0 1 1-1.9-2.27v-2.7a4.98 4.98 0 1 0 4.52 4.97V9.6a6.2 6.2 0 0 0 3.6 1.15V8.09A3.63 3.63 0 0 1 14.9 4.6z" fill="currentColor"/>',
    LinkedIn: '<path d="M6.94 8.72H4.16V21h2.78zM5.55 3.4a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24zM19.84 13.9c0-3.02-1.62-4.43-3.77-4.43a3.25 3.25 0 0 0-2.95 1.62h-.04V8.72H10.4V21h2.78v-6.07c0-1.6.3-3.15 2.29-3.15 1.95 0 1.98 1.83 1.98 3.26V21h2.78z" fill="currentColor"/>'
  };

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
      /* .nav__inner is the same capped, centred column the page content uses,
         so the logo and the "Book a class" button line up with the copy in the
         sections below rather than sitting out at the viewport edge. */
      '<div class="nav__inner">' +
        '<a href="' + url('index.html') + '" class="nav__logo" aria-label="Élever Badminton — home">' + brandLogo('nav__logo') + '</a>' +
        /* One container for every link so the mobile burger panel stays a single
           scrolling list; .nav__end is only pushed right on desktop. */
        '<nav class="nav__links" id="navLinks" aria-label="Primary">' +
          navLinks(NAV) +
          '<div class="nav__end">' +
            navLinks(NAV_END) +
          '</div>' +
        '</nav>' +
        /* The booking CTA sits in the bar itself, NOT inside .nav__links —
           on phones that keeps it on screen beside the burger instead of
           hiding it inside the menu (client, Sep 2026). On desktop
           .nav__links takes the free space, so the button still lands at the
           right-hand end of the row exactly as before. */
        '<a href="' + BOOK_URL + '" target="_blank" rel="noopener" class="nav__cta">Book a class</a>' +
        '<button class="nav__burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>' +
      '</div>';
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
              return '<a href="' + s.href + '" target="_blank" rel="noopener"' +
                ' aria-label="Élever Badminton on ' + s.label + '" title="' + s.label + '">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (SOCIAL_ICONS[s.label] || '') + '</svg>' +
              '</a>';
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
          /* About no longer carries its own contact block (client, Sep 2026),
             so the footer names the Contact page explicitly. */
          '<a href="' + url('contact.html') + '">Contact</a>' +
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
