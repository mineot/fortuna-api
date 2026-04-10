import type { Types } from '@db/schema';

export async function listTypes(): Promise<Types[]> {
  if (!window.fortuna?.listTypes) {
    throw new Error('Renderer API unavailable. Check preload/IPC initialization.');
  }

  return window.fortuna.listTypes();
}
