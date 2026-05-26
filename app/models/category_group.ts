import { CategoryGroupSchema } from '#database/schema'
import Category from '#models/category'
import User from '#models/user'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class CategoryGroup extends CategoryGroupSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>
}
