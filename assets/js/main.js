/* =====================================================================
   ÉLEVER BADMINTON — Interactive layer
   - Cinematic canvas intro (physics shuttlecock + racket smash)
   - Live hero shuttle-field
   - Nav behaviour, magnetic buttons, 3D tilt, scroll reveals
   - SG Badminton Hub venue directory + world-tour calendar
   ===================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  /* ---------- helper: draw a realistic shuttlecock on a canvas ctx ---------- */
  function drawShuttle(ctx, x, y, scale, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    var len = 60;          // skirt height: cork sits near 0, feather crown at -len
    var crownR = 31;       // half-width of the flared feather crown
    var neckR = 8;         // half-width where the feathers gather into the cork
    var N = 16;            // number of feather vanes

    // ---- soft cone body behind the feathers (gives the skirt real volume) ----
    ctx.beginPath();
    ctx.moveTo(-neckR, -2);
    ctx.quadraticCurveTo(-crownR * 1.04, -len * 0.72, -crownR, -len);
    ctx.quadraticCurveTo(0, -len - 7, crownR, -len);
    ctx.quadraticCurveTo(crownR * 1.04, -len * 0.72, neckR, -2);
    ctx.closePath();
    var body = ctx.createLinearGradient(0, 0, 0, -len);
    body.addColorStop(0, 'rgba(238,242,249,.92)');
    body.addColorStop(1, 'rgba(210,221,236,.72)');
    ctx.fillStyle = body;
    ctx.fill();

    // ---- individual overlapping feather vanes ----
    for (var i = 0; i < N; i++) {
      var f = i / (N - 1);                                    // 0..1 across the crown
      var topX = (f - 0.5) * crownR * 2;
      var baseX = (f - 0.5) * neckR * 2;
      var topY = -len - Math.cos((f - 0.5) * Math.PI) * 6;    // crown domes up in the middle
      var edge = Math.abs(f - 0.5) * 2;                       // 0 centre .. 1 outer feathers
      var w = 4.4 - edge * 1.5;                               // vane half-width, slimmer at the edges

      ctx.beginPath();
      ctx.moveTo(baseX, -2);
      ctx.lineTo(topX - w, topY + 3);
      ctx.quadraticCurveTo(topX, topY - 3, topX + w, topY + 3);  // rounded feather tip
      ctx.closePath();
      var g = ctx.createLinearGradient(baseX, -2, topX, topY);
      g.addColorStop(0, 'rgba(255,255,255,.98)');
      g.addColorStop(1, 'rgba(226,234,246,' + (0.96 - edge * 0.22) + ')');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(150,168,193,.5)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
      // central quill/rib
      ctx.beginPath();
      ctx.moveTo(baseX, -3);
      ctx.lineTo(topX, topY + 4);
      ctx.strokeStyle = 'rgba(150,166,190,.4)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // ---- two crossing binding threads (the classic double ring) ----
    ctx.strokeStyle = 'rgba(120,140,168,.55)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, -len * 0.42, crownR * 0.5, 3.4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -len * 0.66, crownR * 0.72, 4.6, 0, 0, Math.PI * 2); ctx.stroke();

    // ---- cork base: domed top, rounded bottom, softly shaded ----
    var cw = neckR + 3;
    var cork = ctx.createRadialGradient(-cw * 0.35, 1, 2, 0, 5, cw * 2);
    cork.addColorStop(0, '#ffffff');
    cork.addColorStop(0.72, '#f3f1ea');
    cork.addColorStop(1, '#d3d0c6');
    ctx.fillStyle = cork;
    ctx.beginPath();
    ctx.moveTo(-cw, 2);
    ctx.quadraticCurveTo(0, -3, cw, 2);              // gently domed top
    ctx.lineTo(cw, 5);
    ctx.arc(0, 5, cw, 0, Math.PI, false);            // rounded bottom
    ctx.lineTo(-cw, 2);
    ctx.closePath();
    ctx.fill();
    // little specular highlight on the cork
    ctx.fillStyle = 'rgba(255,255,255,.65)';
    ctx.beginPath(); ctx.ellipse(-cw * 0.32, 3, 2.6, 3.4, -0.3, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  /* =====================================================================
     1. CINEMATIC INTRO
     ===================================================================== */
  var intro = document.getElementById('intro');
  var body = document.body;
  body.classList.add('intro-lock');

  function finishIntro() {
    if (!intro || intro.dataset.done) return;
    intro.dataset.done = '1';
    intro.classList.add('done');
    body.classList.remove('intro-lock');
    setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 1000);
    initHero();
    startReveals();
  }

  if (!intro || reduce) {
    if (intro) intro.style.display = 'none';
    body.classList.remove('intro-lock');
    initHero(); startReveals();
  } else {
    runIntro();
    /* Safety net: the intro is a full-screen overlay, so if its
       requestAnimationFrame loop ever stalls (background tab, canvas
       failure) the site would be unreachable. Force it closed. */
    setTimeout(finishIntro, 6000);
  }

  
  function runIntro() {
    var canvas = document.getElementById('introCanvas');
    var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) { finishIntro(); return; }
    var word = document.getElementById('introWord');
    var tag = document.getElementById('introTag');
    var skip = document.getElementById('skipIntro');
    var W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    var t0 = 0;
    var IMPACT = 1050;
    var particles = [];
    var trail = [];
    var revealed = false, tagged = false, ended = false;
    var started = false;
    var cx = function () { return W * 0.5; };
    var cy = function () { return H * 0.52; };

    // Auto-play the smash transition after a short idle hover of the shuttle
    setTimeout(startSmash, 900);

    function spawnBurst(px, py) {
      for (var i = 0; i < 90; i++) {
        var a = Math.random() * Math.PI * 2;
        var sp = 3 + Math.random() * 12;
        particles.push({
          x: px, y: py,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
          life: 1, size: 1 + Math.random() * 3,
          hue: Math.random() < 0.6 ? '33,81,209' : '255,255,255'
        });
      }
    }

    function frame(now) {
      if(!started) {
        // Idle animation of shuttlecock before click
        ctx.clearRect(0, 0, W, H);
        var hoverPy = -H * 0.15 + (cy() - (-H * 0.15)) * 0.2 + Math.sin(now / 500) * 10;
        var hoverPx = -W * 0.1 + (cx() - (-W * 0.1)) * 0.2 + Math.cos(now / 700) * 10;
        drawShuttle(ctx, hoverPx, hoverPy, 0.7, -0.7);
        if (!intro.dataset.done) requestAnimationFrame(frame);
        return;
      }

      var e = now - t0;
      ctx.clearRect(0, 0, W, H);

      // court light streaks
      ctx.save();
      ctx.globalAlpha = 0.12;
      for (var i = 0; i < 6; i++) {
        ctx.strokeStyle = '#2151D1';
        ctx.lineWidth = 1;
        var yy = cy() + Math.sin(e / 600 + i) * 4 + (i - 3) * 40;
        ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy + 20); ctx.stroke();
      }
      ctx.restore();

      var px, py, ang, scale;
      if (e < IMPACT) {
        var p = e / IMPACT;
        var ease = 1 - Math.pow(1 - p, 2);
        px = -W * 0.1 + (cx() - (-W * 0.1)) * ease;
        py = -H * 0.15 + (cy() - (-H * 0.15)) * ease;
        ang = -0.9 + ease * 0.9;
        scale = 0.7 + ease * 0.9;

        if (e > IMPACT - 260) {
          var rp = (e - (IMPACT - 260)) / 260;
          drawRacket(ctx, cx() + 180 - rp * 170, cy() - 120 + rp * 90, -0.6 + rp * 0.8, 1);
        }
        drawShuttle(ctx, px, py, scale, ang);
      } else {
        if (!particles.length && !revealed) { spawnBurst(cx(), cy()); flash(ctx); }
        var q = Math.min((e - IMPACT) / 900, 1);
        var qe = q * q;
        px = cx() + qe * W * 0.9;
        py = cy() + qe * H * 0.7;
        ang = 0.4 + qe * 2.4;
        scale = 1.6 * (1 - qe * 0.85);
        if (q < 1) drawShuttle(ctx, px, py, Math.max(scale, 0.05), ang);

        if (!revealed && e > IMPACT + 150) { revealed = true; word.classList.add('show'); }
        if (!tagged && e > IMPACT + 900) { tagged = true; tag.classList.add('show'); }
        if (!ended && e > IMPACT + 2400) { ended = true; finishIntro(); }
      }

      for (var j = particles.length - 1; j >= 0; j--) {
        var pt = particles[j];
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.25; pt.vx *= 0.98; pt.life -= 0.018;
        if (pt.life <= 0) { particles.splice(j, 1); continue; }
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = 'rgba(' + pt.hue + ',' + pt.life + ')';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (var k = trail.length - 1; k >= 0; k--) {
        var tr = trail[k]; tr.life -= 0.04;
        if (tr.life <= 0) { trail.splice(k, 1); continue; }
        ctx.globalAlpha = tr.life * 0.5;
        ctx.fillStyle = '#2151D1';
        ctx.beginPath(); ctx.arc(tr.x, tr.y, tr.life * 6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!intro.dataset.done) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function flash(c) {
      intro.classList.add('flash');
      setTimeout(function () { intro.classList.remove('flash'); }, 260);
    }

    intro.addEventListener('mousemove', function (ev) {
      var r = canvas.getBoundingClientRect();
      trail.push({ x: ev.clientX - r.left, y: ev.clientY - r.top, life: 1 });
      if (trail.length > 40) trail.shift();
    });

    function startSmash() {
      if(started) return;
      started = true;
      t0 = performance.now();
      if(skip) skip.style.display = 'none';
    }

    if (skip) skip.addEventListener('click', finishIntro);
  }


  function drawRacket(ctx, x, y, angle, scale) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle); ctx.scale(scale, scale);
    // head
    ctx.strokeStyle = 'rgba(230,240,255,.9)';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, -70, 34, 46, 0, 0, Math.PI * 2); ctx.stroke();
    // strings
    ctx.strokeStyle = 'rgba(200,220,245,.25)'; ctx.lineWidth = 1;
    for (var i = -3; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * 9, -110); ctx.lineTo(i * 9, -30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-30, -70 + i * 11); ctx.lineTo(30, -70 + i * 11); ctx.stroke();
    }
    // shaft + grip
    ctx.strokeStyle = 'rgba(33,81,209,.9)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, 70); ctx.stroke();
    ctx.restore();
  }


  /* =====================================================================
     4. NAV
     ===================================================================== */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  // Interior pages keep the solid treatment at all scroll positions.
  var navSolid = nav && nav.classList.contains('nav--solid');
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
     8. FULL 2026 SEASON — every tournament, grouped by month
        status: 'done' (verified/played) or 'upcoming'
        result: shown for events with confirmed champions
     ===================================================================== */
  (function seasonNews() {
    var mount = document.getElementById('newsTimeline');
    if (!mount) return;

    var EVENTS = [
      // ---- JANUARY ----
      { m: 'January', date: '6–11 Jan', name: 'India Open', grade: 'Super 750', status: 'done',
        result: 'MS Lin Chun-yi · WS An Se-young · MD Liang Weikeng/Wang Chang · WD Liu Shengshu/Tan Ning · XD Dechapol Puavaranukroh/Supissara Paewsampran.' },
      { m: 'January', date: '11–13 Jan', name: 'Malaysia Open', grade: 'Super 1000', status: 'done', latest: false,
        result: 'MS Kunlavut Vitidsarn (maiden Super 1000) · WS An Se-young (three-peat) · MD Kim Won-ho/Seo Seung-jae · WD Liu Shengshu/Tan Ning · XD Feng Yanzhe/Huang Dongping.' },
      { m: 'January', date: '20–25 Jan', name: 'Indonesia Masters', grade: 'Super 500', status: 'done' },
      { m: 'January', date: '27 Jan–1 Feb', name: 'Thailand Masters', grade: 'Super 300', status: 'done' },
      // ---- FEBRUARY ----
      { m: 'February', date: 'Feb', name: 'German Open', grade: 'Super 300', status: 'done' },
      // ---- MARCH ----
      { m: 'March', date: '3–8 Mar', name: 'All England Open', grade: 'Super 1000', status: 'done',
        result: 'MS Lin Chun-yi (def. Lakshya Sen) · WS Wang Zhiyi (def. An Se-young) · XD Ye Hong-wei/Nicole Gonzales Chan.' },
      { m: 'March', date: 'Mar', name: 'Swiss Open', grade: 'Super 300', status: 'done' },
      { m: 'March', date: 'Mar', name: 'Ruichang China Masters', grade: 'Super 100', status: 'done' },
      { m: 'March', date: 'Mar', name: 'Orléans Masters', grade: 'Super 300', status: 'done' },
      // ---- MAY ----
      { m: 'May', date: 'May', name: 'Thailand Open', grade: 'Super 500', status: 'done' },
      { m: 'May', date: 'May', name: 'Baoji China Masters', grade: 'Super 100', status: 'done' },
      { m: 'May', date: 'May', name: 'Malaysia Masters', grade: 'Super 500', status: 'done' },
      { m: 'May', date: 'May–Jun', name: 'Singapore Open', grade: 'Super 750', status: 'done',
        result: 'MS Alex Lanier · MD Satwiksairaj Rankireddy/Chirag Shetty. Loh Kean Yew reached his first home final.' },
      // ---- JUNE ----
      { m: 'June', date: 'Jun', name: 'Indonesia Open', grade: 'Super 1000', status: 'done',
        result: 'MS Victor Lai · WS An Se-young · MD Goh Sze Fei/Nur Izzuddin · WD Yuki Fukushima/Mayu Matsumoto · XD Mathias Christiansen/Alexandra Bøje.' },
      { m: 'June', date: 'Jun', name: 'Australian Open', grade: 'Super 500', status: 'done' },
      { m: 'June', date: 'Jun', name: 'Macau Open', grade: 'Super 300', status: 'done' },
      { m: 'June', date: 'Jun', name: 'U.S. Open', grade: 'Super 300', status: 'done' },
      { m: 'June', date: 'Jun', name: 'Canada Open', grade: 'Super 300', status: 'done' },
      // ---- JULY ----
      { m: 'July', date: '14–19 Jul', name: 'Japan Open', grade: 'Super 750', status: 'done',
        result: 'MS Christo Popov · WS PV Sindhu · MD Fajar Alfian/Muhammad Shohibul Fikri · WD Kim Hye Jeong/Kong Hee Yong · XD Feng Yanzhe/Huang Dongping.' },
      { m: 'July', date: '21–26 Jul', name: 'China Open', grade: 'Super 1000', status: 'done', latest: true,
        result: 'MS Chou Tien-chen — at 36, the oldest Super 1000 champion ever (def. Toma Junior Popov) · WS Akane Yamaguchi (def. Chen Yufei) · MD Fajar Alfian/Muhammad Shohibul Fikri · WD Liu Shengshu/Tan Ning (defended) · XD Guo Xinwa/Chen Fanghui.' },
      { m: 'July', date: 'Jul', name: 'Taipei Open', grade: 'Super 300', status: 'done' },
      // ---- AUGUST ----
      { m: 'August', date: 'Aug', name: 'Korea Masters', grade: 'Super 300', status: 'upcoming' },
      { m: 'August', date: '17–23 Aug', name: 'BWF World Championships', grade: 'New Delhi', status: 'upcoming',
        result: 'The season\u2019s biggest prize. Akane Yamaguchi eyes back-to-back world titles; the field chases the rainbow jersey.' },
      // ---- SEPTEMBER ----
      { m: 'September', date: 'Sep', name: 'China Masters', grade: 'Super 750', status: 'upcoming' },
      { m: 'September', date: 'Sep', name: 'Indonesia Masters Super 100 I', grade: 'Super 100', status: 'upcoming' },
      { m: 'September', date: 'Sep', name: 'Vietnam Open', grade: 'Super 100', status: 'upcoming' },
      // ---- OCTOBER ----
      { m: 'October', date: 'Oct', name: 'Arctic Open', grade: 'Super 500', status: 'upcoming' },
      { m: 'October', date: 'Oct', name: 'Denmark Open', grade: 'Super 750', status: 'upcoming' },
      { m: 'October', date: 'Oct', name: 'Malaysia Super 100', grade: 'Super 100', status: 'upcoming' },
      { m: 'October', date: 'Oct', name: 'French Open', grade: 'Super 750', status: 'upcoming' },
      { m: 'October', date: 'Oct', name: 'Indonesia Masters Super 100 II', grade: 'Super 100', status: 'upcoming' },
      { m: 'October', date: 'Oct', name: 'Hylo Open', grade: 'Super 500', status: 'upcoming' },
      // ---- NOVEMBER ----
      { m: 'November', date: 'Nov', name: 'Korea Open', grade: 'Super 500', status: 'upcoming' },
      { m: 'November', date: 'Nov', name: 'Japan Masters', grade: 'Super 500', status: 'upcoming' },
      { m: 'November', date: 'Nov', name: 'Kaohsiung Masters', grade: 'Super 100', status: 'upcoming' },
      { m: 'November', date: 'Nov', name: 'Hong Kong Open', grade: 'Super 500', status: 'upcoming' },
      { m: 'November', date: 'Nov', name: 'Syed Modi International', grade: 'Super 300', status: 'upcoming' },
      // ---- DECEMBER ----
      { m: 'December', date: 'Dec', name: 'Guwahati Masters', grade: 'Super 100', status: 'upcoming' },
      { m: 'December', date: 'Dec', name: 'Odisha Masters', grade: 'Super 100', status: 'upcoming' },
      { m: 'December', date: '9–13 Dec', name: 'BWF World Tour Finals', grade: 'Season finale', status: 'upcoming',
        result: 'The top 8 in each discipline meet to close the 2026 season.' }
    ];

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    function dateLabel(ev) {
      // ev.date already carries the month (e.g. "6–11 Jan"), so we must NOT
      // append the month again — that produced "Jul Jul 2026".
      return ev.date + ' 2026';
    }

    var VISIBLE = 4;              // most-recent shown by default
    var expanded = false;
    var currentFilter = 'all';

    function render() {
      var done = EVENTS.filter(function (e) { return e.status === 'done'; }).reverse();   // most recent results first
      var up = EVENTS.filter(function (e) { return e.status === 'upcoming'; });            // upcoming in date order
      var list;
      if (currentFilter === 'done') list = done;
      else if (currentFilter === 'upcoming') list = up;
      else list = done.concat(up);   // recent results first, then what's coming next
      var shown = expanded ? list : list.slice(0, VISIBLE);
      var html = '';
      shown.forEach(function (ev) {
        var x = ev;
        var cls = 'ncard' + (ev.latest ? ' ncard--latest' : '') + (ev.status === 'upcoming' ? ' ncard--next' : '');
        var badge = ev.latest ? ' · Latest' : (ev.status === 'upcoming' ? ' · Upcoming' : '');
        html += '<article class="' + cls + '">';
        html += '<div class="ncard__head"><span class="ncard__date">' + dateLabel(ev) + badge + '</span>';
        html += '<span class="ncard__grade">' + esc(x.grade) + '</span></div>';
        html += '<h4 class="ncard__name">' + esc(x.name) + '</h4>';
        if (x.result) html += '<p class="ncard__result">' + esc(x.result) + '</p>';
        else html += '<p class="ncard__result ncard__result--muted">' + (ev.status === 'upcoming' ? 'Draw and results to come.' : 'Results to be confirmed.') + '</p>';
        html += '</article>';
      });
      mount.innerHTML = html;

      var extra = list.length - VISIBLE;
      if (toggleBtn) {
        if (extra > 0) {
          toggleBtn.style.display = '';
          toggleBtn.textContent = expanded ? 'Show less' : 'Show all ' + list.length + ' tournaments';
          toggleBtn.setAttribute('aria-expanded', String(expanded));
        } else {
          toggleBtn.style.display = 'none';
        }
      }
    }

    var toggleBtn = document.getElementById('newsToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () { expanded = !expanded; render(); });
    }
    render();

    var filters = document.getElementById('newsFilters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('.news__filter');
        if (!btn) return;
        filters.querySelectorAll('.news__filter').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active'); btn.setAttribute('aria-pressed', 'true');
        currentFilter = btn.dataset.filter;
        expanded = false;
        render();
      });
    }

    // Re-render on language change.
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
    var VENUES = [
      // ---------- PRIVATE HALLS ----------
      { id: 'wyse', name: 'Wyse Active Hub', area: 'Jurong East', type: 'private', addr: '1 Venture Avenue, #03-01, Perennial Business City, S608521', meta: 'Air-conditioned · 32 courts (SG\u2019s largest)', book: 'https://wyseactive.rezerv.co/', elever: true },
      { id: 'fernvale', name: 'Fernvale Village', area: 'Sengkang', type: 'private', addr: '61 Fernvale Link, S799956', meta: 'Air-conditioned · badminton & pickleball', book: 'https://booking.fernvalevillage.com/', elever: true },
      { id: 'arina', name: 'The Sports Arina @ Jalan Kayu', area: 'Sengkang West', type: 'private', addr: '28 Fernvale Road, S799951', meta: 'Air-conditioned · multi-sport hub', book: 'https://thesportsarina.com/' },
      { id: 'sbhsims', name: 'Singapore Badminton Hall (SBH @ Sims)', area: 'Geylang', type: 'private', addr: '1 Lorong 23 Geylang, S388352', meta: '16 courts + VIP · Tel 6744 4111', elever: true },
      { id: 'sbhexpo', name: 'SBH East Coast @ Expo', area: 'Changi', type: 'private', addr: 'Singapore Expo, Carpark J, Changi South Ave 1, S486150', meta: 'SG\u2019s largest private hall · 22+ courts', elever: true },
      { id: 'obapasirris', name: 'OBA Arena @ Pasir Ris', area: 'Pasir Ris', type: 'private', addr: '3A Pasir Ris Drive 6, S519422', meta: 'Academy-operated arena', book: 'https://www.optimumbadmintonacademy.com/' },
      { id: 'obapunggol', name: 'OBA Arena @ Punggol', area: 'Punggol', type: 'private', addr: '11 Northshore Drive, S828670', meta: 'Covered arena', book: 'https://www.optimumbadmintonacademy.com/' },
      { id: 'citysprouts', name: 'City Sprouts @ Bedok', area: 'Bedok', type: 'private', addr: '200 Bedok North Avenue 1', meta: 'Community hub · courts by XY Badminton', book: 'https://xyacademy.rezerv.co/' },
      { id: 'kff', name: 'KFF Badminton Arena / Singapore Badminton Stadium', area: 'Geylang', type: 'private', addr: '100 Guillemard Road, S399718', meta: 'Historic SBA venue · 12 courts (reopened 2025)', elever: true },
      { id: 'smash', name: 'Smash Arena', area: 'Joo Koon', type: 'private', addr: '511 Upper Jurong Road, D\u2019Arena, Blk B L2, S638366', meta: '9 doubles + 1 single · Taraflex flooring', book: 'https://booking.smasharena.sg/' },
      { id: 'cereza', name: 'Cereza Sports Hall', area: 'Eunos', type: 'private', addr: '3 Chin Cheng Avenue, S429401', meta: '~4 courts · rubber-mat flooring' },
      { id: 'kovan', name: 'Kovan Sports Centre', area: 'Hougang', type: 'private', addr: '60 Hougang Street 21, S538738', meta: 'Indoor courts' },

      // ---------- ACTIVESG PUBLIC SPORT CENTRES ----------
      { id: 'ocbc', name: 'OCBC Arena', area: 'Kallang', type: 'activesg', addr: '5 Stadium Drive, S397631 (Singapore Sports Hub)', meta: 'Air-conditioned arena', book: 'https://www.sportshub.com.sg/' },
      { id: 'oth', name: 'Our Tampines Hub — Tampines Sport Centre', area: 'Tampines', type: 'activesg', addr: '1 Tampines Walk, S528523', meta: 'Flagship ActiveSG hall · ~20 courts' },
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
      { id: 'csc', name: 'Chinese Swimming Club', area: 'Katong', type: 'club', addr: '21 Amber Road, S439870', meta: 'Members only · est. 1909' },
      { id: 'ssc', name: 'Singapore Swimming Club', area: 'Tanjong Rhu', type: 'club', addr: '45 Tanjong Rhu Road, S436899', meta: 'Members only · est. 1894' },
      { id: 'warren', name: 'Warren Golf & Country Club', area: 'Dover', type: 'club', addr: '23 Folkestone Road, S139599', meta: 'Members only · Tel 6778 0127' },

      // ---------- ÉLEVER REGULAR CLASS VENUES (schools & community clubs) ----------
      // Where Élever runs its regular coaching classes. Marked elever:true so they
      // surface under the "Élever classes" filter. The public halls listed above
      // that Élever also teaches at carry the same flag inline on their own entry.
      { id: 'acsbarker', name: 'Anglo-Chinese School (Barker Road)', area: 'Newton', type: 'elever', addr: '60 Barker Road, S309919', meta: 'Élever class venue · school hall', elever: true },
      { id: 'bidadari', name: 'Bidadari Community Club', area: 'Bidadari', type: 'elever', addr: 'Bidadari Park Drive, Singapore', meta: 'Élever class venue · community club', elever: true },
      { id: 'cantonment', name: 'Cantonment Primary School', area: 'Tanjong Pagar', type: 'elever', addr: '1 Cantonment Close, Singapore', meta: 'Élever class venue · school hall', elever: true },
      { id: 'northvista', name: 'North Vista Primary School', area: 'Sengkang', type: 'elever', addr: 'Rivervale Drive, Sengkang, Singapore', meta: 'Élever class venue · school hall', elever: true },
      { id: 'scgs', name: "Singapore Chinese Girls' School", area: 'Bukit Timah', type: 'elever', addr: '190 Dunearn Road, S299521', meta: 'Élever class venue · school hall', elever: true }
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
        var bookLabel = v.type === 'activesg' ? 'Book on ActiveSG' : 'Book';
        var actions = '<a class="hcard__link" href="' + mapsUrl(v) + '" target="_blank" rel="noopener" aria-label="' + attr('Open ' + l.name + ' in Google Maps') + '">Map \u2197</a>';
        if (book) actions += '<a class="hcard__link hcard__link--book" href="' + book + '" target="_blank" rel="noopener" aria-label="' + attr('Book a court at ' + l.name) + '">' + bookLabel + ' \u2197</a>';
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
      if (link && link.dataset.goto) activateTab(link.dataset.goto);
    });

    render();
    // Re-render the venue list when the language changes (static text in the
    // book/groups panels is static markup).
  })();


})();
