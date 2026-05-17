import { strict as assert } from 'node:assert';
import test from 'node:test';

import { parseArgv } from '../src/runtime/argv.js';

test('parseArgv parses two-word command after global flags', () => {
  const result = parseArgv(['--mode', 'remote', '--output', 'json', 'transactions', 'list', '--page', '1']);
  assert.equal(result.command, 'transactions list');
  assert.deepEqual(result.commandArgs, ['--page', '1']);
});

test('parseArgv returns null command when argv is empty', () => {
  const result = parseArgv([]);
  assert.equal(result.command, null);
  assert.deepEqual(result.commandArgs, []);
});

test('parseArgv supports one-word command', () => {
  const result = parseArgv(['help']);
  assert.equal(result.command, 'help');
  assert.deepEqual(result.commandArgs, []);
});
