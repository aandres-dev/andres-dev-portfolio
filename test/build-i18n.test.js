// Guards buildSpanish()'s translation behavior against a small fixture.
import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSpanish } from '../script/build-i18n.js';

const FIXTURE = `<html lang="en">
<head>
  <link rel="canonical" href="https://andres-dev-portfolio.netlify.app/">
  <meta property="og:url" content="https://andres-dev-portfolio.netlify.app/">
  <meta property="twitter:url" content="https://andres-dev-portfolio.netlify.app/">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="es_ES">
</head>
<body>
  <button aria-label="Open menu"></button>
  <h1 data-es="Hola mundo">Hello world</h1>
</body>
</html>`;

test('translates a data-es element\'s content', () => {
  const { html } = buildSpanish(FIXTURE);
  assert.match(html, /<h1 data-es="Hola mundo">Hola mundo<\/h1>/);
});

test('translates a known aria-label via the ARIA map', () => {
  const { html } = buildSpanish(FIXTURE);
  assert.match(html, /aria-label="Abrir menú"/);
  assert.doesNotMatch(html, /aria-label="Open menu"/);
});

test('localises lang, canonical, og/twitter url and locale for /es/', () => {
  const { html } = buildSpanish(FIXTURE);
  assert.match(html, /<html lang="es">/);
  assert.match(html, /href="https:\/\/andres-dev-portfolio\.netlify\.app\/es\/"/);
  assert.match(html, /content="https:\/\/andres-dev-portfolio\.netlify\.app\/es\/"/g);
  assert.match(html, /content="es_ES"/);
  assert.match(html, /content="en_US"/);
});

test('reports an ARIA/META entry that no longer matches the source', () => {
  const { missing } = buildSpanish('<html lang="en"></html>');
  assert.ok(missing.includes('aria-label="Open menu"'));
});
