import type {
  TypeFilters,
  TypeInsertInput,
  TypeRemoveInput,
  Types,
  TypeUpdateInput,
} from '@db/schema';

export async function listTypes(filters?: TypeFilters): Promise<Types[]> {
  if (!window.fortuna?.listTypes) {
    throw new Error('Renderer API unavailable. Check preload/IPC initialization.');
  }

  return window.fortuna.listTypes(filters);
}

export async function insertType(input: TypeInsertInput): Promise<Types> {
  if (!window.fortuna?.insertType) {
    throw new Error('Renderer API unavailable. Check preload/IPC initialization.');
  }

  return window.fortuna.insertType(input);
}

export async function updateType(input: TypeUpdateInput): Promise<Types | undefined> {
  if (!window.fortuna?.updateType) {
    throw new Error('Renderer API unavailable. Check preload/IPC initialization.');
  }

  return window.fortuna.updateType(input);
}

export async function removeType(input: TypeRemoveInput): Promise<boolean> {
  if (!window.fortuna?.removeType) {
    throw new Error('Renderer API unavailable. Check preload/IPC initialization.');
  }

  return window.fortuna.removeType(input);
}
