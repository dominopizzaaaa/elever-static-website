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

  function initEventLightbox(scope) {
    if (!scope || scope.dataset.lightboxReady) return;
    scope.dataset.lightboxReady = '1';

    var activeGallery = 0;
    var activePhoto = 0;
    var modal = document.createElement('div');
    modal.className = 'lightbox';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Event photo viewer');
    modal.hidden = true;
    modal.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close gallery">Close</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">‹</button>' +
      '<figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">›</button>';
    document.body.appendChild(modal);

    var img = modal.querySelector('.lightbox__img');
    var cap = modal.querySelector('.lightbox__cap');

    function show() {
      var gallery = D.eventShowcase[activeGallery];
      if (!gallery) return;
      var photos = gallery.photos || [];
      var src = photos[activePhoto];
      if (!src) return;
      img.src = src;
      img.alt = gallery.title + ' photo ' + (activePhoto + 1);
      cap.textContent = gallery.title + ' · ' + (activePhoto + 1) + ' of ' + photos.length;
    }

    function open(galleryIndex, photoIndex) {
      activeGallery = galleryIndex;
      activePhoto = photoIndex;
      show();
      modal.hidden = false;
      document.body.classList.add('has-lightbox');
      modal.querySelector('.lightbox__close').focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('has-lightbox');
    }

    function step(dir) {
      var gallery = D.eventShowcase[activeGallery];
      var photos = gallery && gallery.photos ? gallery.photos : [];
      if (!photos.length) return;
      activePhoto = (activePhoto + dir + photos.length) % photos.length;
      show();
    }

    scope.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-gallery]');
      if (!trigger) return;
      open(Number(trigger.dataset.gallery), Number(trigger.dataset.photo || 0));
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.lightbox__close')) close();
      else if (e.target.closest('.lightbox__nav--prev')) step(-1);
      else if (e.target.closest('.lightbox__nav--next')) step(1);
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
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
     ================================================================= */
  (function pathways() {
    var mount = el('pathsGrid');
    if (!mount) return;
    mount.innerHTML = D.pathways.map(function (p, i) {
      return '<article class="path" id="' + p.key + '" style="--step:' + i + '">' +
        '<div class="path__rise"><span class="path__num">' + p.num + '</span><span class="path__step">Step ' + (i + 1) + '</span></div>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<span class="path__tag">' + esc(p.tag) + '</span>' +
        '<p class="path__blurb">' + esc(p.blurb) + '</p>' +
        '<ul class="path__learn">' + p.learn.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
        '<a class="path__cta" href="' + esc(p.cta.href) + '">' + esc(p.cta.label) + ' &rsaquo;</a>' +
      '</article>';
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

    function mapPosition(v) {
      var bounds = { minLat: 1.24, maxLat: 1.45, minLng: 103.62, maxLng: 104.02 };
      var x = ((v.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
      var y = (1 - ((v.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat))) * 100;
      return {
        left: Math.max(5, Math.min(95, x)),
        top: Math.max(8, Math.min(92, y))
      };
    }

    function drawMap() {
      if (!mapMount) return;
      var rows = visible();
      mapDrawn = true;
      mapMount.innerHTML = '<div class="sched__mapbase" role="img" aria-label="Approximate Singapore map with class venue pins">' +
        '<span class="sched__island"></span>' +
        '<div class="sched__legend"><span><i class="pin-dot pin-dot--essentials"></i>Essentials</span><span><i class="pin-dot pin-dot--emergence"></i>Emergence</span><span><i class="pin-dot pin-dot--mixed"></i>Both</span></div>' +
        rows.map(function (v) {
          var pos = mapPosition(v);
          var lvl = venueLevel(v);
          var sessionText = sessionsFor(v).map(function (s) { return s.day + ' ' + s.time + ' ' + s.level; }).join(', ');
          return '<a class="sched__pin sched__pin--' + lvl + '" href="' + gmapsSearchUrl(v) + '" target="_blank" rel="noopener"' +
            ' style="left:' + pos.left.toFixed(2) + '%;top:' + pos.top.toFixed(2) + '%"' +
            ' aria-label="' + esc(v.venue + ', ' + sessionText + '. Open in Google Maps') + '">' +
            '<span class="sched__pinlabel">' + esc(v.venue) + '</span></a>';
        }).join('') +
      '</div>';
    }

    function visible() {
      return D.classes.filter(function (v) {
        if (level === 'all') return true;
        return v.sessions.some(function (s) { return s.level === level; });
      });
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
          '<p class="vcard__addr">' + esc(v.addr) + (v.mrt ? ' · Nearest MRT: ' + esc(v.mrt) : '') + '</p>' +
          '<ul class="vcard__sessions">' + sessionsFor(v).map(function (s) {
            return '<li><span class="vcard__day">' + esc(s.day) + '</span>' +
              '<span class="vcard__time">' + esc(s.time) + '</span>' +
              '<span class="vcard__lvl vcard__lvl--' + esc(s.level.toLowerCase()) + '">' + esc(s.level) + '</span>' +
              (s.status ? '<span class="vcard__status">' + esc(s.status) + '</span>' : '') + '</li>';
          }).join('') + '</ul>' +
          '<div class="vcard__actions">' +
            '<a class="vcard__book" href="' + esc(v.book || BOOK) + '" target="_blank" rel="noopener">Book this class &rsaquo;</a>' +
            '<a class="vcard__gmaps" href="' + gmapsSearchUrl(v) + '" target="_blank" rel="noopener">Open in Google Maps &#8599;</a>' +
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
            '<a class="btn btn--primary" href="' + esc(m.signup || BOOK) + '" target="_blank" rel="noopener">Register for this camp</a>' +
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
        return '<article class="eshow">' +
          (cover ? '<button class="eshow__photo" type="button" data-gallery="' + eIndex + '" data-photo="0" aria-label="' + esc('View photos from ' + e.title) + '"><img class="eshow__cover" src="' + esc(cover) + '" alt="' + esc(e.title) + '" loading="lazy" decoding="async"></button>' : '') +
          '<div class="eshow__body">' +
            '<span class="eshow__type">' + esc(e.type) + '</span>' +
            '<h3>' + esc(e.title) + '</h3>' +
            '<p>' + esc(e.when) + ' · ' + esc(e.where) + '</p>' +
            '<div class="eshow__thumbs">' + photos.slice(1, 4).map(function (p, idx) {
              return '<button class="eshow__thumb" type="button" data-gallery="' + eIndex + '" data-photo="' + (idx + 1) + '" aria-label="' + esc('View ' + e.title + ' photo ' + (idx + 2)) + '">' +
                '<img src="' + esc(p) + '" alt="' + esc(e.title) + ' photo ' + (idx + 2) + '" loading="lazy" decoding="async"></button>';
            }).join('') + '</div>' +
            '<button class="eshow__more" type="button" data-gallery="' + eIndex + '" data-photo="0">View gallery</button>' +
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
          (c.profilePage === false ? '<p class="coach__more">Profile coming soon</p>' : '<p class="coach__more">View profile &rsaquo;</p>') +
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
