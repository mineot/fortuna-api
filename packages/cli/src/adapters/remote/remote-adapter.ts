import type { RemoteAdapter } from '../../services/types.js';

export function createRemoteAdapter(apiBaseUrl: string): RemoteAdapter {
  return {
    mode: 'remote',
    apiBaseUrl
  };
}

