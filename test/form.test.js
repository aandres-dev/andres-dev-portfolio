import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import '../src/js/form.js';
const initContactForm = globalThis.initContactForm;

function element() {
  const attributes = new Map();
  const listeners = new Map();
  return {
    disabled: false,
    hidden: false,
    textContent: '',
    addEventListener(type, listener) { listeners.set(type, listener); },
    emit(type) { return listeners.get(type)?.({ preventDefault() {}, target: this }); },
    focus() {},
    getAttribute(name) { return attributes.get(name) ?? null; },
    removeAttribute(name) { attributes.delete(name); },
    setAttribute(name, value) { attributes.set(name, value); },
  };
}

async function contactHarness() {
  const callbacks = {};
  const field = { ...element(), checkValidity: () => true, matches: () => true };
  const submit = element();
  const form = {
    ...element(),
    checkValidity: () => true,
    querySelector: () => submit,
    querySelectorAll: () => [field],
    reset() {},
  };
  const status = element();
  const retry = element();
  const slot = element();
  const root = {
    querySelector(selector) {
      return {
        '#contact-form': form,
        '#contact-status': status,
        '#contact-retry': retry,
        '#contact-turnstile': slot,
        '#contact-turnstile-label': element(),
      }[selector] ?? null;
    },
  };

  globalThis.document = {
    documentElement: {},
    getElementById: () => null,
    querySelector: () => ({}),
  };
  const turnstile = {
    getResponse: () => 'verified-token',
    render: (_, options) => { Object.assign(callbacks, options); return 'widget'; },
    reset() {},
  };
  globalThis.window = { location: { search: '' }, turnstile };
  globalThis.FormData = class { constructor() {} };
  globalThis.MutationObserver = class { observe() {} };

  const state = initContactForm(root, {
    endpoint: 'https://formspree.io/f/test-form',
    siteKey: 'test-site-key',
    turnstile,
  });
  await new Promise(setImmediate);
  assert.equal(state.widgetId, 'widget', status.getAttribute('data-i18n'));
  return { callbacks, form, retry, state, status };
}

function deferredFetch() {
  let resolve;
  const pending = new Promise((done) => { resolve = done; });
  let calls = 0;
  globalThis.fetch = () => { calls += 1; return pending; };
  return { calls: () => calls, resolve };
}

test('handles 429 and preserves the lock through expiry/error callbacks and Retry', async () => {
  {
    const { form, status } = await contactHarness();
    const fetch = deferredFetch();
    const submission = form.emit('submit');
    fetch.resolve({ ok: false, status: 429 });
    await submission;
    assert.equal(fetch.calls(), 1);
    assert.equal(status.getAttribute('data-i18n'), 'form.status.delivery');
  }

  for (const callbackName of ['expired-callback', 'error-callback']) {
    const { callbacks, form, retry, state } = await contactHarness();
    const fetch = deferredFetch();
    const submission = form.emit('submit');

    assert.equal(typeof callbacks[callbackName], 'function');
    assert.equal(state.locked, true);
    callbacks[callbackName]();
    retry.emit('click');

    assert.equal(state.locked, true, `${callbackName} must preserve the lock`);
    assert.equal(fetch.calls(), 1, `${callbackName} Retry must not start another fetch`);

    fetch.resolve({ ok: true, status: 200 });
    await submission;
    assert.equal(state.locked, false, `${callbackName} may unlock after fetch settles`);
  }
});

test('no-JS contact markup never posts to a placeholder provider endpoint', async () => {
  const markup = await readFile(new URL('../src/sections/contact.html', import.meta.url), 'utf8');
  const action = /<form\b[^>]*\baction="([^"]*)"/.exec(markup);

  assert.equal(
    action,
    null,
    'contact.html must not ship a form action; form.js sets it only for a live endpoint',
  );
  assert.match(markup, /<noscript>/, 'contact.html must tell no-JS visitors the form needs JavaScript');
});
