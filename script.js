(function () {
  var root = document.documentElement;

  /* Theme toggle (dark / light), remembered between visits */
  var toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Mobile menu */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* Scroll reveal */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Highlight active nav link */
  var sections = document.querySelectorAll('main section[id]');
  var links = navLinks.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Stagger cards inside grids */
  document.querySelectorAll('.skills-grid, .projects-grid, .timeline').forEach(function (grid) {
    grid.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
    });
  });

  /* Scroll progress bar + back-to-top */
  var bar = document.getElementById('progress');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY || document.documentElement.scrollTop;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* Count-up stats */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced || isNaN(target)) return;
    el.textContent = '0';
    var start = null;
    setTimeout(function () {
      requestAnimationFrame(function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1100, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      });
    }, 700);
  });

  /* Rotating role text with typing effect */
  var typed = document.getElementById('typed');
  if (typed && !reduced) {
    var roles = ['Java & Spring Boot Developer', 'Backend & REST API Builder', 'Full-Stack Problem Solver'];
    var ri = 0, ci = roles[0].length, deleting = true;
    function tick() {
      var word = roles[ri];
      if (deleting) { ci--; } else { ci++; }
      typed.textContent = word.slice(0, ci);
      var delay = deleting ? 35 : 70;
      if (!deleting && ci === word.length) { deleting = true; delay = 2200; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 2600);
  }

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
