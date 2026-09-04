/**
 * Advanced Kinetic Scroll Engine (scroll-scrubbed-word-reveal & scroll-progress-timeline)
 * Implements GPU-accelerated scroll progress, text scrubbing, and timeline rail animation.
 */
export function initScrollEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const progressBar = document.getElementById('scroll-progress');
  const manifestoSection = document.getElementById('manifesto');
  const scrubParagraphs = document.querySelectorAll('[data-scrub-reveal]');
  const workflowContainer = document.querySelector('.workflow-container');
  const workflowRailFill = document.querySelector('.workflow-rail-fill');
  const workflowSteps = document.querySelectorAll('.workflow-step');

  // 1. Prepare Scroll-Scrubbed Words (TreeWalker word split)
  const scrubWordsMap = [];
  scrubParagraphs.forEach(p => {
    const rawText = p.innerText;
    const words = rawText.split(/\s+/).filter(Boolean);
    p.innerHTML = words.map(w => {
      let highlightClass = '';
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (['architecture', 'architect', 'systems', 'mastery', 'sdd'].includes(clean)) {
        highlightClass = ' highlight-gold';
      } else if (['ai', 'machine', 'zero', 'directs'].includes(clean)) {
        highlightClass = ' highlight-crimson';
      }
      return `<span class="scrub-word${highlightClass}">${w}</span>`;
    }).join(' ');

    const spanElements = p.querySelectorAll('.scrub-word');
    scrubWordsMap.push({ paragraph: p, spans: spanElements, count: spanElements.length });
  });

  // 2. Main High-Performance Passive Scroll Loop
  let ticking = false;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // A. Top Progress Line
    if (progressBar && docHeight > 0) {
      const globalProgress = Math.min(1, Math.max(0, scrollTop / docHeight));
      progressBar.style.transform = `scaleX(${globalProgress})`;
    }

    // B. Scrubbed Word Reveal in Manifesto
    if (manifestoSection && scrubWordsMap.length) {
      const rect = manifestoSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Calculate progress while section is passing through viewport
      const start = windowH * 0.85;
      const end = -rect.height * 0.2;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      scrubWordsMap.forEach(item => {
        const thresholdIndex = Math.floor(progress * item.count * 1.15);
        item.spans.forEach((span, idx) => {
          if (idx <= thresholdIndex) {
            span.classList.add('is-active');
          } else {
            span.classList.remove('is-active');
          }
        });
      });
    }

    // C. Workflow Timeline Rail Fill
    if (workflowContainer && workflowRailFill && workflowSteps.length) {
      const rect = workflowContainer.getBoundingClientRect();
      const windowH = window.innerHeight;
      const start = windowH * 0.75;
      const end = windowH * 0.25;
      const railProgress = Math.min(1, Math.max(0, (start - rect.top) / (rect.height)));

      workflowRailFill.style.transform = `scaleY(${railProgress})`;

      // Illuminate steps as rail reaches them
      workflowSteps.forEach((step, idx) => {
        const stepThreshold = (idx + 0.3) / workflowSteps.length;
        if (railProgress >= stepThreshold) {
          step.classList.add('is-illuminated');
        } else {
          step.classList.remove('is-illuminated');
        }
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

  // Run initial calculation
  onScroll();
}

/**
 * 3D Perspective Tilt on Hover for Cards
 */
export function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
