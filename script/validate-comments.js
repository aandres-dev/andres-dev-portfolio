// Fails when a comment block runs longer than two lines.
// Usage: node script/validate-comments.js

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAX_LINES = 2;
const SKIP = ['node_modules', '.git', 'es', 'test-results', 'playwright-report', '.codegraph'];
const EXTENSIONS = ['.html', '.css', '.js'];

// A line that starts with a comment marker, in any of the three languages.
const COMMENT_ONLY = /^\s*(\/\/|\/\*|\*|<!--)/;
const BLOCK_END = /(\*\/|-->)\s*$/;
const BLOCK_START = /^\s*(\/\*|<!--)/;

function filesToCheck(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...filesToCheck(full));
    else if (EXTENSIONS.includes(path.extname(entry.name))) found.push(full);
  }
  return found;
}

// Groups consecutive comment lines into blocks.
function blocksIn(lines) {
  const blocks = [];
  let current = null;
  let inBlockComment = false;

  let inTemplate = false;

  lines.forEach((line, index) => {
    // Skip template literals: _headers uses "/*" as a path pattern.
    const wasTemplate = inTemplate;
    if ((line.match(/(?<!\\)`/g) || []).length % 2 === 1) inTemplate = !inTemplate;
    if (wasTemplate) return;

    // Only a line opening with the marker starts a block, so "/assets/*" in a
    // string is not read as a comment.
    const opensBlock = BLOCK_START.test(line) && !BLOCK_END.test(line);
    const isComment = inBlockComment || COMMENT_ONLY.test(line);

    if (isComment) {
      if (!current) current = { start: index + 1, lines: [] };
      current.lines.push(line.trim());
      if (inBlockComment && BLOCK_END.test(line)) inBlockComment = false;
      else if (opensBlock) inBlockComment = true;
    } else if (current) {
      blocks.push(current);
      current = null;
    }
  });

  if (current) blocks.push(current);
  return blocks;
}

const offenders = [];
for (const file of filesToCheck(ROOT)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const block of blocksIn(lines)) {
    if (block.lines.length > MAX_LINES) {
      offenders.push({ file: path.relative(ROOT, file), line: block.start, count: block.lines.length });
    }
  }
}

if (offenders.length) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${offenders.length} comment block(s) over ${MAX_LINES} lines:\n`);
  for (const o of offenders) console.error(`       ${o.file}:${o.line} — ${o.count} lines`);
  console.error('\n       A comment says what the code does, in one line. Two at most.');
  console.error('       Longer reasoning belongs in the README or the commit message.\n');
  process.exit(1);
}

console.log(`\x1b[32m[PASS]\x1b[0m Every comment block is ${MAX_LINES} lines or fewer`);
