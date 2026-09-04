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

function initContactForm(root, options = {}) {
  const form = root.querySelector('#contact-form');
  const status = root.querySelector('#contact-status');
  const retry = root.querySelector('#contact-retry');
  const slot = root.querySelector('#contact-turnstile');
  const endpoint = options.endpoint;
  const siteKey = options.siteKey;
  const turnstile = options.turnstile || (typeof window !== 'undefined' ? window.turnstile : undefined);
  const live = isLiveEndpoint(endpoint);
  const state = { widgetId: null, locked: false };

  if (live && form) form.setAttribute('action', endpoint);

  let hideTimer = 0;

  function clearStatus() {
    clearTimeout(hideTimer);
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
    status.setAttribute('data-i18n', `form.status.${key}`);
    status.setAttribute('data-tone', key === 'success' ? 'success' : 'issue');
    status.textContent = copy[lang()];
    status.classList.remove('is-in');
    void status.offsetWidth;
    status.classList.add('is-in');
    if (key === 'success') {
      hideTimer = setTimeout(clearStatus, 4200);
      hideTimer.unref?.();
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
