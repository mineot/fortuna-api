import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const preloadTsPath = path.resolve(__dirname, '../preload.ts');
const preloadLegacyCjsPath = path.resolve(__dirname, '../preload.cjs');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

test('preload.ts uses all IPC channels and exposes expected API methods', () => {
  const source = readFile(preloadTsPath);

  const expectedMethods = ['appGetLocale', 'appGetMeta', 'users', 'accounts', 'transactions'];
  for (const method of expectedMethods) {
    assert.match(source, new RegExp(`\\b${method}\\s*:`));
  }
});

test('legacy src/preload.cjs file does not exist', () => {
  assert.equal(fs.existsSync(preloadLegacyCjsPath), false);
});
