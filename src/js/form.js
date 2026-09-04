const LIVE_FORMSPREE = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9-]+$/;

const STATUS = {
  success: {
    en: 'Message sent. I will get back to you.',
    es: 'Mensaje enviado. Te respondo pronto.',
  },
  validation: {
    en: 'Check the fields. Something is missing or invalid.',
    es: 'Revisa los campos. Falta algo o no está bien.',
  },
  delivery: {
    en: 'The message could not be sent. Try again.',
    es: 'No se pudo enviar. Intenta de nuevo.',
  },
  turnstile: {
    en: 'Verification expired. Try again.',
    es: 'La verificación se venció. Intenta de nuevo.',
  },
};

function isLiveEndpoint(endpoint) {
  return typeof endpoint === 'string'
    && LIVE_FORMSPREE.test(endpoint)
    && !endpoint.includes('PLACEHOLDER');
}

function lang() {
  return document.documentElement?.lang === 'es' ? 'es' : 'en';
}

function playSendBurst(canvas, host) {
  if (!canvas || !host || typeof canvas.getContext !== 'function') {
    return { stop() {} };
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { stop() {} };
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop() {} };

  let running = true;
  let frame = 0;
  const box = host.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(box.width * dpr);
  canvas.height = Math.floor(box.height * dpr);
  canvas.style.width = `${box.width}px`;
  canvas.style.height = `${box.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = box.width < 700 ? 26 : 46;
  const cx = box.width / 2;
  const cy = box.height / 2;
  const bits = [];
  for (let i = 0; i < count; i += 1) {
    const angle = ((Math.PI * 2) * i) / count + Math.random() * 0.45;
    const speed = 90 + Math.random() * 220;
    bits.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 90,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 8,
      w: 3 + Math.random() * 8,
      h: 1 + Math.random() * 2,
      life: 0.75 + Math.random() * 0.7,
      age: 0,
      gold: Math.random() > 0.22,
    });
  }

  let last = performance.now();
  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    ctx.clearRect(0, 0, box.width, box.height);
    let alive = 0;
    for (const bit of bits) {
      bit.age += dt;
      if (bit.age > bit.life) continue;
      alive += 1;
      bit.vy += 420 * dt;
      bit.x += bit.vx * dt;
      bit.y += bit.vy * dt;
      bit.rot += bit.vr * dt;
      ctx.save();
      ctx.translate(bit.x, bit.y);
      ctx.rotate(bit.rot);
      ctx.globalAlpha = (1 - bit.age / bit.life) * 0.92;
      ctx.fillStyle = bit.gold ? '#d4af37' : '#c4452d';
      ctx.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
      ctx.restore();
    }
    if (alive) frame = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, box.width, box.height);
  }
  frame = requestAnimationFrame(tick);

  return {
    stop() {
      running = false;
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}

function initContactForm(root, options = {}) {
  const form = root.querySelector('#contact-form');
  const status = root.querySelector('#contact-status');
  const retry = root.querySelector('#contact-retry');
  const slot = root.querySelector('#contact-turnstile');
  const footer = root.querySelector('#contact');
  const canvas = root.querySelector('#contact-burst');
  const endpoint = options.endpoint;
  const siteKey = options.siteKey;
  const turnstile = options.turnstile || (typeof window !== 'undefined' ? window.turnstile : undefined);
  const live = isLiveEndpoint(endpoint);
  const state = { widgetId: null, locked: false };

  if (live && form) form.setAttribute('action', endpoint);

  let hideTimer = 0;
  let burst = { stop() {} };

  function clearStatus() {
    clearTimeout(hideTimer);
    burst.stop();
    footer?.classList.remove('is-sent');
    if (!status) return;
    status.textContent = '';
    status.removeAttribute('data-tone');
    status.classList.remove('is-in');
  }

  function setStatus(key) {
    if (!status) return;
    const copy = STATUS[key];
    if (!copy) return;
    clearTimeout(hideTimer);
    burst.stop();
    status.setAttribute('data-i18n', `form.status.${key}`);
    status.setAttribute('data-tone', key === 'success' ? 'success' : 'issue');
    status.textContent = copy[lang()];
    status.classList.remove('is-in');
    void status.offsetWidth;
    status.classList.add('is-in');
    if (key === 'success') {
      footer?.classList.add('is-sent');
      burst = playSendBurst(canvas, footer);
      hideTimer = setTimeout(clearStatus, 4200);
      hideTimer.unref?.();
    } else {
      footer?.classList.remove('is-sent');
    }
  }

  function onTurnstileIssue() {
    if (state.locked) return;
    setStatus('turnstile');
    if (retry) retry.hidden = false;
  }

  if (turnstile && slot && siteKey) {
    state.widgetId = turnstile.render(slot, {
      sitekey: siteKey,
      'expired-callback': onTurnstileIssue,
      'error-callback': onTurnstileIssue,
    });
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (state.locked) return;

    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      setStatus('validation');
      form.querySelector(':invalid')?.focus?.();
      return;
    }

    if (!live) {
      setStatus('delivery');
      if (retry) retry.hidden = false;
      return;
    }

    state.locked = true;
    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setStatus('success');
        form.reset?.();
        turnstile?.reset?.(state.widgetId);
        if (retry) retry.hidden = true;
      } else {
        setStatus('delivery');
        if (retry) retry.hidden = false;
      }
    } catch {
      setStatus('delivery');
      if (retry) retry.hidden = false;
    } finally {
      state.locked = false;
      if (submit) submit.disabled = false;
    }
  });

  retry?.addEventListener('click', () => {
    if (state.locked) return;
    turnstile?.reset?.(state.widgetId);
    retry.hidden = true;
    form?.querySelector('[type="submit"]')?.focus?.();
  });

  return state;
}

globalThis.initContactForm = initContactForm;
