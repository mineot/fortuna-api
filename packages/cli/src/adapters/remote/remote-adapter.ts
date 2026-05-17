import type { RemoteAdapter } from '../../services/types.js';

export function createRemoteAdapter(
  apiBaseUrl: string,
  environment: 'DEV' | 'PROD'
): RemoteAdapter {
  return {
    mode: 'remote',
    environment,
    apiBaseUrl
  };
}
