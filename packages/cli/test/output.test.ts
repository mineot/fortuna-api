import { strict as assert } from 'node:assert';
import test from 'node:test';

import { formatOutput } from '../src/formatters/output.js';

test('formatOutput returns JSON for json format', () => {
  const output = formatOutput({ ok: true }, 'json');
  assert.equal(output, '{\n  "ok": true\n}');
});

test('formatOutput preserves string for human format', () => {
  const output = formatOutput('hello', 'human');
  assert.equal(output, 'hello');
});
