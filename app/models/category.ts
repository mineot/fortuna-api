import { CategorySchema } from '#database/schema'
import CategoryGroup from '#models/category_group'
import Budget from '#models/budget'
import BudgetCategory from '#models/budget_category'
import CreditCardPurchase from '#models/credit_card_purchase'
import Purchase from '#models/purchase'
import RecurringTransaction from '#models/recurring_transaction'
import Transaction from '#models/transaction'
import User from '#models/user'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Category extends CategorySchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => CategoryGroup)
  declare categoryGroup: BelongsTo<typeof CategoryGroup>

  @belongsTo(() => Category, {
    foreignKey: 'parentId',
  })
  declare parentCategory: BelongsTo<typeof Category>

  @hasMany(() => Category, {
    foreignKey: 'parentId',
  })
  declare childCategories: HasMany<typeof Category>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>

  @hasMany(() => BudgetCategory)
  declare budgetCategories: HasMany<typeof BudgetCategory>

  @hasMany(() => CreditCardPurchase)
  declare creditCardPurchases: HasMany<typeof CreditCardPurchase>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>

  @manyToMany(() => Budget, {
    pivotTable: 'budget_categories',
  })
  declare budgets: ManyToMany<typeof Budget>
}
