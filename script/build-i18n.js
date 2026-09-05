// Writes es/index.html by applying every data-es attribute of index.html.
// Run with --check to exit 1 when the Spanish copy is stale.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'index.html');
const OUT_DIR = path.join(ROOT, 'es');
const OUT = path.join(OUT_DIR, 'index.html');

const ORIGIN = 'https://andres-dev-portfolio.netlify.app';

// Head strings, which live in attributes and so cannot use data-es.
const META = {
  'andres.dev — AI Orchestrator &amp; Architectural Director':
    'andres.dev — Orquestador de IA &amp; Director de Arquitectura',
  'Official portfolio of Andres Lopez. Architecting, directing, and orchestrating AI to construct production-grade software with high performance, strict semantics, and senior architectural craft.':
    'Portafolio de Andrés López. Arquitectura, dirección y orquestación de IA para construir software listo para producción, con buen rendimiento, semántica estricta y criterio de arquitectura.',
  'Directing AI to engineer production systems through architectural discipline, domain modeling, and Spec-Driven Development.':
    'Dirigir IA para construir sistemas de producción con disciplina de arquitectura, modelado de dominio y desarrollo guiado por especificación.',
  'Andres Lopez, Software AI Orchestrator. The Human Directs. The Machine Executes.':
    'Andrés López, Orquestador de software con IA. El humano dirige. La máquina ejecuta.',
};

// aria-label values, which live in attributes and so cannot use data-es.
const ARIA = {
  'aria-label="Main Navigation"': 'aria-label="Navegación principal"',
  'aria-label="Andres Lopez home link"': 'aria-label="Enlace de inicio de Andres Lopez"',
  'aria-label="Open menu"': 'aria-label="Abrir menú"',
  'aria-label="Language selector"': 'aria-label="Selector de idioma"',
  'aria-label="Switch theme"': 'aria-label="Cambiar tema"',
  'aria-label="Hero actions"': 'aria-label="Acciones principales"',
  'aria-label="Architectural Director Card"': 'aria-label="Tarjeta de Director de Arquitectura"',
  'aria-label="How I direct AI"': 'aria-label="Cómo dirijo la IA"',
  'aria-label="Open GitHub profile in a new tab"': 'aria-label="Abrir perfil de GitHub en una pestaña nueva"',
  'aria-label="Open LinkedIn profile in a new tab"': 'aria-label="Abrir perfil de LinkedIn en una pestaña nueva"',
};

// Turns escaped tags back into markup, leaving every other entity escaped.
function decodeMarkup(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

// Replaces each element's content with its data-es value.
function translateBody(html) {
  let applied = 0;
  const out = html.replace(
    /<([a-z0-9]+)\b([^>]*\bdata-es="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag, attrs, spanish, content) => {
      if (/<[a-z]/i.test(content) && !/data-i18n-html/.test(attrs)) return whole;
      applied += 1;
      // Attribute values arrive escaped; only data-i18n-html becomes markup.
      const value = /data-i18n-html/.test(attrs) ? decodeMarkup(spanish) : spanish;
      return `<${tag}${attrs}>${value}</${tag}>`;
    },
  );
  return { html: out, applied };
}

function translateHead(html) {
  const missing = [];
  let out = html;
  for (const [en, es] of Object.entries(META)) {
    if (!out.includes(en)) {
      missing.push(en.slice(0, 60));
      continue;
    }
    out = out.split(en).join(es);
  }
  return { html: out, missing };
}

function translateAria(html) {
  const missing = [];
  let out = html;
  for (const [en, es] of Object.entries(ARIA)) {
    if (!out.includes(en)) {
      missing.push(en);
      continue;
    }
    out = out.split(en).join(es);
  }
  return { html: out, missing };
}

function localiseLinks(html) {
  return html
    .replace('<html lang="en">', '<html lang="es">')
    .replace(
      `<link rel="canonical" href="${ORIGIN}/">`,
      `<link rel="canonical" href="${ORIGIN}/es/">`,
    )
    .replace(
      `<meta property="og:url" content="${ORIGIN}/">`,
      `<meta property="og:url" content="${ORIGIN}/es/">`,
    )
    .replace(
      `<meta property="twitter:url" content="${ORIGIN}/">`,
      `<meta property="twitter:url" content="${ORIGIN}/es/">`,
    )
    .replace('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="es_ES">')
    .replace(
      '<meta property="og:locale:alternate" content="es_ES">',
      '<meta property="og:locale:alternate" content="en_US">',
    );
}

export function buildSpanish(source) {
  const body = translateBody(source);
  const head = translateHead(body.html);
  const aria = translateAria(head.html);
  return {
    html: localiseLinks(aria.html),
    applied: body.applied,
    missing: [...head.missing, ...aria.missing],
  };
}

const source = fs.readFileSync(SOURCE, 'utf8');
const result = buildSpanish(source);
const check = process.argv.includes('--check');

if (result.missing.length) {
  console.error(
    `\x1b[31m[FAIL]\x1b[0m ${result.missing.length} head string(s) in script/build-i18n.js no longer match index.html:\n` +
      result.missing.map((m) => `       "${m}..."`).join('\n') +
      '\n       Update META, then run: node script/build-i18n.js',
  );
  process.exit(1);
}

if (check) {
  const actual = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (actual !== result.html) {
    console.error(
      '\x1b[31m[FAIL]\x1b[0m es/index.html is stale: index.html changed.\n' +
        '       Spanish visitors would get the previous copy.\n' +
        '       Run: node script/build-i18n.js',
    );
    process.exit(1);
  }
  console.log(`\x1b[32m[PASS]\x1b[0m es/index.html matches index.html (${result.applied} strings)`);
} else {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, result.html);
  console.log(`Wrote es/index.html (${result.applied} strings translated)`);
}
