import AccountType from '#models/account_type';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { accountTypeDefaults } from '../support/finance_defaults_catalog.js';
import { seedTerms } from '../support/seed_i18n_terms.js';

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select(['id']);
    if (users.length === 0) return;

    for (const user of users) {
      for (const item of accountTypeDefaults) {
        const accountType = await AccountType.firstOrCreate(
          {
            userId: user.id,
            termKey: item.termKey,
          },
          {
            descriptionTermKey: `${item.termKey}.description`,
            archived: false,
            archivedAt: null,
          },
        );

        if (!accountType.descriptionTermKey) {
          accountType.descriptionTermKey = `${item.termKey}.description`;
          await accountType.save();
        }

        await seedTerms({
          userId: user.id,
          namespace: 'account_types',
          termKey: item.termKey,
          enUS: item.enUS,
          ptBR: item.ptBR,
        });

        await seedTerms({
          userId: user.id,
          namespace: 'account_types',
          termKey: `${item.termKey}.description`,
          enUS: item.descriptionEnUS,
          ptBR: item.descriptionPtBR,
        });
      }
    }
  }
}
