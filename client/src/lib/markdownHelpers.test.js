import test from 'node:test';
import assert from 'node:assert/strict';
import { insertBadgeAfterHeading } from './markdownHelpers.js';

const A = '![A](https://img.shields.io/badge/A-red)';
const B = '![B](https://img.shields.io/badge/B-blue)';

test('inserts a badge paragraph with blank lines around it', () => {
  const out = insertBadgeAfterHeading('# Title\n\n## Table of Contents\n', A);
  assert.equal(out, '# Title\n\n![A](https://img.shields.io/badge/A-red)\n\n## Table of Contents\n');
  assert.ok(!out.includes('<p align="center">'));
});

test('inserts after the centered title and subheading', () => {
  const out = insertBadgeAfterHeading('<h1 align="center">T</h1>\n<h3 align="center">Sub</h3>\n\nBody\n', A);
  assert.equal(out, '<h1 align="center">T</h1>\n<h3 align="center">Sub</h3>\n\n![A](https://img.shields.io/badge/A-red)\n\nBody\n');
});

test('appends to an existing badge row on the same line', () => {
  const out = insertBadgeAfterHeading(`# T\n\n${A}\n\nBody\n`, B);
  assert.equal(out, `# T\n\n${A} ${B}\n\nBody\n`);
});

test('unwraps a legacy <p align="center"> badge block', () => {
  const legacy = `# T\n\n<p align="center">\n${A}\n</p>\n\n## Next\n`;
  const out = insertBadgeAfterHeading(legacy, B);
  assert.equal(out, `# T\n\n${A} ${B}\n\n## Next\n`);
});

test('keeps the badge above the title horizontal rule', () => {
  const out = insertBadgeAfterHeading('# T\n\n---\n\n## Table of Contents\n', A);
  assert.equal(out, `# T\n\n${A}\n\n---\n\n## Table of Contents\n`);
});

test('prepends a badge when there is no heading', () => {
  const out = insertBadgeAfterHeading('just text\n', A);
  assert.equal(out, `![A](https://img.shields.io/badge/A-red)\n\njust text\n`);
});

test('handles empty content', () => {
  assert.equal(insertBadgeAfterHeading('', A), `${A}\n`);
});
