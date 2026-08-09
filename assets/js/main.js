/* =====================================================================
   ÉLEVER BADMINTON — Interactive Experience Engine
   - Cinematic canvas intro (physics shuttlecock + racket smash)
   - Live hero shuttle-field that reacts to the cursor
   - Custom cursor, magnetic buttons, 3D tilt, scroll reveals
   - Interactive "Smash Speed" meter, draggable news timeline
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
  }

  function runIntro() {
    var canvas = document.getElementById('introCanvas');
    var ctx = canvas.getContext('2d');
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

    var t0 = performance.now();
    var IMPACT = 1050;             // ms when smash happens
    var particles = [];
    var trail = [];
    var revealed = false, tagged = false, ended = false;
    var cx = function () { return W * 0.5; };
    var cy = function () { return H * 0.52; };

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

      // ---- shuttle motion ----
      var px, py, ang, scale;
      if (e < IMPACT) {
        // fly in from top-left toward center, decelerating
        var p = e / IMPACT;                 // 0..1
        var ease = 1 - Math.pow(1 - p, 2);
        px = -W * 0.1 + (cx() - (-W * 0.1)) * ease;
        py = -H * 0.15 + (cy() - (-H * 0.15)) * ease;
        ang = -0.9 + ease * 0.9;
        scale = 0.7 + ease * 0.9;

        // racket swings in from right just before impact
        if (e > IMPACT - 260) {
          var rp = (e - (IMPACT - 260)) / 260; // 0..1
          drawRacket(ctx, cx() + 180 - rp * 170, cy() - 120 + rp * 90, -0.6 + rp * 0.8, 1);
        }
        drawShuttle(ctx, px, py, scale, ang);
      } else {
        if (!particles.length && !revealed) { spawnBurst(cx(), cy()); flash(ctx); }
        // shuttle rockets away to lower-right, shrinking
        var q = Math.min((e - IMPACT) / 900, 1);
        var qe = q * q;
        px = cx() + qe * W * 0.9;
        py = cy() + qe * H * 0.7;
        ang = 0.4 + qe * 2.4;
        scale = 1.6 * (1 - qe * 0.85);
        if (q < 1) drawShuttle(ctx, px, py, Math.max(scale, 0.05), ang);

        // reveal wordmark
        if (!revealed && e > IMPACT + 150) { revealed = true; word.classList.add('show'); }
        if (!tagged && e > IMPACT + 900) { tagged = true; tag.classList.add('show'); }
        if (!ended && e > IMPACT + 2400) { ended = true; finishIntro(); }
      }

      // ---- particles ----
      for (var j = particles.length - 1; j >= 0; j--) {
        var pt = particles[j];
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.25; pt.vx *= 0.98; pt.life -= 0.018;
        if (pt.life <= 0) { particles.splice(j, 1); continue; }
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = 'rgba(' + pt.hue + ',' + pt.life + ')';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ---- cursor trail (interactive) ----
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

    // interactive: cursor leaves shuttle sparks during intro
    intro.addEventListener('mousemove', function (ev) {
      var r = canvas.getBoundingClientRect();
      trail.push({ x: ev.clientX - r.left, y: ev.clientY - r.top, life: 1 });
      if (trail.length > 40) trail.shift();
    });

    if (skip) skip.addEventListener('click', finishIntro);
    // safety timeout
    setTimeout(finishIntro, 5200);
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
     2. LIVE HERO SHUTTLE FIELD (reacts to cursor)
     ===================================================================== */
  function initHero() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || reduce) return;
    var ctx = canvas.getContext('2d');
    var W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var shuttles = [];
    var mouse = { x: -9999, y: -9999, active: false };

    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size(); window.addEventListener('resize', size);

    var COUNT = window.innerWidth < 700 ? 7 : 16;
    for (var i = 0; i < COUNT; i++) {
      shuttles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        s: 0.28 + Math.random() * 0.5, a: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02
      });
    }

    canvas.parentElement.addEventListener('mousemove', function (ev) {
      var r = canvas.getBoundingClientRect();
      mouse.x = ev.clientX - r.left; mouse.y = ev.clientY - r.top; mouse.active = true;
    });
    canvas.parentElement.addEventListener('mouseleave', function () { mouse.active = false; });

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < shuttles.length; i++) {
        var s = shuttles[i];
        // cursor repulsion (like hitting the shuttle)
        if (mouse.active) {
          var dx = s.x - mouse.x, dy = s.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 26000) {
            var d = Math.sqrt(d2) || 1;
            var f = (1 - d / 161) * 1.4;
            s.vx += (dx / d) * f; s.vy += (dy / d) * f;
            s.spin += 0.01;
          }
        }
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.985; s.vy *= 0.985;
        // gentle drift back
        s.vy += 0.002;
        s.a = Math.atan2(s.vy, s.vx) + Math.PI / 2 + Math.sin(Date.now() / 900 + i) * 0.05;
        // wrap
        var m = 80;
        if (s.x < -m) s.x = W + m; if (s.x > W + m) s.x = -m;
        if (s.y < -m) s.y = H + m; if (s.y > H + m) s.y = -m;
        ctx.globalAlpha = 0.5;
        drawShuttle(ctx, s.x, s.y, s.s, s.a);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* =====================================================================
     3. CUSTOM CURSOR
     ===================================================================== */
  if (!isTouch && !reduce) {
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll('a,button,.tilt,.magnetic').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* =====================================================================
     4. NAV
     ===================================================================== */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  if (burger) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
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
  function startReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); }); runCounters(); return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = en.target.dataset.delay || 0;
          setTimeout(function () { en.target.classList.add('in'); }, d);
          revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { revealObserver.observe(el); });
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
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
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
     7. "FIND YOUR BADMINTON TWIN" PERSONALITY QUIZ
     ===================================================================== */
  (function twinQuiz() {
    var root = document.getElementById('quiz');
    if (!root) return;

    var IMG = 'assets/img/players/';
    // Language-independent data: image path, flag, licence, and the option
    // weight maps. All display text (name/role/tag/desc, questions, options)
    // comes from window.I18N so the quiz can switch language live.
    var PLAYER_META = {
      an:       { img: IMG + 'an-se-young.jpg', flag: '🇰🇷', lic: 'CC BY-SA 2.0' },
      tai:      { img: IMG + 'tai-tzu-ying.jpg', flag: '🇹🇼', lic: 'CC BY 2.0' },
      akane:    { img: IMG + 'akane-yamaguchi.jpg', flag: '🇯🇵', lic: 'CC BY 3.0' },
      yeo:      { img: IMG + 'yeo-jia-min.jpg', flag: '🇸🇬', lic: 'CC BY-SA 4.0' },
      axelsen:  { img: IMG + 'viktor-axelsen.jpg', flag: '🇩🇰', lic: 'CC BY 4.0' },
      kunlavut: { img: IMG + 'kunlavut-vitidsarn.jpg', flag: '🇹🇭', lic: 'CC BY 3.0' },
      loh:      { img: IMG + 'loh-kean-yew.jpg', flag: '🇸🇬', lic: 'CC BY 4.0' },
      antonsen: { img: IMG + 'anders-antonsen.jpg', flag: '🇩🇰', lic: 'CC BY-SA 4.0' },
      chou:     { img: IMG + 'chou-tien-chen.jpg', flag: '🇹🇼', lic: 'Attribution' },
      naraoka:  { img: IMG + 'kodai-naraoka.jpg', flag: '🇯🇵', lic: 'CC BY-SA 4.0' },
      shi:      { img: IMG + 'shi-yuqi.jpg', flag: '🇨🇳', lic: 'CC BY 4.0' },
      jonatan:  { img: IMG + 'jonatan-christie.jpg', flag: '🇮🇩', lic: 'CC BY 2.0' },
      lakshya:  { img: IMG + 'lakshya-sen.jpg', flag: '🇮🇳', lic: 'CC BY-SA 4.0' },
      chenyf:   { img: IMG + 'chen-yufei.jpg', flag: '🇨🇳', lic: 'CC BY-SA 4.0' },
      marin:    { img: IMG + 'carolina-mar-n.jpg', flag: '🇪🇸', lic: 'CC BY-SA 2.0' },
      sindhu:   { img: IMG + 'p-v-sindhu.jpg', flag: '🇮🇳', lic: 'CC BY-SA 3.0' },
      ratchanok:{ img: IMG + 'ratchanok-intanon.jpg', flag: '🇹🇭', lic: 'CC BY 3.0' },
      wangzy:   { img: IMG + 'wang-zhiyi.jpg', flag: '🇨🇳', lic: 'CC BY-SA 4.0' },
      leezii:   { img: IMG + 'lee-zii-jia.jpg', flag: '🇲🇾', lic: 'CC BY-SA 4.0' },
      ginting:  { img: IMG + 'anthony-sinisuka-ginting.jpg', flag: '🇮🇩', lic: 'CC BY 4.0' },
      gregoria: { img: IMG + 'gregoria-mariska-tunjung.jpg', flag: '🇮🇩', lic: 'Public domain' },
      lindan:   { img: IMG + 'lin-dan.jpg', flag: '🇨🇳', lic: 'CC BY-SA 4.0' },
      lcw:      { img: IMG + 'lee-chong-wei.jpg', flag: '🇲🇾', lic: 'CC BY-SA 2.0' },
      okuhara:  { img: IMG + 'nozomi-okuhara.jpg', flag: '🇯🇵', lic: 'CC BY 4.0' },
      momota:   { img: IMG + 'kento-momota.png', flag: '🇯🇵', lic: 'CC BY 3.0' },
      saina:    { img: IMG + 'saina-nehwal.jpg', flag: '🇮🇳', lic: 'GODL-India' },
      tommy:    { img: IMG + 'tommy-sugiarto.jpg', flag: '🇮🇩', lic: 'CC BY-SA 4.0' }
    };

    // Option weight maps (parallel to the localized questions in I18N.data.quiz).
    var WEIGHTS = [
      [ { an: 2, kunlavut: 2, momota: 1, wangzy: 1 }, { tai: 2, loh: 2, leezii: 1 }, { axelsen: 2, momota: 1, shi: 1 }, { akane: 2, naraoka: 2, okuhara: 1 } ],
      [ { loh: 2, axelsen: 1, sindhu: 1, leezii: 1 }, { tai: 2, ratchanok: 2, antonsen: 1, tommy: 1 }, { akane: 2, okuhara: 2, naraoka: 1 }, { ginting: 2, jonatan: 1, lakshya: 1 } ],
      [ { an: 2, axelsen: 1, chou: 2 }, { tai: 2, ratchanok: 1, lindan: 1 }, { naraoka: 2, okuhara: 2, chou: 1 }, { yeo: 2, kunlavut: 1, wangzy: 1, shi: 1 } ],
      [ { marin: 2, lindan: 1, jonatan: 1 }, { chenyf: 2, momota: 1, an: 1 }, { yeo: 2, okuhara: 1, gregoria: 1, tommy: 1 }, { lindan: 2, jonatan: 2, leezii: 1 } ],
      [ { loh: 2, lakshya: 2, gregoria: 1 }, { marin: 1, saina: 2, sindhu: 1, lcw: 1 }, { chou: 2, naraoka: 1, okuhara: 1 }, { shi: 2, axelsen: 1, wangzy: 1, kunlavut: 1 } ],
      [ { loh: 1, sindhu: 2, ginting: 2, leezii: 1 }, { tai: 2, ratchanok: 1, tommy: 1, antonsen: 2 }, { an: 1, akane: 2, naraoka: 1, okuhara: 1 }, { sindhu: 1, lcw: 2, lindan: 1, saina: 1, momota: 1 } ]
    ];

    // Clean line-art icons (self-contained SVG, inherit the badge colour), each
    // picked to actually match its answer — a big step up from generic emoji.
    function svgIcon(inner, filled) {
      return '<svg viewBox="0 0 24 24" ' +
        (filled ? 'fill="currentColor" stroke="none"'
                : 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"') +
        ' aria-hidden="true">' + inner + '</svg>';
    }
    var ICONS = {
      shield:    svgIcon('<path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/>'),
      target:    svgIcon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>'),
      clipboard: svgIcon('<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V3a3 3 0 0 1 6 0v1"/><path d="M9 12.5l2 2 4-4"/>'),
      pulse:     svgIcon('<path d="M2 12h4l3 8 4-16 3 8h6"/>'),
      dumbbell:  svgIcon('<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>'),
      mask:      svgIcon('<path d="M4 6c5-2 11-2 16 0 0 8-3.5 12-8 12S4 14 4 6Z"/><circle cx="9.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="11" r="1" fill="currentColor" stroke="none"/><path d="M9.5 15c1.2 1 3.8 1 5 0"/>'),
      wall:      svgIcon('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 15h18M9 5v5M15 5v5M9 15v4M15 15v4"/>'),
      bolt:      svgIcon('<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>', true),
      alarm:     svgIcon('<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 1.5"/><path d="M5 4 2.5 6.5M19 4l2.5 2.5"/>'),
      palette:   svgIcon('<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2s.6-2 2-2h1.5A2.5 2.5 0 0 0 20 14.5C20 8 16.4 3 12 3Z"/><circle cx="8" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none"/>'),
      battery:   svgIcon('<rect x="2" y="8" width="17" height="9" rx="2"/><path d="M22 11.5v2"/><path d="M6 11.5v3M9.5 11.5v3M13 11.5v3"/>'),
      gear:      svgIcon('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>'),
      flame:     svgIcon('<path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-1.6.6-2.8 1.5-3.7C8.7 9 9 10.2 10 10.7 10 8 11 4.6 12 2Z"/>', true),
      snowflake: svgIcon('<path d="M12 2v20M4 7l16 10M20 7 4 17M12 6l2-1.5M12 6l-2-1.5M12 18l2 1.5M12 18l-2 1.5"/>'),
      eyeoff:    svgIcon('<path d="M2 12s4-6.5 10-6.5c1.7 0 3.1.4 4.4 1M22 12s-4 6.5-10 6.5c-1.7 0-3.1-.4-4.4-1"/><circle cx="12" cy="12" r="2.5"/><path d="M3 3 21 21"/>'),
      mic:       svgIcon('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/>'),
      rocket:    svgIcon('<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9.5 11.5A11 11 0 0 1 18 3c2 0 3 1 3 3a11 11 0 0 1-8.5 8.5l-1.5 1.5-3-3z"/><circle cx="14.5" cy="8.5" r="1.4"/>'),
      flag:      svgIcon('<path d="M5 21V3M5 4h11l-2 3.5L16 11H5"/>'),
      hourglass: svgIcon('<path d="M6 3h12M6 21h12M8 3c0 4.5 4 5.5 4 9s-4 4.5-4 9M16 3c0 4.5-4 5.5-4 9s4 4.5 4 9"/>'),
      grid:      svgIcon('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
      wand:      svgIcon('<path d="M4 20 13 11"/><path d="M17 3l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>'),
      mountain:  svgIcon('<path d="M3 20 9 8l4 6 2-3 6 9z"/><path d="m9 8 1.6 3"/>'),
      trophy:    svgIcon('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6.5H5.6A1.5 1.5 0 0 0 7 9.6M16 6.5h2.4A1.5 1.5 0 0 1 15 9.6"/><path d="M12 13v3M10 16h4l.8 4H9.2z"/>')
    };
    // Which icon fits each option (parallel to the localized questions).
    var OPTION_ICON_NAMES = [
      ['shield', 'target', 'clipboard', 'pulse'],
      ['dumbbell', 'mask', 'wall', 'bolt'],
      ['alarm', 'palette', 'battery', 'gear'],
      ['flame', 'snowflake', 'eyeoff', 'mic'],
      ['rocket', 'flag', 'hourglass', 'grid'],
      ['dumbbell', 'wand', 'mountain', 'trophy']
    ];

    var I18N = window.I18N;
    function lang() { return I18N ? I18N.lang() : 'en'; }
    function players() { return (I18N && I18N.data.players[lang()]) || I18N.data.players.en; }
    function questions() { return (I18N && I18N.data.quiz[lang()]) || I18N.data.quiz.en; }
    function player(key) {
      var p = players()[key] || {};
      var m = PLAYER_META[key] || {};
      return { name: p.name, role: p.role, tag: p.tag, desc: p.desc, img: m.img, flag: m.flag, lic: m.lic };
    }

    var scores = {}, current = 0, lastResult = null, view = 'intro';
    var qWrap = document.getElementById('quizQ');
    var progress = document.getElementById('quizProgress');
    var progressBar = document.getElementById('quizProgressBar');
    var result = document.getElementById('quizResult');
    var stage = document.getElementById('quizStage');
    var startBtn = document.getElementById('quizStart');
    var intro = document.getElementById('quizIntro');

    function setProgress(pct) {
      progress.style.width = pct + '%';
      if (progressBar) progressBar.setAttribute('aria-valuenow', String(Math.round(pct)));
    }

    function reset() {
      scores = {}; current = 0;
      Object.keys(PLAYER_META).forEach(function (k) { scores[k] = 0; });
    }

    function renderQuestion() {
      view = 'question';
      var QS = questions();
      var Q = QS[current];
      setProgress(current / QS.length * 100);
      var html = '<p class="quiz__count">' + I18N.t('quiz.count', { n: current + 1, total: QS.length }) + '</p>';
      html += '<h3 class="quiz__q">' + Q.q + '</h3><div class="quiz__opts">';
      Q.a.forEach(function (optText, i) {
        var names = OPTION_ICON_NAMES[current] || [];
        var mark = ICONS[names[i]] || ICONS.target;
        html += '<button class="quiz__opt" data-i="' + i + '"><span class="quiz__opt-icon quiz__opt-icon--' + i + '" aria-hidden="true">' + mark + '</span><span class="quiz__opt-text">' + optText + '</span></button>';
      });
      html += '</div>';
      qWrap.innerHTML = html;
      qWrap.classList.remove('fade'); void qWrap.offsetWidth; qWrap.classList.add('fade');
      qWrap.querySelectorAll('.quiz__opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var w = WEIGHTS[current][+btn.dataset.i];
          Object.keys(w).forEach(function (k) { scores[k] += w[k]; });
          current++;
          if (current < QS.length) renderQuestion();
          else showResult();
        });
      });
    }

    function showResult() {
      view = 'result';
      setProgress(100);
      if (!lastResult) {
        var bestScore = -1;
        Object.keys(scores).forEach(function (k) { if (scores[k] > bestScore) bestScore = scores[k]; });
        var top = Object.keys(scores).filter(function (k) { return scores[k] === bestScore; });
        lastResult = top[Math.floor(Math.random() * top.length)];
      }
      renderResult();
      quizConfetti();     // celebrate the reveal (only on completion, not on language re-render)
    }

    // Lightweight confetti burst contained inside the result card.
    function quizConfetti() {
      if (reduce || !result) return;
      var layer = document.createElement('div');
      layer.className = 'quiz__confetti-layer';
      result.appendChild(layer);
      var fall = result.offsetHeight + 40;
      var colors = ['#2151D1', '#7ea2f2', '#ff7a9c', '#ffd166', '#00c2a8'];
      var emojis = ['🏸', '✨', '🎉', '⭐', '💫'];
      for (var i = 0; i < 46; i++) {
        var bit = document.createElement('span');
        bit.className = 'quiz__confetti';
        if (Math.random() < 0.28) {
          bit.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          bit.style.fontSize = (12 + Math.random() * 12) + 'px';
        } else {
          bit.style.background = colors[Math.floor(Math.random() * colors.length)];
          bit.style.width = (6 + Math.random() * 6) + 'px';
          bit.style.height = (9 + Math.random() * 8) + 'px';
        }
        var dur = 1.7 + Math.random() * 1.7, delay = Math.random() * 0.35;
        bit.style.left = (Math.random() * 100) + '%';
        bit.style.setProperty('--dx', ((Math.random() * 2 - 1) * 90) + 'px');
        bit.style.setProperty('--fall', fall + 'px');
        bit.style.setProperty('--rot', ((Math.random() * 2 - 1) * 540) + 'deg');
        bit.style.animationDuration = dur + 's';
        bit.style.animationDelay = delay + 's';
        layer.appendChild(bit);
      }
      setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 4200);
    }

    function renderResult() {
      var p = player(lastResult);
      qWrap.style.display = 'none';
      result.style.display = 'block';
      result.innerHTML =
        '<p class="quiz__count">' + I18N.t('quiz.resultLead') + '</p>' +
        '<div class="quiz__photo"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"><span class="quiz__flagbadge" aria-hidden="true">' + p.flag + '</span></div>' +
        '<h3 class="quiz__name">' + p.name + '</h3>' +
        '<p class="quiz__role">' + p.role + '</p>' +
        '<p class="quiz__playertag">\u201C' + p.tag + '\u201D</p>' +
        '<p class="quiz__desc">' + p.desc + '</p>' +
        '<p class="quiz__rr">' + I18N.t('quiz.rrPrompt') + '</p>' +
        '<div class="quiz__result-actions">' +
          '<a class="btn btn--primary magnetic" href="https://racketratings.net/" target="_blank" rel="noopener">' + I18N.t('quiz.rrCta') + '</a>' +
          '<button class="btn btn--ghost" id="quizAgain">' + I18N.t('quiz.again') + '</button>' +
        '</div>' +
        '<p class="quiz__credit">' + I18N.t('quiz.credit', { lic: p.lic }) + '</p>';
      result.classList.remove('fade'); void result.offsetWidth; result.classList.add('fade');
      document.getElementById('quizAgain').addEventListener('click', function () {
        result.style.display = 'none'; qWrap.style.display = 'block';
        lastResult = null; reset(); renderQuestion();
      });
    }

    startBtn.addEventListener('click', function () {
      intro.style.display = 'none';
      stage.style.display = 'block';
      lastResult = null; reset(); renderQuestion();
    });

    // Re-render whatever is on screen when the language changes.
    document.addEventListener('i18n:change', function () {
      if (view === 'question') renderQuestion();
      else if (view === 'result') renderResult();
    });
  })();

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

    var I18N = window.I18N;
    function lang() { return I18N ? I18N.lang() : 'en'; }
    // Look up translated fields for an event; fall back to the English source.
    function tr(ev) {
      var over = (I18N && I18N.data.news[lang()] && I18N.data.news[lang()][ev.name]) || null;
      return {
        name: (over && over.name) || ev.name,
        grade: (over && over.grade) || ev.grade,
        result: over && over.result ? over.result : (lang() === 'en' ? ev.result : null)
        // For zh, only show a result if we have a translated one; otherwise use the muted fallback.
      };
    }
    function monthLabel(m) {
      var map = (I18N && I18N.data.months[lang()]) || {};
      return map[m] || m;
    }
    function dateLabel(ev) {
      // ev.date already carries the month (e.g. "6–11 Jan", "Jul", "May–Jun"),
      // so we must NOT append the month again — that produced "Jul Jul 2026".
      // English keeps the descriptive date range; Chinese uses the month label
      // (the English ranges like "6–11 Jan" are not localised to avoid errors).
      if (lang() === 'en') return ev.date + ' 2026';
      return monthLabel(ev.m) + ' · 2026';
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
        var x = tr(ev);
        var cls = 'ncard' + (ev.latest ? ' ncard--latest' : '') + (ev.status === 'upcoming' ? ' ncard--next' : '');
        var badge = ev.latest ? ' · ' + I18N.t('news.latest') : (ev.status === 'upcoming' ? ' · ' + I18N.t('news.upcoming') : '');
        html += '<article class="' + cls + '">';
        html += '<div class="ncard__head"><span class="ncard__date">' + dateLabel(ev) + badge + '</span>';
        html += '<span class="ncard__grade">' + esc(x.grade) + '</span></div>';
        html += '<h4 class="ncard__name">' + esc(x.name) + '</h4>';
        if (x.result) html += '<p class="ncard__result">' + esc(x.result) + '</p>';
        else html += '<p class="ncard__result ncard__result--muted">' + (ev.status === 'upcoming' ? I18N.t('news.tbdUpcoming') : I18N.t('news.tbdDone')) + '</p>';
        html += '</article>';
      });
      mount.innerHTML = html;

      var extra = list.length - VISIBLE;
      if (toggleBtn) {
        if (extra > 0) {
          toggleBtn.style.display = '';
          toggleBtn.textContent = expanded ? I18N.t('news.showLess') : I18N.t('news.showAllN', { n: list.length });
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
    document.addEventListener('i18n:change', render);
  })();

  /* =====================================================================
     9. INTERACTIVE BADMINTON RALLY — play a point vs a dummy opponent
        Perspective court, cursor-controlled racket, projectile shuttle
        with height (scale + shadow), AI opponent, particles, scoreboard.
     ===================================================================== */
  (function rallyGame() {
    var canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    var elStart = document.getElementById('gameStart');
    var elYou = document.getElementById('scoreYou');
    var elCpu = document.getElementById('scoreCpu');
    var elMsg = document.getElementById('gameMsg');
    var elRally = document.getElementById('gameRally');
    var elShot = document.getElementById('gameShot');

    var I18N = window.I18N;
    function T(key, vars) { return I18N ? I18N.t(key, vars) : key; }

    function size() { W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * DPR; canvas.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }

    /* ================= real-time side-view physics =================
       Original implementation (own code/art/physics) in the classic
       "move + jump + swing" stick badminton style.
       Screen pixels used directly; ground line near the bottom. =========== */
    var GROUND, NET_X, NET_TOP, GRAV = 0.42, PLAYER_W = 26, RACKET = 66;
    var TARGET = 7;
    // shuttle feel: high-drag / floaty (like the classic stick badminton games)
    var BIRD_GRAV = 0.10;      // gentle fall
    var BIRD_DRAG = 0.988;     // strong air drag so it slows & floats
    var BIRD_R = 7;            // small shuttle

    var you, cpu, bird, particles = [], keys = {};
    var state = 'idle';    // idle | play | point | over
    var scoreYou = 0, scoreCpu = 0, rally = 0, server = 'you', pointTimer = 0;

    function layout() {
      GROUND = H * 0.86; NET_X = W * 0.5; NET_TOP = GROUND - H * 0.32;
    }

    function resetPositions() {
      you = { x: W * 0.25, y: GROUND, vy: 0, onGround: true, swing: 0, facing: 1 };
      cpu = { x: W * 0.75, y: GROUND, vy: 0, onGround: true, swing: 0, facing: -1, think: 0, aim: W * 0.75 };
    }

    function setMsg(t) { if (elMsg) elMsg.textContent = t; }
    function setShot(t) { if (elShot) elShot.textContent = t; }
    function updateScore() { if (elYou) elYou.textContent = scoreYou; if (elCpu) elCpu.textContent = scoreCpu; if (elRally) elRally.textContent = rally; }
    function burst(x, y, c, n) { n = n || 18; for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = 1 + Math.random() * 5; particles.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: c }); } }

    // Launch the shuttle from (x0,y0) so it arcs high over the net and lands near landX.
    // Apex clearance scales with court height; vx solved from the true drag sum so it
    // lands accurately at any screen size. Guarantees the bird clears the net.
    function launchTo(x0, y0, landX, clearFrac) {
      var g = BIRD_GRAV;
      // apex sits a fraction of the net's height ABOVE the tape, so it always clears
      var netH = GROUND - NET_TOP;
      var apexY = NET_TOP - netH * (clearFrac || 0.45);
      if (apexY > y0 - 40) apexY = y0 - 40;             // must actually rise from contact point
      var riseH = Math.max(40, y0 - apexY);
      var vUp = Math.sqrt(2 * g * riseH);
      var tUp = vUp / g;
      var tDown = Math.sqrt(2 * (GROUND - apexY) / g);
      var totalT = Math.max(1, Math.round(tUp + tDown));
      // horizontal distance a starting vx of 1 would cover under drag over totalT frames:
      // sum_{t=0..totalT-1} DRAG^t = (1 - DRAG^totalT) / (1 - DRAG)
      var reachPerVx = (1 - Math.pow(BIRD_DRAG, totalT)) / (1 - BIRD_DRAG);
      var vx = (landX - x0) / reachPerVx;
      return { vx: Math.max(-12, Math.min(12, vx)), vy: -vUp };
    }

    function serveBird(byWho) {
      rally = 0; updateScore(); setShot(T('play.shotServe'));
      var fromLeft = byWho === 'you';
      var x0 = fromLeft ? (NET_X - W * 0.20) : (NET_X + W * 0.20);
      var y0 = GROUND - 60;
      // land in the receiver's mid court (keeps a safe, high clearance over the net)
      var landX = fromLeft ? (NET_X + W * 0.14 + Math.random() * W * 0.14)
                           : (NET_X - W * 0.14 - Math.random() * W * 0.14);
      var v = launchTo(x0, y0, landX, 0.9);
      bird = { x: x0, y: y0, vx: v.vx, vy: v.vy, live: true, last: byWho, cool: 0 };
      state = 'play';
      setMsg(byWho === 'you' ? T('play.serveYou') : T('play.serveCpu'));
    }

    function startGame() {
      scoreYou = 0; scoreCpu = 0; updateScore(); server = 'you';
      elStart.style.display = 'none';
      if (elStart.blur) elStart.blur();        // so Space doesn't re-trigger the button
      layout(); resetPositions();
      serveBird('you');
    }

    function awardPoint(who, reason) {
      if (state === 'point') return;
      state = 'point'; pointTimer = 90;
      if (who === 'you') scoreYou++; else scoreCpu++;
      server = who;
      updateScore();
      burst(bird ? bird.x : W / 2, bird ? bird.y : GROUND, who === 'you' ? '33,81,209' : '255,90,90', 26);
      setMsg((who === 'you' ? T('play.pointYou') : T('play.pointCpu')) + ' — ' + reason + '.  ' + scoreYou + '\u2013' + scoreCpu);
      if (bird) bird.live = false;
      if (scoreYou >= TARGET || scoreCpu >= TARGET) {
        state = 'over';
        setTimeout(function () {
          elStart.style.display = ''; elStart.textContent = T('play.again');
          setMsg(scoreYou > scoreCpu ? T('play.win', { a: scoreYou, b: scoreCpu }) : T('play.lose', { a: scoreCpu, b: scoreYou }));
          state = 'idle';
        }, 1200);
      }
    }

    /* ---------- input ---------- */
    // only capture keys when the game is active (armed) so the page still scrolls normally otherwise
    function armed() { return state === 'play' || state === 'point'; }
    document.addEventListener('keydown', function (e) {
      if (!armed()) return;
      keys[e.key.toLowerCase()] = true;
      // stop Space / arrows from scrolling the page while playing
      if (e.key === ' ' || e.key === 'Spacebar' || e.key.indexOf('Arrow') === 0) e.preventDefault();
    });
    document.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
    // --- Mobile: on-screen control buttons (Left / Right / Jump / Swing) ---
    // Held state so movement buttons work like keys.
    var touch = { left: false, right: false };
    function bindHold(el, on, off) {
      if (!el) return;
      var down = function (e) { e.preventDefault(); on(); };
      var up = function (e) { e.preventDefault(); if (off) off(); };
      el.addEventListener('touchstart', down, { passive: false });
      el.addEventListener('touchend', up, { passive: false });
      el.addEventListener('touchcancel', up, { passive: false });
      el.addEventListener('mousedown', down);
      el.addEventListener('mouseup', up);
      el.addEventListener('mouseleave', up);
    }
    bindHold(document.getElementById('padLeft'), function () { touch.left = true; }, function () { touch.left = false; });
    bindHold(document.getElementById('padRight'), function () { touch.right = true; }, function () { touch.right = false; });
    bindHold(document.getElementById('padJump'), function () { if (armed()) doJump(you); });
    bindHold(document.getElementById('padSwing'), function () { if (armed()) doSwing(you); });
    // tapping the court also swings (quick, forgiving)
    canvas.addEventListener('touchstart', function (e) { if (armed()) { doSwing(you); e.preventDefault(); } }, { passive: false });
    if (elStart) elStart.addEventListener('click', startGame);

    function doJump(p) { if (p.onGround) { p.vy = -11.5; p.onGround = false; } }
    function doSwing(p) { if (p.swing <= 0) p.swing = 16; }

    /* ---------- shuttle hit ---------- */
    function racketTip(p) {
      // tip is up-and-in-front during a swing
      var prog = p.swing > 0 ? (16 - p.swing) / 16 : 0;         // 0..1
      var ang = -1.15 + prog * 1.9;                             // sweeps overhead to front
      var hx = p.x + Math.cos(ang) * RACKET * p.facing * 0.6 + RACKET * 0.2 * p.facing;
      var hy = (p.y - 60) - Math.sin(ang) * RACKET * 0.85;
      return { x: hx, y: hy, prog: prog };
    }

    function tryHit(p, who) {
      if (!bird || !bird.live || p.swing <= 0) return;
      if (bird.last === who) return;         // you can't hit your own shot twice — opponent must touch it first
      // shuttle must be on the striker's own side (can't reach across the net)
      if (who === 'you' && bird.x > NET_X - 4) return;
      if (who === 'cpu' && bird.x < NET_X + 4) return;
      var tip = racketTip(p);
      var dx = bird.x - tip.x, dy = bird.y - tip.y;
      if (dx * dx + dy * dy > 60 * 60) return;

      var dir = who === 'you' ? 1 : -1;
      var netH = GROUND - NET_TOP;
      var aboveTape = NET_TOP - bird.y;        // > 0 when the shuttle is above the net tape
      var SMASH_OK = netH * 0.16;              // contact must be this far above the tape to smash cleanly
      var label = (who === 'you' ? T('play.you') : T('play.cpu'));
      bird.smashByYou = false;   // reset each hit; set true only for a genuine player smash below

      if (aboveTape > SMASH_OK) {
        // ---- SMASH (contact comfortably above the net) ----
        // Aim the shuttle to pass just above the tape, then let physics dive it into
        // the far court. Because it is aimed above the tape it ALWAYS clears the net.
        // The flight is fast, so the receiver has little time to react — a clean high
        // smash wins the point most of the time.
        var aimY = NET_TOP - Math.max(12, netH * 0.10);      // a hair above the tape
        var aimX = NET_X + dir * 10;
        var tx = aimX - bird.x, ty = aimY - bird.y;
        var len = Math.hypot(tx, ty) || 1;
        var SPEED = 11 + Math.random() * 2;                  // fast → hard to reach
        bird.vx = tx / len * SPEED;
        bird.vy = ty / len * SPEED;
        if (bird.vy < 0.5) bird.vy = 0.5;                    // keep a real smash descending
        setShot(label + ': ' + T('play.shotSmash'));
        burst(tip.x, tip.y, '255,90,90', 28);
        // The computer only digs out ~half of the player's smashes: roll it now.
        if (who === 'you') { bird.smashByYou = true; bird.cpuCanReturn = (Math.random() < 0.5); }
      } else if (aboveTape > 0) {
        // ---- SMASH TOO LOW ----
        // The shuttle isn't high enough to angle down safely, so the attempted smash
        // is driven straight into the net — the smasher loses the point (handled when
        // the net collision / own-side landing is resolved in update()).
        bird.vx = dir * 4.2;
        bird.vy = 3.4;
        setShot(label + ': ' + T('play.shotSmash'));
        burst(tip.x, tip.y, '255,90,90', 18);
      } else {
        // ---- LIFT / CLEAR (shuttle at or below the tape) ----
        // A safe, high, floaty arc that sails deep toward the far baseline and clears the net.
        var landX = who === 'you' ? (NET_X + W * 0.34 + Math.random() * W * 0.13) : (NET_X - W * 0.34 - Math.random() * W * 0.13);
        var v = launchTo(bird.x, bird.y, landX, 1.05 + Math.random() * 0.35);
        bird.vx = v.vx; bird.vy = v.vy;
        setShot(label + ': ' + T('play.shotClear'));
        burst(tip.x, tip.y, '150,220,255', 16);
      }
      bird.last = who; bird.cool = 14; rally++; updateScore();
      p.swing = Math.min(p.swing, 8);
    }

    /* ---------- update ---------- */
    function update() {
      // ----- YOU -----
      var mv = 0;
      if (keys['arrowleft'] || keys['a'] || touch.left) mv -= 1;
      if (keys['arrowright'] || keys['d'] || touch.right) mv += 1;
      you.x += mv * 4.6;
      you.facing = 1;                                                 // always face the net (front)
      you.x = Math.max(PLAYER_W, Math.min(NET_X - PLAYER_W, you.x));   // stay on your side
      if (keys['arrowup'] || keys['w']) doJump(you);
      if (keys[' '] || keys['arrowdown'] || keys['s']) doSwing(you);
      physicsPlayer(you);
      if (state === 'play') tryHit(you, 'you');

      // ----- CPU (fair, readable AI) -----
      cpuAI();
      physicsPlayer(cpu);
      if (state === 'play') tryHit(cpu, 'cpu');

      // ----- shuttle -----
      if (bird && bird.live) {
        bird.vy += BIRD_GRAV; bird.vx *= BIRD_DRAG; bird.vy *= BIRD_DRAG;
        bird.x += bird.vx; bird.y += bird.vy; if (bird.cool > 0) bird.cool--;
        // net: block low crossings
        if (bird.x > NET_X - 6 && bird.x < NET_X + 6 && bird.y > NET_TOP) {
          bird.vx *= -0.3; bird.x += bird.vx * 2;
          awardPoint(bird.last === 'you' ? 'cpu' : 'you', T('play.reasonNet', { who: bird.last === 'you' ? T('play.whoYou') : T('play.whoCpu') }));
        }
        // side walls: shuttle bounces back in (arena style, no side-out)
        if (bird.x < BIRD_R + 2) { bird.x = BIRD_R + 2; bird.vx = Math.abs(bird.vx) * 0.7; }
        if (bird.x > W - BIRD_R - 2) { bird.x = W - BIRD_R - 2; bird.vx = -Math.abs(bird.vx) * 0.7; }
        // ceiling
        if (bird.y < BIRD_R + 2) { bird.y = BIRD_R + 2; bird.vy = Math.abs(bird.vy) * 0.5; }
        // floor
        if (bird.y >= GROUND) {
          bird.y = GROUND;
          if (bird.x < NET_X) awardPoint('cpu', T('play.reasonYourSide'));
          else awardPoint('you', T('play.reasonCpuSide'));
        }
      }

      // decay swings & particles
      if (you.swing > 0) you.swing--; if (cpu.swing > 0) cpu.swing--;
      for (var i = particles.length - 1; i >= 0; i--) { var pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.3; pt.life -= 0.03; if (pt.life <= 0) particles.splice(i, 1); }

      if (state === 'point') { if (--pointTimer <= 0) { resetPositions(); serveBird(server); } }
    }

    function physicsPlayer(p) {
      if (!p.onGround) { p.vy += GRAV; p.y += p.vy; if (p.y >= GROUND) { p.y = GROUND; p.vy = 0; p.onGround = true; } }
    }

    function cpuAI() {
      // move toward where the shuttle will be on its side; jump & swing when close
      if (!bird || !bird.live) { cpu.x += (W * 0.75 - cpu.x) * 0.05; return; }
      // The player's smash is too fast to dig out every time — on the ~half rolled
      // unreturnable, the computer can't get there, so it doesn't chase or swing.
      if (bird.smashByYou && bird.cpuCanReturn === false) return;
      var target = W * 0.75;
      var comingToCpu = (bird.x > NET_X) || (bird.vx > 0);
      if (comingToCpu) {
        // predict landing x on the CPU side (uses the same floaty physics)
        var x = bird.x, y = bird.y, vx = bird.vx, vy = bird.vy, g = 0;
        while (y < GROUND && g < 400) {
          vy += BIRD_GRAV; vx *= BIRD_DRAG; vy *= BIRD_DRAG; x += vx; y += vy;
          if (x < BIRD_R + 2) { x = BIRD_R + 2; vx = Math.abs(vx) * 0.7; }
          if (x > W - BIRD_R - 2) { x = W - BIRD_R - 2; vx = -Math.abs(vx) * 0.7; }
          g++;
        }
        target = Math.max(NET_X + PLAYER_W + 10, Math.min(W - PLAYER_W, x));
      }
      var d = target - cpu.x;
      cpu.x += Math.max(-4.4, Math.min(4.4, d * 0.14));
      cpu.x = Math.max(NET_X + PLAYER_W, Math.min(W - PLAYER_W, cpu.x));
      cpu.facing = -1;

      if (!comingToCpu || bird.x < NET_X) return;   // nothing to do until it's on our side
      if (bird.last === 'cpu') return;              // already returned it; wait for the player

      var overhead = bird.y < NET_TOP - 10;          // high enough to smash
      var nearX = Math.abs(bird.x - cpu.x) < 44;     // lined up horizontally
      var racketY = cpu.y - 60;                      // approx racket height when standing

      // jump to reach a high shuttle that's close
      if (overhead && Math.abs(bird.x - cpu.x) < 80 && cpu.onGround) doJump(cpu);

      // swing when the shuttle is within the racket's reach (so the hit actually connects & clears)
      var reachable = nearX && bird.y > racketY - 80 && bird.y < GROUND - 6;
      if (reachable && cpu.swing <= 0) doSwing(cpu);
    }

    /* ---------- drawing ---------- */
    function drawCourt() {
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1220'); bg.addColorStop(1, '#0e1a28');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var fg = ctx.createLinearGradient(0, GROUND, 0, H); fg.addColorStop(0, '#1c455c'); fg.addColorStop(1, '#123246');
      ctx.fillStyle = fg; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(W * 0.03, GROUND); ctx.lineTo(W * 0.97, GROUND); ctx.stroke();
      // net
      ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1;
      for (var y = NET_TOP; y < GROUND; y += 8) { ctx.beginPath(); ctx.moveTo(NET_X - 10, y); ctx.lineTo(NET_X + 10, y); ctx.stroke(); }
      ctx.fillStyle = '#fff'; ctx.fillRect(NET_X - 11, NET_TOP - 3, 22, 4);
      ctx.fillStyle = '#cfd8e2'; ctx.fillRect(NET_X - 13, NET_TOP - 4, 3, GROUND - NET_TOP + 6); ctx.fillRect(NET_X + 10, NET_TOP - 4, 3, GROUND - NET_TOP + 6);
    }

    function drawStick(p, color) {
      ctx.save(); ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0, 2, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
      var crouch = p.onGround ? 0 : -4;
      // legs
      ctx.beginPath(); ctx.moveTo(-2, -22 + crouch); ctx.lineTo(-9, 0); ctx.moveTo(2, -22 + crouch); ctx.lineTo(9, 0); ctx.stroke();
      // torso
      ctx.beginPath(); ctx.moveTo(0, -22 + crouch); ctx.lineTo(0, -50 + crouch); ctx.stroke();
      // head
      ctx.beginPath(); ctx.arc(0, -58 + crouch, 8, 0, Math.PI * 2); ctx.fill();
      // racket arm
      var prog = p.swing > 0 ? (16 - p.swing) / 16 : 0;
      var ang = -1.15 + prog * 1.9;
      var ex = Math.cos(ang) * RACKET * p.facing * 0.6 + RACKET * 0.2 * p.facing;
      var ey = -60 + crouch - Math.sin(ang) * RACKET * 0.55;
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -46 + crouch); ctx.lineTo(ex, ey); ctx.stroke();
      // racket head at tip
      ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(ex + p.facing * 6, ey - 4, 8, 12, p.facing * (ang), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    function drawBird() {
      if (!bird) return;
      var sx = bird.x, sy = bird.y;
      ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(sx, GROUND, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
      var sp = Math.hypot(bird.vx, bird.vy);
      if (sp > 5) { ctx.strokeStyle = 'rgba(255,120,90,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - bird.vx * 3, sy - bird.vy * 3); ctx.lineTo(sx, sy); ctx.stroke(); }
      var ang = Math.atan2(bird.vy, bird.vx) + Math.PI / 2;
      drawShuttle(ctx, sx, sy, 0.42, ang);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      drawCourt();
      if (you) drawStick(you, '#5b86ff');
      if (cpu) drawStick(cpu, '#8fd0ff');
      if (state === 'play' || state === 'point') drawBird();
      for (var i = 0; i < particles.length; i++) { var pt = particles[i]; ctx.globalAlpha = pt.life; ctx.fillStyle = 'rgba(' + pt.c + ',' + pt.life + ')'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 2 + pt.life * 2.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    }

    function loop() { if (state !== 'idle') update(); draw(); requestAnimationFrame(loop); }

    size(); layout(); resetPositions();
    window.addEventListener('resize', function () { size(); layout(); if (state === 'idle') resetPositions(); });
    setMsg(T('play.msgStart'));
    // When idle (not mid-game), refresh the start prompt on language change.
    document.addEventListener('i18n:change', function () { if (state === 'idle') setMsg(T('play.msgStart')); });
    loop();
  })();

  /* =====================================================================
     10. SG BADMINTON HUB — venue directory, booking guide, groups
         Tabs + searchable / filterable directory of Singapore halls.
         Addresses from Google Maps & the official SportSG dataset.
     ===================================================================== */
  (function sgHub() {
    var hub = document.getElementById('hub');
    if (!hub) return;

    // id: stable key used to look up translated name/area/meta in I18N.data.venues.
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

    var I18N = window.I18N;
    function T(key, vars) { return I18N ? I18N.t(key, vars) : key; }
    function lang() { return I18N ? I18N.lang() : 'en'; }
    // Merge English defaults with any translated name/area/meta for the language.
    function loc(v) {
      var over = (I18N && I18N.data.venues[lang()] && I18N.data.venues[lang()][v.id]) || null;
      return {
        name: (over && over.name) || v.name,
        area: (over && over.area) || v.area,
        meta: over && over.meta ? over.meta : v.meta
      };
    }

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
      // Search matches both English and translated name/area so it works in any language.
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

      if (countEl) countEl.textContent = list.length === 1 ? T('hub.countOne') : T('hub.count', { n: list.length });

      if (!list.length) {
        grid.innerHTML = '<p class="hub__empty">' + T('hub.empty') + '</p>';
        return;
      }

      grid.innerHTML = list.map(function (v) {
        var l = loc(v);
        var book = v.book || (v.type === 'activesg' ? ACTIVESG_BOOK : '');
        var bookLabel = v.type === 'activesg' ? T('hub.bookActivesg') : T('hub.book');
        var actions = '<a class="hcard__link" href="' + mapsUrl(v) + '" target="_blank" rel="noopener" aria-label="' + attr(T('hub.mapAria', { name: l.name })) + '">' + T('hub.map') + ' \u2197</a>';
        if (book) actions += '<a class="hcard__link hcard__link--book" href="' + book + '" target="_blank" rel="noopener" aria-label="' + attr(T('hub.bookAria', { name: l.name })) + '">' + bookLabel + ' \u2197</a>';
        return '<article class="hcard">' +
          '<div class="hcard__head">' +
            '<h3 class="hcard__name">' + esc(l.name) + '</h3>' +
            '<div class="hcard__tags">' +
              '<span class="hcard__tag hcard__tag--' + v.type + '">' + T('tag.' + v.type) + '</span>' +
              (v.elever && v.type !== 'elever' ? '<span class="hcard__tag hcard__tag--elever">' + T('tag.elever') + '</span>' : '') +
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
    // book/groups panels is handled by the i18n engine directly).
    document.addEventListener('i18n:change', render);
  })();

})();
