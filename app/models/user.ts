import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { hasOne } from '@adonisjs/lucid/orm'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Setting from '#models/setting'
import Account from '#models/account'
import CategoryGroup from '#models/category_group'
import Category from '#models/category'
import Payee from '#models/payee'
import Transaction from '#models/transaction'
import Transfer from '#models/transfer'
import RecurringTransaction from '#models/recurring_transaction'
import Budget from '#models/budget'
import CreditCard from '#models/credit_card'
import CreditCardInvoice from '#models/credit_card_invoice'
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment'
import CreditCardPurchase from '#models/credit_card_purchase'
import CreditCardInstallment from '#models/credit_card_installment'
import ShoppingList from '#models/shopping_list'
import Purchase from '#models/purchase'

/**
 * User model represents a user in the application.
 * It extends UserSchema and includes authentication capabilities
 * through the withAuthFinder mixin.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasOne(() => Setting)
  declare setting: HasOne<typeof Setting>

  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>

  @hasMany(() => CategoryGroup)
  declare categoryGroups: HasMany<typeof CategoryGroup>

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>

  @hasMany(() => Payee)
  declare payees: HasMany<typeof Payee>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => Transfer)
  declare transfers: HasMany<typeof Transfer>

  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>

  @hasMany(() => Budget)
  declare budgets: HasMany<typeof Budget>

  @hasMany(() => CreditCard)
  declare creditCards: HasMany<typeof CreditCard>

  @hasMany(() => CreditCardInvoice)
  declare creditCardInvoices: HasMany<typeof CreditCardInvoice>

  @hasMany(() => CreditCardInvoicePayment)
  declare creditCardInvoicePayments: HasMany<typeof CreditCardInvoicePayment>

  @hasMany(() => CreditCardPurchase)
  declare creditCardPurchases: HasMany<typeof CreditCardPurchase>

  @hasMany(() => CreditCardInstallment)
  declare creditCardInstallments: HasMany<typeof CreditCardInstallment>

  @hasMany(() => ShoppingList)
  declare shoppingLists: HasMany<typeof ShoppingList>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>

  /**
   * Get the user's initials from their full name or email.
   * Returns the first letter of first and last name if available,
   * otherwise returns the first two characters of the email username.
   */
  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
