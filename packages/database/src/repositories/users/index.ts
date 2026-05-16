import type {
  NewUser,
  NewUserSettings,
  User,
  UserSettings,
  UserSettingsUpdate,
  UserUpdate,
} from '@repo/shared';

import type { DatabaseClient } from '../../client';

const hasAffectedRows = (value: bigint | number): boolean => Number(value) > 0;

export interface UserListQuery {
  page?: number;
  pageSize?: number;
}

export interface UsersRepository {
  createUser(input: NewUser): Promise<User>;
  findUserById(id: number): Promise<User | undefined>;
  findUserByEmail(email: string): Promise<User | undefined>;
  listUsers(query?: UserListQuery): Promise<User[]>;
  updateUserById(id: number, patch: UserUpdate): Promise<User | undefined>;
  deleteUserById(id: number): Promise<boolean>;

  createUserSettings(input: NewUserSettings): Promise<UserSettings>;
  findUserSettingsByUserId(userId: number): Promise<UserSettings | undefined>;
  updateUserSettingsByUserId(
    userId: number,
    patch: UserSettingsUpdate,
  ): Promise<UserSettings | undefined>;
}

export const createUsersRepository = (db: DatabaseClient): UsersRepository => ({
  async createUser(input) {
    const created = await db
      .insertInto('users')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();

    return created;
  },

  async findUserById(id) {
    return db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async findUserByEmail(email) {
    return db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
  },

  async listUsers(query = {}) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const safePage = page < 1 ? 1 : page;
    const safePageSize = pageSize < 1 ? 20 : pageSize;
    const offset = (safePage - 1) * safePageSize;

    return db
      .selectFrom('users')
      .selectAll()
      .orderBy('id', 'asc')
      .limit(safePageSize)
      .offset(offset)
      .execute();
  },

  async updateUserById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findUserById(id);
    }

    const updated = await db
      .updateTable('users')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    return updated;
  },

  async deleteUserById(id) {
    const result = await db.deleteFrom('users').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createUserSettings(input) {
    const created = await db
      .insertInto('user_settings')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();

    return created;
  },

  async findUserSettingsByUserId(userId) {
    return db
      .selectFrom('user_settings')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst();
  },

  async updateUserSettingsByUserId(userId, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findUserSettingsByUserId(userId);
    }

    return db
      .updateTable('user_settings')
      .set(patch)
      .where('user_id', '=', userId)
      .returningAll()
      .executeTakeFirst();
  },
});
