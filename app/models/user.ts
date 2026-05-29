import Account from '#models/account';
import AccountType from '#models/account_type';
import Budget from '#models/budget';
import BudgetCategory from '#models/budget_category';
import Category from '#models/category';
import CategoryGroup from '#models/category_group';
import CreditCard from '#models/credit_card';
import CreditCardInstallment from '#models/credit_card_installment';
import CreditCardInvoice from '#models/credit_card_invoice';
import CreditCardInvoicePayment from '#models/credit_card_invoice_payment';
import CreditCardPurchase from '#models/credit_card_purchase';
import Payee from '#models/payee';
import Purchase from '#models/purchase';
import PurchaseItem from '#models/purchase_item';
import RecurringTransaction from '#models/recurring_transaction';
import ShoppingList from '#models/shopping_list';
import ShoppingListItem from '#models/shopping_list_item';
import Transaction from '#models/transaction';
import Transfer from '#models/transfer';
import { UserSchema } from '#database/schema';
import Setting from '#models/setting';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { hasMany, hasOne } from '@adonisjs/lucid/orm';
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations';

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasOne(() => Setting)
  declare setting: HasOne<typeof Setting>;
  @hasMany(() => AccountType)
  declare accountTypes: HasMany<typeof AccountType>;
  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>;
  @hasMany(() => CategoryGroup)
  declare categoryGroups: HasMany<typeof CategoryGroup>;
  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>;
  @hasMany(() => Payee)
  declare payees: HasMany<typeof Payee>;
  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>;
  @hasMany(() => Transfer)
  declare transfers: HasMany<typeof Transfer>;
  @hasMany(() => RecurringTransaction)
  declare recurringTransactions: HasMany<typeof RecurringTransaction>;
  @hasMany(() => Budget)
  declare budgets: HasMany<typeof Budget>;
  @hasMany(() => BudgetCategory)
  declare budgetCategories: HasMany<typeof BudgetCategory>;
  @hasMany(() => CreditCard)
  declare creditCards: HasMany<typeof CreditCard>;
  @hasMany(() => CreditCardInvoice)
  declare creditCardInvoices: HasMany<typeof CreditCardInvoice>;
  @hasMany(() => CreditCardPurchase)
  declare creditCardPurchases: HasMany<typeof CreditCardPurchase>;
  @hasMany(() => CreditCardInstallment)
  declare creditCardInstallments: HasMany<typeof CreditCardInstallment>;
  @hasMany(() => CreditCardInvoicePayment)
  declare creditCardInvoicePayments: HasMany<typeof CreditCardInvoicePayment>;
  @hasMany(() => ShoppingList)
  declare shoppingLists: HasMany<typeof ShoppingList>;
  @hasMany(() => ShoppingListItem)
  declare shoppingListItems: HasMany<typeof ShoppingListItem>;
  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>;
  @hasMany(() => PurchaseItem)
  declare purchaseItems: HasMany<typeof PurchaseItem>;

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@');
    if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    return `${first.slice(0, 2)}`.toUpperCase();
  }
}
