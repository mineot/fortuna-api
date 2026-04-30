import type { NewUser, User,UserUpdate } from '@db/schema';

class UsersService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.users.list(input);
  }

  listAll(): Promise<User[]> {
    return window.fortuna.users.listAll() as Promise<User[]>;
  }

  findOne(id: number): Promise<User | undefined> {
    return window.fortuna.users.findOne(id) as Promise<User | undefined>;
  }

  add(input: NewUser): Promise<User> {
    return window.fortuna.users.add(input) as Promise<User>;
  }

  change(input: { id: number; changes: Partial<UserUpdate> }): Promise<User | undefined> {
    return window.fortuna.users.change(input) as Promise<User | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.users.remove(id) as Promise<boolean>;
  }
}

export const usersService = new UsersService();
