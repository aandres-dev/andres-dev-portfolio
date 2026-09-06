// Guards findInlineViolations() against regressions.
import assert from 'node:assert/strict';
import test from 'node:test';
import { findInlineViolations } from '../script/validate-inline.js';

test('flags style attribute on html elements', () => {
  const html = '<div style="color: red">Hello</div>';
  const violations = findInlineViolations(html);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].type, 'style-attribute');
});

test('flags inline event handlers like onclick', () => {
  const html = '<button onclick="alert(1)">Click</button>';
  const violations = findInlineViolations(html);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].type, 'event-handler');
});

test('flags inline style tag inside body', () => {
  const html = '<html><body><style>.a{color:red}</style></body></html>';
  const violations = findInlineViolations(html);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].type, 'body-style-tag');
});

test('flags inline script tag inside body', () => {
  const html = '<html><body><script>alert(1)</script></body></html>';
  const violations = findInlineViolations(html);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].type, 'body-script-tag');
});

test('allows external scripts with src inside body', () => {
  const html = '<html><body><script src="/src/main.js"></script></body></html>';
  const violations = findInlineViolations(html);
  assert.equal(violations.length, 0);
});

test('allows clean markup without inline attributes', () => {
  const html = '<html lang="en"><head><script>/* critical */</script></head><body><h1>Clean</h1></body></html>';
  const violations = findInlineViolations(html);
  assert.equal(violations.length, 0);
});
