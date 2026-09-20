import test from 'node:test';
import assert from 'node:assert/strict';
import { createStreamParser } from './streamParser.js';

function collect() {
  const statuses = [];
  let content = '';
  const parser = createStreamParser({
    onStatus: (e) => statuses.push(e),
    onContent: (c) => {
      content = c;
    },
  });
  return { parser, statuses, get content() { return content; } };
}

test('peels status lines out of README content', () => {
  const t = collect();
  t.parser.push('\u001e{"type":"status","step":"clone","message":"Cloning"}\n# Hi\n');
  t.parser.push('more text\n');
  t.parser.flush();

  assert.deepEqual(t.statuses, [
    { type: 'status', step: 'clone', message: 'Cloning' },
  ]);
  assert.equal(t.content, '# Hi\nmore text\n');
});

test('handles a status line split across chunks', () => {
  const t = collect();
  t.parser.push('\u001e{"type":"status","step":"ge');
  t.parser.push('nerate","message":"Go"}\nbody');
  t.parser.flush();

  assert.equal(t.statuses.length, 1);
  assert.equal(t.statuses[0].step, 'generate');
  assert.equal(t.content, 'body');
});

test('flushes a trailing line without a newline', () => {
  const t = collect();
  t.parser.push('\u001e{"type":"status","step":"files","message":"Files"}\nlast line');
  t.parser.flush();

  assert.equal(t.statuses[0].step, 'files');
  assert.equal(t.content, 'last line');
});

test('ignores malformed status lines', () => {
  const t = collect();
  t.parser.push('\u001enot json\nkeep me\n');
  t.parser.flush();

  assert.equal(t.statuses.length, 0);
  assert.equal(t.content, 'keep me\n');
});

test('reports error events without mixing them into content', () => {
  const errors = [];
  let content = '';
  const parser = createStreamParser({
    onStatus: () => {},
    onContent: (c) => { content = c; },
    onError: (e) => errors.push(e),
  });
  parser.push('\u001e{"type":"error","message":"Repository not found"}\npartial');
  parser.flush();

  assert.deepEqual(errors, [{ type: 'error', message: 'Repository not found' }]);
  assert.equal(content, 'partial');
});
