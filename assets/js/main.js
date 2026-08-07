/* ===================== ÉLEVER BADMINTON — interactions ===================== */
(function () {
  'use strict';

  /* ---------- INTRO: shuttlecock smash ---------- */
  var intro = document.getElementById('intro');
  var skip = document.getElementById('skipIntro');
  var body = document.body;
  body.classList.add('intro-lock');

  function endIntro() {
    if (!intro || intro.classList.contains('done')) return;
    intro.classList.add('done');
    body.classList.remove('intro-lock');
    setTimeout(function () { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); }, 850);
    startReveals();
  }

  if (intro) {
    // kick off the smash animation on next frame
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { intro.classList.add('smash'); });
    });
    // total sequence ~2.6s
    var timer = setTimeout(endIntro, 2600);
    if (skip) skip.addEventListener('click', function () { clearTimeout(timer); endIntro(); });
  } else {
    body.classList.remove('intro-lock');
  }

  /* ---------- NAV: scroll state + mobile menu ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });

  if (burger) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- SCROLL REVEALS ---------- */
  var revealObserver;
  function startReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      runCounters();
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { revealObserver.observe(el); });
    runCounters();
  }

  /* ---------- STAT COUNTERS ---------- */
  function runCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      var io = new IntersectionObserver(function (ent) {
        if (ent[0].isIntersecting) { requestAnimationFrame(step); io.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(el);
    });
  }

  /* ---------- HERO parallax (subtle) ---------- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.transform = 'scale(1.12) translateY(' + (y * 0.15) + 'px)';
    }, { passive: true });
  }

  /* fallback: if intro missing, reveal immediately */
  if (!intro) startReveals();
})();
