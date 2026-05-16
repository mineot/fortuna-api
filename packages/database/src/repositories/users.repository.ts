import type { Database as FortunaDatabase, NewUser, User, UserUpdate } from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface UsersRepository {
  create: (payload: NewUser) => Promise<User>;
  findById: (id: number) => Promise<User | undefined>;
  findByEmail: (email: string) => Promise<User | undefined>;
  updateById: (id: number, payload: UserUpdate) => Promise<User | undefined>;
  deleteById: (id: number) => Promise<boolean>;
}

export const createUsersRepository = (db: Kysely<FortunaDatabase>): UsersRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('users').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (id) => {
      return db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst();
    },

    findByEmail: async (email) => {
      return db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    },

    updateById: async (id, payload) => {
      if (!hasPatchValues(payload)) {
        return db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst();
      }

      return db
        .updateTable('users')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (id) => {
      const result = await db.deleteFrom('users').where('id', '=', id).executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
