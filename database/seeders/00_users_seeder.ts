import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      { email: 'seed.user@fortuna.local' },
      {
        fullName: 'Seed User',
        password: 'seed-password',
      },
    );
  }
}
