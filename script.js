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

      var mailto = 'mailto:beanurag4@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      status.className = 'form-status ok';
      status.textContent = 'Opening your email app…';
      window.location.href = mailto;

      setTimeout(function () {
        status.textContent = 'If nothing opened, email beanurag4@gmail.com directly.';
      }, 2500);
    });
  }

})();

/* ============================================================
   FLOATING BOT COMPANION
   Moves up/down with scroll using smooth lerp
   ============================================================ */
(function () {
  'use strict';

  var bot = document.getElementById('botCompanion');
  if (!bot) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targetY = 0;
  var currentY = 0;

  function computeTarget() {
    var doc = document.documentElement;
    var maxScroll = doc.scrollHeight - window.innerHeight;
    var progress = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;

    var startY = window.innerHeight * 0.20;
    var endY   = window.innerHeight * 0.72;
    targetY = startY + progress * (endY - startY);

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

/* ============================================================
   SOUND EFFECTS — Click tick + MP3 greeting
   ============================================================ */
(function () {
  'use strict';

  var audioCtx = null;
  var soundEnabled = true;
  var greetingPlayed = false;
  var greetingAudio = null;

  try {
    if (localStorage.getItem('ads_sound_muted') === '1') soundEnabled = false;
  } catch (e) {}

  function getCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  /* ---------- CLICK tick ---------- */
  function playClick() {
    if (!soundEnabled) return;
    var ctx = getCtx(); if (!ctx) return;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /* ---------- HOVER tick (soft) ---------- */
  function playHover() {
    if (!soundEnabled) return;
    var ctx = getCtx(); if (!ctx) return;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /* ---------- GREETING — plays assets/greeting.mp3 ---------- */
  function playGreeting() {
    if (!soundEnabled || greetingPlayed) return;
    greetingPlayed = true;

    try {
      if (!greetingAudio) {
        greetingAudio = new Audio('assets/greeting.mp3');
        greetingAudio.preload = 'auto';
        greetingAudio.volume = 0.9;
      }
      greetingAudio.currentTime = 0;
      var p = greetingAudio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { /* blocked or file missing — ignore */ });
      }
    } catch (e) { /* silent */ }
  }

  /* ---------- CLICK handler — fires greeting once + plays tick ---------- */
  var clickTargets = 'a, button, .btn, .service-card, .portfolio-card, .skill-item, .contact-card, input, select, textarea, .nav-link';

  document.addEventListener('click', function (e) {
    if (e.target.closest('.sound-toggle')) return;
    playGreeting();
    if (e.target.closest(clickTargets)) playClick();
  }, true);

  /* Also fire greeting on first touch (mobile) */
  document.addEventListener('touchstart', function () {
    playGreeting();
  }, { passive: true, once: true });

  /* Hover sound (desktop only) */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .btn')) playHover();
    }, true);
  }

  /* ---------- Sound toggle button ---------- */
  var toggleBtn = document.getElementById('soundToggle');
  if (toggleBtn) {
    if (!soundEnabled) toggleBtn.classList.add('muted');

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      toggleBtn.classList.toggle('muted', !soundEnabled);

      try { localStorage.setItem('ads_sound_muted', soundEnabled ? '0' : '1'); } catch (err) {}

      if (soundEnabled) {
        setTimeout(playClick, 60);
      } else if (greetingAudio) {
        greetingAudio.pause();
      }
    });
  }

})();
/* ============================================================
   SCROLL-DRAWN BLUE LINE — draws down the whole page
   ============================================================ */
(function () {
  'use strict';

  var path = document.getElementById('scrollLinePath');
  var layer = document.querySelector('.scroll-line-layer');
  if (!path || !layer) return;

  // Get exact path length so dasharray matches perfectly
  var pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  var ticking = false;
  var lastProgress = -1;

  function updateLine() {
    ticking = false;

    var doc = document.documentElement;
    var totalScroll = doc.scrollHeight - window.innerHeight;

    if (totalScroll <= 0) {
      // Page fits in viewport — draw fully
      path.style.strokeDashoffset = 0;
      return;
    }

    // 0 at top, 1 at bottom
    var progress = window.scrollY / totalScroll;
    progress = Math.max(0, Math.min(1, progress));

    // Avoid redraws when nothing meaningful changed
    if (Math.abs(progress - lastProgress) < 0.001) return;
    lastProgress = progress;

    // Ease slightly for a more organic draw
    var eased = 1 - Math.pow(1 - progress, 1.6);

    path.style.strokeDashoffset = pathLength * (1 - eased);
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateLine);
      ticking = true;
    }
  }

  function onResize() {
    // Recompute everything
    pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    lastProgress = -1;
    updateLine();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  // Sync height of the layer to the document on load
  function syncLayerHeight() {
    if (!layer) return;
    var doc = document.documentElement;
    layer.style.height = doc.scrollHeight + 'px';
  }
  window.addEventListener('load', syncLayerHeight);
  window.addEventListener('resize', syncLayerHeight);
  syncLayerHeight();

  // Initial draw
  updateLine();

})();
