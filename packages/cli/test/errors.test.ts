import { strict as assert } from 'node:assert';
import test from 'node:test';

import { CLI_EXIT_CODE, exitCodeForError, normalizeCliError } from '../src/runtime/errors.js';

test('normalizeCliError maps auth-required errors', () => {
  const error = normalizeCliError(new Error('No saved session token. Run auth login first.'));
  assert.equal(error.code, 'AUTH_REQUIRED');
  assert.equal(exitCodeForError(error.code), CLI_EXIT_CODE.AUTH);
});

test('normalizeCliError maps validation errors', () => {
  const error = normalizeCliError(new Error('Missing required flag: --amount'));
  assert.equal(error.code, 'VALIDATION_ERROR');
  assert.equal(exitCodeForError(error.code), CLI_EXIT_CODE.USAGE);
});

test('normalizeCliError maps API errors', () => {
  const error = normalizeCliError(new Error('API_ERROR: failed request'));
  assert.equal(error.code, 'API_ERROR');
  assert.equal(exitCodeForError(error.code), CLI_EXIT_CODE.API);
});

test('normalizeCliError defaults to internal error', () => {
  const error = normalizeCliError(new Error('some unknown failure'));
  assert.equal(error.code, 'INTERNAL_ERROR');
  assert.equal(exitCodeForError(error.code), CLI_EXIT_CODE.INTERNAL);
});
