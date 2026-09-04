/**
 * Accessible Navigation & Header Elevation Module
 * Tracks active section, updates aria and state attributes, manages focus.
 */
export function initNavigation() {
  const header = document.querySelector('header.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');

  if (!sections.length || !navLinks.length) return;

  // 1. Passive scroll listener for header elevation
  let ticking = false;
  const updateHeaderElevation = () => {
    if (window.scrollY > 30) {
      header?.setAttribute('data-elevated', 'true');
    } else {
      header?.removeAttribute('data-elevated');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderElevation);
      ticking = true;
    }
  }, { passive: true });

  // 2. Section visibility tracking using IntersectionObserver
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href')?.replace('#', '');
          if (href === id) {
            link.setAttribute('data-active', 'true');
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('data-active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(sec => sectionObserver.observe(sec));
}
