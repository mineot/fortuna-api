import { strict as assert } from 'node:assert';
import test from 'node:test';

import { createCliConfig, resolveCliMode, resolveOutputFormat } from '../src/config/cli-config.js';

test('resolveCliMode prefers --mode flag', () => {
  const mode = resolveCliMode(['--mode', 'remote'], { FORTUNA_CLI_MODE: 'local' });
  assert.equal(mode, 'remote');
});

test('resolveCliMode falls back to env and defaults to local', () => {
  assert.equal(resolveCliMode([], { FORTUNA_CLI_MODE: 'remote' }), 'remote');
  assert.equal(resolveCliMode([], {}), 'local');
});

test('resolveOutputFormat supports json and human', () => {
  assert.equal(resolveOutputFormat(['--output', 'json'], {}), 'json');
  assert.equal(resolveOutputFormat([], { FORTUNA_CLI_OUTPUT: 'human' }), 'human');
});

test('createCliConfig sets environment and session file defaults', () => {
  const dev = createCliConfig([], {});
  assert.equal(dev.environment, 'DEV');
  assert.equal(dev.sessionFilePath, '.fortuna/session.dev.json');

  const prod = createCliConfig([], { FORTUNA_ENV: 'PROD' });
  assert.equal(prod.environment, 'PROD');
  assert.equal(prod.sessionFilePath, '.fortuna/session.prod.json');
});
