import type { TypeFilters, TypeInsertInput, TypeRemoveInput, TypeUpdateInput } from '@db/schema';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseTypeFilters(input: unknown): TypeFilters | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (!isObject(input)) {
    throw new Error('Invalid filters payload');
  }

  const group = input.group;
  const name = input.name;

  if (group !== undefined && !isNonEmptyString(group)) {
    throw new Error('Invalid filters.group');
  }

  if (name !== undefined && !isNonEmptyString(name)) {
    throw new Error('Invalid filters.name');
  }

  const payload: TypeFilters = {};

  if (typeof group === 'string') {
    payload.group = group.trim();
  }

  if (typeof name === 'string') {
    payload.name = name.trim();
  }

  return payload;
}

export function parseTypeInsertInput(input: unknown): TypeInsertInput {
  if (!isObject(input)) {
    throw new Error('Invalid insert payload');
  }

  const group = input.group;
  const value = input.value;

  if (!isNonEmptyString(group)) {
    throw new Error('Invalid input.group');
  }

  if (!isNonEmptyString(value)) {
    throw new Error('Invalid input.value');
  }

  return {
    group: group.trim(),
    value: value.trim(),
  };
}

export function parseTypeUpdateInput(input: unknown): TypeUpdateInput {
  if (!isObject(input)) {
    throw new Error('Invalid update payload');
  }

  const id = input.id;
  const group = input.group;
  const value = input.value;

  if (!Number.isInteger(id) || Number(id) <= 0) {
    throw new Error('Invalid input.id');
  }

  if (group !== undefined && !isNonEmptyString(group)) {
    throw new Error('Invalid input.group');
  }

  if (value !== undefined && !isNonEmptyString(value)) {
    throw new Error('Invalid input.value');
  }

  const payload: TypeUpdateInput = { id: Number(id) };

  if (typeof group === 'string') {
    payload.group = group.trim();
  }

  if (typeof value === 'string') {
    payload.value = value.trim();
  }

  if (payload.group === undefined && payload.value === undefined) {
    throw new Error('At least one field must be provided to update');
  }

  return payload;
}

export function parseTypeRemoveInput(input: unknown): TypeRemoveInput {
  if (!isObject(input)) {
    throw new Error('Invalid remove payload');
  }

  const id = input.id;

  if (!Number.isInteger(id) || Number(id) <= 0) {
    throw new Error('Invalid input.id');
  }

  return { id: Number(id) };
}
