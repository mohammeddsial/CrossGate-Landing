(function () {
  'use strict';
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MARK = '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="20,3 34,12 22,15.5 13.5,11" fill="#C9A96E"/><polygon points="13,13 25,17.5 18,21.5 8.5,18" fill="#C9A96E" opacity="0.9"/><polygon points="19.5,20.5 28,25.5 20.5,28.5 14,24.5" fill="#C9A96E" opacity="0.8"/><polygon points="11,21.5 18.5,25.5 14,34 8.5,27.5" fill="#C9A96E" opacity="0.68"/></svg>';

  function injectChrome() {
    var frag = document.createElement('div');
    frag.innerHTML = '<div class="scroll-progress" id="scrollProgress"></div>';
    while (frag.firstChild) document.body.appendChild(frag.firstChild);
  }

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

  function initMobileOverlay() {
    var toggle = document.querySelector('.nav-toggle');
    var overlay = document.getElementById('navOverlay');
    if (!toggle || !overlay) return;
    var links = overlay.querySelectorAll('a');
    toggle.addEventListener('click', function () {
      var open = overlay.classList.toggle('open');
      toggle.innerHTML = open ? '<i class="ti ti-x"></i>' : '<i class="ti ti-menu-2"></i>';
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        overlay.classList.remove('open');
        toggle.innerHTML = '<i class="ti ti-menu-2"></i>';
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  function initLenis() {
    if (typeof lenis === 'undefined' || rm) return;
    var l = new lenis({ duration: 1.2, easing: function(t){return 1-Math.pow(1-t,3)}, smoothWheel: true });
    function raf(time) { l.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    l.on('scroll', function (i) {
      var nav = document.querySelector('.nav');
      var bar = document.getElementById('scrollProgress');
      if (nav) nav.classList.toggle('scrolled', i.animatedScroll > 24);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (i.animatedScroll / h) * 100 : 0) + '%';
      }
    });
  }

  function initGsapReveal() {
    if (typeof gsap === 'undefined') return;
    if (rm) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    var els = gsap.utils.toArray('[data-reveal]');
    if (!els.length) return;
    els.forEach(function (el) {
      var delay = parseFloat(el.style.getPropertyValue('--rd')) || 0;
      gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: delay, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' } });
    });
  }

  function initGsapCounters() {
    if (typeof gsap === 'undefined') return;
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    els.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (rm) { el.textContent = target + suffix; return; }
      var obj = { val: 0 };
      gsap.to(obj, { val: target, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }, onUpdate: function () { el.textContent = Math.round(obj.val) + suffix; } });
    });
  }

  function initGsapStaggers() {
    if (typeof gsap === 'undefined' || rm) return;
    gsap.fromTo('.services-grid .service-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.fromTo('.steps .step', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.steps', start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.fromTo('.regions-row .region-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.regions-row', start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.fromTo('.risk-flags .rflag', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.risk-flags', start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.fromTo('.jur-grid .jur-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.jur-grid', start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.fromTo('.team-grid .team-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.team-grid', start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.fromTo('.cta-banner', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.cta-banner', start: 'top 82%', toggleActions: 'play none none none' } });
    gsap.fromTo('.testimonial-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.testimonial-grid', start: 'top 80%', toggleActions: 'play none none none' } });
  }

  function initConstellation() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || rm) return;
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
      for (var i = 0; i < count; i++) { nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.6 + 0.6 }); }
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i]; n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 132) { ctx.strokeStyle = 'rgba(201,169,110,' + (0.16 * (1 - d / 132)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
        }
      }
      for (var k = 0; k < nodes.length; k++) { var p = nodes[k]; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(201,169,110,0.55)'; ctx.fill(); }
      raf = requestAnimationFrame(tick);
    }
    resize(); tick();
    window.addEventListener('resize', function () { cancelAnimationFrame(raf); resize(); tick(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { cancelAnimationFrame(raf); } else { cancelAnimationFrame(raf); tick(); } });
  }

  function initHeroGradient() {
    if (typeof gsap === 'undefined' || rm) return;
    if (!document.querySelector('.orb')) return;
    gsap.to('.orb-gold', { x: 24, y: -12, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.orb-green', { x: -18, y: 16, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  function boot() {
    injectChrome();
    initScroll();
    initMobileOverlay();
    initLenis();
    initGsapReveal();
    initGsapCounters();
    initGsapStaggers();
    initConstellation();
    initHeroGradient();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();