// Guards validate.js actually scanning the site's real HTML entry points.
import { execFileSync } from 'node:child_process';

function runValidateAudit() {
  console.log('--- Starting validate.js Targeting Audit ---\n');

  let output = '';
  let exitCode = 0;
  try {
    output = execFileSync('node', ['script/validate.js'], { encoding: 'utf8' });
  } catch (err) {
    output = err.stdout || '';
    exitCode = err.status ?? 1;
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  const checked = Number(output.match(/Archivos evaluados: (\d+)/)?.[1] ?? 0);
  assert(checked === 3, `Scans the site's 3 real HTML entry points (found ${checked})`);
  assert(exitCode === 0, `Exits clean against the current, already-audited markup (exit ${exitCode})`);
  assert(!/No se encontraron archivos HTML/.test(output), 'Never falls back to the empty src/ scan');

  console.log(`\nAudit Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runValidateAudit();
