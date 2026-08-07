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

    // feather skirt (cone of feathers)
    var feathers = 14, topR = 34, botR = 9, len = 60;
    for (var i = 0; i < feathers; i++) {
      var t = (i / (feathers - 1)) - 0.5;         // -0.5..0.5
      var spread = t * topR * 2;
      ctx.beginPath();
      ctx.moveTo(-botR * (t * 2), 0);              // base near cork
      ctx.lineTo(spread - 6, -len);
      ctx.lineTo(spread + 6, -len);
      ctx.closePath();
      var g = ctx.createLinearGradient(0, 0, 0, -len);
      g.addColorStop(0, 'rgba(255,255,255,.95)');
      g.addColorStop(1, 'rgba(210,222,238,.65)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,140,165,.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    // binding threads
    ctx.strokeStyle = 'rgba(150,170,195,.5)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, -len * 0.55, topR * 0.55, 6, 0, 0, Math.PI * 2); ctx.stroke();

    // cork base (rounded)
    var cg = ctx.createRadialGradient(-4, 6, 2, 0, 10, 22);
    cg.addColorStop(0, '#ffffff');
    cg.addColorStop(1, '#d8dee7');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 8, botR + 5, 0, Math.PI * 2);
    ctx.fill();
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
          hue: Math.random() < 0.6 ? '198,255,46' : '255,255,255'
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
        ctx.strokeStyle = '#c6ff2e';
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
        ctx.fillStyle = '#c6ff2e';
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
    ctx.strokeStyle = 'rgba(198,255,46,.9)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
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

    // 27 real players — photos are freely licensed (Wikimedia Commons: CC-BY / CC-BY-SA / Public domain).
    var IMG = 'assets/img/players/';
    var PLAYERS = {
      an:       { name: 'An Se-young', flag: '🇰🇷', role: 'Women\u2019s Singles · World No. 1', tag: 'The Relentless Counter-Puncher', img: IMG + 'an-se-young.jpg', lic: 'CC BY-SA 2.0',
        desc: 'Olympic & World champion who wins with suffocating consistency: she absorbs pace, extends rallies and flips defence into attack in a single shot. Ice-cold discipline, elite stamina, endless patience.' },
      tai:      { name: 'Tai Tzu-ying', flag: '🇹🇼', role: 'Women\u2019s Singles · Legend', tag: 'The Court Artist', img: IMG + 'tai-tzu-ying.jpg', lic: 'CC BY 2.0',
        desc: 'The most deceptive player of her generation \u2014 spontaneous, creative and impossible to read. She controls rallies with disguise and wristy magic rather than raw power. Pure improvisation.' },
      akane:    { name: 'Akane Yamaguchi', flag: '🇯🇵', role: 'Women\u2019s Singles · 3× World Champion', tag: 'The Tireless Retriever', img: IMG + 'akane-yamaguchi.jpg', lic: 'CC BY 3.0',
        desc: 'Proof that heart beats height. Bottomless defence, blistering footwork and a never-give-up spirit force opponents to hit one more shot \u2014 until they crack. Humble off court, ferocious on it.' },
      yeo:      { name: 'Yeo Jia Min', flag: '🇸🇬', role: 'Women\u2019s Singles · Singapore', tag: 'The Quiet Giant-Killer', img: IMG + 'yeo-jia-min.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Singapore\u2019s under-the-radar star who has toppled Yamaguchi, Sindhu and other top-10 names. Humble, self-analytical and mentally tough \u2014 she rises without the spotlight and lets her racket talk.' },
      axelsen:  { name: 'Viktor Axelsen', flag: '🇩🇰', role: 'Men\u2019s Singles · 2× Olympic Champion', tag: 'The Problem-Solver', img: IMG + 'viktor-axelsen.jpg', lic: 'CC BY 4.0',
        desc: 'The ultimate professional: methodical, disciplined and relentlessly self-improving. Towering defence married to a devastating smash \u2014 there\u2019s no problem on court he can\u2019t engineer a solution to.' },
      kunlavut: { name: 'Kunlavut Vitidsarn', flag: '🇹🇭', role: 'Men\u2019s Singles · World Champion', tag: 'The Rally Chess-Master', img: IMG + 'kunlavut-vitidsarn.jpg', lic: 'CC BY 3.0',
        desc: 'A patient, tactical thinker with elite defence who pushes you back, opens the court and counter-attacks the instant you\u2019re out of position. Calm, deceptive at the net, endlessly adaptable.' },
      loh:      { name: 'Loh Kean Yew', flag: '🇸🇬', role: 'Men\u2019s Singles · Singapore, 2021 World Champ', tag: 'The Fearless Attacker', img: IMG + 'loh-kean-yew.jpg', lic: 'CC BY 4.0',
        desc: 'Singapore\u2019s first world champion. Explosive speed, high-flying jump smashes and a huge fighting spirit \u2014 he chases every shuttle and turns defence into attack in a heartbeat. Fearless underdog energy.' },
      antonsen: { name: 'Anders Antonsen', flag: '🇩🇰', role: 'Men\u2019s Singles · World Champion', tag: 'The Tactical Craftsman', img: IMG + 'anders-antonsen.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Wins with brain over brawn: sharp changes of tempo, deceptive strokes, a tight net game and iron mental toughness. Built brick-by-brick from Denmark\u2019s famous club system.' },
      chou:     { name: 'Chou Tien-chen', flag: '🇹🇼', role: 'Men\u2019s Singles · Veteran', tag: 'The Ageless Warrior', img: IMG + 'chou-tien-chen.jpg', lic: 'Attribution',
        desc: 'At 36 the oldest-ever Super 1000 champion. Ferociously fit, disciplined and durable \u2014 he out-lasts younger rivals through relentless conditioning and sheer will.' },
      naraoka:  { name: 'Kodai Naraoka', flag: '🇯🇵', role: 'Men\u2019s Singles · Rising Star', tag: 'The Marathon Runner', img: IMG + 'kodai-naraoka.jpg', lic: 'CC BY-SA 4.0',
        desc: 'A defensive powerhouse who thrives in brutal, lung-busting rallies. Turns matches into endurance tests and simply refuses to miss.' },
      shi:      { name: 'Shi Yuqi', flag: '🇨🇳', role: 'Men\u2019s Singles · Former World No. 1', tag: 'The Complete Package', img: IMG + 'shi-yuqi.jpg', lic: 'CC BY 4.0',
        desc: 'Smooth, balanced and technically flawless \u2014 strong in every phase, with the calm of a player who\u2019s solved the game. All-round excellence.' },
      jonatan:  { name: 'Jonatan Christie', flag: '🇮🇩', role: 'Men\u2019s Singles · Asian Champion', tag: 'The Crowd-Pleaser', img: IMG + 'jonatan-christie.jpg', lic: 'CC BY 2.0',
        desc: 'Athletic, charismatic and attack-minded \u2014 he feeds off the crowd and lights up an arena with explosive, entertaining badminton.' },
      lakshya:  { name: 'Lakshya Sen', flag: '🇮🇳', role: 'Men\u2019s Singles · India', tag: 'The Fearless Youngster', img: IMG + 'lakshya-sen.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Fast, aggressive and unafraid of anyone\u2019s reputation. A gutsy shot-maker who plays his best badminton on the biggest stages.' },
      chenyf:   { name: 'Chen Yufei', flag: '🇨🇳', role: 'Women\u2019s Singles · Olympic Champion', tag: 'The Ice Queen', img: IMG + 'chen-yufei.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Tokyo 2020 gold medallist with a controlled, weighty game and nerves of steel. She dictates rallies with placement and composure.' },
      marin:    { name: 'Carolina Marín', flag: '🇪🇸', role: 'Women\u2019s Singles · Olympic Champion', tag: 'The Fierce Competitor', img: IMG + 'carolina-mar-n.jpg', lic: 'CC BY-SA 2.0',
        desc: 'Europe\u2019s trailblazer \u2014 explosive, left-handed and famously fiery. Roars through rallies with relentless attacking intensity and passion.' },
      sindhu:   { name: 'P. V. Sindhu', flag: '🇮🇳', role: 'Women\u2019s Singles · 2× Olympic Medallist', tag: 'The Big-Match Player', img: IMG + 'p-v-sindhu.jpg', lic: 'CC BY-SA 3.0',
        desc: 'Tall, powerful and built for the occasion \u2014 a towering smash and a champion\u2019s temperament that peaks when the medals are on the line.' },
      ratchanok:{ name: 'Ratchanok Intanon', flag: '🇹🇭', role: 'Women\u2019s Singles · Former World Champ', tag: 'The Silky Stylist', img: IMG + 'ratchanok-intanon.jpg', lic: 'CC BY 3.0',
        desc: 'Elegant, wristy and wonderfully deceptive \u2014 she wins with touch, timing and clever angles rather than brute force.' },
      wangzy:   { name: 'Wang Zhiyi', flag: '🇨🇳', role: 'Women\u2019s Singles · World No. 2', tag: 'The Steady Riser', img: IMG + 'wang-zhiyi.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Consistent, composed and quietly climbing to the top with solid all-court play and a cool head under pressure.' },
      leezii:   { name: 'Lee Zii Jia', flag: '🇲🇾', role: 'Men\u2019s Singles · Malaysia', tag: 'The Independent Maverick', img: IMG + 'lee-zii-jia.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Flashy, powerful and fiercely his own person \u2014 he went independent to chase his dream his way, with a spectacular attacking game.' },
      ginting:  { name: 'Anthony Ginting', flag: '🇮🇩', role: 'Men\u2019s Singles · Indonesia', tag: 'The Speed Demon', img: IMG + 'anthony-sinisuka-ginting.jpg', lic: 'CC BY 4.0',
        desc: 'Lightning-fast footwork and a rapid-fire attacking style. He overwhelms opponents with sheer pace and quick hands.' },
      gregoria: { name: 'Gregoria M. Tunjung', flag: '🇮🇩', role: 'Women\u2019s Singles · Olympic Medallist', tag: 'The Resilient Fighter', img: IMG + 'gregoria-mariska-tunjung.jpg', lic: 'Public domain',
        desc: 'Battled through setbacks to a Paris 2024 bronze. Tenacious, improving and full of heart \u2014 she never stops believing.' },
      lindan:   { name: 'Lin Dan', flag: '🇨🇳', role: 'Men\u2019s Singles · The G.O.A.T.', tag: 'The Super Dan', img: IMG + 'lin-dan.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Two-time Olympic champion and the most decorated men\u2019s singles player ever. Charismatic, dominant and box-office \u2014 a once-in-a-generation icon.' },
      lcw:      { name: 'Lee Chong Wei', flag: '🇲🇾', role: 'Men\u2019s Singles · Legend', tag: 'The Eternal Contender', img: IMG + 'lee-chong-wei.jpg', lic: 'CC BY-SA 2.0',
        desc: 'A record-breaking world No. 1 and Malaysia\u2019s hero \u2014 blistering speed and a fighter\u2019s heart that never gave up chasing gold.' },
      okuhara:  { name: 'Nozomi Okuhara', flag: '🇯🇵', role: 'Women\u2019s Singles · World Champion', tag: 'The Iron Retriever', img: IMG + 'nozomi-okuhara.jpg', lic: 'CC BY 4.0',
        desc: 'Small in stature, giant in defence. Famous for epic marathon rallies and a bottomless tank of stamina and grit.' },
      momota:   { name: 'Kento Momota', flag: '🇯🇵', role: 'Men\u2019s Singles · 2× World Champion', tag: 'The Comeback King', img: IMG + 'kento-momota.png', lic: 'CC BY 3.0',
        desc: 'A tactical genius with pinpoint control who fought back from adversity to reach world No. 1. Precision, patience and mental steel.' },
      saina:    { name: 'Saina Nehwal', flag: '🇮🇳', role: 'Women\u2019s Singles · Trailblazer', tag: 'The Pioneer', img: IMG + 'saina-nehwal.jpg', lic: 'GODL-India',
        desc: 'The player who put Indian women\u2019s badminton on the map \u2014 aggressive, determined and an inspiration to a whole generation.' },
      tommy:    { name: 'Tommy Sugiarto', flag: '🇮🇩', role: 'Men\u2019s Singles · Indonesia', tag: 'The Crafty Veteran', img: IMG + 'tommy-sugiarto.jpg', lic: 'CC BY-SA 4.0',
        desc: 'Experienced, clever and steady \u2014 he relies on smart placement, deception and years of ring-craft rather than raw power.' }
    };

    // 6 questions; each option weights several player keys. Every player is reachable.
    var QUESTIONS = [
      { q: 'It\u2019s match point against you. What\u2019s your instinct?',
        a: [
          { t: 'Stay calm, extend the rally, wait for their mistake', w: { an: 2, kunlavut: 2, momota: 1, wangzy: 1 } },
          { t: 'Go for a bold, unexpected winner', w: { tai: 2, loh: 2, leezii: 1 } },
          { t: 'Trust the plan I drilled for exactly this moment', w: { axelsen: 2, momota: 1, shi: 1 } },
          { t: 'Dig in and out-run them \u2014 I never stop chasing', w: { akane: 2, naraoka: 2, okuhara: 1 } }
        ] },
      { q: 'Pick your signature shot.',
        a: [
          { t: 'A thunderous jump smash', w: { loh: 2, axelsen: 1, sindhu: 1, leezii: 1 } },
          { t: 'A disguised drop that fools everyone', w: { tai: 2, ratchanok: 2, antonsen: 1, tommy: 1 } },
          { t: 'A gets-everything defensive retrieve', w: { akane: 2, okuhara: 2, naraoka: 1 } },
          { t: 'A blistering fast net-to-net exchange', w: { ginting: 2, jonatan: 1, lakshya: 1 } }
        ] },
      { q: 'How do you train?',
        a: [
          { t: 'Rigid routine, strict diet, zero shortcuts', w: { an: 2, axelsen: 1, chou: 2 } },
          { t: 'Experiment, improvise, keep it playful', w: { tai: 2, ratchanok: 1, lindan: 1 } },
          { t: 'Grind fitness until my tank is bottomless', w: { naraoka: 2, okuhara: 2, chou: 1 } },
          { t: 'Quietly fix my weaknesses, session by session', w: { yeo: 2, kunlavut: 1, wangzy: 1, shi: 1 } }
        ] },
      { q: 'What\u2019s your energy on court?',
        a: [
          { t: 'Fiery \u2014 I roar, I fist-pump, I feed off emotion', w: { marin: 2, lindan: 1, jonatan: 1 } },
          { t: 'Ice-cold and unreadable', w: { chenyf: 2, momota: 1, an: 1 } },
          { t: 'Humble \u2014 I\u2019d rather fly under the radar', w: { yeo: 2, okuhara: 1, gregoria: 1, tommy: 1 } },
          { t: 'A showman \u2014 I love entertaining the crowd', w: { lindan: 2, jonatan: 2, leezii: 1 } }
        ] },
      { q: 'What drives you the most?',
        a: [
          { t: 'Being a fearless underdog with nothing to lose', w: { loh: 2, lakshya: 2, gregoria: 1 } },
          { t: 'Blazing a trail others will follow', w: { marin: 1, saina: 2, sindhu: 1, lcw: 1 } },
          { t: 'Outlasting everyone through sheer fitness', w: { chou: 2, naraoka: 1, okuhara: 1 } },
          { t: 'Perfecting a complete, all-round game', w: { shi: 2, axelsen: 1, wangzy: 1, kunlavut: 1 } }
        ] },
      { q: 'Your ideal way to win a point?',
        a: [
          { t: 'Overwhelm them with power and speed', w: { loh: 1, sindhu: 2, ginting: 2, leezii: 1 } },
          { t: 'Outsmart them with deception and touch', w: { tai: 2, ratchanok: 1, tommy: 1, antonsen: 2 } },
          { t: 'Outlast them until they break', w: { an: 1, akane: 2, naraoka: 1, okuhara: 1 } },
          { t: 'Rise to the moment when it matters most', w: { sindhu: 1, lcw: 2, lindan: 1, saina: 1, momota: 1 } }
        ] }
    ];

    var scores = {}, current = 0;
    var qWrap = document.getElementById('quizQ');
    var progress = document.getElementById('quizProgress');
    var result = document.getElementById('quizResult');
    var stage = document.getElementById('quizStage');
    var startBtn = document.getElementById('quizStart');
    var intro = document.getElementById('quizIntro');

    function reset() {
      scores = {}; current = 0;
      Object.keys(PLAYERS).forEach(function (k) { scores[k] = 0; });
    }

    function renderQuestion() {
      var Q = QUESTIONS[current];
      progress.style.width = ((current) / QUESTIONS.length * 100) + '%';
      var html = '<p class="quiz__count">Question ' + (current + 1) + ' / ' + QUESTIONS.length + '</p>';
      html += '<h3 class="quiz__q">' + Q.q + '</h3><div class="quiz__opts">';
      Q.a.forEach(function (opt, i) {
        html += '<button class="quiz__opt" data-i="' + i + '"><span>' + String.fromCharCode(65 + i) + '</span>' + opt.t + '</button>';
      });
      html += '</div>';
      qWrap.innerHTML = html;
      qWrap.classList.remove('fade'); void qWrap.offsetWidth; qWrap.classList.add('fade');
      qWrap.querySelectorAll('.quiz__opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var w = Q.a[+btn.dataset.i].w;
          Object.keys(w).forEach(function (k) { scores[k] += w[k]; });
          current++;
          if (current < QUESTIONS.length) renderQuestion();
          else showResult();
        });
      });
    }

    function showResult() {
      progress.style.width = '100%';
      var bestScore = -1;
      Object.keys(scores).forEach(function (k) { if (scores[k] > bestScore) bestScore = scores[k]; });
      // collect everyone tied at the top, then pick one at random for variety
      var top = Object.keys(scores).filter(function (k) { return scores[k] === bestScore; });
      var best = top[Math.floor(Math.random() * top.length)];
      var p = PLAYERS[best];
      qWrap.style.display = 'none';
      result.style.display = 'block';
      result.innerHTML =
        '<p class="quiz__count">Your badminton twin is\u2026</p>' +
        '<div class="quiz__photo"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"><span class="quiz__flagbadge">' + p.flag + '</span></div>' +
        '<h3 class="quiz__name">' + p.name + '</h3>' +
        '<p class="quiz__role">' + p.role + '</p>' +
        '<p class="quiz__playertag">\u201C' + p.tag + '\u201D</p>' +
        '<p class="quiz__desc">' + p.desc + '</p>' +
        '<button class="btn btn--ghost" id="quizAgain">Play again</button>' +
        '<p class="quiz__credit">Photo: Wikimedia Commons · ' + p.lic + '</p>';
      result.classList.remove('fade'); void result.offsetWidth; result.classList.add('fade');
      document.getElementById('quizAgain').addEventListener('click', function () {
        result.style.display = 'none'; qWrap.style.display = 'block';
        reset(); renderQuestion();
      });
    }

    startBtn.addEventListener('click', function () {
      intro.style.display = 'none';
      stage.style.display = 'block';
      reset(); renderQuestion();
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

    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

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
        var cls = 'ncard' + (ev.latest ? ' ncard--latest' : '') + (ev.status === 'upcoming' ? ' ncard--next' : '');
        html += '<article class="' + cls + '">';
        html += '<div class="ncard__head"><span class="ncard__date">' + ev.date + ' ' + ev.m.slice(0, 3) + ' 2026' + (ev.latest ? ' · Latest' : (ev.status === 'upcoming' ? ' · Upcoming' : '')) + '</span>';
        html += '<span class="ncard__grade">' + esc(ev.grade) + '</span></div>';
        html += '<h4 class="ncard__name">' + esc(ev.name) + '</h4>';
        if (ev.result) html += '<p class="ncard__result">' + esc(ev.result) + '</p>';
        else html += '<p class="ncard__result ncard__result--muted">' + (ev.status === 'upcoming' ? 'Scheduled — results to come.' : 'Completed. Champions per BWF records.') + '</p>';
        html += '</article>';
      });
      mount.innerHTML = html;

      var extra = list.length - VISIBLE;
      if (toggleBtn) {
        if (extra > 0) {
          toggleBtn.style.display = '';
          toggleBtn.textContent = expanded ? 'Show less' : ('Show all ' + list.length + ' tournaments');
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
        filters.querySelectorAll('.news__filter').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        currentFilter = btn.dataset.filter;
        expanded = false;
        render();
      });
    }
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

    function size() { W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * DPR; canvas.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }

    /* ================= real-time side-view physics =================
       Original implementation (own code/art/physics) in the classic
       "move + jump + swing" stick badminton style.
       Screen pixels used directly; ground line near the bottom. =========== */
    var GROUND, NET_X, NET_TOP, GRAV = 0.42, PLAYER_W = 26, RACKET = 66;
    var TARGET = 7;

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

    function serveBird(byWho) {
      rally = 0; updateScore(); setShot('—');
      var fromLeft = byWho === 'you';
      bird = {
        x: fromLeft ? you.x + 20 : cpu.x - 20,
        y: GROUND - 120,
        vx: fromLeft ? 3.2 : -3.2,
        vy: -6.5,
        live: true, last: byWho, cool: 0
      };
      state = 'play';
      setMsg(byWho === 'you' ? 'Your serve! ← → move · ↑ / W jump · SPACE / ↓ swing.' : 'Opponent serves — move under the shuttle and swing!');
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
      burst(bird ? bird.x : W / 2, bird ? bird.y : GROUND, who === 'you' ? '198,255,46' : '255,90,90', 26);
      setMsg((who === 'you' ? 'Point YOU' : 'Point Dummy') + ' — ' + reason + '.  ' + scoreYou + '\u2013' + scoreCpu);
      if (bird) bird.live = false;
      if (scoreYou >= TARGET || scoreCpu >= TARGET) {
        state = 'over';
        setTimeout(function () {
          elStart.style.display = ''; elStart.textContent = 'Play again';
          setMsg(scoreYou > scoreCpu ? 'GAME! You win ' + scoreYou + '\u2013' + scoreCpu + ' \uD83C\uDFC6' : 'Dummy wins ' + scoreCpu + '\u2013' + scoreYou + '. Play again!');
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
    // touch: left half moves toward tap; tap always swings; swipe up jumps
    canvas.addEventListener('touchstart', function (e) {
      if (state === 'idle') return;
      var t = e.touches[0], r = canvas.getBoundingClientRect(), tx = t.clientX - r.left, ty = t.clientY - r.top;
      you._touchX = tx;
      if (ty < r.height * 0.5) doJump(you);
      doSwing(you);
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) { var t = e.touches[0], r = canvas.getBoundingClientRect(); you._touchX = t.clientX - r.left; e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', function () { if (you) you._touchX = null; });
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
      if (!bird || !bird.live || p.swing <= 0 || bird.cool > 0) return;
      // shuttle must be on the striker's own side (can't reach across the net)
      if (who === 'you' && bird.x > NET_X - 4) return;
      if (who === 'cpu' && bird.x < NET_X + 4) return;
      var tip = racketTip(p);
      var dx = bird.x - tip.x, dy = bird.y - tip.y;
      if (dx * dx + dy * dy > 58 * 58) return;

      var dir = who === 'you' ? 1 : -1;
      var high = bird.y < NET_TOP - 10;      // clearly above the net -> can attack down

      if (high && Math.abs(bird.x - NET_X) > W * 0.10) {
        // SMASH: fast & downward, but still starts from above the net so it clears
        bird.vx = dir * (9 + Math.random() * 2);
        bird.vy = 2.6 + Math.random() * 1.2;
        setShot((who === 'you' ? 'You' : 'Dummy') + ': SMASH!');
        burst(tip.x, tip.y, '255,90,90', 26);
      } else {
        // CLEAR / LIFT: aim to land deep in the far court, guaranteed to arc over the net.
        var landX = who === 'you' ? (W * 0.70 + Math.random() * W * 0.20) : (W * 0.10 + Math.random() * W * 0.20);
        var g = GRAV * 0.35;
        // choose an apex height well above the net
        var apexY = Math.min(bird.y, NET_TOP) - (60 + Math.random() * 60);
        var riseH = Math.max(40, bird.y - apexY);
        var vUp = Math.sqrt(2 * g * riseH);            // speed needed to rise riseH
        var tUp = vUp / g;                             // frames to apex
        var tDown = Math.sqrt(2 * (GROUND - apexY) / g);
        var totalT = tUp + tDown;
        bird.vy = -vUp;
        bird.vx = (landX - bird.x) / totalT;
        // keep horizontal speed sane
        bird.vx = Math.max(-8, Math.min(8, bird.vx));
        setShot((who === 'you' ? 'You' : 'Dummy') + ': Clear');
        burst(tip.x, tip.y, '150,220,255', 16);
      }
      bird.last = who; bird.cool = 14; rally++; updateScore();
      p.swing = Math.min(p.swing, 8);
    }

    /* ---------- update ---------- */
    function update() {
      // ----- YOU -----
      var mv = 0;
      if (keys['arrowleft'] || keys['a']) mv -= 1;
      if (keys['arrowright'] || keys['d']) mv += 1;
      if (mv === 0 && you._touchX != null) mv = (you._touchX - you.x) > 6 ? 1 : ((you._touchX - you.x) < -6 ? -1 : 0);
      you.x += mv * 4.6; if (mv) you.facing = mv > 0 ? 1 : -1;
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
        bird.vy += GRAV * 0.35; bird.x += bird.vx; bird.y += bird.vy; if (bird.cool > 0) bird.cool--;
        // net: block low crossings
        if (bird.x > NET_X - 6 && bird.x < NET_X + 6 && bird.y > NET_TOP) {
          bird.vx *= -0.3; bird.x += bird.vx * 2;
          awardPoint(bird.last === 'you' ? 'cpu' : 'you', (bird.last === 'you' ? 'you' : 'dummy') + ' hit the net');
        }
        // walls (out to the sides)
        if (bird.x < 6 || bird.x > W - 6) awardPoint(bird.last === 'you' ? 'cpu' : 'you', 'shuttle went out');
        // floor
        if (bird.y >= GROUND) {
          bird.y = GROUND;
          if (bird.x < NET_X) awardPoint('cpu', 'shuttle landed on your side');
          else awardPoint('you', 'shuttle landed on the dummy\u2019s side');
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
      var target = W * 0.75;
      var comingToCpu = (bird.x > NET_X) || (bird.vx > 0);
      if (comingToCpu) {
        // predict landing x on the CPU side
        var x = bird.x, y = bird.y, vx = bird.vx, vy = bird.vy, g = 0;
        while (y < GROUND && g < 260) { vy += GRAV * 0.35; x += vx; y += vy; g++; }
        target = Math.max(NET_X + PLAYER_W + 10, Math.min(W - PLAYER_W, x));
      }
      var d = target - cpu.x;
      cpu.x += Math.max(-4.4, Math.min(4.4, d * 0.14));
      cpu.x = Math.max(NET_X + PLAYER_W, Math.min(W - PLAYER_W, cpu.x));
      cpu.facing = -1;

      if (!comingToCpu || bird.x < NET_X) return;   // nothing to do until it's on our side

      var overhead = bird.y < NET_TOP - 10;          // high enough to smash
      var nearX = Math.abs(bird.x - cpu.x) < 46;     // lined up horizontally
      var racketY = cpu.y - 60;                      // approx racket height when standing

      // jump to reach a high shuttle that's close
      if (overhead && Math.abs(bird.x - cpu.x) < 80 && cpu.onGround) doJump(cpu);

      // swing when the shuttle is within the racket's reach (so the hit actually connects & clears)
      var reachable = nearX && bird.y > racketY - 70 && bird.y < GROUND - 8;
      if (reachable && bird.cool === 0 && cpu.swing <= 0) doSwing(cpu);
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
      ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(sx, GROUND, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
      var sp = Math.hypot(bird.vx, bird.vy);
      if (sp > 8) { ctx.strokeStyle = 'rgba(255,120,90,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx - bird.vx * 3, sy - bird.vy * 3); ctx.lineTo(sx, sy); ctx.stroke(); }
      var ang = Math.atan2(bird.vy, bird.vx) + Math.PI / 2;
      drawShuttle(ctx, sx, sy, 0.7, ang);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      drawCourt();
      if (you) drawStick(you, '#c6ff2e');
      if (cpu) drawStick(cpu, '#8fd0ff');
      if (state === 'play' || state === 'point') drawBird();
      for (var i = 0; i < particles.length; i++) { var pt = particles[i]; ctx.globalAlpha = pt.life; ctx.fillStyle = 'rgba(' + pt.c + ',' + pt.life + ')'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 2 + pt.life * 2.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    }

    function loop() { if (state !== 'idle') update(); draw(); requestAnimationFrame(loop); }

    size(); layout(); resetPositions();
    window.addEventListener('resize', function () { size(); layout(); if (state === 'idle') resetPositions(); });
    setMsg('Press Start. ← → move · ↑ jump · SPACE swing. Jump into high shuttles to SMASH. First to 7!');
    loop();
  })();

})();
