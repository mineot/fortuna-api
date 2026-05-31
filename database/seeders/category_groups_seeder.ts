import CategoryGroup from '#models/category_group';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { categoryGroupDefaults } from '../support/finance_defaults_catalog.js';

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select(['id']);
    if (users.length === 0) return;

    for (const user of users) {
      for (const item of categoryGroupDefaults) {
        await CategoryGroup.firstOrCreate(
          {
            userId: user.id,
            name: item.name,
          },
          {
            position: item.position,
            archived: false,
            archivedAt: null,
          },
        );
      }
    }
  }
}
