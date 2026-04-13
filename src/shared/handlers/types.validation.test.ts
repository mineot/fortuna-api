import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseTypeFilters,
  parseTypeInsertInput,
  parseTypeRemoveInput,
  parseTypeUpdateInput,
} from './types.validation';

test('parseTypeFilters accepts undefined and trims values', () => {
  assert.equal(parseTypeFilters(undefined), undefined);
  assert.deepEqual(parseTypeFilters({ group: '  Income ', name: ' Salary  ' }), {
    group: 'Income',
    name: 'Salary',
  });
});

test('parseTypeFilters rejects invalid values', () => {
  assert.throws(() => parseTypeFilters({ group: '' }), /Invalid filters\.group/);
  assert.throws(() => parseTypeFilters({ name: '   ' }), /Invalid filters\.name/);
});

test('parseTypeInsertInput validates required fields', () => {
  assert.deepEqual(parseTypeInsertInput({ group: ' Fixed ', value: ' Rent ' }), {
    group: 'Fixed',
    value: 'Rent',
  });
  assert.throws(() => parseTypeInsertInput({ group: 'Fixed' }), /Invalid input\.value/);
});

test('parseTypeUpdateInput requires id and at least one field', () => {
  assert.deepEqual(parseTypeUpdateInput({ id: 1, group: ' Essentials ' }), {
    id: 1,
    group: 'Essentials',
  });
  assert.throws(() => parseTypeUpdateInput({ id: 0, group: 'X' }), /Invalid input\.id/);
  assert.throws(() => parseTypeUpdateInput({ id: 1 }), /At least one field must be provided/);
});

test('parseTypeRemoveInput requires positive integer id', () => {
  assert.deepEqual(parseTypeRemoveInput({ id: 1 }), { id: 1 });
  assert.throws(() => parseTypeRemoveInput({ id: -1 }), /Invalid input\.id/);
});
