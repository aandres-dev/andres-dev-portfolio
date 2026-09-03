import { content, DEFAULT_LANG } from './content.js';
import { resolveLang } from './language.js';

/** Public Formspree endpoint. Replace FORMSPREE_FORM_ID_PLACEHOLDER with the dashboard form id. */
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/FORMSPREE_FORM_ID_PLACEHOLDER';

/** Public Turnstile site key only. Never commit the Turnstile secret or Target Email. */
export const TURNSTILE_SITE_KEY = 'TURNSTILE_SITE_KEY_PLACEHOLDER';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function copy(key) {
  const entry = content[key];
  if (!entry) return '';
  const lang = resolveLang();
  return entry[lang] ?? entry[DEFAULT_LANG] ?? '';
}

export function isLiveFormspree(url = FORMSPREE_ENDPOINT) {
  return typeof url === 'string'
    && url.startsWith('https://formspree.io/f/')
    && !url.includes('PLACEHOLDER')
    && url.length > 'https://formspree.io/f/'.length;
}

export function isLiveSiteKey(key = TURNSTILE_SITE_KEY) {
  return typeof key === 'string' && key.length > 0 && !key.includes('PLACEHOLDER');
}

function setStatus(node, key, live = 'polite') {
  if (!key) {
    node.textContent = '';
    node.removeAttribute('data-i18n');
    node.setAttribute('aria-live', 'polite');
    return;
  }
  node.setAttribute('data-i18n', key);
  node.textContent = copy(key);
  node.setAttribute('aria-live', live);
}

function errorNode(field) {
  return document.getElementById(`${field.id}-error`);
}

function revealError(field) {
  field.setAttribute('aria-invalid', 'true');
  const error = errorNode(field);
  if (error) error.hidden = false;
}

function clearError(field) {
  field.removeAttribute('aria-invalid');
  const error = errorNode(field);
  if (error) error.hidden = true;
}

function namedFields(form) {
  return [...form.querySelectorAll('input[required], textarea[required]')];
}

function loadTurnstileScript() {
  const existing = document.querySelector('script[data-contact-turnstile]');
  if (existing && window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.dataset.contactTurnstile = 'true';
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('unavailable'));
    };
    script.onerror = () => reject(new Error('unavailable'));
    document.head.appendChild(script);
  });
}

export function initContactForm(root = document) {
  const form = root.querySelector('#contact-form');
  if (!form) return null;

  const status = root.querySelector('#contact-status');
  const retry = root.querySelector('#contact-retry');
  const submit = form.querySelector('[type="submit"]');
  const slot = root.querySelector('#contact-turnstile');
  const turnstileLabel = root.querySelector('#contact-turnstile-label');
  const state = { locked: false, widgetId: null, focusingInvalid: false };

  if (isLiveFormspree(FORMSPREE_ENDPOINT)) {
    form.action = FORMSPREE_ENDPOINT;
  }

  function lock() {
    state.locked = true;
    if (submit) submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
  }

  function unlock() {
    state.locked = false;
    if (submit) submit.disabled = false;
    form.removeAttribute('aria-busy');
  }

  function showRetry(visible) {
    if (retry) retry.hidden = !visible;
  }

  function token() {
    if (!isLiveSiteKey() || !window.turnstile || state.widgetId === null) return '';
    try {
      return window.turnstile.getResponse(state.widgetId) || '';
    } catch {
      return '';
    }
  }

  function resetTurnstile() {
    if (!window.turnstile || state.widgetId === null) return;
    try {
      window.turnstile.reset(state.widgetId);
    } catch {
      /* Widget may already be gone. */
    }
  }

  function onTurnstileExpired() {
    unlock();
    showRetry(true);
    setStatus(status, 'form.status.turnstileExpired', 'assertive');
    status.focus();
  }

  function onTurnstileError() {
    unlock();
    showRetry(true);
    setStatus(status, 'form.status.turnstileError', 'assertive');
    status.focus();
  }

  function widgetOptions() {
    return {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      language: resolveLang(),
      'expired-callback': onTurnstileExpired,
      'error-callback': onTurnstileError,
      'timeout-callback': onTurnstileExpired,
    };
  }

  function renderWidget(api) {
    if (!slot || state.widgetId !== null) return;
    state.widgetId = api.render(slot, widgetOptions());
  }

  function syncWidgetLanguage() {
    if (!window.turnstile || state.widgetId === null || !slot) return;
    window.turnstile.remove(state.widgetId);
    state.widgetId = null;
    state.widgetId = window.turnstile.render(slot, widgetOptions());
  }

  async function setupTurnstile() {
    if (!isLiveSiteKey()) {
      if (turnstileLabel) turnstileLabel.hidden = true;
      if (slot) slot.hidden = true;
      return;
    }
    try {
      const api = await loadTurnstileScript();
      renderWidget(api);
    } catch {
      onTurnstileError();
    }
  }

  function statusForResponse(response) {
    if (response.status === 429) return 'form.status.quota';
    if (response.status === 422) return 'form.status.invalid';
    return 'form.status.delivery';
  }

  async function deliver() {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (response.ok) return { key: 'form.status.success' };
    return { key: statusForResponse(response) };
  }

  form.addEventListener('invalid', (event) => {
    event.preventDefault();
    revealError(event.target);
    if (state.focusingInvalid) return;
    state.focusingInvalid = true;
    setStatus(status, 'form.status.invalid', 'assertive');
    event.target.focus();
    requestAnimationFrame(() => {
      state.focusingInvalid = false;
    });
  }, true);

  form.addEventListener('input', (event) => {
    const field = event.target;
    if (!field.matches('input[required], textarea[required]')) return;
    if (field.checkValidity()) clearError(field);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (state.locked) return;
    if (!form.checkValidity()) return;

    if (!isLiveFormspree()) {
      setStatus(status, 'form.status.unavailable', 'assertive');
      status.focus();
      return;
    }

    if (!isLiveSiteKey() || !token()) {
      showRetry(true);
      setStatus(status, 'form.status.turnstileError', 'assertive');
      status.focus();
      return;
    }

    lock();
    showRetry(false);
    setStatus(status, 'form.status.sending', 'polite');

    try {
      const result = await deliver();
      if (result.key === 'form.status.success') {
        form.reset();
        namedFields(form).forEach(clearError);
        resetTurnstile();
        unlock();
        setStatus(status, result.key, 'polite');
        status.focus();
        return;
      }
      unlock();
      showRetry(true);
      setStatus(status, result.key, 'assertive');
      status.focus();
    } catch {
      unlock();
      showRetry(true);
      setStatus(status, 'form.status.network', 'assertive');
      status.focus();
    }
  });

  retry?.addEventListener('click', () => {
    unlock();
    showRetry(false);
    setStatus(status, '');
    resetTurnstile();
    namedFields(form)[0]?.focus();
  });

  const langObserver = new MutationObserver(syncWidgetLanguage);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  setupTurnstile();
  return state;
}
