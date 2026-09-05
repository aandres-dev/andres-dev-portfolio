// Reports which source files have no test covering them (via codegraph's
// static import graph), so a break traces to "this had no test", not guesswork.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

// Loaded via <script src> in HTML, not import — codegraph's static graph
// can't see the link to the e2e tests that click their DOM output.
const E2E_ONLY = new Set(['src/scripts/main.js', 'src/js/theme.js']);

function sourceFiles() {
  const dirs = ['src', 'script'];
  const found = [];
  for (const dir of dirs) {
    const abs = path.join(ROOT, dir);
    for (const entry of fs.readdirSync(abs, { recursive: true, withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.js')) {
        found.push(path.relative(ROOT, path.join(entry.parentPath ?? entry.path, entry.name)));
      }
    }
  }
  return found.sort();
}

function testFiles() {
  return fs.readdirSync(path.join(ROOT, 'test'), { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.js'))
    .map((e) => path.join(e.parentPath ?? e.path, e.name));
}

// codegraph only sees static `import`s; a test spawning a script as a
// subprocess leaves no import edge, so fall back to a textual path match.
function referencedByPath(file, tests) {
  return tests.filter((abs) => fs.readFileSync(abs, 'utf8').includes(file))
    .map((abs) => path.relative(ROOT, abs));
}

function affectedTestsFor(file, allTests) {
  const raw = execFileSync('codegraph', ['affected', file, '--json'], { cwd: ROOT, encoding: 'utf8' });
  const statically = JSON.parse(raw).affectedTests;
  return statically.length ? statically : referencedByPath(file, allTests);
}

function assertCodegraphAvailable() {
  try {
    execFileSync('codegraph', ['--version'], { stdio: 'ignore' });
  } catch {
    console.error('[FAIL] The `codegraph` CLI is not on PATH; this report needs it.');
    process.exit(1);
  }
}

function run() {
  assertCodegraphAvailable();
  console.log('--- Coverage-Gap Report (static import graph) ---\n');

  const allTests = testFiles();
  const gaps = [];
  for (const file of sourceFiles()) {
    const tests = affectedTestsFor(file, allTests);
    const e2e = E2E_ONLY.has(file);
    const icon = tests.length ? '✅' : e2e ? '🌐' : '⚠️ ';
    console.log(`${icon} ${file}`);
    if (tests.length) console.log(`   -> ${tests.join(', ')}`);
    if (e2e) console.log('   -> also loaded via <script src>, exercised by e2e (run: pnpm e2e)');
    if (!tests.length && !e2e) {
      console.log('   -> NO STATIC TEST covers this file');
      gaps.push(file);
    }
  }

  console.log(`\n${gaps.length} file(s) with no test at all:`);
  gaps.forEach((f) => console.log(`   - ${f}`));
  if (!gaps.length) console.log('   (none)');
}

run();
