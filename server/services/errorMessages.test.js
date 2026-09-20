import test from 'node:test';
import assert from 'node:assert/strict';
import { friendlyGenerationError } from './errorMessages.js';

test('maps 404 to a repository-not-found message', () => {
  assert.match(friendlyGenerationError({ status: 404 }), /Repository not found/);
});

test('maps a nested response status too', () => {
  assert.match(friendlyGenerationError({ response: { status: 404 } }), /Repository not found/);
});

test('maps 429 to a rate-limit message', () => {
  assert.match(friendlyGenerationError({ status: 429 }), /rate-limited/);
});

test('falls back to a generic server message', () => {
  assert.match(friendlyGenerationError(new Error('boom')), /server/);
  assert.doesNotMatch(friendlyGenerationError(new Error('boom')), /boom/);
});
