import type { Types } from '@db/schema';

export const IPC_CHANNELS = {
  appGetLocale: 'app:get-locale',
  typesList: 'types:list',
} as const;

export interface RendererApi {
  getLocale: () => Promise<string>;
  listTypes: () => Promise<Types[]>;
}
