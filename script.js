(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Active nav link ---- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  function setActive() {
    var pos = window.scrollY + 120;
    var current = '';
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('visible'); }, i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Contact form (mailto, no backend) ---- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      form.querySelectorAll('input,textarea').forEach(function (el) { el.classList.remove('invalid'); });

      var errors = [];
      if (name.length < 2) { form.name.classList.add('invalid'); errors.push('Please enter your name.'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.classList.add('invalid'); errors.push('Please enter a valid email address.'); }
      if (message.length < 10) { form.message.classList.add('invalid'); errors.push('Please write a slightly longer message.'); }

      if (errors.length) {
        status.className = 'form-status err';
        status.textContent = errors.join(' ');
        return;
      }

      var subject = 'Project Enquiry — Anurag Digital Services';
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Service: ' + (service || 'Not specified') + '\n\n' +
        'Message:\n' + message + '\n';

      var mailto = 'mailto:anurag123kumar1234567@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      status.className = 'form-status ok';
      status.textContent = 'Opening your email app…';
      window.location.href = mailto;

      setTimeout(function () {
        status.textContent = 'If nothing opened, email anurag123kumar1234567@gmail.com directly.';
      }, 2500);
    });
  }
})();
/* ============ 3D TILT + PARALLAX ============ */
(function () {
  'use strict';

  // Only enable 3D hover effects on devices with a real pointer (desktop/laptop)
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function addTilt(selector, maxTilt) {
    if (!canHover) return;
    var cards = document.querySelectorAll(selector);
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width  / 2;
        var cy = rect.height / 2;
        var rx = ((y - cy) / cy) * -maxTilt;
        var ry = ((x - cx) / cx) *  maxTilt;
        card.style.transform =
          'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) ' +
          'rotateY(' + ry.toFixed(2) + 'deg) translateZ(10px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  addTilt('.service-card',   7);
  addTilt('.portfolio-card', 7);

  // Hero card parallax — moves gently with the cursor
  var hero     = document.querySelector('.hero');
  var heroCard = document.querySelector('.hero-card');
  if (canHover && hero && heroCard) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      heroCard.style.transform =
        'perspective(1200px) ' +
        'rotateY(' + (x * 8).toFixed(2) + 'deg) ' +
        'rotateX(' + (-y * 8).toFixed(2) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () {
      heroCard.style.transform = '';
    });
  }
})();
