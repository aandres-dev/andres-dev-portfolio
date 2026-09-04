/**
 * High-Performance Scroll Reveal Module
 * Uses passive IntersectionObserver to trigger hardware-accelerated animations
 * without main-thread scroll listener overhead.
 */
export function initScrollReveal() {
  const elements = document.querySelectorAll('[data-animate="reveal"]');
  if (!elements.length) return;

  // Check user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.setAttribute('data-visible', 'true'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-visible', 'true');
        // Unobserve to free up observer memory once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => revealObserver.observe(el));
}
