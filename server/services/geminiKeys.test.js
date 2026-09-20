import test from 'node:test';
import assert from 'node:assert/strict';
import { runWithKeyFallback } from './geminiService.js';

const rateLimited = () => Object.assign(new Error('429 quota exceeded'), { status: 429 });
const unavailable = () => Object.assign(new Error('503 overloaded'), { status: 503 });
const serverError = () => Object.assign(new Error('boom'), { status: 500 });

test('falls back to the next key on 429', async () => {
  const tried = [];
  const { result, index } = await runWithKeyFallback(['a', 'b'], 0, async (client) => {
    tried.push(client);
    if (client === 'a') throw rateLimited();
    return `readme-${client}`;
  });
  assert.equal(result, 'readme-b');
  assert.equal(index, 1);
  assert.deepEqual(tried, ['a', 'b']);
});

test('falls back to the next key on 503', async () => {
  const tried = [];
  const { result } = await runWithKeyFallback(['a', 'b'], 0, async (client) => {
    tried.push(client);
    if (client === 'a') throw unavailable();
    return `readme-${client}`;
  });
  assert.equal(result, 'readme-b');
  assert.deepEqual(tried, ['a', 'b']);
});

test('does not retry other errors', async () => {
  let calls = 0;
  await assert.rejects(
    runWithKeyFallback(['a', 'b'], 0, async () => {
      calls += 1;
      throw serverError();
    }),
    /boom/,
  );
  assert.equal(calls, 1);
});

test('wraps around the ring and rethrows when every key is rate-limited', async () => {
  const tried = [];
  await assert.rejects(
    runWithKeyFallback(['a', 'b'], 1, async (client) => {
      tried.push(client);
      throw rateLimited();
    }),
    /429/,
  );
  assert.deepEqual(tried, ['b', 'a']);
});

test('starts at the preferred key and reports it', async () => {
  const tried = [];
  const { index } = await runWithKeyFallback(['a', 'b', 'c'], 2, async (client) => {
    tried.push(client);
    return 'ok';
  });
  assert.deepEqual(tried, ['c']);
  assert.equal(index, 2);
});

test('throws when no keys are configured', async () => {
  await assert.rejects(
    runWithKeyFallback([], 0, async () => 'ok'),
    /No Gemini API keys/,
  );
});
