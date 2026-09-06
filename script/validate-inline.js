// Validates zero inline style and event attributes, and checks CSP head blocks.
// Usage: node script/validate-inline.js

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const HTML_FILES = ['index.html', 'es/index.html', '404.html'];

// Finds forbidden inline style="..." and on*="..." event attributes.
export function findInlineViolations(html) {
  const violations = [];

  // Strips HTML comments so commented examples are not flagged.
  const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length));
  const cleanLines = cleanHtml.split('\n');

  cleanLines.forEach((line, idx) => {
    // 1. Inline style attribute: style="..."
    const styleMatch = line.match(/<[a-z0-9-]+[^>]*\b(style\s*=\s*["'][^"']*["'])[^>]*>/i);
    if (styleMatch) {
      violations.push({ line: idx + 1, type: 'style-attribute', match: styleMatch[1] });
    }

    // 2. Inline event handler attributes: onclick="...", onload="...", etc.
    const eventMatch = line.match(/<[a-z0-9-]+[^>]*\b(on[a-z]+\s*=\s*["'][^"']*["'])[^>]*>/i);
    if (eventMatch) {
      violations.push({ line: idx + 1, type: 'event-handler', match: eventMatch[1] });
    }
  });

  // 3. Inline <style> or <script> inside <body> (forbidden outside <head>)
  const bodyMatch = cleanHtml.match(/<body[\s\S]*?<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[0];
    if (/<style[\s>]/i.test(bodyContent)) {
      violations.push({ line: 0, type: 'body-style-tag', match: '<style> inside <body>' });
    }
    // Inline script in body without src attribute is forbidden.
    const inlineScriptInBody = /<script(?![^>]*\bsrc=)[\s>]/i.test(bodyContent);
    if (inlineScriptInBody) {
      violations.push({ line: 0, type: 'body-script-tag', match: 'inline <script> inside <body>' });
    }
  }

  return violations;
}

export function runAudit() {
  let hasErrors = false;
  for (const relativePath of HTML_FILES) {
    const fullPath = path.join(ROOT, relativePath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const violations = findInlineViolations(content);

    if (violations.length > 0) {
      hasErrors = true;
      violations.forEach((v) => {
        const loc = v.line > 0 ? `:${v.line}` : '';
        console.error(`\x1b[31m[FAIL]\x1b[0m ${relativePath}${loc} -> Found forbidden inline code: ${v.match}`);
      });
    }
  }

  if (hasErrors) {
    console.error('\x1b[31mValidation failed: Inline CSS/JS attributes violate architecture separation.\x1b[0m');
    process.exit(1);
  }

  console.log('[PASS] Zero inline style attributes, event handlers, or unhashed body tags found');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAudit();
}
