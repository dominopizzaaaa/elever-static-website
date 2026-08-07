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
     7. INTERACTIVE "SMASH SPEED" METER
     ===================================================================== */
  (function smashMeter() {
    var zone = document.getElementById('smashZone');
    if (!zone) return;
    var fill = document.getElementById('smashFill');
    var val = document.getElementById('smashVal');
    var label = document.getElementById('smashLabel');
    var lastX = null, lastT = null, peak = 0, decayTimer;
    var WR = 565; // world record kmh (Tan Boon Heong exhibition ~493 official; keep aspirational)

    function setSpeed(v) {
      v = Math.min(v, WR);
      peak = Math.max(peak, v);
      var pct = Math.min(v / WR * 100, 100);
      fill.style.width = pct + '%';
      val.textContent = Math.round(v);
      if (v > 480) label.textContent = 'WORLD-CLASS SMASH!';
      else if (v > 300) label.textContent = 'Pro power!';
      else if (v > 150) label.textContent = 'Nice swing!';
      else label.textContent = 'Swipe / drag fast across the court';
    }

    function move(x, y) {
      var now = performance.now();
      if (lastX !== null) {
        var dt = now - lastT;
        var dx = Math.abs(x - lastX);
        if (dt > 0) {
          var speed = (dx / dt) * 1000 / 6; // scaled to a fun kmh-ish number
          setSpeed(speed);
        }
      }
      lastX = x; lastT = now;
      clearTimeout(decayTimer);
      decayTimer = setTimeout(function () { lastX = null; }, 120);
    }
    zone.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    zone.addEventListener('touchmove', function (e) {
      var t = e.touches[0]; move(t.clientX, t.clientY);
    }, { passive: true });
  })();

  /* =====================================================================
     8. DRAGGABLE NEWS TIMELINE
     ===================================================================== */
  (function dragScroll() {
    var track = document.getElementById('newsTrack');
    if (!track) return;
    var down = false, startX, scrollStart;
    track.addEventListener('mousedown', function (e) {
      down = true; track.classList.add('dragging');
      startX = e.pageX; scrollStart = track.scrollLeft;
    });
    window.addEventListener('mouseup', function () { down = false; track.classList.remove('dragging'); });
    track.addEventListener('mousemove', function (e) {
      if (!down) return; e.preventDefault();
      track.scrollLeft = scrollStart - (e.pageX - startX) * 1.4;
    });
  })();

})();
