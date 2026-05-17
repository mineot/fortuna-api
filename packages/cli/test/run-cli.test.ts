import { strict as assert } from 'node:assert';
import test from 'node:test';

import { runCli } from '../src/runtime/run-cli.js';

test('runCli returns help envelope when no command is provided', async () => {
  const result = await runCli({ argv: [] });
  assert.equal(result.exitCode, 0);
  const parsed = JSON.parse(result.output) as { ok: boolean; data: { commands: string[] } };
  assert.equal(parsed.ok, true);
  assert.ok(parsed.data.commands.length > 0);
});

test('runCli returns unknown-command error envelope', async () => {
  const result = await runCli({ argv: ['foo', 'bar'] });
  assert.equal(result.exitCode, 2);
  const parsed = JSON.parse(result.output) as { ok: boolean; error: { code: string } };
  assert.equal(parsed.ok, false);
  assert.equal(parsed.error.code, 'UNKNOWN_COMMAND');
});
