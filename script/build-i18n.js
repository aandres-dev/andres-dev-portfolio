// Generates es/index.html from index.html.
//
// The Spanish text already lives in the page, inside data-es attributes, and
// the language switch applies it in the browser. That is enough for a visitor
// and useless for a crawler: without a distinct URL, Google indexes English
// only and any hreflang pointing Spanish at "/" is an unbacked claim.
//
// This produces that URL by applying the same substitution the switcher does,
// at build time, so both versions come from one source of truth.
//
//   node script/build-i18n.js          write es/index.html
//   node script/build-i18n.js --check  exit 1 if it is stale
//
// Metadata cannot live in data-es: <meta> carries its text in an attribute,
// not as element content. Those few strings are listed here instead, and
// --check fails when one is missing.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'index.html');
const OUT_DIR = path.join(ROOT, 'es');
const OUT = path.join(OUT_DIR, 'index.html');

const ORIGIN = 'https://andres.dev';

// Head strings with no element content to translate. Keep in sync by hand;
// --check verifies each English original is still present before swapping.
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

// Turns escaped markup back into markup, and nothing else. &amp; is content,
// not a tag, so it stays escaped — decoding it would emit a bare & into the
// document. Same for the typographic entities.
function decodeMarkup(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

// Every data-es element is a leaf: verified against index.html, where the only
// two carrying markup declare data-i18n-html. So a tag-scoped replacement is
// safe here and does not need a full parser.
function translateBody(html) {
  let applied = 0;
  const out = html.replace(
    /<([a-z0-9]+)\b([^>]*\bdata-es="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag, attrs, spanish, content) => {
      if (/<[a-z]/i.test(content) && !/data-i18n-html/.test(attrs)) return whole;
      applied += 1;
      // The attribute value is already escaped for HTML, so plain text goes in
      // verbatim. Only data-i18n-html is meant to become markup, and only that
      // gets decoded — decoding both would emit a bare & into the document.
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
  return {
    html: localiseLinks(head.html),
    applied: body.applied,
    missing: head.missing,
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
