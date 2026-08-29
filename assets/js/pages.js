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
  var BOOK = SITE.bookUrl || 'https://app.eleverbadminton.com/';
  var EMAIL = SITE.email || 'info@eleverbadminton.com';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function el(id) { return document.getElementById(id); }
  function sampleTag(item) { return item && item.placeholder ? ' <span class="sample" title="Sample content — replace in assets/js/data.js">sample</span>' : ''; }

  /* Photo path helpers. data.js stores bare filenames; the base directories
     live alongside so the full-size and thumbnail sets cannot drift apart. */
  var PHOTO_BASE = D.eventPhotoBase || 'assets/img/events/';
  var THUMB_BASE = D.eventThumbBase || 'assets/img/events/thumb/';
  function fullSrc(file) { return (SITE.base || '') + PHOTO_BASE + file; }
  function thumbSrc(file) { return (SITE.base || '') + THUMB_BASE + file; }

  /* Full-screen gallery viewer for the event showcase.
     Shows the full-size image, a thumbnail strip, a counter and keyboard,
     swipe and button navigation. */
  function initEventLightbox(scope) {
    if (!scope || scope.dataset.lightboxReady) return;
    scope.dataset.lightboxReady = '1';

    var activeGallery = 0;
    var activePhoto = 0;
    var lastTrigger = null;

    var modal = document.createElement('div');
    modal.className = 'lightbox';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Event photo viewer');
    modal.hidden = true;
    modal.innerHTML =
      '<div class="lightbox__bar">' +
        '<div class="lightbox__meta"><b class="lightbox__title"></b><span class="lightbox__count"></span></div>' +
        '<button class="lightbox__close" type="button" aria-label="Close gallery">Close &times;</button>' +
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

    function gallery() { return D.eventShowcase[activeGallery] || null; }
    function photos() { var g = gallery(); return (g && g.photos) || []; }

    /* Fetching the neighbours keeps stepping through a gallery instant. */
    function preloadNeighbours() {
      var list = photos();
      if (list.length < 2) return;
      [1, -1].forEach(function (d) {
        var i = (activePhoto + d + list.length) % list.length;
        var pre = new Image();
        pre.src = fullSrc(list[i]);
      });
    }

    function buildStrip() {
      var g = gallery();
      if (!g) return;
      stripEl.innerHTML = photos().map(function (file, i) {
        return '<button class="lightbox__stripitem" type="button" role="tab" data-idx="' + i + '"' +
          ' aria-label="' + esc('Photo ' + (i + 1) + ' of ' + photos().length) + '">' +
          '<img src="' + esc(thumbSrc(file)) + '" alt="" loading="lazy" decoding="async"></button>';
      }).join('');
    }

    function show() {
      var g = gallery();
      var list = photos();
      var file = list[activePhoto];
      if (!g || !file) return;
      img.src = fullSrc(file);
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
  var PILLARS = [
    { num: '01', name: 'Classes', href: 'classes.html', who: 'Weekly coaching along a structured pathway.' },
    { num: '02', name: 'Camps', href: 'camps.html', who: 'Holiday Exploration camps for new players.' },
    { num: '03', name: 'Carnivals', href: 'events.html#carnival', who: 'Mass-participation event days.' },
    { num: '04', name: 'Clinics', href: 'events.html#clinic', who: 'Short, focused coaching workshops.' },
    { num: '05', name: 'Competitions', href: 'events.html#competition', who: 'Tournaments run end to end.' }
  ];

  (function pillars() {
    var mount = el('pillarsGrid');
    if (!mount) return;
    var base = SITE.base || '';
    mount.innerHTML = PILLARS.map(function (p, i) {
      return '<a class="pillar" href="' + base + p.href + '">' +
        '<span class="pillar__num">' + p.num + '</span>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p class="pillar__who">' + esc(p.who) + '</p>' +
        '<span class="pillar__go">Explore &rsaquo;</span>' +
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

    var ARROW = '<span class="path__arrow" aria-hidden="true">' +
      '<svg viewBox="0 0 24 16" width="24" height="16" focusable="false">' +
        '<path d="M1 8h20M15 2l6 6-6 6" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></span>';

    mount.innerHTML = steps.map(function (p, i) {
      return '<article class="path" id="' + esc(p.key) + '">' +
          '<span class="path__num">' + esc(p.num) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="path__headline">' + esc(p.headline) + '</p>' +
          (p.hook ? '<p class="path__hook">' + esc(p.hook) + '</p>' : '') +
          '<p class="path__body">' + esc(p.body) + '</p>' +
          '<p class="path__closing">' + esc(p.closing) + '</p>' +
          '<a class="path__cta" href="' + esc(p.cta.href) + '">' + esc(p.cta.label) + ' &rsaquo;</a>' +
        '</article>' + (i < last ? ARROW : '');
    }).join('');
  })();

  /* =================================================================
     CLASSES — locations. Map OR list, never both at once.
     ================================================================= */
  (function locations() {
    var listMount = el('schedList');
    if (!listMount) return;

    var mapMount = el('schedMap');
    var countEl = el('schedCount');
    var filterWrap = el('schedFilters');
    var toggleWrap = el('schedToggle');
    var mapView = el('schedMapView');
    var listView = el('schedListView');

    var level = 'all';
    var mapDrawn = false;

    function gmapsSearchUrl(v) {
      var addr = (v.addr || '').replace(/,?\s*S\d{6}.*/, '');
      return 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent((v.venue + ' ' + addr + ' Singapore').trim());
    }

    function venueLevel(v) {
      var hasEmergence = v.sessions.some(function (s) { return s.level === 'Emergence'; });
      var hasEssentials = v.sessions.some(function (s) { return s.level === 'Essentials'; });
      if (hasEmergence && hasEssentials) return 'mixed';
      return hasEmergence ? 'emergence' : 'essentials';
    }

    /* ---- Real map (Leaflet + OpenStreetMap tiles, no API key) ----
       Pins are colour-coded by the level(s) taught at that venue:
       Essentials = blue, Emergence = green, both = split marker. */
    var LEVEL_COLOR = { essentials: '#2151d1', emergence: '#13a65b' };
    var map = null;
    var markerLayer = null;

    function pinIcon(lvl) {
      var a = LEVEL_COLOR.essentials, b = LEVEL_COLOR.emergence;
      var fill = lvl === 'mixed'
        ? '<path d="M14 0a14 14 0 0 0-14 14c0 9 14 26 14 26V0z" fill="' + a + '"/>' +
          '<path d="M14 0a14 14 0 0 1 14 14c0 9-14 26-14 26V0z" fill="' + b + '"/>'
        : '<path d="M14 0a14 14 0 0 0 0 28 14 14 0 0 0 0-28zM14 0a14 14 0 0 1 14 14c0 9-14 26-14 26S0 23 0 14A14 14 0 0 1 14 0z" fill="' +
          (lvl === 'emergence' ? b : a) + '"/>';
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">' +
        fill + '<circle cx="14" cy="14" r="5.2" fill="#fff"/></svg>';
      return L.divIcon({
        className: 'sched__leafpin',
        html: svg,
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -34]
      });
    }

    function popupHtml(v) {
      var rows = sessionsFor(v).map(function (s) {
        return '<li><b>' + esc(s.day) + '</b> ' + esc(s.time) +
          ' <span class="mpop__lvl mpop__lvl--' + esc(s.level.toLowerCase()) + '">' + esc(s.level) + '</span></li>';
      }).join('');
      return '<div class="mpop">' +
        '<h4 class="mpop__name">' + esc(v.venue) + '</h4>' +
        '<p class="mpop__addr"><a href="' + gmapsSearchUrl(v) + '" target="_blank" rel="noopener">' +
          esc(v.addr) + '</a></p>' +
        '<ul class="mpop__sessions">' + rows + '</ul>' +
        '<div class="mpop__actions">' +
          '<a href="' + esc(v.book || BOOK) + '" target="_blank" rel="noopener">Book this class &rsaquo;</a>' +
        '</div>' +
      '</div>';
    }

    /* Rendered only when the Map view is first opened, so the tile request
       never runs for visitors who stay on the list. */
    function drawMap() {
      if (!mapMount) return;
      var rows = visible();

      // Leaflet blocked or offline: say so rather than showing an empty box.
      if (typeof L === 'undefined') {
        mapMount.innerHTML = '<p class="sched__mapfail">The map could not load. ' +
          '<button type="button" class="sched__mapfail-btn" data-view="list">Use the list view</button> ' +
          'for every venue, day and time.</p>';
        mapDrawn = false;
        return;
      }

      if (!map) {
        map = L.map(mapMount, { scrollWheelZoom: false, attributionControl: true });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        // Wheel-zoom only after a deliberate click, so the page still scrolls.
        map.on('click', function () { map.scrollWheelZoom.enable(); });
        map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
        markerLayer = L.layerGroup().addTo(map);
      }

      markerLayer.clearLayers();
      var pts = [];
      rows.forEach(function (v) {
        if (typeof v.lat !== 'number' || typeof v.lng !== 'number') return;
        var m = L.marker([v.lat, v.lng], {
          icon: pinIcon(venueLevel(v)),
          title: v.venue,
          alt: v.venue + ' — ' + sessionsFor(v).length + ' classes'
        });
        m.bindPopup(popupHtml(v), { maxWidth: 280 });
        m.addTo(markerLayer);
        pts.push([v.lat, v.lng]);
      });

      if (pts.length > 1) map.fitBounds(pts, { padding: [38, 38], maxZoom: 15 });
      else if (pts.length === 1) map.setView(pts[0], 15);
      else map.setView([1.3521, 103.8198], 11);   // whole island when nothing matches

      // The container is sized by CSS after the tab switches; recalc once.
      setTimeout(function () { map.invalidateSize(); }, 60);
      mapDrawn = true;
    }

    /* Venues read alphabetically. localeCompare so the curly apostrophe in
       "Singapore Chinese Girls' School" does not sort it out of place. */
    function byVenueName(a, b) {
      return String(a.venue).localeCompare(String(b.venue), 'en', { sensitivity: 'base' });
    }
    function visible() {
      return D.classes.filter(function (v) {
        if (level === 'all') return true;
        return v.sessions.some(function (s) { return s.level === level; });
      }).sort(byVenueName);
    }
    function sessionsFor(v) {
      return v.sessions.filter(function (s) { return level === 'all' || s.level === level; });
    }

    function render() {
      var rows = visible();

      if (countEl) {
        var n = rows.reduce(function (a, v) { return a + sessionsFor(v).length; }, 0);
        countEl.textContent = rows.length + (rows.length === 1 ? ' venue' : ' venues') +
          ' · ' + n + (n === 1 ? ' class' : ' classes');
      }
      if (mapDrawn) drawMap();

      if (!rows.length) {
        listMount.innerHTML = '<p class="sched__empty">No classes match that level yet. Try “All levels”, or ' +
          '<a href="contact.html">ask us about a venue near you</a>.</p>';
        return;
      }

      listMount.innerHTML = rows.map(function (v) {
        return '<article class="vcard" id="venue-' + esc(v.venueId) + '">' +
          '<div class="vcard__top"><h3>' + esc(v.venue) + sampleTag(v) + '</h3>' +
            '<span class="vcard__region">' + esc(v.region) + '</span></div>' +
          '<p class="vcard__addr"><a href="' + gmapsSearchUrl(v) + '" target="_blank" rel="noopener">' +
            esc(v.addr) + '</a></p>' +
          '<ul class="vcard__sessions">' + sessionsFor(v).map(function (s) {
            return '<li><span class="vcard__day">' + esc(s.day) + '</span>' +
              '<span class="vcard__time">' + esc(s.time) + '</span>' +
              '<span class="vcard__lvl vcard__lvl--' + esc(s.level.toLowerCase()) + '">' + esc(s.level) + '</span>' +
              '</li>';
          }).join('') + '</ul>' +
          '<div class="vcard__actions">' +
            '<a class="vcard__book" href="' + esc(v.book || BOOK) + '" target="_blank" rel="noopener">Book this class &rsaquo;</a>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    if (filterWrap) {
      filterWrap.addEventListener('click', function (e) {
        var b = e.target.closest('.sched__filter');
        if (!b) return;
        level = b.getAttribute('data-level');
        filterWrap.querySelectorAll('.sched__filter').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-pressed', String(on));
        });
        render();
      });
    }

    function setView(view) {
      if (!toggleWrap || !mapView || !listView) return;
      toggleWrap.querySelectorAll('button').forEach(function (x) {
        var on = x.getAttribute('data-view') === view;
        x.classList.toggle('is-active', on);
        x.setAttribute('aria-pressed', String(on));
      });
      listView.classList.toggle('is-active', view === 'list');
      mapView.classList.toggle('is-active', view === 'map');
      if (view === 'map') drawMap();
    }

    // The map's own failure message offers a way back to the list.
    if (mapMount) {
      mapMount.addEventListener('click', function (e) {
        if (e.target.closest('.sched__mapfail-btn')) setView('list');
      });
    }

    if (toggleWrap && mapView && listView) {
      toggleWrap.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var view = b.getAttribute('data-view');
        toggleWrap.querySelectorAll('button').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-pressed', String(on));
        });
        listView.classList.toggle('is-active', view === 'list');
        mapView.classList.toggle('is-active', view === 'map');
        if (view === 'map') drawMap();
      });
    }

    render();
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
                  return '<div><span>' + esc(p.label) + ' <em style="color:var(--faint)">' + esc(p.note) + '</em></span><b>' + esc(p.price) + '</b></div>';
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
     EVENTS
     ================================================================= */
  (function events() {
    var types = el('eventTypes');
    if (types) {
      types.innerHTML = D.eventTypes.map(function (t) {
        return '<article class="etype" id="' + t.key + '">' +
          '<span class="etype__num">' + t.num + '</span>' +
          '<h3>' + esc(t.name) + '</h3>' +
          '<p class="etype__what">' + esc(t.what) + '</p>' +
          '<ul class="etype__prov">' + t.provides.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn btn--ghost" href="contact.html">Request a proposal</a>' +
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
            return '<article class="ecard' + (e.feature ? ' ecard--feature' : '') + '">' +
              '<span class="ecard__type">' + esc(e.type) + '</span>' +
              '<h3>' + esc(e.title) + sampleTag(e) + '</h3>' +
              (e.client ? '<ul class="ecard__meta"><li><b>Client:</b> ' + esc(e.client) + '</li></ul>' : '') +
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

        return '<article class="eshow">' +
          (cover
            ? '<button class="eshow__photo" type="button" data-gallery="' + eIndex + '" data-photo="0"' +
                ' aria-label="' + esc('View all ' + total + ' photos from ' + e.title) + '">' +
                '<img class="eshow__cover" src="' + esc(thumbSrc(cover)) + '" alt="' + esc(e.title) + '"' +
                  ' loading="lazy" decoding="async">' +
                '<span class="eshow__badge">' + total + ' photos</span>' +
              '</button>'
            : '') +
          '<div class="eshow__body">' +
            '<span class="eshow__type">' + esc(e.type) + '</span>' +
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
      initEventLightbox(showcase);
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

    var partners = el('eventPartners');
    if (partners) {
      partners.innerHTML = D.partners.map(function (p) {
        return p.logo
          ? '<span class="partners__chip"><img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async"></span>'
          : '<span class="partners__chip">' + esc(p.name) + '</span>';
      }).join('');
    }
  })();

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
      var rows = D.articles.filter(function (a) { return cat === 'all' || a.category === cat; });
      mount.innerHTML = rows.length ? rows.map(function (a) {
        return '<article class="article">' +
          '<span class="article__cat">' + esc(a.category) + '</span>' +
          '<h3>' + esc(a.title) + sampleTag(a) + '</h3>' +
          '<p>' + esc(a.excerpt) + '</p>' +
          '<div class="article__foot"><span>' + fmt(a.date) + '</span><span>' + esc(a.read) + ' read</span></div>' +
        '</article>';
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
     No backend is wired yet, so submitting opens a pre-filled email
     rather than silently dropping the enquiry. Point `action` at a real
     endpoint (Formspree, Netlify Forms, your CRM) to go live.
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
        var lines = [];
        new FormData(form).forEach(function (v, k) {
          if (k === 'consent') return;
          if (String(v).trim()) lines.push(k + ': ' + v);
        });
        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        if (status) {
          status.textContent = 'Opening your email app — press send and we will reply within 1 working day.';
          status.className = 'lead__status lead__status--ok';
        }
      });
    });
  })();
})();
