/**
 * High-Performance Spotlight Cursor Tracking Module
 * Updates CSS variables (--mouse-x, --mouse-y) on hover without triggering layout reflows.
 */
export function initSpotlight() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  // If user prefers reduced motion or is on touch-only device, skip spotlight
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });
}
