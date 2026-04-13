import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { IPC_CHANNELS } from './ipc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const preloadTsPath = path.resolve(__dirname, '../preload.ts');
const preloadLegacyCjsPath = path.resolve(__dirname, '../preload.cjs');

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

test('legacy src/preload.cjs file does not exist', () => {
  assert.equal(fs.existsSync(preloadLegacyCjsPath), false);
});
