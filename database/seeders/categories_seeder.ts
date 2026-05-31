import Category from '#models/category';
import CategoryGroup from '#models/category_group';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { categoryDefaults, categoryGroupDefaults } from '../support/finance_defaults_catalog.js';
import { seedTerms } from '../support/seed_i18n_terms.js';

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select(['id']);
    if (users.length === 0) return;

    for (const user of users) {
      const groupsByTermKey = new Map<string, CategoryGroup>();

      for (const groupDefault of categoryGroupDefaults) {
        const group = await CategoryGroup.firstOrCreate(
          {
            userId: user.id,
            termKey: groupDefault.termKey,
          },
          {
            position: groupDefault.position,
            archived: false,
            archivedAt: null,
          },
        );
        groupsByTermKey.set(group.termKey, group);
      }

      for (const item of categoryDefaults) {
        const group = groupsByTermKey.get(item.groupTermKey);
        if (!group) continue;

        await Category.firstOrCreate(
          {
            userId: user.id,
            termKey: item.termKey,
          },
          {
            categoryGroupId: group.id,
            type: item.type,
            color: item.color,
            icon: item.icon,
            position: item.position,
            archived: false,
            archivedAt: null,
          },
        );

        await seedTerms({
          userId: user.id,
          namespace: 'categories',
          termKey: item.termKey,
          enUS: item.enUS,
          ptBR: item.ptBR,
        });
      }
    }
  }
}
