// Fails if any reachable commit attributes the work to an AI co-author.
// Usage: node script/validate-commit-attribution.js

import { execFileSync } from 'node:child_process';

const FORBIDDEN = [
  /^\s*Co-Authored-By:/im,
  /^\s*Claude-Session:/im,
  /noreply@anthropic\.com/i,
  /Claude Code/i,
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

try {
  const hashes = git(['rev-list', 'HEAD']).split('\n').filter(Boolean);
  const hits = hashes.filter((hash) => {
    const message = git(['log', '-1', '--format=%B', hash]);
    return FORBIDDEN.some((rule) => rule.test(message));
  });

  if (hits.length) {
    const short = hits.map((hash) => hash.slice(0, 7)).join(', ');
    console.error(`[FAIL] AI attribution in commits: ${short}`);
    console.error('Strip Co-Authored-By / Claude-Session trailers. Do not attribute AI.');
    process.exit(1);
  }

  console.log(`[PASS] No AI attribution trailers in ${hashes.length} commits`);
} catch (err) {
  console.error('[FAIL] Could not read git history for attribution check');
  console.error(err.message);
  process.exit(1);
}
