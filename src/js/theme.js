function initThemeSwitcher() {
  const btn = document.getElementById('theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!btn) return;

  function paintIcons(light) {
    const faces = btn.querySelectorAll('.island-face');
    if (faces[0]) {
      faces[0].style.color = light ? 'var(--color-gold)' : '';
      const moon = faces[0].querySelector('svg');
      if (moon) moon.style.fill = light ? 'currentColor' : 'none';
    }
    if (faces[1]) {
      faces[1].style.color = light ? '' : 'var(--color-gold)';
      const sun = faces[1].querySelector('svg');
      if (sun) sun.style.fill = light ? 'none' : 'currentColor';
    }
  }

  function applyTheme(theme, persist) {
    const light = theme === 'light';
    document.documentElement.classList.add('theme-switching');
    if (light) document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    btn.classList.toggle('is-light', light);
    btn.setAttribute('aria-pressed', String(light));
    paintIcons(light);
    if (meta) meta.setAttribute('content', light ? '#f7f6f2' : '#0a0a0e');
    if (persist) {
      try { localStorage.setItem('preferred-theme', theme); } catch (e) {}
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('theme-switching');
      });
    });
  }

  btn.addEventListener('click', function (event) {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.style.setProperty('--theme-x', event.clientX + 'px');
    document.documentElement.style.setProperty('--theme-y', event.clientY + 'px');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next, true);
      return;
    }

    let applied = false;
    const run = function () {
      if (applied) return;
      applied = true;
      applyTheme(next, true);
      window.dispatchEvent(new CustomEvent('theme-change-applied', { detail: { theme: next } }));
    };

    if (typeof document.startViewTransition === 'function') {
      try {
        document.startViewTransition(run);
        return;
      } catch (e) {}
    }

    run();
  });

  try {
    const saved = localStorage.getItem('preferred-theme');
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    const initial = saved || (isDay ? 'light' : 'dark');
    applyTheme(initial, false);
  } catch (e) {
    applyTheme('dark', false);
  }
}

globalThis.initThemeSwitcher = initThemeSwitcher;
