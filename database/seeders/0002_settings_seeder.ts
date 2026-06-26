import Setting from '#models/setting';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select(['id']);
    if (users.length === 0) return;

    const existingSettings = await Setting.query().select(['userId']);
    const existingUserIds = new Set(existingSettings.map((setting) => setting.userId));

    const missingSettings = users
      .filter((user) => !existingUserIds.has(user.id))
      .map((user) => ({
        userId: user.id,
        currency: 'USD',
        locale: 'en-US',
        timezone: 'America/New_York',
        localeInitializedAt: null,
      }));

    if (missingSettings.length > 0) {
      await Setting.createMany(missingSettings);
    }
  }
}
