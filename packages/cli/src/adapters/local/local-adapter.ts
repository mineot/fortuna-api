import type { LocalAdapter } from '../../services/types.js';

export function createLocalAdapter(environment: 'DEV' | 'PROD'): LocalAdapter {
  return {
    mode: 'local',
    environment
  };
}
