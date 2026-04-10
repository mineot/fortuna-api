import type { Types } from '@db/schema';

export const IPC_CHANNELS = {
  typesList: 'types:list',
} as const;

export interface RendererApi {
  listTypes: () => Promise<Types[]>;
}
