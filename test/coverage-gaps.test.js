// Guards the coverage-gap report classifying known files correctly.
import { execFileSync } from 'node:child_process';

function runReportAudit() {
  console.log('--- Starting Coverage-Gap Report Audit ---\n');

  const output = execFileSync('node', ['script/coverage-gaps.js'], { encoding: 'utf8' });

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

  assert(
    /script\/build-i18n\.js[\s\S]*?NO STATIC TEST/.test(output),
    'Flags build-i18n.js as having no statically-linked test',
  );
  assert(
    /script\/csp\.js[\s\S]*?test\/headers\.test\.js/.test(output),
    'Credits csp.js with the test that statically imports it',
  );
  assert(
    /src\/js\/form\.js[\s\S]*?test\/form\.test\.js/.test(output),
    'Credits form.js with the test that statically imports it',
  );
  assert(
    /src\/scripts\/main\.js[\s\S]*?e2e/i.test(output),
    'Calls out main.js as e2e-only coverage, not a false "no test" verdict',
  );
  assert(
    /script\/validate\.js[\s\S]*?test\/validate\.test\.js/.test(output),
    'Credits validate.js with test/validate.test.js despite the subprocess (not import) link',
  );

  console.log(`\nAudit Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runReportAudit();
