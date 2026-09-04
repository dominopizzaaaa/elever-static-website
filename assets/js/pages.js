/* =====================================================================
   ÉLEVER BADMINTON — PAGE RENDERERS
   Renders the data-driven parts of each standalone page from
   assets/js/data.js. Every block no-ops when its mount point is absent,
   so this one file is safe to load on every page.
   ===================================================================== */
(function () {
  'use strict';

  var D = window.ELEVER_DATA;
  if (!D) return;
  var SITE = window.ELEVER_SITE || {};
  var BOOK = SITE.bookUrl || 'https://wa.me/6589214221';
  var EMAIL = SITE.email || 'info@eleverbadminton.com';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function el(id) { return document.getElementById(id); }
  function sampleTag(item) { return item && item.placeholder ? ' <span class="sample" title="Sample content — replace in assets/js/data.js">sample</span>' : ''; }

  /* Photo path helpers. data.js stores bare filenames; the base directories
     live alongside so the full-size and thumbnail sets cannot drift apart.
     Events and camps keep separate directories, hence the pair of makers
     rather than one pair of module-level functions. */
  var PHOTO_BASE = D.eventPhotoBase || 'assets/img/events/';
  var THUMB_BASE = D.eventThumbBase || 'assets/img/events/thumb/';
  var CAMP_PHOTO_BASE = D.campPhotoBase || 'assets/img/camps/';
  var CAMP_THUMB_BASE = D.campThumbBase || 'assets/img/camps/thumb/';
  function srcMaker(dir) {
    return function (file) { return (SITE.base || '') + dir + file; };
  }
  var fullSrc = srcMaker(PHOTO_BASE);
  var thumbSrc = srcMaker(THUMB_BASE);
  var campFullSrc = srcMaker(CAMP_PHOTO_BASE);
  var campThumbSrc = srcMaker(CAMP_THUMB_BASE);

  /* Full-screen gallery viewer, shared by the event showcase and the camp
     gallery. Shows the full-size image, a thumbnail strip, a counter and
     keyboard, swipe and button navigation.

     `galleries` is a list of { title, photos: [filename] }; a click on any
     [data-gallery]/[data-photo] element inside `scope` opens that photo.
     `full` / `thumb` turn a bare filename into a URL, so each caller keeps
     its own photo directory. */
  function initLightbox(scope, opts) {
    if (!scope || scope.dataset.lightboxReady) return;
    scope.dataset.lightboxReady = '1';

    var galleries = opts.galleries || [];
    var full = opts.full || fullSrc;
    var thumb = opts.thumb || thumbSrc;
    var label = opts.label || 'Event photo viewer';

    var activeGallery = 0;
    var activePhoto = 0;
    var lastTrigger = null;

    var modal = document.createElement('div');
    modal.className = 'lightbox';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', label);
    modal.hidden = true;
    modal.innerHTML =
      '<div class="lightbox__bar">' +
        '<div class="lightbox__meta"><b class="lightbox__title"></b><span class="lightbox__count"></span></div>' +
        /* A circled × rather than the words "Close ×" (client, Sep 2026). */
        '<button class="lightbox__close" type="button" aria-label="Close gallery" title="Close">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
            '<path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" fill="none" stroke="currentColor" ' +
              'stroke-width="2.1" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="lightbox__stage">' +
        '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">&lsaquo;</button>' +
        '<figure class="lightbox__figure"><img class="lightbox__img" alt=""></figure>' +
        '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">&rsaquo;</button>' +
      '</div>' +
      '<div class="lightbox__strip" role="tablist" aria-label="Choose a photo"></div>';
    document.body.appendChild(modal);

    var img = modal.querySelector('.lightbox__img');
    var titleEl = modal.querySelector('.lightbox__title');
    var countEl = modal.querySelector('.lightbox__count');
    var stripEl = modal.querySelector('.lightbox__strip');
    var closeBtn = modal.querySelector('.lightbox__close');

    function gallery() { return galleries[activeGallery] || null; }
    function photos() { var g = gallery(); return (g && g.photos) || []; }

    /* Fetching the neighbours keeps stepping through a gallery instant. */
    function preloadNeighbours() {
      var list = photos();
      if (list.length < 2) return;
      [1, -1].forEach(function (d) {
        var i = (activePhoto + d + list.length) % list.length;
        var pre = new Image();
        pre.src = full(list[i]);
      });
    }

    function buildStrip() {
      var g = gallery();
      if (!g) return;
      stripEl.innerHTML = photos().map(function (file, i) {
        return '<button class="lightbox__stripitem" type="button" role="tab" data-idx="' + i + '"' +
          ' aria-label="' + esc('Photo ' + (i + 1) + ' of ' + photos().length) + '">' +
          '<img src="' + esc(thumb(file)) + '" alt="" loading="lazy" decoding="async"></button>';
      }).join('');
    }

    function show() {
      var g = gallery();
      var list = photos();
      var file = list[activePhoto];
      if (!g || !file) return;
      img.src = full(file);
      img.alt = g.title + ' — photo ' + (activePhoto + 1) + ' of ' + list.length;
      titleEl.textContent = g.title;
      countEl.textContent = (activePhoto + 1) + ' / ' + list.length;

      var items = stripEl.querySelectorAll('.lightbox__stripitem');
      items.forEach(function (b, i) {
        var on = i === activePhoto;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
        if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' });
      });

      // A one-photo gallery has nothing to step to.
      modal.classList.toggle('lightbox--single', list.length < 2);
      preloadNeighbours();
    }

    function open(galleryIndex, photoIndex, trigger) {
      activeGallery = galleryIndex;
      activePhoto = photoIndex;
      lastTrigger = trigger || null;
      buildStrip();
      show();
      modal.hidden = false;
      document.body.classList.add('has-lightbox');
      closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('has-lightbox');
      // Send focus back where it came from so the keyboard user is not lost.
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
      lastTrigger = null;
    }

    function step(dir) {
      var list = photos();
      if (list.length < 2) return;
      activePhoto = (activePhoto + dir + list.length) % list.length;
      show();
    }

    scope.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-gallery]');
      if (!trigger) return;
      open(Number(trigger.dataset.gallery), Number(trigger.dataset.photo || 0), trigger);
    });

    modal.addEventListener('click', function (e) {
      var strip = e.target.closest('.lightbox__stripitem');
      if (strip) { activePhoto = Number(strip.dataset.idx); show(); return; }
      if (e.target.closest('.lightbox__close')) { close(); return; }
      if (e.target.closest('.lightbox__nav--prev')) { step(-1); return; }
      if (e.target.closest('.lightbox__nav--next')) { step(1); return; }
      // A click on the backdrop (not the image, strip or controls) closes.
      if (e.target === modal || e.target.classList.contains('lightbox__stage') ||
          e.target.classList.contains('lightbox__figure')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowLeft') { step(-1); return; }
      if (e.key === 'ArrowRight') { step(1); return; }
      if (e.key === 'Home') { activePhoto = 0; show(); return; }
      if (e.key === 'End') { activePhoto = photos().length - 1; show(); return; }
      // Trap Tab inside the dialog while it is open.
      if (e.key === 'Tab') {
        var f = modal.querySelectorAll('button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Horizontal swipe steps photos on touch devices. */
    var touchX = 0, touchY = 0;
    modal.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    }, { passive: true });
    modal.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      // Ignore mostly-vertical drags so scrolling the strip still works.
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* =================================================================
     THE FIVE PILLARS — Home + About
     ================================================================= */
  /* Five photo tiles, full width, title centred on the photo (client brief,
     Sep 2026). `photo` is Élever's own photography — swap any line here when
     the client picks a different shot for a pillar; `focus` is the CSS
     object-position for the crop, `who` is the line revealed on hover. */
  var PILLARS = [
    { name: 'Classes', href: 'classes.html', who: 'Weekly coaching along a structured pathway.',
      photo: 'assets/img/camps/camp-7.jpg', focus: '50% 38%',
      alt: 'A junior player in an Élever shirt playing a forehand in a class' },
    { name: 'Camps', href: 'camps.html', who: 'Holiday Exploration camps for new players.',
      photo: 'assets/img/camps/camp-4.jpg', focus: 'center 32%',
      alt: 'A holiday camp group on court with their coaches' },
    /* The three event pillars land on their own slice of Past Events rather
       than on the service card (client, Sep 2026). */
    { name: 'Carnivals', href: 'events.html#past-carnivals', who: 'Mass-participation event days.',
      photo: 'assets/img/events/joo-chiat-carnival-2026-4.jpg', focus: 'center 62%',
      alt: 'A full hall of players at an Élever badminton carnival' },
    { name: 'Clinics', href: 'events.html#past-clinics', who: 'Short, focused coaching workshops.',
      photo: 'assets/img/events/bukit-gombak-clinic-2026-9.jpg', focus: 'center 40%',
      alt: 'A coach demonstrating a shot to two children at a community clinic' },
    { name: 'Competitions', href: 'events.html#past-competitions', who: 'Tournaments run end to end.',
      photo: 'assets/img/events/joo-chiat-carnival-2026-18.jpg', focus: '58% 45%',
      alt: 'Medals being presented at the end of a competition' }
  ];

  (function pillars() {
    var mount = el('pillarsGrid');
    if (!mount) return;
    var base = SITE.base || '';
    mount.innerHTML = PILLARS.map(function (p) {
      /* div/h3/p rather than nested spans: <a> is transparent content, so the
         heading is valid here and the tile keeps a real heading in the
         outline. */
      return '<a class="pillar" href="' + base + p.href + '">' +
        '<div class="pillar__media">' +
          '<img src="' + esc(base + p.photo) + '" alt="' + esc(p.alt || '') + '"' +
            (p.focus ? ' style="object-position:' + esc(p.focus) + '"' : '') +
            ' loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="pillar__inner">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="pillar__who">' + esc(p.who) + '</p>' +
        '</div>' +
      '</a>';
    }).join('');
  })();

  /* =================================================================
     CLASSES — development pathways
     Four equal boxes in one row with an arrow between each pair.
     Copy comes verbatim from data.js (see the Google Doc write-ups).
     ================================================================= */
  (function pathways() {
    var mount = el('pathsGrid');
    if (!mount) return;
    var steps = D.pathways;
    var last = steps.length - 1;

    /* The connector between two cards: a filled chevron chip, so the
       progression reads as part of the design rather than as a stray
       glyph dropped in the gap. .path__arrow rotates it on the narrow
       layouts — the chip is drawn upright and CSS turns the whole span. */
    var ARROW = '<span class="path__arrow" aria-hidden="true">' +
      '<svg viewBox="0 0 16 16" width="16" height="16" focusable="false">' +
        '<path d="M5.5 3.2 10.3 8l-4.8 4.8" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></span>';

    var base = SITE.base || '';

    mount.innerHTML = steps.map(function (p, i) {
      return '<article class="path" id="' + esc(p.key) + '">' +
          (p.photo
            ? '<div class="path__media"><img src="' + esc(base + p.photo) + '"' +
                ' alt="' + esc(p.photoAlt || (p.name + ' players in training')) + '"' +
                ' loading="lazy" decoding="async"></div>'
            : '') +
          '<span class="path__num">' + esc(p.num) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="path__headline">' + esc(p.headline) + '</p>' +
          (p.hook ? '<p class="path__hook">' + esc(p.hook) + '</p>' : '') +
          '<p class="path__body">' + esc(p.body) + '</p>' +
          /* nbsp keeps the chevron on the last word rather than orphaning it. */
          '<a class="path__cta" href="' + esc(p.cta.href) + '">' + esc(p.cta.label) + '&nbsp;&rsaquo;</a>' +
        '</article>' + (i < last ? ARROW : '');
    }).join('');
  })();

  /* =================================================================
     CLASSES — class-type tabs + swipeable pages (Group / Private).
     ElevenLabs-style: a tab rail (Group = "Creative" slot, Private =
     "Agents" slot) sits above a viewport that slides a 2-page track. Tabs,
     the prev/next arrows, arrow-keys and a left/right swipe all move between
     the two pages in sync. The Group page's venue list is rendered by
     locations() below.
     ================================================================= */
  (function classTabs() {
    var root = el('classCarousel');
    if (!root) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll('.ctabs__tab'));
    var track = el('ctabTrack');
    var prevBtn = el('ctabPrev');
    var nextBtn = el('ctabNext');
    var viewport = el('ctabViewport');
    if (tabs.length < 2 || !track) return;

    var active = 0;
    var count = tabs.length;

    function go(i) {
      active = Math.max(0, Math.min(count - 1, i));
      tabs.forEach(function (t, k) {
        var on = k === active;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      /* Slide the track. Each page is 100% of the viewport wide, and the
         track's own width is one viewport (100%), so one page step is a full
         100% of the track's width. */
      track.style.transform = 'translateX(-' + (active * 100) + '%)';
      if (prevBtn) prevBtn.disabled = active === 0;
      if (nextBtn) nextBtn.disabled = active === count - 1;
      root.setAttribute('data-active', String(active));
      sizeViewport();
    }

    /* Match the viewport height to the active page so a short page (Private)
       doesn't leave the tall page's whitespace beneath it. Because the
       viewport clips overflow, an under-measured height would cut off the
       bottom cards — so we re-measure whenever the active page's own size
       changes (fonts loading, wrapping, filters) via a ResizeObserver. */
    var pages = Array.prototype.slice.call(track.querySelectorAll('.ctabs__page'));
    function sizeViewport() {
      if (!viewport || !pages[active]) return;
      viewport.style.height = pages[active].offsetHeight + 'px';
    }
    if (typeof ResizeObserver === 'function') {
      var ro = new ResizeObserver(function () { sizeViewport(); });
      pages.forEach(function (p) { ro.observe(p); });
    }
    /* Web fonts change text height after first paint; recalc once ready. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(sizeViewport);
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { go(parseInt(t.getAttribute('data-goto'), 10) || 0); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { go(active - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(active + 1); });

    /* Keyboard: left/right arrows move between pages and focus the new tab. */
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(active + 1); tabs[active].focus(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { go(active - 1); tabs[active].focus(); e.preventDefault(); }
    });

    /* Touch + mouse swipe on the viewport switches pages. Mostly-vertical
       gestures are ignored so page scrolling still works. */
    var startX = 0, startY = 0, dragging = false;
    function down(x, y) { startX = x; startY = y; dragging = true; }
    function up(x, y) {
      if (!dragging) return;
      dragging = false;
      var dx = x - startX;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(y - startY)) {
        go(active + (dx < 0 ? 1 : -1));
      }
    }
    if (viewport) {
      viewport.addEventListener('touchstart', function (e) { down(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      viewport.addEventListener('touchend', function (e) {
        var t = e.changedTouches[0] || {};
        up(t.clientX || startX, t.clientY || startY);
      });
      viewport.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') down(e.clientX, e.clientY); });
      window.addEventListener('pointerup', function (e) { if (e.pointerType === 'mouse') up(e.clientX, e.clientY); });
    }

    window.addEventListener('resize', sizeViewport);
    /* Filtering the venue list changes the Group page height, so recalc after
       any click inside the pages (filters, etc.) once the DOM updates. */
    track.addEventListener('click', function () { window.setTimeout(sizeViewport, 0); });
    go(0);
    /* The Group venue list renders after this runs, so recalc height once it
       has settled. */
    window.setTimeout(sizeViewport, 150);
  })();

  /* =================================================================
     CLASSES — locations list.
     One <details> per area (Aljunied, Cantonment, Expo …) so the list reads
     as a short set of drop-downs on a phone rather than one very long page
     (client, Sep 2026). Native <details> keeps it working without JS and
     gives the disclosure semantics for free. Desktop has the room, so the
     areas start open there and collapsed on narrow screens.
     The level filter was removed in the same round.
     ================================================================= */
  (function locations() {
    var listMount = el('schedList');
    if (!listMount) return;

    /* A Google Maps search for the venue. Coordinates would pin more exactly,
       but a name + address search survives a venue moving, and every entry in
       CLASSES has both. */
    function mapsUrl(v) {
      return 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(v.venue + ', ' + v.addr);
    }

    /* Areas read alphabetically. localeCompare keeps sort stable across
       punctuation. */
    function byAreaName(a, b) {
      return String(a.area).localeCompare(String(b.area), 'en', { sensitivity: 'base' });
    }
    /* Group the venues by their area, preserving the source order of venues
       within each area. Returns an array of { area, venues:[] }. */
    function areasOf(list) {
      var map = {};
      var order = [];
      list.forEach(function (v) {
        if (!map[v.area]) { map[v.area] = { area: v.area, venues: [] }; order.push(v.area); }
        map[v.area].venues.push(v);
      });
      return order.map(function (a) { return map[a]; }).sort(byAreaName);
    }

    var CHEV = '<svg class="vcard__chev" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">' +
      '<path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function render() {
      var areas = areasOf(D.classes);

      if (!areas.length) {
        listMount.innerHTML = '<p class="sched__empty">No classes on the schedule right now — ' +
          '<a href="contact.html">ask us about a venue near you</a>.</p>';
        return;
      }

      /* Phones open one area at a time; from tablet up there is room to show
         them all, so they start expanded. */
      var openByDefault = !window.matchMedia('(max-width:900px)').matches;

      listMount.innerHTML = areas.map(function (g) {
        var region = g.venues[0].region;
        var book = g.venues[0].book || BOOK;
        var count = g.venues.reduce(function (n, v) { return n + v.sessions.length; }, 0);
        return '<details class="vcard" id="area-' + esc(g.area.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '"' +
            (openByDefault ? ' open' : '') + '>' +
          '<summary class="vcard__top">' +
            '<span class="vcard__heading">' +
              '<h3>' + esc(g.area) + '</h3>' +
              '<span class="vcard__region">' + esc(region) + '</span>' +
              '<span class="vcard__count">' + count + (count === 1 ? ' class' : ' classes') + '</span>' +
            '</span>' +
            CHEV +
          '</summary>' +
          '<div class="vcard__body">' +
            g.venues.map(function (v) {
              return '<div class="vcard__venue">' +
                /* Name left, address right, on one line — the address opens the
                   venue on Google Maps (client, Sep 2026). */
                '<p class="vcard__venuename">' + esc(v.venue) + sampleTag(v) +
                  '<a class="vcard__addr" href="' + esc(mapsUrl(v)) + '" target="_blank" rel="noopener"' +
                    ' aria-label="' + esc(v.venue + ', ' + v.addr + ' — open in Google Maps') + '">' +
                    '<span class="vcard__pin" aria-hidden="true">\u25CE</span>' + esc(v.addr) +
                  '</a>' +
                '</p>' +
                '<ul class="vcard__sessions">' + v.sessions.map(function (s) {
                  return '<li><span class="vcard__day">' + esc(s.day) + '</span>' +
                    '<span class="vcard__time">' + esc(s.time) + '</span>' +
                    '<span class="vcard__lvl">' + esc(s.level) + '</span>' +
                    '</li>';
                }).join('') + '</ul>' +
              '</div>';
            }).join('') +
            '<div class="vcard__actions">' +
              '<a class="vcard__book" href="' + esc(book) + '" target="_blank" rel="noopener">Book a class &rsaquo;</a>' +
            '</div>' +
          '</div>' +
        '</details>';
      }).join('');
    }

    render();

    /* Opening or closing an area changes the panel height, and the class-type
       carousel sizes its viewport to the active page — nudge it to re-measure. */
    listMount.addEventListener('toggle', function () {
      window.dispatchEvent(new Event('resize'));
    }, true);
  })();

  /* =================================================================
     CAMPS
     ================================================================= */
  (function camps() {
    var up = el('campUpcoming');
    if (!up) return;
    var c = D.camps;

    /* The waitlist form is only offered when there is nothing to register
       for. With a camp on sale the card takes the full width instead. */
    var waitlist = el('campWaitlist');
    var layout = el('campLayout');
    if (waitlist) waitlist.hidden = !!c.upcoming.length;
    if (layout) layout.classList.toggle('cols2--single', !!c.upcoming.length);

    if (!c.upcoming.length) {
      up.innerHTML = '<article class="camp"><div class="camp__head"><h3>No camp on sale right now</h3>' +
        '<p class="camp__dates">Our next Exploration camp runs in the school holidays.</p></div>' +
        '<div class="camp__body"><p style="color:var(--muted);font-size:.9rem">' +
        'Camps open for registration a few weeks before each MOE school holiday. Leave your email and we will tell you the day the next one opens.</p></div></article>';
    } else {
      up.innerHTML = c.upcoming.map(function (m) {
        return '<article class="camp">' +
          '<div class="camp__head"><h3>' + esc(m.title) + sampleTag(m) + '</h3>' +
            '<p class="camp__dates">' + esc(m.dates) + '</p></div>' +
          '<div class="camp__body">' +
            (m.venues && m.venues.length
              ? '<h4 class="camp__fact"><span>Venues</span></h4><ul class="camp__venues">' +
                m.venues.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>'
              : '') +
            '<div class="camp__facts">' +
              '<div class="camp__fact"><span>Coach ratio</span><b>' + esc(m.ratio) + '</b></div>' +
            '</div>' +
            (m.pricing && m.pricing.length
              ? '<div class="camp__price">' + m.pricing.map(function (p) {
                  return '<div' + (p.over ? ' style="text-decoration:line-through;color:var(--faint)"' : '') + '><span>' + esc(p.label) + ' <em style="color:var(--faint)">' + esc(p.note) + '</em></span><b>' + esc(p.price) + '</b></div>';
                }).join('') + '</div>'
              : '') +
            (m.bring && m.bring.length
              ? '<ul class="camp__bring">' + m.bring.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>'
              : '') +
            '<a class="btn btn--primary" href="' + esc(m.signup || BOOK) + '" target="_blank" rel="noopener">Register</a>' +
          '</div>' +
        '</article>';
      }).join('');
    }

  })();

  /* =================================================================
     CAMPS — photo gallery
     One rolling set of past-camp photos, opening in the shared lightbox.
     ================================================================= */
  (function campGallery() {
    var mount = el('campGallery');
    if (!mount) return;

    var g = (D.camps && D.camps.gallery) || null;
    var photos = (g && g.photos) || [];
    var alts = (g && g.alt) || [];

    // Nothing supplied yet: leave the section out rather than show empty boxes.
    if (!photos.length) {
      var section = mount.closest('section');
      if (section) section.hidden = true;
      return;
    }

    mount.innerHTML = photos.map(function (file, i) {
      var alt = alts[i] || (g.title + ' — photo ' + (i + 1));
      return '<button class="gallery__item' + (i === 0 ? ' gallery__item--lead' : '') + '"' +
        ' type="button" data-gallery="0" data-photo="' + i + '"' +
        ' aria-label="' + esc('Open photo ' + (i + 1) + ' of ' + photos.length + ': ' + alt) + '">' +
        '<img src="' + esc(campThumbSrc(file)) + '" alt="' + esc(alt) + '"' +
          ' loading="lazy" decoding="async"></button>';
    }).join('');

    initLightbox(mount, {
      galleries: [g],
      full: campFullSrc,
      thumb: campThumbSrc,
      label: 'Camp photo viewer'
    });
  })();

  /* =================================================================
     EVENTS
     ================================================================= */
  (function events() {
    /* Each service card links through to that filter in Past Events (client,
       Sep 2026). On the Events page itself that is a same-page hash — the
       filter listens for hashchange — and from About it is the full URL. */
    var onEvents = document.body.getAttribute('data-page') === 'events';
    function pastHash(t) { return '#past-' + t.key + 's'; }
    function pastHref(t) {
      var evt = SITE.url ? SITE.url('events.html') : 'events.html';
      return (onEvents ? '' : evt) + pastHash(t);
    }

    var types = el('eventTypes');
    if (types) {
      types.innerHTML = D.eventTypes.map(function (t) {
        return '<article class="etype" id="' + t.key + '">' +
          '<span class="etype__num">' + t.num + '</span>' +
          '<h3>' + esc(t.name) + '</h3>' +
          '<p class="etype__what">' + esc(t.what) + '</p>' +
          '<ul class="etype__prov">' + t.provides.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
          '<a class="etype__link" href="' + esc(pastHref(t)) + '">See past ' + esc(t.name) + '&nbsp;&rsaquo;</a>' +
        '</article>';
      }).join('');
    }

    var services = el('eventServices');
    if (services && D.eventServices) {
      services.innerHTML = D.eventServices.map(function (s, i) {
        var title = typeof s === 'string' ? s : s.title;
        var copy = typeof s === 'string' ? '' : s.copy;
        return '<article class="suite__item">' +
          '<span class="suite__num">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<h3>' + esc(title) + '</h3>' +
          (copy ? '<p>' + esc(copy) + '</p>' : '') +
        '</article>';
      }).join('');
    }

    var upc = el('eventsUpcoming');
    if (upc) {
      upc.innerHTML = D.eventsUpcoming.length
        ? D.eventsUpcoming.map(function (e) {
            /* Date, time and venue (client, Sep 2026). The venue links out to
               Google Maps when the entry carries a `map` URL. The old
               "Client:" line was dropped in the same round. */
            var meta = [];
            if (e.when) meta.push('<li><b>Date</b> ' + esc(e.when) + '</li>');
            if (e.time) meta.push('<li><b>Time</b> ' + esc(e.time) + '</li>');
            if (e.where) {
              meta.push('<li><b>Location</b> ' + (e.map
                ? '<a href="' + esc(e.map) + '" target="_blank" rel="noopener"' +
                    ' aria-label="' + esc(e.where + ' — open in Google Maps') + '">' +
                    esc(e.where) + '</a>'
                : esc(e.where)) + '</li>');
            }
            return '<article class="ecard' + (e.feature ? ' ecard--feature' : '') + '">' +
              '<span class="ecard__types">' + typeList(e.type).map(function (t) {
                return '<span class="ecard__type">' + esc(t) + '</span>';
              }).join('') + '</span>' +
              '<h3>' + esc(e.title) + sampleTag(e) + '</h3>' +
              (meta.length ? '<ul class="ecard__meta">' + meta.join('') + '</ul>' : '') +
              (e.scope && e.scope.length
                ? '<ul class="ecard__scope">' + e.scope.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'
                : '') +
            '</article>';
          }).join('')
        : '<p class="sched__empty">No public events on the calendar right now — <a href="contact.html">talk to us about running one</a>.</p>';
    }

    var showcase = el('eventShowcase');
    if (showcase && D.eventShowcase) {
      showcase.innerHTML = D.eventShowcase.map(function (e, eIndex) {
        var photos = e.photos || [];
        var cover = photos[0] || '';
        var total = photos.length;
        // Three thumbs under the cover; the rest are reachable in the viewer.
        var strip = photos.slice(1, 4);
        var hidden = total - 1 - strip.length;

        return '<article class="eshow" data-type="' + esc(typeKeys(e.type).join(' ')) + '">' +
          (cover
            ? '<button class="eshow__photo" type="button" data-gallery="' + eIndex + '" data-photo="0"' +
                ' aria-label="' + esc('View all ' + total + ' photos from ' + e.title) + '">' +
                '<img class="eshow__cover" src="' + esc(thumbSrc(cover)) + '" alt="' + esc(e.title) + '"' +
                  ' loading="lazy" decoding="async">' +
                '<span class="eshow__badge">' + total + ' photos</span>' +
              '</button>'
            : '') +
          '<div class="eshow__body">' +
            '<span class="eshow__types">' + typeList(e.type).map(function (t) {
              return '<span class="eshow__type">' + esc(t) + '</span>';
            }).join('') + '</span>' +
            '<h3>' + esc(e.title) + '</h3>' +
            '<p>' + esc(e.when) + ' \u00b7 ' + esc(e.where) + '</p>' +
            '<div class="eshow__thumbs">' + strip.map(function (file, idx) {
              var isLast = hidden > 0 && idx === strip.length - 1;
              return '<button class="eshow__thumb' + (isLast ? ' eshow__thumb--more' : '') + '" type="button"' +
                ' data-gallery="' + eIndex + '" data-photo="' + (idx + 1) + '"' +
                ' aria-label="' + esc('View ' + e.title + ' photo ' + (idx + 2) + ' of ' + total) + '">' +
                '<img src="' + esc(thumbSrc(file)) + '" alt="" loading="lazy" decoding="async">' +
                (isLast ? '<span class="eshow__thumbmore">+' + hidden + '</span>' : '') +
              '</button>';
            }).join('') + '</div>' +
            '<button class="eshow__more" type="button" data-gallery="' + eIndex + '" data-photo="0">' +
              'View all ' + total + ' photos &rsaquo;</button>' +
          '</div>' +
        '</article>';
      }).join('');
      initLightbox(showcase, {
        galleries: D.eventShowcase,
        full: fullSrc,
        thumb: thumbSrc,
        label: 'Event photo viewer'
      });
      initShowcaseFilter(showcase);
    }

    var pst = el('eventsPast');
    if (pst) {
      var groups = D.eventsPast || {};
      var labels = D.eventGroupLabel || {};
      pst.innerHTML = Object.keys(groups).filter(function (k) { return groups[k].length; }).map(function (k) {
        return '<section class="elog__group">' +
          '<h3>' + esc(labels[k] || k) + '</h3>' +
          '<ul class="elog__list">' + groups[k].map(function (e) {
            return '<li><span class="elog__name">' + esc(e.title) + '</span>' +
              '<span class="elog__where">' + esc(e.when) + ' · ' + esc(e.where) + '</span></li>';
          }).join('') + '</ul>' +
        '</section>';
      }).join('');
    }

    /* Trusted by — one row that scrolls continuously, like the Home page
       marquee (client, Sep 2026). The set is rendered TWICE: the CSS animation
       translates the track by exactly -50%, so the second copy is in the first
       copy's place when the loop restarts and the motion has no seam. The
       duplicate is aria-hidden so the names are announced only once. */
    var partners = el('eventPartners');
    if (partners) {
      var pbase = SITE.base || '';
      var logos = D.partners.map(function (p) {
        return p.logo
          ? '<span class="logorail__item">' +
              '<img src="' + esc(pbase + p.logo) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' +
            '</span>'
          : '<span class="logorail__item logorail__item--name">' + esc(p.name) + '</span>';
      }).join('');
      partners.innerHTML = '<span class="logorail__set">' + logos + '</span>' +
        '<span class="logorail__set" aria-hidden="true">' + logos + '</span>';
      initLogoRail(partners.parentElement);
    }
  })();

  /* 'Clinic' -> 'clinic', 'Carnival' -> 'carnival': the entries carry a display
     type, the EVENT_TYPES keys are lowercase singular. */
  function typeKey(t) {
    return String(t || '').toLowerCase().trim().replace(/s$/, '');
  }
  /* An event can be more than one thing — the SingHealth day is a competition
     AND a clinic (client, Sep 2026). `type` therefore takes a single name or a
     list; these two normalise either shape. */
  function typeList(t) {
    return (Array.isArray(t) ? t : [t]).filter(Boolean);
  }
  function typeKeys(t) {
    return typeList(t).map(typeKey);
  }

  /* Past Events filter. The Our Services cards link in with #past-clinics and
     friends (client, Sep 2026), so the hash selects a chip; the chips let the
     reader change it from there. Cards are hidden rather than re-rendered so
     the photo viewer's indices stay valid. */
  function initShowcaseFilter(showcase) {
    var chips = el('showcaseFilters');
    var cards = Array.prototype.slice.call(showcase.querySelectorAll('.eshow'));
    if (!chips || !cards.length) return;

    /* Every service gets a chip, in the order EVENT_TYPES lists them, even
       when nothing has run yet — the Our Services cards link straight to
       #past-competitions and the reader should land on that filter and be told
       it is empty rather than silently see everything. */
    var types = D.eventTypes || [];
    if (!types.length) return;

    var options = [{ key: 'all', name: 'All' }].concat(types);
    chips.innerHTML = options.map(function (o, i) {
      return '<button class="sched__filter' + (i === 0 ? ' is-active' : '') + '" type="button"' +
        ' data-type="' + esc(o.key) + '" aria-pressed="' + (i === 0) + '">' + esc(o.name) + '</button>';
    }).join('');

    var empty = document.createElement('p');
    empty.className = 'sched__empty';
    empty.hidden = true;
    showcase.parentNode.insertBefore(empty, showcase.nextSibling);

    function apply(key, focus) {
      var shown = 0;
      cards.forEach(function (c) {
        var keys = (c.getAttribute('data-type') || '').split(' ');
        var on = key === 'all' || keys.indexOf(key) > -1;
        c.hidden = !on;
        if (on) shown++;
      });
      var label = (options.filter(function (o) { return o.key === key; })[0] || {}).name || key;
      empty.hidden = shown > 0;
      empty.textContent = 'No past ' + label.toLowerCase() + ' to show yet — ' +
        'ask us about running one.';
      chips.querySelectorAll('.sched__filter').forEach(function (b) {
        var on = b.getAttribute('data-type') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      if (focus) {
        var head = document.getElementById('past');
        if (head && head.scrollIntoView) head.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.sched__filter');
      if (!b) return;
      apply(b.getAttribute('data-type'), false);
    });

    /* #past-clinics -> 'clinic'. An unknown hash falls through to 'all'. */
    function fromHash(focus) {
      var m = /^#past-(.+)$/.exec(window.location.hash || '');
      if (!m) return;
      var key = typeKey(m[1]);
      var known = options.some(function (o) { return o.key === key; });
      apply(known ? key : 'all', focus);
    }
    window.addEventListener('hashchange', function () { fromHash(true); });
    fromHash(true);
  }

  /* Drive the "Trusted by" row by scrolling the container rather than
     animating the track (client, Sep 2026: "scrolls too slowly and cannot
     scroll manually"). Because the motion IS the scroll position, a finger
     swipe, a trackpad or the arrow keys move it like any other scroller; the
     auto-advance simply pauses while the reader is driving and picks up again
     once they stop. The CSS keyframe animation stays as the no-JS fallback and
     is switched off by the .logorail--js class. */
  function initLogoRail(rail) {
    if (!rail || !rail.classList.contains('logorail')) return;
    var track = rail.querySelector('.logorail__track');
    if (!track) return;
    rail.classList.add('logorail--js');

    var SPEED = 58;            // px per second — roughly double the old pace
    var RESUME_AFTER = 1800;   // ms of stillness before it starts again
    var pos = 0, last = 0, paused = false, resumeTimer = 0;

    /* The set is rendered twice, so half the track is one full pass: jumping
       back by that much is invisible. */
    function half() { return track.scrollWidth / 2; }
    function scrollable() { return rail.scrollWidth - rail.clientWidth > 4; }

    function pause() {
      paused = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        pos = rail.scrollLeft;
        paused = false;
      }, RESUME_AFTER);
    }

    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (evt) {
      rail.addEventListener(evt, pause, { passive: true });
    });
    rail.addEventListener('mouseenter', function () { paused = true; });
    rail.addEventListener('mouseleave', function () { pos = rail.scrollLeft; paused = false; });
    /* A scroll we did not cause means the reader is dragging it. Scroll events
       are dispatched after our own write has returned, so a flag set around the
       assignment would always be back to false by the time this runs — compare
       against the position we asked for instead. */
    rail.addEventListener('scroll', function () {
      if (Math.abs(rail.scrollLeft - pos) > 2) pause();
    }, { passive: true });

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.requestAnimationFrame(function step(now) {
      window.requestAnimationFrame(step);
      if (!last) { last = now; return; }
      var dt = Math.min(64, now - last);
      last = now;
      if (paused || document.hidden || !scrollable()) { pos = rail.scrollLeft; return; }
      var h = half();
      pos += SPEED * dt / 1000;
      if (h > 0 && pos >= h) pos -= h;
      rail.scrollLeft = pos;
    });
  }

  /* =================================================================
     COACHES — About page grid
     ================================================================= */
  (function coaches() {
    var founders = el('coachFounders');
    var team = el('coachTeam');
    if (!founders && !team) return;
    var base = SITE.base || '';

    function initials(name) {
      return String(name || '').split(/\s+/).filter(Boolean).map(function (part) { return part.charAt(0); }).join('').slice(0, 2).toUpperCase();
    }

    function card(c, i) {
      var tag = c.profilePage === false ? 'div' : 'a';
      var href = c.profilePage === false ? '' : ' href="' + base + 'coaches/' + esc(c.slug) + '.html"';
      var photo = c.photo
        ? '<img src="' + base + esc(c.photo) + '" alt="' + esc(c.name) + '" width="640" height="640" loading="lazy" decoding="async">'
        : '<span class="coach__initials">' + esc(initials(c.name)) + '</span>';
      return '<' + tag + ' class="coach coach--' + (c.profilePage === false ? 'static' : 'linked') + '"' + href + '>' +
        '<div class="coach__img">' + photo + '</div>' +
        '<div class="coach__body"><h3>' + esc(c.name) + '</h3>' +
          '<p class="coach__role">' + esc(c.role) + '</p>' +
          (c.cert ? '<span class="coach__cert">' + esc(c.cert) + '</span>' : '') +
          /* No profile page yet: the card simply does not link anywhere. */
          (c.profilePage === false ? '' : '<p class="coach__more">View profile &rsaquo;</p>') +
        '</div></' + tag + '>';
    }

    if (founders) founders.innerHTML = D.coaches.filter(function (c) { return c.group === 'founder'; }).map(card).join('');
    if (team) team.innerHTML = D.coaches.filter(function (c) { return c.group !== 'founder'; }).map(card).join('');

    /* The team row scrolls sideways. Scrolling itself is CSS; this only adds
       the two arrows a mouse user would otherwise not get, and only while
       there is something off-screen to reach. */
    var rail = el('coachTeamRail');
    if (!rail || !team || !team.classList.contains('coachgrid--rail')) return;

    function arrow(dir, label, d) {
      return '<button class="rail__nav rail__nav--' + dir + '" type="button" aria-label="' + label + '">' +
        '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">' +
          '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.9" ' +
            'stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    }
    rail.insertAdjacentHTML('beforeend',
      arrow('prev', 'Scroll the team left', 'M10 3 5 8l5 5') +
      arrow('next', 'Scroll the team right', 'M6 3l5 5-5 5'));

    var prev = rail.querySelector('.rail__nav--prev');
    var next = rail.querySelector('.rail__nav--next');

    function sync() {
      var max = team.scrollWidth - team.clientWidth;
      // 2px of slack: fractional scroll positions never land exactly on the end.
      prev.disabled = team.scrollLeft <= 2;
      next.disabled = team.scrollLeft >= max - 2;
      /* Phones don't get the arrows (they would only cover cards), so the same
         two states drive the quiet edge cue instead — see .rail--end in the
         stylesheet. `max < 3` also covers a row short enough not to scroll,
         where there is nothing to hint at. */
      rail.classList.toggle('rail--end', max < 3 || next.disabled);
    }
    // One click moves two cards, so the gap has to come from the CSS.
    function page(dir) {
      var card = team.querySelector('.coach');
      var gap = parseFloat(getComputedStyle(team).columnGap) || 0;
      var step = card ? (card.offsetWidth + gap) * 2 : team.clientWidth * 0.8;
      team.scrollBy({ left: dir * step, behavior: 'smooth' });
    }

    prev.addEventListener('click', function () { page(-1); });
    next.addEventListener('click', function () { page(1); });
    team.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  })();

  /* =================================================================
     NEWS — articles
     ================================================================= */
  (function news() {
    var mount = el('articleGrid');
    if (!mount) return;
    var filters = el('articleFilters');
    var cat = 'all';

    function fmt(d) {
      var parts = String(d).split('-');
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return parts.length === 3 ? (Number(parts[2]) + ' ' + months[Number(parts[1]) - 1] + ' ' + parts[0]) : d;
    }

    function render() {
      var base = SITE.base || '';
      var rows = D.articles.filter(function (a) { return cat === 'all' || a.category === cat; });
      mount.innerHTML = rows.length ? rows.map(function (a) {
        return '<a class="article" href="' + base + 'news/' + esc(a.slug) + '.html">' +
          '<span class="article__cat">' + esc(a.category) + '</span>' +
          '<h3>' + esc(a.title) + sampleTag(a) + '</h3>' +
          '<p>' + esc(a.excerpt) + '</p>' +
          '<div class="article__foot"><span>' + fmt(a.date) +
            (a.author ? ' · ' + esc(a.author) : '') + '</span>' +
            '<span>' + esc(a.read) + ' read</span></div>' +
        '</a>';
      }).join('') : '<p class="sched__empty">Nothing published in this category yet.</p>';
    }

    if (filters) {
      var cats = ['all'].concat(D.articles.map(function (a) { return a.category; })
        .filter(function (v, i, arr) { return arr.indexOf(v) === i; }));
      filters.innerHTML = cats.map(function (c, i) {
        return '<button class="sched__filter' + (i === 0 ? ' is-active' : '') + '" data-cat="' + esc(c) + '"' +
          ' aria-pressed="' + (i === 0) + '">' + (c === 'all' ? 'All articles' : esc(c)) + '</button>';
      }).join('');
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('.sched__filter');
        if (!b) return;
        cat = b.getAttribute('data-cat');
        filters.querySelectorAll('.sched__filter').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-pressed', String(on));
        });
        render();
      });
    }
    render();
  })();

  /* =================================================================
     RACKET RATINGS + RECREATIONAL PLAY GROUPS  (SG Hub → Groups tab)
     ================================================================= */
  (function racketRatings() {
    var mount = el('rrFeatures');
    if (!mount) return;
    mount.innerHTML = D.racketRatings.features.map(function (f, i) {
      return '<a class="rrcard' + (f.primary ? ' rrcard--primary' : '') + '"' +
        ' href="' + esc(f.href) + '" target="_blank" rel="noopener">' +
        '<span class="rrcard__icon" aria-hidden="true">' + f.icon + '</span>' +
        '<h4>' + esc(f.name) + (f.primary ? '<span class="rrcard__flag">Start here for groups</span>' : '') + '</h4>' +
        '<p>' + esc(f.desc) + '</p>' +
        '<span class="rrcard__go">Open on Racket Ratings &rsaquo;</span>' +
      '</a>';
    }).join('');
  })();


  /* =================================================================
     TEAM SINGAPORE  (SG Hub → Team Singapore tab)
     Player cards with last-known world ranking, the squad's next
     competitions read off the same 2026 calendar the season tracker
     uses, and a news panel that pulls current stories per player.
     ================================================================= */
  (function teamSingapore() {
    var mount = el('teamGrid');
    if (!mount || !D.teamSg) return;
    var T = D.teamSg;

    function newsUrl(q) {
      return 'https://news.google.com/search?q=' + encodeURIComponent(q) + '&hl=en-SG&gl=SG&ceid=SG:en';
    }

    /* ---- player cards ---- */
    mount.innerHTML = T.players.map(function (p) {
      var rank = p.rank
        ? '<div class="tcard__rank"><b>#' + p.rank + '</b><span>World ranking<br>' + esc(p.rankAs) + '</span></div>'
        : '<div class="tcard__rank tcard__rank--none"><b>—</b><span>See live<br>BWF ranking</span></div>';

      return '<article class="tcard">' +
        '<div class="tcard__top">' +
          '<div>' +
            '<span class="tcard__disc">' + esc(p.discipline) + '</span>' +
            '<h4 class="tcard__name">' + esc(p.name) + '</h4>' +
          '</div>' + rank +
        '</div>' +
        '<p class="tcard__note">' + esc(p.note) + '</p>' +
        (p.highlights && p.highlights.length
          ? '<ul class="tcard__highlights">' + p.highlights.map(function (h) {
              return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>'
          : '') +
        '<div class="tcard__links">' +
          '<a href="' + esc(T.rankingUrl) + '" target="_blank" rel="noopener">Live ranking &#8599;</a>' +
          '<a href="' + esc(newsUrl(p.news)) + '" target="_blank" rel="noopener">News &#8599;</a>' +
        '</div>' +
      '</article>';
    }).join('');

    /* ---- next competitions ----
       Read from the season calendar that main.js renders, so the two can
       never disagree. main.js publishes it on window as ELEVER_SEASON —
       but main.js loads AFTER this file, so wait for the DOM to be ready
       before reading it rather than racing the script order. */
    var nextMount = el('teamNext');
    function renderNext() {
      var cal = window.ELEVER_SEASON || [];
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      function stamp(iso) {
        var a = String(iso).split('-');
        return new Date(Number(a[0]), Number(a[1]) - 1, Number(a[2]));
      }

      var upcoming = cal.filter(function (e) { return stamp(e.end) >= today; })
        .sort(function (a, b) { return stamp(a.start) - stamp(b.start); })
        .slice(0, 4);

      if (!upcoming.length) {
        nextMount.innerHTML = '<li class="tnext__empty">The 2026 season is complete. ' +
          '<a href="' + esc(T.calendarUrl) + '" target="_blank" rel="noopener">See the next calendar &#8599;</a></li>';
      } else {
        nextMount.innerHTML = upcoming.map(function (e) {
          var live = stamp(e.start) <= today;
          return '<li class="tnext__item' + (live ? ' is-live' : '') + '">' +
            '<span class="tnext__when">' + esc(e.date) + (live ? ' · on now' : '') + '</span>' +
            '<span class="tnext__name">' + esc(e.name) + '</span>' +
            '<span class="tnext__grade">' + esc(e.grade) + '</span>' +
          '</li>';
        }).join('');
      }
    }
    if (nextMount) {
      if (window.ELEVER_SEASON) renderNext();
      else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNext);
      } else {
        // Every script tag has already run — the calendar is there or never.
        setTimeout(renderNext, 0);
      }
    }

    /* ---- news ----
       Google News has no CORS-open JSON feed, so rather than fake a live
       feed we give one clearly-labelled search link per player plus the
       squad as a whole. Every link opens the current stories. */
    var newsMount = el('teamNews');
    if (newsMount) {
      var feeds = [
        { label: 'Singapore national team', q: 'Singapore national badminton team' },
        { label: 'Singapore Badminton Association', q: 'Singapore Badminton Association' }
      ].concat(T.players.map(function (p) {
        return { label: p.name, q: p.news };
      }));

      newsMount.innerHTML = feeds.map(function (f) {
        return '<a class="tnews__chip" href="' + esc(newsUrl(f.q)) + '" target="_blank" rel="noopener">' +
          esc(f.label) + ' &#8599;</a>';
      }).join('');
    }
  })();

  /* =================================================================
     LEAD FORMS
     Submits the enquiry to the /api/contact serverless function, which
     sends it to info@eleverbadminton.com via Resend. If that endpoint is
     not available (e.g. the static GitHub Pages mirror, which has no
     backend), it falls back to opening a pre-filled email so no enquiry
     is silently dropped.
     ================================================================= */
  (function leadForms() {
    var forms = document.querySelectorAll('form[data-lead]');
    if (!forms.length) return;

    forms.forEach(function (form) {
      var status = form.querySelector('.lead__status');
      function clearErrors() {
        form.querySelectorAll('.field-error').forEach(function (err) { err.remove(); });
        form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
          field.removeAttribute('aria-invalid');
          field.removeAttribute('aria-describedby');
        });
      }

      function showError(field, message) {
        var id = (field.id || field.name || 'field').replace(/\s+/g, '-').toLowerCase() + '-error';
        var err = document.createElement('span');
        err.className = 'field-error';
        err.id = id;
        err.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', id);
        var label = field.closest('label') || field.parentElement;
        if (label) label.appendChild(err);
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();
        var firstInvalid = null;
        form.querySelectorAll('input, select, textarea').forEach(function (field) {
          var hasValue = field.type === 'checkbox' ? field.checked : String(field.value || '').trim();
          var valid = field.required ? hasValue : true;
          if (valid && hasValue && field.validity && !field.validity.valid) valid = false;
          if (!valid) {
            if (!firstInvalid) firstInvalid = field;
            showError(field, field.type === 'checkbox'
              ? 'Please tick this box so we can respond to your enquiry.'
              : (field.validity && field.validity.typeMismatch
                ? 'Please enter this in the correct format.'
                : 'Please complete this field before sending your enquiry.'));
          }
        });
        if (firstInvalid) {
          if (status) { status.textContent = 'Please fix the highlighted fields and try again.'; status.className = 'lead__status lead__status--err'; }
          firstInvalid.focus();
          return;
        }
        var to = form.getAttribute('data-to') || EMAIL;
        var subject = form.getAttribute('data-subject') || 'Website enquiry';

        var payload = { subject: subject };
        var lines = [];
        new FormData(form).forEach(function (v, k) {
          if (k === 'consent') return;
          payload[k] = v;
          if (String(v).trim()) lines.push(k + ': ' + v);
        });

        function fallbackMailto(msg) {
          window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(lines.join('\n'));
          if (status) {
            status.textContent = msg || 'Opening your email app — press send and we will reply within 1 working day.';
            status.className = 'lead__status lead__status--ok';
          }
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (status) {
          status.textContent = 'Sending your message…';
          status.className = 'lead__status';
        }

        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (resp) {
          if (resp.ok) {
            form.reset();
            if (status) {
              status.textContent = 'Thanks — your message has been sent. We will reply within 1 working day.';
              status.className = 'lead__status lead__status--ok';
            }
          } else {
            // Endpoint reached but could not send (e.g. domain not verified yet).
            fallbackMailto('We could not send it automatically — opening your email app so you can send it directly.');
          }
        }).catch(function () {
          // No backend available (e.g. the static GitHub Pages mirror).
          fallbackMailto();
        }).then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
      });
    });
  })();
})();
