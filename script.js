/* ============================================================
   ANURAG DIGITAL SERVICES — MAIN SCRIPT
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Mobile nav toggle ---------- */
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

  /* ---------- 2. Header shadow on scroll ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Active nav link ---------- */
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

  /* ---------- 4. Scroll reveal ---------- */
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

  /* ---------- 5. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 6. Scroll progress bar ---------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 7. Animated stat counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var duration = 1600;
    var start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-number');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- 8. Typewriter for hero tagline ---------- */
  var tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    var originalText = tagline.textContent.trim();
    var pieces = originalText.split('|').map(function (p) { return p.trim(); });
    tagline.innerHTML = '<span class="tw-text"></span><span class="tw-cursor"></span>';
    var twText = tagline.querySelector('.tw-text');

    var lineIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = pieces[lineIndex];
      if (!deleting) {
        charIndex++;
        twText.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, 1600);
        }
        return setTimeout(tick, 55);
      } else {
        charIndex--;
        twText.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % pieces.length;
          return setTimeout(tick, 320);
        }
        return setTimeout(tick, 28);
      }
    }
    setTimeout(tick, 600);
  }

  /* ---------- 9. 3D tilt on cards (desktop only) ---------- */
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

  /* ---------- 10. Cursor glow (desktop only) ---------- */
  if (canHover) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var gx = 0, gy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('active');
    });
    document.addEventListener('mouseleave', function () {
      glow.classList.remove('active');
    });
    (function loopGlow() {
      gx += (tx - gx) * 0.16;
      gy += (ty - gy) * 0.16;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loopGlow);
    })();
  }

  /* ---------- 11. Contact form (mailto) ---------- */
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
/* ============================================================
   FLOATING 3D SCROLL COMPANION
   Follows scroll position smoothly with lerp animation
   ============================================================ */
(function () {
  'use strict';

  var companion = document.getElementById('scrollCompanion');
  if (!companion) return;

  // Skip on mobile if reduced motion is set
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targetY = 0;
  var currentY = 0;
  var initialized = false;

  function computeTarget() {
    var doc = document.documentElement;
    var maxScroll = doc.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;

    // Range: start slightly below top, end slightly above bottom
    var startY = window.innerHeight * 0.18;
    var endY   = window.innerHeight * 0.70;
    targetY = startY + progress * (endY - startY);

    // Fade in once user has scrolled a bit
    if (window.scrollY > 100) {
      companion.classList.add('visible');
    } else {
      companion.classList.remove('visible');
    }
  }

  function tick() {
    // Smooth lerp for buttery motion
    currentY += (targetY - currentY) * 0.10;
    companion.style.transform = 'translate3d(0, ' + currentY.toFixed(2) + 'px, 0)';
    requestAnimationFrame(tick);
  }

  // Initial position — jump to target so there's no slide-in on first load
  computeTarget();
  currentY = targetY;
  initialized = true;

  window.addEventListener('scroll', computeTarget, { passive: true });
  window.addEventListener('resize', computeTarget, { passive: true });

  requestAnimationFrame(tick);
})();
/* ============================================================
   FLOATING BOT COMPANION
   Moves up/down with scroll — smooth lerp
   ============================================================ */
(function () {
  'use strict';

  var bot = document.getElementById('botCompanion');
  if (!bot) return;

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targetY = 0;
  var currentY = 0;

  function computeTarget() {
    var doc = document.documentElement;
    var maxScroll = doc.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;

    // Bot travels from top ~20% to bottom ~75% of viewport
    var startY = window.innerHeight * 0.20;
    var endY   = window.innerHeight * 0.72;
    targetY = startY + progress * (endY - startY);

    // Fade in only after user scrolls past hero
    if (window.scrollY > 100) {
      bot.classList.add('visible');
    } else {
      bot.classList.remove('visible');
    }
  }

  function tick() {
    currentY += (targetY - currentY) * 0.10;
    bot.style.transform = 'translate3d(0, ' + currentY.toFixed(2) + 'px, 0)';
    requestAnimationFrame(tick);
  }

  computeTarget();
  currentY = targetY;

  window.addEventListener('scroll', computeTarget, { passive: true });
  window.addEventListener('resize', computeTarget, { passive: true });

  requestAnimationFrame(tick);
})();
