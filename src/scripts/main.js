// Andres Lopez Portfolio Application Script (Vanilla JS)
(function () {
  'use strict';

  // 1. Mark DOM as JS-Ready for Progressive Enhancement
  document.documentElement.classList.add('js-ready');

  // 2. High-Performance Scroll Reveal Module
  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-animate="reveal"]');
    if (!elements.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return elements.forEach(el => el.setAttribute('data-visible', 'true'));
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    elements.forEach(el => observer.observe(el));
  }

  // 3. Navigation & Header Elevation Module
  function initNavigation() {
    const header = document.querySelector('header.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section');
    if (!sections.length || !navLinks.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) header?.setAttribute('data-elevated', 'true');
          else header?.removeAttribute('data-elevated');
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const active = link.getAttribute('href')?.replace('#', '') === id;
            if (active) {
              link.setAttribute('data-active', 'true');
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('data-active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));

    // Smooth scroll for in-page anchors (prevents opaque origin frame navigation on file://)
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      try {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } catch (_) {}
    });
  }

  // 4. Spotlight & 3D Tilt
  function initSpotlightAndTilt() {
    const cards = document.querySelectorAll('.spotlight-card');
    if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        const rotX = (((e.clientY - rect.top) - rect.height / 2) / (rect.height / 2)) * -4;
        const rotY = (((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 4;
        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }

  // 5. Kinetic Scroll Effects
  function initScrollEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const progressBar = document.getElementById('scroll-progress');
    const manifestoSection = document.getElementById('manifesto');
    const scrubParagraphs = document.querySelectorAll('[data-scrub-reveal]');
    const workflowContainer = document.querySelector('.workflow-container');
    const workflowRailFill = document.querySelector('.workflow-rail-fill');
    const workflowSteps = document.querySelectorAll('.workflow-step');

    const scrubWordsMap = [];
    scrubParagraphs.forEach(p => {
      const words = p.innerText.split(/\s+/).filter(Boolean);
      p.innerHTML = words.map(w => {
        let highlight = '';
        const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (['architecture', 'architect', 'systems', 'mastery', 'sdd', 'arquitectura', 'sistemas'].includes(clean)) highlight = ' highlight-gold';
        else if (['ai', 'machine', 'zero', 'directs', 'executes', 'ia', 'máquina', 'ejecuta'].includes(clean)) highlight = ' highlight-crimson';
        return `<span class="scrub-word${highlight}">${w}</span>`;
      }).join(' ');
      const spans = p.querySelectorAll('.scrub-word');
      scrubWordsMap.push({ spans, count: spans.length });
    });

    let ticking = false;
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (progressBar && docHeight > 0) {
        progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollTop / docHeight))})`;
      }

      if (manifestoSection && scrubWordsMap.length) {
        const rect = manifestoSection.getBoundingClientRect();
        const start = window.innerHeight * 0.85;
        const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - (-rect.height * 0.15))));
        scrubWordsMap.forEach(item => {
          const threshold = Math.floor(progress * item.count * 1.12);
          item.spans.forEach((s, idx) => s.classList.toggle('is-active', idx <= threshold));
        });
      }

      if (workflowContainer && workflowRailFill && workflowSteps.length) {
        const rect = workflowContainer.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - rect.top) / (rect.height * 0.85)));
        workflowRailFill.style.transform = `scaleY(${progress})`;
        workflowSteps.forEach((step, idx) => {
          step.classList.toggle('is-illuminated', progress >= (idx + 0.25) / workflowSteps.length);
        });
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  // 6. Interactive GPU Particle Constellation Canvas in Hero
  function initNeuralMesh() {
    const canvas = document.getElementById('neural-mesh');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const nodeCount = Math.min(48, Math.max(22, Math.floor(width / 32)));
    const nodes = [];
    const mouse = { x: -9999, y: -9999, radius: 130 };

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.6 + 1,
        color: Math.random() > 0.65 ? '#d4af37' : '#e63946'
      });
    }

    const heroSection = canvas.parentElement;
    if (heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }, { passive: true });
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
      });
    }

    let isVisible = true, animId = null;
    const heroObserver = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animId) animId = requestAnimationFrame(render);
      else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }, { threshold: 0.05 });
    if (heroSection) heroObserver.observe(heroSection);

    function render() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 1.5;
          n.y -= (dy / dist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.55;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist2 = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = n.color;
            ctx.globalAlpha = (1 - dist2 / 100) * 0.2;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);
  }

  // 7. Kinetic Text Decipher / Scramble Effect
  function initTextScramble() {
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    if (!scrambleElements.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const chars = '!<>-_\\/[]{}—=+*^?#________01';

    function scramble(el) {
      if (el.dataset.scrambling === 'true') return;
      const originalText = el.textContent;
      // Scramble glyphs are narrower than real letters, so a heading drops a line
      // mid-effect and shoves the cards below it. Hold the resting height.
      let box = el;
      while (box && getComputedStyle(box).display === 'inline') box = box.parentElement;
      if (box) box.style.minHeight = `${box.offsetHeight}px`;
      el.dataset.scrambling = 'true';
      let frame = 0;
      const totalFrames = Math.min(32, Math.max(16, originalText.length * 2.2));

      const interval = setInterval(() => {
        let output = '';
        const progress = frame / totalFrames;
        const revealedChars = Math.floor(progress * originalText.length);

        for (let i = 0; i < originalText.length; i++) {
          if (originalText[i] === ' ' || originalText[i] === '\n') output += originalText[i];
          else if (i < revealedChars) output += originalText[i];
          else output += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = output;
        frame++;
        if (frame > totalFrames) {
          clearInterval(interval);
          el.textContent = originalText;
          if (box) box.style.minHeight = '';
          el.dataset.scrambling = 'false';
        }
      }, 28);
    }

    const scrambleObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scramble(entry.target);
          scrambleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    scrambleElements.forEach(el => scrambleObserver.observe(el));
  }

  // 8. Magnetic Micro-Interaction on Interactive Buttons
  function initMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - (rect.left + rect.width / 2)) * 0.2}px, ${(e.clientY - (rect.top + rect.height / 2)) * 0.2}px)`;
      }, { passive: true });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
  }

  // 10. Obfuscated Outbound Destination Module
  function initOutboundLinks() {
    const githubBtn = document.getElementById('github-link-btn');
    githubBtn?.addEventListener('click', () => {
      window.open(['https://', 'github.com/', 'aandres-dev'].join(''), '_blank', 'noopener,noreferrer');
    });

    const linkedinBtn = document.getElementById('linkedin-link-btn');
    linkedinBtn?.addEventListener('click', () => {
      const profile = linkedinBtn.getAttribute('data-profile') || '';
      if (!profile) return;
      window.open(['https://', 'www.linkedin.com/in/', profile].join(''), '_blank', 'noopener,noreferrer');
    });
  }

  // 11. Multi-Language Switcher (EN primary / ES secondary)
  function initLanguageSwitcher() {
    const btns = document.querySelectorAll('[data-lang-btn]');
    const items = document.querySelectorAll('[data-es]');
    if (!btns.length || !items.length) return;

    items.forEach(el => {
      if (!el.dataset.en) {
        el.dataset.en = el.dataset.i18nHtml ? el.innerHTML : el.textContent.trim();
      }
    });

    function setLang(lang) {
      const isEs = lang === 'es';
      document.documentElement.lang = isEs ? 'es' : 'en';

      items.forEach(el => {
        const val = isEs ? el.dataset.es : el.dataset.en;
        if (val) {
          if (el.dataset.i18nHtml) {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        }
      });

      btns.forEach(b => {
        const active = b.dataset.langBtn === lang;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      document.querySelectorAll('.lang-switch').forEach(el => el.classList.toggle('is-es', isEs));

      try {
        localStorage.setItem('preferred-lang', lang);
      } catch (e) {}
    }

    btns.forEach(b => b.addEventListener('click', () => setLang(b.dataset.langBtn)));

    try {
      if (localStorage.getItem('preferred-lang') === 'es') setLang('es');
    } catch (e) {}
  }

  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"], [data-lang-btn]')) setOpen(false);
    });
    window.addEventListener('theme-change-applied', function () {
      if (menu.classList.contains('is-open')) setOpen(false);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });
  }

  // Bootstrap

  function bootstrap() {
    initScrollReveal();
    initNavigation();
    initMobileNav();
    initSpotlightAndTilt();
    initScrollEffects();
    initNeuralMesh();
    initTextScramble();
    initMagneticButtons();
    initOutboundLinks();
    initLanguageSwitcher();
    if (window.initThemeSwitcher) window.initThemeSwitcher();
    if (window.initContactForm) window.initContactForm(document, { endpoint: '', siteKey: '', turnstile: window.turnstile });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
