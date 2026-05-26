import { BudgetSchema } from '#database/schema'
import BudgetCategory from '#models/budget_category'
import Category from '#models/category'
import User from '#models/user'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Budget extends BudgetSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => BudgetCategory)
  declare budgetCategories: HasMany<typeof BudgetCategory>

  @manyToMany(() => Category, {
    pivotTable: 'budget_categories',
  })
  declare categories: ManyToMany<typeof Category>
}
