import { strict as assert } from 'node:assert';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

import { createFileSessionStore } from '../src/services/session/file-session-store.js';

test('file session store persists and clears token', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'fortuna-cli-test-'));
  const file = join(dir, 'session.json');
  const store = createFileSessionStore(file);

  assert.equal(await store.getAccessToken(), null);
  await store.setAccessToken('abc123');
  assert.equal(await store.getAccessToken(), 'abc123');
  await store.clear();
  assert.equal(await store.getAccessToken(), null);

  await rm(dir, { recursive: true, force: true });
});
