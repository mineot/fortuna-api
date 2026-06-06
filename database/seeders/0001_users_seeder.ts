import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      { email: 'admin@admin.com' },
      {
        fullName: 'Administrator',
        password: 'admin@123',
      },
    );
  }
}
