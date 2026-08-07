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

    // 8 real players (facts drawn from BWF/Wikipedia/coach profiles)
    var PLAYERS = {
      an: { name: 'An Se-young', flag: '🇰🇷', role: 'Women\u2019s Singles · World No. 1',
        tag: 'The Relentless Counter-Puncher',
        desc: 'Olympic & World champion who wins with suffocating consistency: she absorbs pace, extends rallies and flips defence into attack in a single shot. Ice-cold discipline, elite stamina, endless patience.' },
      tai: { name: 'Tai Tzu-ying', flag: '🇹🇼', role: 'Women\u2019s Singles · Legend',
        tag: 'The Court Artist',
        desc: 'The most deceptive player of her generation \u2014 spontaneous, creative and impossible to read. She controls rallies with disguise and wristy magic rather than raw power. Pure improvisation.' },
      akane: { name: 'Akane Yamaguchi', flag: '🇯🇵', role: 'Women\u2019s Singles · 3× World Champion',
        tag: 'The Tireless Retriever',
        desc: 'Proof that heart beats height. Bottomless defence, blistering footwork and a never-give-up spirit force opponents to hit "one more shot" \u2014 until they crack. Humble off court, ferocious on it.' },
      yeo: { name: 'Yeo Jia Min', flag: '🇸🇬', role: 'Women\u2019s Singles · Singapore',
        tag: 'The Quiet Giant-Killer',
        desc: 'Singapore\u2019s under-the-radar star who has toppled Yamaguchi, Sindhu and other top-10 names. Humble, self-analytical and mentally tough \u2014 she rises without the spotlight and lets her racket talk.' },
      axelsen: { name: 'Viktor Axelsen', flag: '🇩🇰', role: 'Men\u2019s Singles · 2× Olympic Champion',
        tag: 'The Problem-Solver',
        desc: 'The ultimate professional: methodical, disciplined and relentlessly self-improving. There was no problem on court he couldn\u2019t engineer a solution to \u2014 towering defence married to a devastating smash.' },
      kunlavut: { name: 'Kunlavut Vitidsarn', flag: '🇹🇭', role: 'Men\u2019s Singles · World Champion',
        tag: 'The Rally Chess-Master',
        desc: 'A patient, tactical thinker with elite defence who pushes you back, opens the court and counter-attacks the instant you\u2019re out of position. Calm, deceptive at the net, endlessly adaptable.' },
      loh: { name: 'Loh Kean Yew', flag: '🇸🇬', role: 'Men\u2019s Singles · Singapore, 2021 World Champ',
        tag: 'The Fearless Attacker',
        desc: 'Singapore\u2019s first world champion. Explosive speed, high-flying jump smashes and a huge fighting spirit \u2014 he chases every shuttle and turns defence into attack in a heartbeat. Fearless underdog energy.' },
      antonsen: { name: 'Anders Antonsen', flag: '🇩🇰', role: 'Men\u2019s Singles · World Champion',
        tag: 'The Tactical Craftsman',
        desc: 'Wins with brain over brawn: sharp changes of tempo, deceptive strokes, a tight net game and iron mental toughness. Built brick-by-brick from Denmark\u2019s famous club system.' }
    };

    // 5 questions; each option adds weight to player keys
    var QUESTIONS = [
      { q: 'It\u2019s match point against you. What\u2019s your instinct?',
        a: [
          { t: 'Stay calm, extend the rally, wait for their mistake', w: { an: 2, kunlavut: 2, akane: 1 } },
          { t: 'Go for a bold, unexpected winner', w: { tai: 2, loh: 2 } },
          { t: 'Trust the plan I drilled for exactly this moment', w: { axelsen: 2, antonsen: 1 } },
          { t: 'Dig in and out-run them \u2014 I never stop chasing', w: { akane: 2, yeo: 1 } }
        ] },
      { q: 'Pick your signature shot.',
        a: [
          { t: 'A thunderous jump smash', w: { loh: 2, axelsen: 2 } },
          { t: 'A disguised drop that fools everyone', w: { tai: 2, antonsen: 1 } },
          { t: 'A perfect defensive retrieve from nowhere', w: { akane: 2, an: 1 } },
          { t: 'A sharp change of pace that opens the court', w: { kunlavut: 2, antonsen: 1 } }
        ] },
      { q: 'How do you train?',
        a: [
          { t: 'Rigid routine, strict diet, zero shortcuts', w: { an: 2, axelsen: 1 } },
          { t: 'Experiment, improvise, keep it playful', w: { tai: 2 } },
          { t: 'Grind the fundamentals until they\u2019re automatic', w: { akane: 2, antonsen: 1, axelsen: 1 } },
          { t: 'Quietly fix my weaknesses after every session', w: { yeo: 2, kunlavut: 1 } }
        ] },
      { q: 'What\u2019s your mindset off the court?',
        a: [
          { t: 'Humble \u2014 I\u2019d rather fly under the radar', w: { yeo: 2, akane: 1 } },
          { t: 'A relentless professional building an empire', w: { axelsen: 2 } },
          { t: 'A fearless underdog with nothing to lose', w: { loh: 2 } },
          { t: 'A calm strategist, always thinking two moves ahead', w: { kunlavut: 2, an: 1 } }
        ] },
      { q: 'Your ideal way to win a point?',
        a: [
          { t: 'Overwhelm them with power and speed', w: { loh: 2, axelsen: 1 } },
          { t: 'Outsmart them with deception', w: { tai: 2, antonsen: 2 } },
          { t: 'Outlast them until they break', w: { an: 2, akane: 2 } },
          { t: 'Surprise everyone \u2014 nobody expected me', w: { yeo: 2, loh: 1 } }
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
      var best = null, bestScore = -1;
      Object.keys(scores).forEach(function (k) {
        if (scores[k] > bestScore) { bestScore = scores[k]; best = k; }
      });
      var p = PLAYERS[best];
      qWrap.style.display = 'none';
      result.style.display = 'block';
      result.innerHTML =
        '<p class="quiz__count">Your badminton twin is\u2026</p>' +
        '<div class="quiz__flag">' + p.flag + '</div>' +
        '<h3 class="quiz__name">' + p.name + '</h3>' +
        '<p class="quiz__role">' + p.role + '</p>' +
        '<p class="quiz__playertag">\u201C' + p.tag + '\u201D</p>' +
        '<p class="quiz__desc">' + p.desc + '</p>' +
        '<button class="btn btn--ghost" id="quizAgain">Play again</button>';
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
     7b. COACH / FOUNDER FLIP CARDS (fun reveal)
     ===================================================================== */
  (function coachFlip() {
    document.querySelectorAll('.tcard').forEach(function (card) {
      card.addEventListener('click', function () { card.classList.toggle('flipped'); });
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

    function render(filter) {
      var html = '', lastMonth = null;
      EVENTS.forEach(function (ev) {
        if (filter === 'done' && ev.status !== 'done') return;
        if (filter === 'upcoming' && ev.status !== 'upcoming') return;
        if (ev.m !== lastMonth) {
          html += '<h3 class="news__month">' + ev.m + ' 2026</h3>';
          lastMonth = ev.m;
        }
        var cls = 'ncard' + (ev.latest ? ' ncard--latest' : '') + (ev.status === 'upcoming' ? ' ncard--next' : '');
        html += '<article class="' + cls + '">';
        html += '<div class="ncard__head"><span class="ncard__date">' + ev.date + (ev.latest ? ' · Latest' : (ev.status === 'upcoming' ? ' · Upcoming' : '')) + '</span>';
        html += '<span class="ncard__grade">' + esc(ev.grade) + '</span></div>';
        html += '<h4 class="ncard__name">' + esc(ev.name) + '</h4>';
        if (ev.result) html += '<p class="ncard__result">' + esc(ev.result) + '</p>';
        else html += '<p class="ncard__result ncard__result--muted">' + (ev.status === 'upcoming' ? 'Scheduled — results to come.' : 'Completed. Champions per BWF records.') + '</p>';
        html += '</article>';
      });
      mount.innerHTML = html;
    }
    render('all');

    var filters = document.getElementById('newsFilters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('.news__filter');
        if (!btn) return;
        filters.querySelectorAll('.news__filter').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        render(btn.dataset.filter);
      });
    }
  })();

})();
