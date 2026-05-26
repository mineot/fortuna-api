import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AccountType from '#models/account_type'

export default class extends BaseSeeder {
  async run() {
    await AccountType.updateOrCreateMany('slug', [
      {
        name: 'Checking',
        slug: 'checking',
        description: 'Primary checking account',
      },
      {
        name: 'Savings',
        slug: 'savings',
        description: 'Savings account',
      },
      {
        name: 'Cash',
        slug: 'cash',
        description: 'Cash wallet',
      },
      {
        name: 'Investment',
        slug: 'investment',
        description: 'Investment account',
      },
      {
        name: 'Digital Wallet',
        slug: 'digital_wallet',
        description: 'Digital wallet account',
      },
      {
        name: 'Other',
        slug: 'other',
        description: 'Other account type',
      },
    ])
  }
}
