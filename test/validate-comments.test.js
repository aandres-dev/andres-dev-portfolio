// Guards blocksIn()'s comment-block grouping, including its template-literal
// escape hatch (needed because _headers uses "/*" as a path pattern).
import assert from 'node:assert/strict';
import test from 'node:test';
import { blocksIn } from '../script/validate-comments.js';

test('a single-line comment is its own block', () => {
  const blocks = blocksIn(['// one line', 'const x = 1;']);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].lines.length, 1);
});

test('a two-line comment stays under the limit', () => {
  const blocks = blocksIn(['// line one', '// line two', 'const x = 1;']);
  assert.equal(blocks[0].lines.length, 2);
});

test('a three-line comment is flagged as one block over the limit', () => {
  const blocks = blocksIn(['// line one', '// line two', '// line three', 'const x = 1;']);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].lines.length, 3);
});

test('a /* */ block comment spanning three lines is one block', () => {
  const blocks = blocksIn(['/* one', 'two', 'three */', 'const x = 1;']);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].lines.length, 3);
});

test('an HTML comment spanning too many lines is flagged', () => {
  const blocks = blocksIn(['<!-- one', 'two', 'three -->', '<p>hi</p>']);
  assert.equal(blocks[0].lines.length, 3);
});

test('"/*" inside a template literal is not read as a comment', () => {
  const blocks = blocksIn(['const headers = `', '/assets/*', 'more text', '`;']);
  assert.equal(blocks.length, 0);
});
