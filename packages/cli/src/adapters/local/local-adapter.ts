import type { LocalAdapter } from '../../services/types.js';

export function createLocalAdapter(): LocalAdapter {
  return {
    mode: 'local'
  };
}

