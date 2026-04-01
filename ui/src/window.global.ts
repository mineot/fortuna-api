import type { Api } from '@shared/api.types';

declare global {
  interface Window {
    electronApi?: {
      app: Api;
    };
  }
}

export {};
