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

  function applyTheme(theme) {
    const light = theme === 'light';
    if (light) document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    btn.classList.toggle('is-light', light);
    btn.setAttribute('aria-pressed', String(light));
    paintIcons(light);
    if (meta) meta.setAttribute('content', light ? '#f7f6f2' : '#0a0a0e');
    try { localStorage.setItem('preferred-theme', theme); } catch (e) {}
  }

  btn.addEventListener('click', function (event) {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.style.setProperty('--theme-x', event.clientX + 'px');
    document.documentElement.style.setProperty('--theme-y', event.clientY + 'px');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next);
      return;
    }

    let applied = false;
    const run = function () {
      if (applied) return;
      applied = true;
      applyTheme(next);
    };

    if (typeof document.startViewTransition === 'function') {
      try {
        const tx = document.startViewTransition(run);
        window.setTimeout(run, 400);
        if (tx && tx.finished) tx.finished.catch(function () {});
        return;
      } catch (e) {}
    }

    run();
  });

  try {
    applyTheme(localStorage.getItem('preferred-theme') === 'light' ? 'light' : 'dark');
  } catch (e) {
    applyTheme('dark');
  }
}

globalThis.initThemeSwitcher = initThemeSwitcher;
