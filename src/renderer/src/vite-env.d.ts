import type { RendererApi } from '@shared/ipc';

declare global {
  interface Window {
    fortuna: RendererApi;
  }
}

export {};
