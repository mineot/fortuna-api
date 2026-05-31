import AccountType from '#models/account_type';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { accountTypeDefaults } from '../support/finance_defaults_catalog.js';

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select(['id']);
    if (users.length === 0) return;

    for (const user of users) {
      for (const item of accountTypeDefaults) {
        await AccountType.firstOrCreate(
          {
            userId: user.id,
            name: item.name,
          },
          {
            description: item.description,
            archived: false,
            archivedAt: null,
          },
        );
      }
    }
  }
}
