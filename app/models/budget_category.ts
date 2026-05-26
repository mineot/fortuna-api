import { BudgetCategorySchema } from '#database/schema'
import Budget from '#models/budget'
import Category from '#models/category'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class BudgetCategory extends BudgetCategorySchema {
  @belongsTo(() => Budget)
  declare budget: BelongsTo<typeof Budget>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
