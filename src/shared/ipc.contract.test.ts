import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { IPC_CHANNELS } from './ipc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const preloadTsPath = path.resolve(__dirname, '../preload.ts');
const preloadCjsPath = path.resolve(__dirname, '../preload.cjs');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

test('preload.ts uses all IPC channels and exposes expected API methods', () => {
  const source = readFile(preloadTsPath);

  const expectedMethods = ['getLocale', 'listTypes', 'insertType', 'updateType', 'removeType'];
  for (const method of expectedMethods) {
    assert.match(source, new RegExp(`\\b${method}\\s*:`));
  }

  const expectedChannels = Object.keys(IPC_CHANNELS).map(
    (channelKey) => `IPC_CHANNELS.${channelKey}`,
  );
  for (const channelToken of expectedChannels) {
    assert.match(source, new RegExp(channelToken.replace('.', '\\.')));
  }
});

test('preload.cjs stays in sync with IPC channel string values', () => {
  const source = readFile(preloadCjsPath);
  const channelValues = Object.values(IPC_CHANNELS);

  for (const channel of channelValues) {
    assert.match(source, new RegExp(`'${channel}'`));
  }

  const literalChannels = new Set(
    [...source.matchAll(/'([a-z]+:[a-z-]+)'/g)].map(([, channel]) => channel),
  );

  assert.deepEqual([...literalChannels].sort(), [...channelValues].sort());
});
