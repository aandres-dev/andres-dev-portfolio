// Guards `immutable` + a 1-year max-age from landing on /assets/*, whose
// filenames (andres-lopez-cv.pdf, andres-480.jpg) are not content-hashed.
import { buildHeaders } from '../script/csp.js';
import fs from 'node:fs';
import path from 'node:path';

function runHeadersAudit() {
  console.log('--- Starting Cache-Control Policy Audit ---\n');
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const headers = buildHeaders(html);

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

  const assetsBlock = headers.split(/\n\/(?=\S)/).find((b) => b.startsWith('assets/*'));
  const assetsCacheControl = assetsBlock?.match(/Cache-Control:\s*(.+)/)?.[1] ?? '';
  const maxAge = Number(assetsCacheControl.match(/max-age=(\d+)/)?.[1] ?? Infinity);

  assert(
    !/immutable/.test(assetsCacheControl),
    '/assets/* does not use immutable (filenames are not content-hashed)',
  );
  assert(
    maxAge <= 86400,
    `/assets/* max-age stays low enough to pick up content changes (found ${maxAge}s)`,
  );

  console.log(`\nAudit Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runHeadersAudit();
