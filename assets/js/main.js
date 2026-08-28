/* =====================================================================
   ÉLEVER BADMINTON — Interactive layer
   - Nav behaviour, magnetic buttons, 3D tilt, scroll reveals
   - SG Badminton Hub venue directory + world-tour calendar
   ===================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  /* Scroll reveals run immediately — no intro gate. */
  startReveals();


  /* =====================================================================
     4. NAV
     ===================================================================== */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  // Interior pages keep the solid treatment at all scroll positions —
  // unless they open on a dark .phead band, where the nav rides over it
  // transparently and only solidifies once scrolled past.
  var navSolid = nav && nav.classList.contains('nav--solid') &&
    !document.body.classList.contains('has-dark-head');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', navSolid || window.scrollY > 40);
    }, { passive: true });
  }
  if (burger) {
    burger.addEventListener('click', function () { 
      const isOpen = nav.classList.toggle('open'); 
      burger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { 
        nav.classList.remove('open'); 
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =====================================================================
     5. MAGNETIC BUTTONS + 3D TILT
     ===================================================================== */
  if (!isTouch && !reduce) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + mx * 0.3 + 'px,' + my * 0.4 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateY(' + px * 10 + 'deg) rotateX(' + (-py * 10) + 'deg) translateY(-6px)';
        el.style.setProperty('--gx', (px * 100 + 50) + '%');
        el.style.setProperty('--gy', (py * 100 + 50) + '%');
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }


  /* =====================================================================
     6. SCROLL REVEALS + COUNTERS + PARALLAX
     ===================================================================== */
  var revealObserver;

  /* Observe every .reveal not already handled. Safe to call repeatedly —
     pages.js injects content, so we re-scan rather than assuming the DOM
     was complete on first run. */
  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';
      revealObserver.observe(el);
    });
  }

  function startReveals() {
    if (!('IntersectionObserver' in window) || reduce) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      runCounters();
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = en.target.dataset.delay || 0;
          setTimeout(function () { en.target.classList.add('in'); }, d);
          revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    observeReveals();
    // Catch anything rendered after this tick (pages.js, late images).
    setTimeout(observeReveals, 0);
    window.addEventListener('load', observeReveals);
    runCounters();

    // section-tag parallax
    if (!reduce) {
      window.addEventListener('scroll', function () {
        document.querySelectorAll('[data-parallax]').forEach(function (el) {
          var speed = parseFloat(el.dataset.parallax);
          var rect = el.getBoundingClientRect();
          var off = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = 'translateY(' + off + 'px)';
        });
      }, { passive: true });
    }
  }

  function runCounters() {
    var hasIO = 'IntersectionObserver' in window;
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      // Without IntersectionObserver there is nothing to trigger the count-up,
      // so show the final figure rather than leaving a permanent 0.
      if (!hasIO) { el.textContent = target; return; }
      var io = new IntersectionObserver(function (ent) {
        if (ent[0].isIntersecting) {
          var start = null;
          (function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 1400, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(step); else el.textContent = target;
          })(performance.now());
          io.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(el);
    });
  }

  /* =====================================================================
     8. THE 2026 SEASON — every stop on the world tour
     ---------------------------------------------------------------------
     Two layers, so the section is never wrong and never blank:

     1. A baked-in calendar with real, sourced champions for every event
        that has finished. This renders instantly and is what shows if the
        device is offline.
     2. A self-updating layer that refreshes results from Wikipedia's
        2026 BWF World Tour winners table on load, caches them in
        localStorage for a day, and merges anything newer over layer 1.
        If that fetch fails for any reason, layer 1 simply stands.

     Status (done / live / upcoming) is always computed from the real clock
     against each event's own dates — nothing about it is hardcoded.
     ===================================================================== */
  (function seasonNews() {
    var mount = document.getElementById('newsTimeline');
    if (!mount) return;

    var BWF_CAL = 'https://corporate.bwfbadminton.com/events/calendar/2026/all/0/-1';

    var EVENTS = [
      { date: '6–11 January', start: '2026-01-06', end: '2026-01-11', name: 'Malaysia Open', grade: 'Super 1000', host: 'Kuala Lumpur, Malaysia', href: 'https://en.wikipedia.org/wiki/2026_Malaysia_Open_(badminton)', champions: { ms: 'Kunlavut Vitidsarn', ws: 'An Se-young', md: 'Kim Won-ho / Seo Seung-jae', wd: 'Liu Shengshu / Tan Ning', xd: 'Feng Yanzhe / Huang Dongping' } },
      { date: '13–18 January', start: '2026-01-13', end: '2026-01-18', name: 'India Open', grade: 'Super 750', host: 'New Delhi, India', href: 'https://en.wikipedia.org/wiki/2026_India_Open', champions: { ms: 'Lin Chun-yi', ws: 'An Se-young', md: 'Liang Weikeng / Wang Chang', wd: 'Liu Shengshu / Tan Ning', xd: 'Dechapol Puavaranukroh / Supissara Paewsampran' } },
      { date: '20–25 January', start: '2026-01-20', end: '2026-01-25', name: 'Indonesia Masters', grade: 'Super 500', host: 'Jakarta, Indonesia', href: 'https://en.wikipedia.org/wiki/2026_Indonesia_Masters', champions: { ms: 'Alwi Farhan', ws: 'Chen Yufei', md: 'Goh Sze Fei / Nur Izzuddin', wd: 'Pearly Tan / Thinaah Muralitharan', xd: 'Chen Tang Jie / Toh Ee Wei' } },
      { date: '27 January–1 February', start: '2026-01-27', end: '2026-02-01', name: 'Thailand Masters', grade: 'Super 300', host: 'Bangkok, Thailand', href: 'https://en.wikipedia.org/wiki/2026_Thailand_Masters_(badminton)', champions: { ms: 'Zaki Ubaidillah', ws: 'Devika Sihag', md: 'Leo Rolly Carnando / Bagas Maulana', wd: 'Amallia Cahaya Pratiwi / Siti Fadia Silva Ramadhanti', xd: 'Adnan Maulana / Indah Cahya Sari Jamil' } },
      { date: '24 February–1 March', start: '2026-02-24', end: '2026-03-01', name: 'German Open', grade: 'Super 300', host: 'Mülheim, Germany', href: 'https://en.wikipedia.org/wiki/2026_German_Open_(badminton)', champions: { ms: 'Christo Popov', ws: 'Han Qianxi', md: 'Chen Boyang / Liu Yi', wd: 'Bao Lijing / Luo Xumin', xd: 'Cheng Xing / Zhang Chi' } },
      { date: '3–8 March', start: '2026-03-03', end: '2026-03-08', name: 'All England Open', grade: 'Super 1000', host: 'Birmingham, England', href: 'https://en.wikipedia.org/wiki/2026_All_England_Open', champions: { ms: 'Lin Chun-yi', ws: 'Wang Zhiyi', md: 'Kim Won-ho / Seo Seung-jae', wd: 'Liu Shengshu / Tan Ning', xd: 'Ye Hong-wei / Nicole Gonzales Chan' } },
      { date: '10–15 March', start: '2026-03-10', end: '2026-03-15', name: 'Swiss Open', grade: 'Super 300', host: 'Basel, Switzerland', href: 'https://en.wikipedia.org/wiki/2026_Swiss_Open_(badminton)', champions: { ms: 'Yushi Tanaka', ws: 'Supanida Katethong', md: 'Lee Fang-chih / Lee Fang-jen', wd: 'Li Yijing / Wang Yiduo', xd: 'Cheng Xing / Zhang Chi' } },
      { date: '17–22 March', start: '2026-03-17', end: '2026-03-22', name: 'Orléans Masters', grade: 'Super 300', host: 'Orléans, France', href: 'https://en.wikipedia.org/wiki/2026_Orléans_Masters', champions: { ms: 'Alex Lanier', ws: 'Nozomi Okuhara', md: 'Hu Keyuan / Lin Xiangyi', wd: 'Sumire Nakade / Miyu Takahashi', xd: 'Thom Gicquel / Delphine Delrue' } },
      { date: '12–17 May', start: '2026-05-12', end: '2026-05-17', name: 'Thailand Open', grade: 'Super 500', host: 'Bangkok, Thailand', href: 'https://en.wikipedia.org/wiki/2026_Thailand_Open_(badminton)', champions: { ms: 'Anders Antonsen', ws: 'Akane Yamaguchi', md: 'Leo Rolly Carnando / Daniel Marthin', wd: 'Bao Lijing / Cao Zihan', xd: 'Mathias Christiansen / Alexandra Bøje' } },
      { date: '19–24 May', start: '2026-05-19', end: '2026-05-24', name: 'Malaysia Masters', grade: 'Super 500', host: 'Kuala Lumpur, Malaysia', href: 'https://en.wikipedia.org/wiki/2026_Malaysia_Masters', champions: { ms: 'Li Shifeng', ws: 'Ratchanok Intanon', md: 'Daniel Lundgaard / Mads Vestergaard', wd: 'Chen Fanshutian / Luo Xumin', xd: 'Gao Jiaxuan / Wei Yaxin' } },
      { date: '26–31 May', start: '2026-05-26', end: '2026-05-31', name: 'Singapore Open', grade: 'Super 750', host: 'Singapore', href: 'https://en.wikipedia.org/wiki/2026_Singapore_Open_(badminton)', champions: { ms: 'Alex Lanier', ws: 'An Se-young', md: 'Satwiksairaj Rankireddy / Chirag Shetty', wd: 'Jia Yifan / Zhang Shuxian', xd: 'Mathias Christiansen / Alexandra Bøje' } },
      { date: '2–7 June', start: '2026-06-02', end: '2026-06-07', name: 'Indonesia Open', grade: 'Super 1000', host: 'Jakarta, Indonesia', href: 'https://en.wikipedia.org/wiki/2026_Indonesia_Open', champions: { ms: 'Victor Lai', ws: 'An Se-young', md: 'Goh Sze Fei / Nur Izzuddin', wd: 'Yuki Fukushima / Mayu Matsumoto', xd: 'Mathias Christiansen / Alexandra Bøje' } },
      { date: '9–14 June', start: '2026-06-09', end: '2026-06-14', name: 'Australian Open', grade: 'Super 500', host: 'Sydney, Australia', href: 'https://en.wikipedia.org/wiki/2026_Australian_Open_(badminton)', champions: { ms: 'Alwi Farhan', ws: 'Akane Yamaguchi', md: 'Chen Boyang / Liu Yi', wd: 'Jia Yifan / Zhang Shuxian', xd: 'Feng Yanzhe / Huang Dongping' } },
      { date: '16–21 June', start: '2026-06-16', end: '2026-06-21', name: 'Macau Open', grade: 'Super 300', host: 'Macau, China', href: 'https://en.wikipedia.org/wiki/2026_Macau_Open_(badminton)', champions: { ms: 'Hu Zhe\'an', ws: 'Kim Ga-eun', md: 'Jin Yong / Lee Jong-min', wd: 'Bao Lijing / Cao Zihan', xd: 'Jiang Zhenbang / Wei Yaxin' } },
      { date: '23–28 June', start: '2026-06-23', end: '2026-06-28', name: 'U.S. Open', grade: 'Super 300', host: 'Fullerton, California, United States', href: 'https://en.wikipedia.org/wiki/2026_U.S._Open_(badminton)', champions: { ms: 'Su Li-yang', ws: 'Line Christophersen', md: 'Hiroki Okamura / Kyohei Yamashita', wd: 'Sumire Nakade / Miyu Takahashi', xd: 'Liu Kuang-heng / Hsu Yin-hui' } },
      { date: '30 June–5 July', start: '2026-06-30', end: '2026-07-05', name: 'Canada Open', grade: 'Super 300', host: 'Markham, Canada', href: 'https://en.wikipedia.org/wiki/2026_Canada_Open', champions: { ms: 'Yudai Okimoto', ws: 'Riko Gunji', md: 'Hiroki Okamura / Kyohei Yamashita', wd: 'Hinata Suzuki / Nao Yamakita', xd: 'Akira Koga / Natsu Saito' } },
      { date: '14–19 July', start: '2026-07-14', end: '2026-07-19', name: 'Japan Open', grade: 'Super 750', host: 'Tokyo, Japan', href: 'https://en.wikipedia.org/wiki/2026_Japan_Open', champions: { ms: 'Christo Popov', ws: 'P. V. Sindhu', md: 'Fajar Alfian / Muhammad Shohibul Fikri', wd: 'Kim Hye-jeong / Kong Hee-yong', xd: 'Feng Yanzhe / Huang Dongping' } },
      { date: '21–26 July', start: '2026-07-21', end: '2026-07-26', name: 'China Open', grade: 'Super 1000', host: 'Changzhou, Jiangsu, China', href: 'https://en.wikipedia.org/wiki/2026_China_Open_(badminton)', champions: { ms: 'Chou Tien-chen', ws: 'Akane Yamaguchi', md: 'Fajar Alfian / Muhammad Shohibul Fikri', wd: 'Liu Shengshu / Tan Ning', xd: 'Guo Xinwa / Chen Fanghui' } },
      { date: '28 July–2 August', start: '2026-07-28', end: '2026-08-02', name: 'Taipei Open', grade: 'Super 300', host: 'Taipei, Taiwan', href: 'https://en.wikipedia.org/wiki/2026_Taipei_Open', champions: { ms: 'Yudai Okimoto', ws: 'Tanvi Sharma', md: 'Leo Rolly Carnando / Daniel Marthin', wd: 'Sumire Nakade / Miyu Takahashi', xd: 'Yuta Watanabe / Maya Taguchi' } },
      { date: '4–9 August', start: '2026-08-04', end: '2026-08-09', name: 'Korea Masters', grade: 'Super 300', host: 'Asan, Korea', href: 'https://en.wikipedia.org/wiki/2026_Korea_Masters', champions: { ms: 'Zhu Xuanchen', ws: 'Ashmita Chaliha', md: 'Tee Kai Wun / Yap Roy King', wd: 'Luo Yi / Wang Tingge', xd: 'Yuta Watanabe / Maya Taguchi' } },
      { date: '17–23 August', start: '2026-08-17', end: '2026-08-23', name: 'World Championships', grade: 'World Championships', host: 'New Delhi, India', href: 'https://en.wikipedia.org/wiki/2026_BWF_World_Championships', champions: { ms: 'Alex Lanier', ws: 'An Se-young', md: 'Liang Weikeng / Wang Chang', wd: 'Baek Ha-na / Lee So-hee', xd: 'Thom Gicquel / Delphine Delrue' } },
      { date: '1–6 September', start: '2026-09-01', end: '2026-09-06', name: 'China Masters', grade: 'Super 750', host: 'Shenzhen, China', href: 'https://en.wikipedia.org/wiki/2026_China_Masters' },
      { date: '22–27 September', start: '2026-09-22', end: '2026-09-27', name: 'Vietnam Open', grade: 'Super 100', host: 'Ho Chi Minh City, Vietnam' },
      { date: '6–11 October', start: '2026-10-06', end: '2026-10-11', name: 'Arctic Open', grade: 'Super 500', host: 'Vantaa, Finland', href: 'https://en.wikipedia.org/wiki/2026_Arctic_Open' },
      { date: '13–18 October', start: '2026-10-13', end: '2026-10-18', name: 'Denmark Open', grade: 'Super 750', host: 'Odense, Denmark' },
      { date: '20–25 October', start: '2026-10-20', end: '2026-10-25', name: 'French Open', grade: 'Super 750', host: 'Paris, France' },
      { date: '27 October–1 November', start: '2026-10-27', end: '2026-11-01', name: 'Hylo Open', grade: 'Super 500', host: 'Saarbrücken, Germany' },
      { date: '3 November–8 November', start: '2026-11-03', end: '2026-11-08', name: 'Korea Open', grade: 'Super 500', host: 'Yeosu, Korea', href: 'https://en.wikipedia.org/wiki/2026_Korea_Open_(badminton)' },
      { date: '10 November–15 November', start: '2026-11-10', end: '2026-11-15', name: 'Japan Masters', grade: 'Super 500', host: 'Kumamoto, Japan', href: 'https://en.wikipedia.org/wiki/2026_Japan_Masters' },
      { date: '17 November–22 November', start: '2026-11-17', end: '2026-11-22', name: 'Hong Kong Open', grade: 'Super 500', host: 'Kowloon, Hong Kong', href: 'https://en.wikipedia.org/wiki/2026_Hong_Kong_Open_(badminton)' },
      { date: '17 November–22 November', start: '2026-11-17', end: '2026-11-22', name: 'Syed Modi International', grade: 'Super 300', host: 'Lucknow, India', href: 'https://en.wikipedia.org/wiki/2026_Syed_Modi_International' },
      { date: '9–13 December', start: '2026-12-09', end: '2026-12-13', name: 'BWF World Tour Finals', grade: 'Season finale', host: 'Hangzhou, China', note: 'The top eight in each discipline close the season.' }
    ];

    /* ---------- self-updating results ---------- */
    var CACHE_KEY = 'eleverBwf2026Results';
    var CACHE_TTL = 24 * 60 * 60 * 1000;          // re-check at most once a day
    var WIKI_API = 'https://en.wikipedia.org/w/api.php?action=parse' +
      '&page=2026_BWF_World_Tour&prop=wikitext&format=json&formatversion=2&origin=*';

    var liveResults = null;      // { '<tournament name>': {ms,ws,md,wd,xd} }
    var liveStamp = null;        // when those results were fetched

    function readCache() {
      try {
        var raw = window.localStorage && localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        var obj = JSON.parse(raw);
        if (!obj || !obj.at || !obj.results) return null;
        return obj;
      } catch (e) { return null; }
    }
    function writeCache(results) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), results: results }));
      } catch (e) { /* private mode or quota — the baked-in results still work */ }
    }

    var BOLD = /'''/g;

    /* Turn one wikitext cell into a plain name (or a doubles pair). */
    function cleanCell(cell) {
      return String(cell)
        .replace(/^\s*(?:rowspan|colspan)="?\d+"?\s*\|/, '')
        .replace(/\{\{flagicon\|?[^}]*\}\}/g, '')
        .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
        .replace(/\[\[([^\]]*)\]\]/g, '$1')
        .replace(BOLD, '')
        .replace(/<br\s*\/?>/gi, ' / ')
        .replace(/<[^>]+>/g, '')
        .replace(/\{\{[^}]*\}\}/g, '')
        .replace(/\s+/g, ' ')
        .replace(/^[\s|/]+|[\s|/]+$/g, '');
    }

    /* Parse the "Winners" table into { tournament: {ms,ws,md,wd,xd} }.
       Mirrors the table's rowspan behaviour, where one winner cell can
       cover two tournaments. */
    function parseWinners(wikitext) {
      var i = wikitext.indexOf('== Winners ==');
      if (i < 0) return null;
      var j = wikitext.indexOf('\n==', i + 5);
      var tbl = j < 0 ? wikitext.slice(i) : wikitext.slice(i, j);

      var rows = tbl.split('\n|-');
      var out = {};
      var carry = {};                              // col -> [value, rowsLeft]
      var KEYS = ['ms', 'ws', 'md', 'wd', 'xd'];

      rows.forEach(function (r) {
        var lines = r.split('\n');
        var isHeader = lines.some(function (l) {
          return l.trim().charAt(0) === '!' && l.indexOf('colspan') > -1;
        });
        if (isHeader) return;

        var cells = [];
        lines.forEach(function (line) {
          if (line.charAt(0) !== '|' || line.slice(0, 2) === '|-') return;
          cells = cells.concat(line.slice(1).split('||'));
        });
        if (cells.length < 2) return;

        var name = cleanCell(cells[0]);
        if (!name || name === 'Report') return;

        var src = cells.slice(2);
        var vals = {};
        var k = 0;
        for (var col = 0; col < 5; col++) {
          if (carry[col] && carry[col][1] > 0) {
            vals[KEYS[col]] = carry[col][0];
            carry[col][1] -= 1;
          } else if (k < src.length) {
            var raw = src[k]; k += 1;
            var v = cleanCell(raw);
            vals[KEYS[col]] = v;
            var m = /rowspan="?(\d+)"?/.exec(raw);
            if (m && v) carry[col] = [v, Number(m[1]) - 1];
          }
        }
        var any = KEYS.some(function (key) { return vals[key]; });
        if (any) out[name] = vals;
      });
      return out;
    }

    /* Names differ slightly between our calendar and Wikipedia's table
       (e.g. "Orleans Masters" vs "Orleans Masters"), so compare loosely. */
    function normName(n) {
      var s = String(n).toLowerCase();
      if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
      return s.replace(/[^a-z0-9]/g, '');
    }

    function championsFor(ev) {
      if (liveResults) {
        var want = normName(ev.name);
        for (var key in liveResults) {
          if (!Object.prototype.hasOwnProperty.call(liveResults, key)) continue;
          if (normName(key) === want) {
            var r = liveResults[key];
            if (r && (r.ms || r.ws || r.md || r.wd || r.xd)) return r;
          }
        }
      }
      return ev.champions || null;
    }

    function refreshResults() {
      var cached = readCache();
      if (cached) {
        liveResults = cached.results;
        liveStamp = cached.at;
        render();
        // Still fresh — no need to hit the network again today.
        if (Date.now() - cached.at < CACHE_TTL) return;
      }
      if (!window.fetch) return;

      fetch(WIKI_API, { mode: 'cors', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          var text = d && d.parse && d.parse.wikitext;
          if (!text) return;
          var parsed = parseWinners(text);
          if (!parsed) return;
          var n = 0;
          for (var key in parsed) { if (parsed[key]) n++; }
          if (!n) return;
          liveResults = parsed;
          liveStamp = Date.now();
          writeCache(parsed);
          render();
        })
        .catch(function () { /* keep the baked-in results */ });
    }

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    function dayStamp(iso) {
      var parts = String(iso).split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }

    function eventStatus(ev, today) {
      // Compared on whole days, so an event is "done" only after its last day.
      if (today > dayStamp(ev.end)) return 'done';
      if (today < dayStamp(ev.start)) return 'upcoming';
      return 'live';
    }

    function dateLabel(ev) { return ev.date + ' 2026'; }

    var DISCIPLINE = [
      ['ms', 'Men’s singles'], ['ws', 'Women’s singles'],
      ['md', 'Men’s doubles'], ['wd', 'Women’s doubles'],
      ['xd', 'Mixed doubles']
    ];

    function championsHtml(c) {
      var rows = DISCIPLINE.filter(function (d) { return c[d[0]]; }).map(function (d) {
        return '<li><span class="ncard__disc">' + d[1] + '</span>' +
          '<span class="ncard__winner">' + esc(c[d[0]]) + '</span></li>';
      }).join('');
      return rows ? '<ul class="ncard__champs">' + rows + '</ul>' : '';
    }

    var VISIBLE = 4;
    var expanded = false;
    var currentFilter = 'all';

    function render() {
      // Recomputed every render, so the page stays right even if the tab has
      // been left open across midnight.
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      var normalised = EVENTS.map(function (ev) {
        var copy = {};
        for (var k in ev) { if (Object.prototype.hasOwnProperty.call(ev, k)) copy[k] = ev[k]; }
        copy.status = eventStatus(copy, today);
        return copy;
      });

      var done = normalised.filter(function (e) { return e.status === 'done'; })
        .sort(function (a, b) { return dayStamp(b.end) - dayStamp(a.end); });
      var live = normalised.filter(function (e) { return e.status === 'live'; });
      var up = normalised.filter(function (e) { return e.status === 'upcoming'; })
        .sort(function (a, b) { return dayStamp(a.start) - dayStamp(b.start); });

      var list;
      if (currentFilter === 'done') list = done;
      else if (currentFilter === 'upcoming') list = live.concat(up);
      else list = live.concat(done).concat(up);

      var shown = expanded ? list : list.slice(0, VISIBLE);
      var latestDoneName = done.length ? done[0].name : '';

      mount.innerHTML = shown.map(function (ev) {
        var cls = 'ncard' +
          (ev.name === latestDoneName ? ' ncard--latest' : '') +
          (ev.status === 'upcoming' ? ' ncard--next' : '') +
          (ev.status === 'live' ? ' ncard--live' : '');
        var badge = ev.status === 'live' ? ' · Live now'
          : (ev.name === latestDoneName ? ' · Latest result'
          : (ev.status === 'upcoming' ? ' · Upcoming' : ''));

        var champs = ev.status === 'done' ? championsFor(ev) : null;
        var body;
        if (champs) {
          body = championsHtml(champs);
        } else if (ev.status === 'done') {
          body = '<p class="ncard__result ncard__result--muted">Finished — champions not published yet. ' +
            'Open the official BWF page for the full draw.</p>';
        } else if (ev.status === 'live') {
          body = '<p class="ncard__result">Being played now. Open BWF for live draws and scores.</p>';
        } else {
          body = '<p class="ncard__result">' +
            esc(ev.note || ('Starts ' + ev.date + '. Draws and entries on BWF.')) + '</p>';
        }

        return '<article class="' + cls + '">' +
          '<div class="ncard__head">' +
            '<span class="ncard__date">' + esc(dateLabel(ev)) + badge + '</span>' +
            '<span class="ncard__grade">' + esc(ev.grade) + '</span>' +
          '</div>' +
          '<h4 class="ncard__name">' + esc(ev.name) + '</h4>' +
          (ev.host ? '<p class="ncard__host">' + esc(ev.host) + '</p>' : '') +
          body +
          '<a class="ncard__link" href="' + esc(ev.href || BWF_CAL) + '" target="_blank" rel="noopener">' +
            (ev.status === 'done' ? 'Full draw and scores' : 'Tournament details') + ' ↗</a>' +
        '</article>';
      }).join('');

      if (toggleBtn) {
        if (list.length > VISIBLE) {
          toggleBtn.style.display = '';
          toggleBtn.textContent = expanded ? 'Show less' : 'Show all ' + list.length + ' tournaments';
          toggleBtn.setAttribute('aria-expanded', String(expanded));
        } else {
          toggleBtn.style.display = 'none';
        }
      }

      // The "updated" line reflects real data rather than a date typed into
      // the markup, so it can never go stale on its own.
      var stampEl = document.getElementById('newsStamp');
      if (stampEl) {
        var n = normalised.filter(function (e) { return e.status === 'done'; }).length;
        var src = liveStamp
          ? 'Results last refreshed ' + new Date(liveStamp).toLocaleDateString('en-GB',
              { day: 'numeric', month: 'short', year: 'numeric' }) + '.'
          : 'Showing our verified results for the season so far.';
        stampEl.textContent = n + ' of ' + EVENTS.length + ' events completed. ' + src;
      }
    }

    var toggleBtn = document.getElementById('newsToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () { expanded = !expanded; render(); });
    }

    var filters = document.getElementById('newsFilters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('.news__filter');
        if (!btn) return;
        filters.querySelectorAll('.news__filter').forEach(function (b) {
          b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active'); btn.setAttribute('aria-pressed', 'true');
        currentFilter = btn.dataset.filter;
        expanded = false;
        render();
      });
    }

    /* Published so the Team Singapore panel can list the same upcoming
       events without keeping a second copy of the calendar. */
    window.ELEVER_SEASON = EVENTS;

    render();
    refreshResults();
  })();


  /* =====================================================================
     10. SG BADMINTON HUB — venue directory, booking guide, groups
         Tabs + searchable / filterable directory of Singapore halls.
         Addresses from Google Maps & the official SportSG dataset.
     ===================================================================== */
  (function sgHub() {
    var hub = document.getElementById('hub');
    if (!hub) return;

    // type: 'private' | 'activesg' | 'club' | 'elever'
    // elever: true on any venue where Élever runs regular classes (cross-cutting).
    // book: direct booking URL where publicly available; otherwise omitted.
    // The English name/area/meta below are the fallback / default-language values.
    /* Booking links were re-verified on 29 Aug 2026.
       `book`      — a URL that actually reaches a booking flow.
       `bookLabel` — what the button says.
       `bookNote`  — how booking really works, shown under the buttons.
       `bookable: false` — no public online booking. These render an honest
       note instead of a button that goes nowhere. Schools and community
       clubs Élever teaches at are not public court-hire venues, so they
       link to our own class booking rather than a court-hire page. */
    var VENUES = [
      // ---------- PRIVATE HALLS ----------
      { id: 'wyse', name: 'Wyse Active Hub', area: 'Jurong East', type: 'private', addr: '1 Venture Avenue, #03-01, Perennial Business City, S608521', meta: 'Air-conditioned \u00b7 32 courts (SG\u2019s largest)', book: 'https://wyseactivehub.rezerv.co/', bookLabel: 'Book on Rezerv', bookNote: 'Court booking runs on Rezerv (also in the Dungeon app).', elever: true },
      { id: 'fernvale', name: 'Fernvale Village', area: 'Sengkang', type: 'private', addr: '61 Fernvale Link, S799956', meta: 'Air-conditioned \u00b7 badminton & pickleball', book: 'https://booking.fernvalevillage.com/', bookLabel: 'Book a court', elever: true },
      { id: 'arina', name: 'The Sports Arina @ Jalan Kayu', area: 'Sengkang West', type: 'private', addr: '28 Fernvale Road, S799951', meta: 'Air-conditioned \u00b7 4 badminton courts', book: 'https://playtomic.com/clubs/tsa-jalan-kayu', bookLabel: 'Book on Playtomic', bookNote: 'Bookings are handled in the Playtomic app.' },
      { id: 'sbhsims', name: 'Singapore Badminton Hall (SBH @ Sims)', area: 'Geylang', type: 'private', addr: '1 Lorong 23 Geylang, S388352', meta: '16 courts + VIP \u00b7 Tel 6744 4111', book: 'https://playtomic.com/clubs/sbh-sims', bookLabel: 'Book on Playtomic', bookNote: 'SBH moved court booking to Playtomic in Aug 2025.', elever: true },
      { id: 'sbhexpo', name: 'SBH East Coast @ Expo', area: 'Changi', type: 'private', addr: 'Singapore Expo, Carpark J, Changi South Ave 1, S486150', meta: 'SG\u2019s largest private hall \u00b7 22+ courts', book: 'https://playtomic.com/clubs/sbh-east-coast-expo', bookLabel: 'Book on Playtomic', bookNote: 'SBH moved court booking to Playtomic in Aug 2025.', elever: true },
      { id: 'obapasirris', name: 'OBA Arena @ Pasir Ris', area: 'Pasir Ris', type: 'private', addr: '3A Pasir Ris Drive 6, S519422', meta: 'Academy-operated arena', book: 'https://www.optimumbadmintonacademy.com/', bookLabel: 'Booking info' },
      { id: 'obapunggol', name: 'OBA Arena @ Punggol', area: 'Punggol', type: 'private', addr: '11 Northshore Drive, S828670', meta: 'Covered arena', book: 'https://www.optimumbadmintonacademy.com/court-booking', bookLabel: 'Book a court', bookNote: 'Court hire is arranged through Optimum Badminton Academy.' },
      { id: 'citysprouts', name: 'City Sprouts @ Bedok', area: 'Bedok', type: 'private', addr: '200 Bedok North Avenue 1', meta: 'Community hub \u00b7 courts by XY Badminton', book: 'https://xyacademy.rezerv.co/', bookLabel: 'Book on Rezerv' },
      { id: 'kff', name: 'KFF Badminton Arena / Singapore Badminton Stadium', area: 'Geylang', type: 'private', addr: '100 Guillemard Road, S399718', meta: 'Historic SBA venue \u00b7 12 courts (reopened 2025)', book: 'https://booking.singaporebadminton.org.sg/', bookLabel: 'Book a court', bookNote: 'Run by the Singapore Badminton Association on its own booking site.', elever: true },
      { id: 'smash', name: 'Smash Arena', area: 'Joo Koon', type: 'private', addr: '511 Upper Jurong Road, D\u2019Arena, Blk B L2, S638366', meta: '9 doubles + 1 single \u00b7 Taraflex flooring', book: 'https://booking.smasharena.sg/', bookLabel: 'Book a court' },
      { id: 'cereza', name: 'Cereza Sports Hall', area: 'Eunos', type: 'private', addr: '3 Chin Cheng Avenue, S429401', meta: '4 courts \u00b7 rubber-mat flooring', book: 'https://cereza.skedda.com/booking', bookLabel: 'Book on Skedda' },
      // Kovan's old kovansports.com domain has lapsed and now redirects to an
      // unrelated site, so no URL is linked — only the number that still works.
      { id: 'kovan', name: 'Kovan Sports Centre', area: 'Hougang', type: 'private', addr: '60 Hougang Street 21, S538738', meta: 'Indoor courts', bookable: false, bookNote: 'No online booking \u2014 call 6286 0256 to check court availability.', phone: '+6562860256' },

      // ---------- ACTIVESG PUBLIC SPORT CENTRES ----------
      { id: 'ocbc', name: 'OCBC Arena', area: 'Kallang', type: 'activesg', addr: '5 Stadium Drive, S397631 (Singapore Sports Hub)', meta: 'Air-conditioned arena', book: 'https://www.sportshub.com.sg/', bookLabel: 'Booking info' },
      { id: 'oth', name: 'Our Tampines Hub — Tampines Sport Centre', area: 'Tampines', type: 'activesg', addr: '1 Tampines Walk, S528523', meta: 'Flagship ActiveSG hall \u00b7 ~20 courts' },
      { id: 'bishan', name: 'Bishan Sport Centre', area: 'Bishan', type: 'activesg', addr: '5 Bishan Street 14, S579783' },
      { id: 'canberra', name: 'Bukit Canberra Sport Centre', area: 'Sembawang', type: 'activesg', addr: '21 Canberra Link, S756973' },
      { id: 'gombak', name: 'Bukit Gombak Sport Centre', area: 'Bukit Batok', type: 'activesg', addr: '810 Bukit Batok West Ave 5, S659088' },
      { id: 'cck', name: 'Choa Chu Kang Sport Centre', area: 'Choa Chu Kang', type: 'activesg', addr: '1 Choa Chu Kang Street 53, S689236' },
      { id: 'clementi', name: 'Clementi Sport Centre', area: 'Clementi', type: 'activesg', addr: '518 Clementi Avenue 3, S129907' },
      { id: 'delta', name: 'Delta Sport Centre', area: 'Tiong Bahru', type: 'activesg', addr: '900 Tiong Bahru Road, S158790' },
      { id: 'heartbeat', name: 'Heartbeat @ Bedok Sport Centre', area: 'Bedok', type: 'activesg', addr: '11 Bedok North Street 1, S469662' },
      { id: 'hougang', name: 'Hougang Sport Centre', area: 'Hougang', type: 'activesg', addr: '93 Hougang Avenue 4, S538832' },
      { id: 'jurongeast', name: 'Jurong East Sport Centre', area: 'Jurong East', type: 'activesg', addr: '21 Jurong East Street 31, S609517' },
      { id: 'jurongwest', name: 'Jurong West Sport Centre', area: 'Jurong West', type: 'activesg', addr: '20 Jurong West Street 93, S648965' },
      { id: 'pasirris', name: 'Pasir Ris Sport Centre', area: 'Pasir Ris', type: 'activesg', addr: '120 Pasir Ris Central, S519640' },
      { id: 'queenstown', name: 'Queenstown Sport Centre', area: 'Queenstown', type: 'activesg', addr: '473 Stirling Road, S148948' },
      { id: 'sengkang', name: 'Sengkang Sport Centre', area: 'Sengkang', type: 'activesg', addr: '57 Anchorvale Road, S544964' },
      { id: 'senja', name: 'Senja-Cashew Sport Centre', area: 'Bukit Panjang', type: 'activesg', addr: '101 Bukit Panjang Road, S679910' },
      { id: 'serangoon', name: 'Serangoon Sport Centre', area: 'Serangoon', type: 'activesg', addr: '35 Yio Chu Kang Road, S545552' },
      { id: 'wilfred', name: 'St. Wilfred Sport Centre', area: 'Kallang', type: 'activesg', addr: '3 St. Wilfred Road, S327920' },
      { id: 'toapayoh', name: 'Toa Payoh Sport Centre', area: 'Toa Payoh', type: 'activesg', addr: '301 Lorong 6 Toa Payoh, S319392' },
      { id: 'woodlands', name: 'Woodlands Sport Centre', area: 'Woodlands', type: 'activesg', addr: '1 Woodlands Street 13, S738597' },
      { id: 'yck', name: 'Yio Chu Kang Sport Centre', area: 'Ang Mo Kio', type: 'activesg', addr: '200 Ang Mo Kio Avenue 9, S569770' },
      { id: 'yishun', name: 'Yishun Sport Centre', area: 'Yishun', type: 'activesg', addr: '101 Yishun Avenue 1, S769130' },
      { id: 'evans', name: 'MOE (Evans) Sport Hall', area: 'Bukit Timah', type: 'activesg', addr: '21 Evans Road, S259366' },

      // ---------- COUNTRY / SOCIAL CLUBS (members) ----------
      // Members-only. Links go to the club's own public facility page rather
      // than a member-login wall a non-member cannot get past.
      { id: 'csc', name: 'Chinese Swimming Club', area: 'Katong', type: 'club', addr: '21 Amber Road, S439870', meta: 'Members only', book: 'https://www.chineseswimmingclub.org.sg/facilities-services/overview/book-a-venue/', bookLabel: 'Venue booking info', bookNote: 'Members only \u2014 book through the club\u2019s member portal.' },
      { id: 'ssc', name: 'Singapore Swimming Club', area: 'Tanjong Rhu', type: 'club', addr: '45 Tanjong Rhu Road, S436899', meta: 'Members only', book: 'https://www.sswimclub.org.sg/', bookLabel: 'Club website', bookNote: 'Members only \u2014 courts are booked in the members\u2019 portal after login.' },
      { id: 'warren', name: 'Warren Golf & Country Club', area: 'Dover', type: 'club', addr: '23 Folkestone Road, S139599', meta: 'Members only \u00b7 Tel 6778 0127', book: 'https://warren.org.sg/sports-facilities/', bookLabel: 'Facilities info', bookNote: 'Members only \u2014 contact the club to check court availability.', phone: '+6567780127' },

      // ---------- ÉLEVER REGULAR CLASS VENUES (schools & community clubs) ----------
      // These are not public court-hire venues: school halls are used under a
      // hire arrangement and CC courts are balloted on OnePA. Linking a "book a
      // court" button here would be misleading, so each one links to the thing
      // a visitor can actually do — book an Élever class at that venue.
      { id: 'acsbarker', name: 'Anglo-Chinese School (Barker Road)', area: 'Newton', type: 'elever', addr: '60 Barker Road, S309919', meta: '\u00c9lever class venue \u00b7 school hall', book: 'https://app.eleverbadminton.com/', bookLabel: 'Book an \u00c9lever class', bookNote: 'School hall \u2014 not open for public court hire. Élever classes run here.', elever: true },
      { id: 'bidadari', name: 'Bidadari Community Club', area: 'Bidadari', type: 'elever', addr: '11 Bidadari Park Drive, S367905', meta: '\u00c9lever class venue \u00b7 community club', book: 'https://app.eleverbadminton.com/', bookLabel: 'Book an \u00c9lever class', bookNote: 'CC courts are balloted on OnePA; Élever classes are booked with us.', altBook: 'https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS', altBookLabel: 'Public courts on OnePA', elever: true },
      { id: 'cantonment', name: 'Cantonment Primary School', area: 'Tanjong Pagar', type: 'elever', addr: '1 Cantonment Close, S088256', meta: '\u00c9lever class venue \u00b7 school hall', book: 'https://app.eleverbadminton.com/', bookLabel: 'Book an \u00c9lever class', bookNote: 'School hall \u2014 not open for public court hire. Élever classes run here.', elever: true },
      { id: 'northvista', name: 'North Vista Primary School', area: 'Sengkang', type: 'elever', addr: '31 Rivervale Drive, S545132', meta: '\u00c9lever class venue \u00b7 school hall', book: 'https://app.eleverbadminton.com/', bookLabel: 'Book an \u00c9lever class', bookNote: 'School hall \u2014 not open for public court hire. Élever classes run here.', elever: true },
      { id: 'scgs', name: "Singapore Chinese Girls' School", area: 'Novena', type: 'elever', addr: '190 Dunearn Road, S309437', meta: '\u00c9lever class venue \u00b7 school hall', book: 'https://app.eleverbadminton.com/', bookLabel: 'Book an \u00c9lever class', bookNote: 'School hall \u2014 not open for public court hire. Élever classes run here.', elever: true }
    ];

    var ACTIVESG_BOOK = 'https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues';

    function loc(v) { return { name: v.name, area: v.area, meta: v.meta }; }

    var TYPE_LABEL = {
      private: 'Private hall', activesg: 'ActiveSG', dus: 'ActiveSG DUS',
      club: 'Club / CC', elever: 'Élever venue'
    };

    var grid = document.getElementById('hallGrid');
    var countEl = document.getElementById('hallCount');
    var searchEl = document.getElementById('hallSearch');
    var filtersEl = document.getElementById('hallFilters');
    var tabsEl = document.getElementById('hubTabs');
    var panels = hub.querySelectorAll('.hub__panel');
    var tabs = tabsEl ? tabsEl.querySelectorAll('.hub__tab') : [];

    var currentType = 'all';
    var query = '';

    /* Header stat: keep the headline number honest by reading it off the
       venue list rather than hardcoding it in the markup. */
    var statVenues = document.getElementById('statVenues');
    if (statVenues) statVenues.textContent = VENUES.length;

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function attr(s) { return esc(s); }

    function mapsUrl(v) {
      return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v.name + ' ' + v.addr.replace(/,?\s*S\d{6}.*/, '') + ' Singapore');
    }

    function render() {
      var list = VENUES.filter(function (v) {
        // "Élever classes" is a cross-cutting flag (a hall can be both a private
        // venue and an Élever class venue), so it filters on v.elever, not v.type.
        if (currentType === 'elever') { if (!v.elever) return false; }
        else if (currentType !== 'all' && v.type !== currentType) return false;
        if (query) {
          var l = loc(v);
          var hay = (v.name + ' ' + v.area + ' ' + v.addr + ' ' + l.name + ' ' + l.area).toLowerCase();
          if (hay.indexOf(query) === -1) return false;
        }
        return true;
      });

      if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' venue' : ' venues');

      if (!list.length) {
        grid.innerHTML = '<p class="hub__empty">No venues match that search. Try a different area or clear the filters.</p>';
        return;
      }

      grid.innerHTML = list.map(function (v) {
        var l = loc(v);
        var book = v.book || (v.type === 'activesg' ? ACTIVESG_BOOK : '');
        var bookLabel = v.bookLabel || (v.type === 'activesg' ? 'Book on ActiveSG' : 'Book');
        var note = v.bookNote || (v.type === 'activesg'
          ? 'Peak slots are balloted about 14 days ahead; off-peak is first-come.'
          : '');

        var actions = '<a class="hcard__link" href="' + mapsUrl(v) + '" target="_blank" rel="noopener" aria-label="' +
          attr('Open ' + l.name + ' in Google Maps') + '">Map \u2197</a>';

        if (v.bookable === false) {
          // No working public booking page — say so instead of linking nowhere.
          if (v.phone) {
            actions += '<a class="hcard__link hcard__link--call" href="tel:' + attr(v.phone) + '" aria-label="' +
              attr('Call ' + l.name) + '">Call to book</a>';
          }
        } else if (book) {
          actions += '<a class="hcard__link hcard__link--book" href="' + attr(book) + '" target="_blank" rel="noopener" aria-label="' +
            attr('Book a court at ' + l.name) + '">' + esc(bookLabel) + ' \u2197</a>';
          if (v.altBook) {
            actions += '<a class="hcard__link" href="' + attr(v.altBook) + '" target="_blank" rel="noopener">' +
              esc(v.altBookLabel || 'Other booking') + ' \u2197</a>';
          }
        }

        return '<article class="hcard">' +
          '<div class="hcard__head">' +
            '<h3 class="hcard__name">' + esc(l.name) + '</h3>' +
            '<div class="hcard__tags">' +
              '<span class="hcard__tag hcard__tag--' + v.type + '">' + (TYPE_LABEL[v.type] || v.type) + '</span>' +
              (v.elever && v.type !== 'elever' ? '<span class="hcard__tag hcard__tag--elever">Élever venue</span>' : '') +
            '</div>' +
          '</div>' +
          '<p class="hcard__area">' + esc(l.area) + '</p>' +
          '<p class="hcard__addr">' + esc(v.addr) + '</p>' +
          (l.meta ? '<p class="hcard__meta">' + esc(l.meta) + '</p>' : '') +
          '<div class="hcard__actions">' + actions + '</div>' +
          (note ? '<p class="hcard__booknote">' + esc(note) + '</p>' : '') +
        '</article>';
      }).join('');
    }

    // filters
    if (filtersEl) {
      filtersEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.hub__filter');
        if (!btn) return;
        filtersEl.querySelectorAll('.hub__filter').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active'); btn.setAttribute('aria-pressed', 'true');
        currentType = btn.dataset.type;
        render();
      });
    }
    // search
    if (searchEl) {
      searchEl.addEventListener('input', function () { query = searchEl.value.trim().toLowerCase(); render(); });
    }

    // tabs (ARIA tablist pattern: click + arrow-key navigation)
    function activateTab(name, focusIt) {
      tabs.forEach(function (b) {
        var on = b.dataset.tab === name;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
        b.setAttribute('tabindex', on ? '0' : '-1');
        if (on && focusIt) b.focus();
      });
      panels.forEach(function (p) {
        var on = p.dataset.panel === name;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
    }
    if (tabsEl) {
      tabsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.hub__tab');
        if (btn) activateTab(btn.dataset.tab);
      });
      tabsEl.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
        var order = Array.prototype.map.call(tabs, function (b) { return b.dataset.tab; });
        var cur = order.indexOf(document.activeElement.dataset ? document.activeElement.dataset.tab : order[0]);
        if (cur < 0) cur = 0;
        var next = cur;
        if (e.key === 'ArrowRight') next = (cur + 1) % order.length;
        else if (e.key === 'ArrowLeft') next = (cur - 1 + order.length) % order.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = order.length - 1;
        e.preventDefault();
        activateTab(order[next], true);
      });
    }
    // inline "go to Where to play" links inside the How-to-book panel
    hub.addEventListener('click', function (e) {
      var link = e.target.closest('.hub__inline-link');
      if (link && link.dataset.goto) {
        activateTab(link.dataset.goto);
        if (history.replaceState) history.replaceState(null, '', '#' + link.dataset.goto);
      }
    });

    /* Deep-link the tabs (#book, #groups) so a panel can be shared,
       bookmarked and linked to from elsewhere on the site. */
    var TAB_NAMES = Array.prototype.map.call(tabs, function (b) { return b.dataset.tab; });
    function tabFromHash() {
      var name = (location.hash || '').replace('#', '');
      return TAB_NAMES.indexOf(name) > -1 ? name : '';
    }
    if (tabsEl) {
      tabsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.hub__tab');
        // history.replaceState keeps the URL shareable without adding a
        // back-button entry for every tab press.
        if (btn && history.replaceState) history.replaceState(null, '', '#' + btn.dataset.tab);
      });
      window.addEventListener('hashchange', function () {
        var name = tabFromHash();
        if (name) activateTab(name);
      });
    }
    var initial = tabFromHash();
    if (initial) activateTab(initial);

    render();
    // Re-render the venue list when the language changes (static text in the
    // book/groups panels is static markup).
  })();


})();
