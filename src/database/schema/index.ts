import type { MigrationTable } from './migrations.schema';
import type {
  TypeFilters,
  TypeInsertInput,
  TypeRemoveInput,
  Types,
  TypeTable,
  TypeUpdateInput,
} from './types.schema';

export interface Database {
  migrations: MigrationTable;
  types: TypeTable;
}

export type { TypeFilters, TypeInsertInput, TypeRemoveInput, Types, TypeUpdateInput };
