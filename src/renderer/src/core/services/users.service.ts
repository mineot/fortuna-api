import type { NewUser, User, UserUpdate } from '@db/schema';

import { CrudService } from './crud.service';

class UsersService extends CrudService<User, NewUser, UserUpdate> {
  constructor() {
    super(window.fortuna.users);
  }
}

export const usersService = new UsersService();
