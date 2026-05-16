import { after, test } from 'node:test';
import assert from 'node:assert/strict';

import { setupTestContext } from './helpers.js';

const context = await setupTestContext();
after(async () => context.cleanup());

test('auth flow: login, me, refresh and logout', async () => {
  const loginResponse = await context.app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: context.userEmail,
      password: context.userPassword,
    }),
  });

  assert.equal(loginResponse.status, 200);
  const loginPayload = await loginResponse.json();
  assert.equal(typeof loginPayload.data.access_token, 'string');
  assert.ok(loginPayload.data.access_token.length > 0);

  const authHeader = `Bearer ${loginPayload.data.access_token}`;

  const meResponse = await context.app.request('/api/v1/auth/me', {
    method: 'GET',
    headers: {
      authorization: authHeader,
    },
  });

  assert.equal(meResponse.status, 200);
  const mePayload = await meResponse.json();
  assert.equal(mePayload.data.id, context.userId);
  assert.equal(mePayload.data.email, context.userEmail);

  const refreshResponse = await context.app.request('/api/v1/auth/refresh', {
    method: 'POST',
    headers: {
      authorization: authHeader,
    },
  });

  assert.equal(refreshResponse.status, 200);
  const refreshPayload = await refreshResponse.json();
  assert.equal(typeof refreshPayload.data.access_token, 'string');
  assert.ok(refreshPayload.data.access_token.length > 0);

  const logoutResponse = await context.app.request('/api/v1/auth/logout', {
    method: 'POST',
    headers: {
      authorization: authHeader,
    },
  });

  assert.equal(logoutResponse.status, 200);
  const logoutPayload = await logoutResponse.json();
  assert.equal(logoutPayload.data.logged_out, true);
});

test('auth flow: invalid credentials return 401', async () => {
  const response = await context.app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: context.userEmail,
      password: 'wrong-password',
    }),
  });

  assert.equal(response.status, 401);
  const payload = await response.json();
  assert.equal(payload.code, 'INVALID_CREDENTIALS');
});

test('auth flow: invalid token returns 401 in protected route', async () => {
  const response = await context.app.request('/api/v1/auth/me', {
    method: 'GET',
    headers: {
      authorization: 'Bearer invalid-token',
    },
  });

  assert.equal(response.status, 401);
  const payload = await response.json();
  assert.equal(payload.code, 'INVALID_TOKEN');
});
