import { getDatabase } from '@db';
import { Model } from './model';
import { TypeGroup, TypeTable } from '../core/schema';
import type { Selectable } from 'kysely';

type TypeEntity = {
  id: number;
  name: string;
  group: TypeGroup;
};

function toEntity(row: Selectable<TypeTable>): TypeEntity {
  return {
    id: row.id,
    name: row.name,
    group: row.group,
  };
}

export class TypeModel implements Model<TypeEntity> {
  private readonly $db = getDatabase();

  async listAll(): Promise<TypeEntity[]> {
    const list = await this.$db.selectFrom('types').selectAll().execute();
    return list.map(toEntity);
  }

  async findById(id: number): Promise<TypeEntity | null> {
    const item = await this.$db
      .selectFrom('types')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return item ? toEntity(item) : null;
  }

  async create(entity: TypeEntity): Promise<TypeEntity> {
    const now = new Date().toISOString();

    const result = await this.$db
      .insertInto('types')
      .values({
        name: entity.name,
        group: entity.group,
        createdAt: now,
        updatedAt: now,
      })
      .returningAll()
      .executeTakeFirst();

    if (!result) {
      throw new Error('Failed to create type.');
    }

    return toEntity(result);
  }

  async update(entity: TypeEntity): Promise<TypeEntity> {
    const now = new Date().toISOString();

    const result = await this.$db
      .updateTable('types')
      .set({
        name: entity.name,
        group: entity.group,
        updatedAt: now,
      })
      .where('id', '=', entity.id)
      .returningAll()
      .executeTakeFirst();

    if (!result) {
      throw new Error(`Type not found for update: ${entity.id}`);
    }

    return toEntity(result);
  }

  async delete(entity: TypeEntity): Promise<void> {
    const result = await this.$db
      .deleteFrom('types')
      .where('id', '=', entity.id)
      .executeTakeFirst();

    const deletedRows = Number(result.numDeletedRows);

    if (deletedRows === 0) {
      throw new Error(`Type not found for delete: ${entity.id}`);
    }
  }
}
