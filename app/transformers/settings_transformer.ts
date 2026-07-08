import type Setting from '#models/setting';
import { BaseTransformer } from '@adonisjs/core/transformers';

export default class SettingsTransformer extends BaseTransformer<Setting> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'locale',
      'currency',
      'timezone',
      'createdAt',
      'updatedAt',
    ]);
  }
}
