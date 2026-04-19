import type { TypeFilters, TypeInsertInput, TypeRemoveInput, Types, TypeUpdateInput } from '@db/schema';

import type { GetLocaleResponse, GetMetaResponse } from './handlers/app.types';

export const IPC_CHANNELS = {
  typesList: 'types:list',
  typesInsert: 'types:insert',
  typesUpdate: 'types:update',
  typesRemove: 'types:remove',
} as const;

export interface RendererApi {
  appGetMeta: () => Promise<GetMetaResponse>;
  appGetLocale: () => Promise<GetLocaleResponse>;
  listTypes: (filters?: TypeFilters) => Promise<Types[]>;
  insertType: (input: TypeInsertInput) => Promise<Types>;
  updateType: (input: TypeUpdateInput) => Promise<Types | undefined>;
  removeType: (input: TypeRemoveInput) => Promise<boolean>;
}
