/* ===========================================================
   CrossGate Legal — shared site behaviour
   Loaded on index / about / contact
   - glass nav + scroll progress
   - scroll-reveal + animated counters
   - hero constellation canvas (index only)
   - "work in progress" preview flow
   =========================================================== */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- brand mark (re-used in the loader) ---------- */
  var MARK =
    '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<polygon points="20,3 34,12 22,15.5 13.5,11" fill="#C9A96E"/>' +
    '<polygon points="13,13 25,17.5 18,21.5 8.5,18" fill="#C9A96E" opacity="0.9"/>' +
    '<polygon points="19.5,20.5 28,25.5 20.5,28.5 14,24.5" fill="#C9A96E" opacity="0.8"/>' +
    '<polygon points="11,21.5 18.5,25.5 14,34 8.5,27.5" fill="#C9A96E" opacity="0.68"/></svg>';

  /* ---------- inject shared UI (progress, loader, modal) ---------- */
  function injectChrome() {
    var frag = document.createElement('div');
    frag.innerHTML =
      '<div class="scroll-progress" id="scrollProgress"></div>' +
      '<div class="wip-modal" id="wipModal" role="dialog" aria-modal="true" aria-labelledby="wipTitle">' +
        '<div class="wip-card">' +
          '<div class="wip-ring">' +
            '<svg viewBox="0 0 84 84"><circle class="ring-bg" cx="42" cy="42" r="36"/>' +
            '<circle class="ring-fg" cx="42" cy="42" r="36"/></svg>' +
            '<span class="wip-count" id="wipCount">7</span>' +
          '</div>' +
          '<h3 id="wipTitle">Work in progress</h3>' +
          '<p>This page is still being crafted for the full release. ' +
          'We’ll take you back to the homepage in a moment.</p>' +
          '<a href="index.html" class="btn-primary">Return home now</a>' +
        '</div>' +
      '</div>';
    while (frag.firstChild) document.body.appendChild(frag.firstChild);
  }

  /* ---------- glass nav + scroll progress ---------- */
  function initScroll() {
    var nav = document.querySelector('.nav');
    var bar = document.getElementById('scrollProgress');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle('scrolled', y > 24);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav toggle ---------- */
  function initNavToggle() {
    var t = document.querySelector('.nav-toggle');
    var l = document.getElementById('navLinks');
    if (!t || !l) return;
    t.addEventListener('click', function () {
      var open = l.classList.toggle('open');
      t.setAttribute('aria-expanded', open);
    });
    l.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') l.classList.remove('open');
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- animated counters ---------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var dur = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero constellation ---------- */
  function initConstellation() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [], w = 0, h = 0, raf;

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(28, Math.min(64, Math.floor((w * h) / 16000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j], dx = n.x - m.x, dy = n.y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 132) {
            ctx.strokeStyle = 'rgba(201,169,110,' + (0.16 * (1 - d / 132)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,169,110,0.55)'; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    resize(); tick();
    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf); resize(); tick();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { cancelAnimationFrame(raf); tick(); }
    });
  }

  /* ---------- work-in-progress preview flow ----------
     Pages tagged <body data-wip-preview> (About, Contact) open normally,
     then 7s after load the modal appears, counts down 7s, and returns home. */
  var wipRunning = false;
  function showWipModal() {
    if (wipRunning) return;
    wipRunning = true;
    var modal = document.getElementById('wipModal');
    var count = document.getElementById('wipCount');
    if (!modal) return;
    modal.classList.add('show');

    var n = 7;
    if (count) count.textContent = n;
    var iv = setInterval(function () {
      n -= 1;
      if (count && n >= 0) count.textContent = n;
      if (n <= 0) clearInterval(iv);
    }, 1000);

    setTimeout(function () { window.location.href = 'index.html'; }, 7000);
  }

  function initWip() {
    if (document.body.hasAttribute('data-wip-preview')) {
      setTimeout(showWipModal, 7000);
    }
  }

  /* ---------- boot ---------- */
  function boot() {
    injectChrome();
    initScroll();
    initNavToggle();
    initReveal();
    initCounters();
    initConstellation();
    initWip();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
