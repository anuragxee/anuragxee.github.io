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
/* ============================================================
   PREMIUM ANIMATION SUITE — JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Typewriter for hero tagline ---------- */
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

  /* ---------- 2. Scroll progress bar ---------- */
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

  /* ---------- 3. Animated stat counters ---------- */
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

  /* ---------- 4. Cursor glow follow (desktop only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
})();
/* ============================================================
   3D SMART BOT — injects the animated robot into every .bot-slot
   ============================================================ */
(function () {
  'use strict';

  var botHTML =
    '<div class="bot-3d" aria-hidden="true">' +
      '<div class="bot-scene">' +
        '<div class="bot-orbit bot-orbit-1"></div>' +
        '<div class="bot-orbit bot-orbit-2"></div>' +
        '<div class="bot-body">' +
          '<div class="bot-arm left"></div>' +
          '<div class="bot-arm right"></div>' +
          '<div class="bot-torso">' +
            '<div class="bot-chest"></div>' +
          '</div>' +
          '<div class="bot-neck"></div>' +
          '<div class="bot-head">' +
            '<div class="bot-antenna"><span></span></div>' +
            '<div class="bot-ear left"></div>' +
            '<div class="bot-ear right"></div>' +
            '<div class="bot-visor">' +
              '<span class="bot-eye"></span>' +
              '<span class="bot-eye"></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="bot-particle"></div>' +
        '<div class="bot-particle"></div>' +
        '<div class="bot-particle"></div>' +
        '<div class="bot-particle"></div>' +
      '</div>' +
      '<div class="bot-shadow"></div>' +
    '</div>';

  document.querySelectorAll('.bot-slot').forEach(function (slot) {
    slot.innerHTML = botHTML;
  });
})();
/* ============================================================
   ANIME ROPE-SLIDING COMPANION + ANIME CURSOR
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1) Rope-sliding companion ---------- */
  var companion = document.getElementById('scrollCompanion');
  if (companion) {
    var targetY  = 0;
    var currentY = 0;
    var idleTimer = null;

    function computeTarget() {
      var doc       = document.documentElement;
      var maxScroll = doc.scrollHeight - window.innerHeight;
      var progress  = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;

      // Character starts just below the anchor (top of viewport)
      // and slides down the rope as user scrolls.
      var startY = -40;                                       // slightly above viewport top
      var endY   = window.innerHeight - companion.offsetHeight - 30;
      targetY = startY + progress * (endY - startY);
    }

    function tick() {
      currentY += (targetY - currentY) * 0.12;
      companion.style.transform = 'translate3d(0,' + currentY + 'px,0)';
      requestAnimationFrame(tick);
    }

    function onScroll() {
      computeTarget();
      companion.classList.add('sliding');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        companion.classList.remove('sliding');
      }, 200);
    }

    computeTarget();
    currentY = targetY;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', computeTarget, { passive: true });
    requestAnimationFrame(tick);
  }

  /* ---------- 2) Anime cursor ---------- */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cursorEl = document.getElementById('cursorCharacter');

  if (canHover && cursorEl) {
    document.body.classList.add('cursor-none');

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var cx = mx, cy = my;
    var visible = false;

    function move(e) {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) { cursorEl.classList.add('active'); visible = true; }
    }
    function loop() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursorEl.style.transform =
        'translate3d(' + (cx - cursorEl.offsetWidth  / 2) + 'px,' +
                          (cy - cursorEl.offsetHeight / 2) + 'px,0)';
      requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', function () {
      cursorEl.classList.remove('active');
      visible = false;
    });

    var interactive = 'a, button, .btn, input, select, textarea, .service-card, .portfolio-card, .skill-item';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactive)) cursorEl.classList.add('grow');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactive)) cursorEl.classList.remove('grow');
    });

    requestAnimationFrame(loop);
  }
})();
