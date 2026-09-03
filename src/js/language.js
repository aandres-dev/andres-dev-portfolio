import { content, DEFAULT_LANG, SUPPORTED_LANGS } from './content.js';

function isSupported(lang) {
  return SUPPORTED_LANGS.includes(lang);
}

export function resolveLang(search = window.location.search) {
  const lang = new URLSearchParams(search).get('lang');
  return isSupported(lang) ? lang : DEFAULT_LANG;
}

function textFor(key, lang) {
  const entry = content[key];
  if (!entry) return null;
  return entry[lang] ?? entry[DEFAULT_LANG] ?? null;
}

function applyText(root, lang) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = textFor(el.getAttribute('data-i18n'), lang);
    if (value !== null) el.textContent = value;
  });
}

function applyAttrs(root, lang) {
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const spec = el.getAttribute('data-i18n-attr');
    const separator = spec.indexOf(':');
    const attr = separator === -1 ? spec : spec.slice(0, separator);
    const key = separator === -1 ? el.getAttribute('data-i18n') : spec.slice(separator + 1);
    const value = textFor(key, lang);
    if (attr && value !== null) el.setAttribute(attr, value);
  });
}

function applyDocumentMeta(lang) {
  document.documentElement.lang = lang;

  const title = textFor('meta.title', lang);
  if (title) document.title = title;

  const description = textFor('meta.description', lang);
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.setAttribute('content', description);
}

function applyLangControls(lang) {
  document.querySelectorAll('[data-lang]').forEach((el) => {
    if (el.getAttribute('data-lang') === lang) {
      el.setAttribute('aria-current', 'true');
    } else {
      el.removeAttribute('aria-current');
    }
  });
}

function shareableUrl(lang) {
  const url = new URL(window.location.href);
  if (lang === DEFAULT_LANG) {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', lang);
  }
  return url;
}

export function applyLanguage(lang) {
  const resolved = isSupported(lang) ? lang : DEFAULT_LANG;
  applyDocumentMeta(resolved);
  applyText(document, resolved);
  applyAttrs(document, resolved);
  applyLangControls(resolved);
  return resolved;
}

function onLanguageControlClick(event) {
  const nextLang = event.currentTarget.getAttribute('data-lang');
  if (!isSupported(nextLang)) return;
  event.preventDefault();
  applyLanguage(nextLang);
  history.replaceState(null, '', shareableUrl(nextLang));
}

function bindLanguageControls() {
  document.querySelectorAll('[data-lang]').forEach((el) => {
    el.addEventListener('click', onLanguageControlClick);
  });
}

export function initLanguage() {
  const lang = applyLanguage(resolveLang());
  bindLanguageControls();
  window.addEventListener('popstate', () => {
    applyLanguage(resolveLang());
  });
  return lang;
}
