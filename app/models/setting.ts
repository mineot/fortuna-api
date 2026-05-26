import { SettingSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Setting extends SettingSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
