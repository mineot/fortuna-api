import Category from '#models/category';
import CategoryGroup from '#models/category_group';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { categoryDefaults, categoryGroupDefaults } from '../support/finance_defaults_catalog.js';

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select(['id']);
    if (users.length === 0) return;

    for (const user of users) {
      const groupsByName = new Map<string, CategoryGroup>();

      for (const groupDefault of categoryGroupDefaults) {
        const group = await CategoryGroup.firstOrCreate(
          {
            userId: user.id,
            name: groupDefault.name,
          },
          {
            position: groupDefault.position,
            archived: false,
            archivedAt: null,
          },
        );
        groupsByName.set(group.name, group);
      }

      for (const item of categoryDefaults) {
        const group = groupsByName.get(item.groupName);
        if (!group) continue;

        await Category.firstOrCreate(
          {
            userId: user.id,
            categoryGroupId: group.id,
            name: item.name,
          },
          {
            type: item.type,
            color: item.color,
            icon: item.icon,
            position: item.position,
            archived: false,
            archivedAt: null,
          },
        );
      }
    }
  }
}
