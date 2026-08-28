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
      return '<article class="path" id="' + p.key + '">' +
        '<span class="path__num">' + p.num + '</span>' +
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
    var mapFrame = null;

    function gmapsSearchUrl(v) {
      var addr = (v.addr || '').replace(/,?\s*S\d{6}.*/, '');
      return 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent((v.venue + ' ' + addr + ' Singapore').trim());
    }

    function drawMap() {
      if (!mapMount || mapFrame) return;
      mapFrame = document.createElement('iframe');
      mapFrame.className = 'sched__mapframe';
      mapFrame.setAttribute('title', 'Map of Élever class venues');
      mapFrame.setAttribute('loading', 'lazy');
      mapFrame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      mapFrame.setAttribute('allowfullscreen', '');
      mapFrame.src = 'https://maps.google.com/maps?q=' + encodeURIComponent('Singapore') + '&hl=en&z=11&output=embed';
      mapMount.appendChild(mapFrame);
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
              '<span class="vcard__lvl vcard__lvl--' + esc(s.level.toLowerCase()) + '">' + esc(s.level) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="vcard__actions">' +
            '<a class="vcard__book" href="' + BOOK + '" target="_blank" rel="noopener">Book this class &rsaquo;</a>' +
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

    var tt = el('campTimetable');
    if (tt && c.timetable) {
      tt.innerHTML = c.timetable.map(function (r) {
        return '<li><b>' + esc(r.time) + '</b><span>' + esc(r.what) + '</span></li>';
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
          '<a class="btn btn--ghost" href="#proposal">Request a proposal</a>' +
        '</article>';
      }).join('');
    }

    var services = el('eventServices');
    if (services && D.eventServices) {
      services.innerHTML = D.eventServices.map(function (s) { return '<div>' + esc(s) + '</div>'; }).join('');
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
        : '<p class="sched__empty">No public events on the calendar right now — <a href="#proposal">talk to us about running one</a>.</p>';
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

    function card(c, i) {
      return '<a class="coach" href="' + base + 'coaches/' + esc(c.slug) + '.html">' +
        '<div class="coach__img"><img src="' + base + esc(c.photo) + '" alt="' + esc(c.name) + '" width="640" height="640" loading="lazy" decoding="async"></div>' +
        '<div class="coach__body"><h3>' + esc(c.name) + '</h3>' +
          '<p class="coach__role">' + esc(c.role) + '</p>' +
          (c.cert ? '<span class="coach__cert">' + esc(c.cert) + '</span>' : '') +
          '<p class="coach__more">View profile &rsaquo;</p>' +
        '</div></a>';
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

  (function recGroups() {
    var mount = el('groupDir');
    if (!mount) return;
    var filters = el('groupFilters');
    var countEl = el('groupCount');
    var rows = D.recGroups || [];
    var region = 'all';

    var CLUBS = (D.racketRatings && D.racketRatings.features.filter(function (f) { return f.key === 'clubs'; })[0]) || null;
    var clubsHref = CLUBS ? CLUBS.href : 'https://www.racketratings.net/badminton/clubs';

    function emptyState(msg) {
      return '<div class="grpempty">' +
        '<p>' + esc(msg) + '</p>' +
        '<a class="btn btn--primary" href="' + esc(clubsHref) + '" target="_blank" rel="noopener">Browse clubs on Racket Ratings</a>' +
      '</div>';
    }

    function render() {
      var list = rows.filter(function (g) { return region === 'all' || g.region === region; });
      if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' group' : ' groups');

      if (!rows.length) {
        mount.innerHTML = emptyState('We are not featuring any local groups just yet — Racket Ratings Clubs has the live list, kept up to date by the groups themselves.');
        return;
      }
      if (!list.length) {
        mount.innerHTML = emptyState('No featured groups in that region yet. Racket Ratings Clubs lists many more across Singapore.');
        return;
      }

      mount.innerHTML = list.map(function (g) {
        return '<article class="grpcard">' +
          '<div class="grpcard__top">' +
            '<h4>' + esc(g.name) + sampleTag(g) + '</h4>' +
            '<span class="grpcard__region">' + esc(g.region) + '</span>' +
          '</div>' +
          '<dl class="grpcard__meta">' +
            '<div><dt>When</dt><dd>' + esc(g.day) + ' · ' + esc(g.time) + '</dd></div>' +
            '<div><dt>Where</dt><dd>' + esc(g.venue) + '</dd></div>' +
            '<div><dt>Level</dt><dd>' + esc(g.level) + '</dd></div>' +
            '<div><dt>Contact</dt><dd>' + esc(g.contact) + '</dd></div>' +
          '</dl>' +
          (g.rrClub ? '<a class="grpcard__rr" href="' + esc(g.rrClub) + '" target="_blank" rel="noopener">View this club on Racket Ratings &rsaquo;</a>' : '') +
        '</article>';
      }).join('');
    }

    if (filters) {
      var regions = ['all'].concat(rows.map(function (g) { return g.region; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; }).sort());
      filters.innerHTML = regions.map(function (r, i) {
        return '<button class="sched__filter' + (i === 0 ? ' is-active' : '') + '" data-region="' + esc(r) + '"' +
          ' aria-pressed="' + (i === 0) + '">' + (r === 'all' ? 'All regions' : esc(r)) + '</button>';
      }).join('');
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('.sched__filter');
        if (!b) return;
        region = b.getAttribute('data-region');
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
