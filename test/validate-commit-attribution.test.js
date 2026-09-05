// Guards FORBIDDEN actually catching AI attribution without false-positiving
// on legitimate trailers (Signed-off-by, Reviewed-by, unrelated mentions).
import assert from 'node:assert/strict';
import test from 'node:test';
import { FORBIDDEN } from '../script/validate-commit-attribution.js';

function isForbidden(message) {
  return FORBIDDEN.some((rule) => rule.test(message));
}

test('catches a Co-Authored-By trailer', () => {
  assert.ok(isForbidden('fix: bug\n\nCo-Authored-By: Claude <noreply@anthropic.com>'));
});

test('catches a Claude-Session trailer', () => {
  assert.ok(isForbidden('fix: bug\n\nClaude-Session: https://claude.ai/code/session_1'));
});

test('catches a bare mention of Claude Code', () => {
  assert.ok(isForbidden('fix: bug\n\nGenerated with Claude Code'));
});

test('does not flag an ordinary conventional commit', () => {
  assert.equal(isForbidden('fix(contact): confirm send on the button, drop the notice box'), false);
});

test('does not flag a legitimate Signed-off-by trailer', () => {
  assert.equal(isForbidden('fix: bug\n\nSigned-off-by: Andres Lopez <a@b.com>'), false);
});
