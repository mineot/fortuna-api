import type {
  TypeFilters,
  TypeInsertInput,
  TypeRemoveInput,
  Types,
  TypeUpdateInput,
} from '@db/schema';

export const IPC_CHANNELS = {
  appGetLocale: 'app:get-locale',
  typesList: 'types:list',
  typesInsert: 'types:insert',
  typesUpdate: 'types:update',
  typesRemove: 'types:remove',
} as const;

export interface RendererApi {
  getLocale: () => Promise<string>;
  listTypes: (filters?: TypeFilters) => Promise<Types[]>;
  insertType: (input: TypeInsertInput) => Promise<Types>;
  updateType: (input: TypeUpdateInput) => Promise<Types | undefined>;
  removeType: (input: TypeRemoveInput) => Promise<boolean>;
}
