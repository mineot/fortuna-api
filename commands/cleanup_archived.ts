import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import { DateTime } from 'luxon';

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

export default class CleanupArchived extends BaseCommand {
  static commandName = 'cleanup:archived';
  static description = 'Permanentemente exclui registros arquivados há mais de 5 anos';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    const cutoff = DateTime.now().minus({ years: 5 });
    const results: { name: string; count: number }[] = [];

    // Ordem de exclusão respeitando chaves estrangeiras (folhas primeiro)
    // Pass 1: sem dependentes
    results.push(await this.purge(Transfer, cutoff));
    results.push(await this.purge(RecurringTransaction, cutoff));
    results.push(await this.purge(BudgetCategory, cutoff));
    results.push(await this.purge(CreditCardInstallment, cutoff));
    results.push(await this.purge(CreditCardInvoicePayment, cutoff));
    results.push(await this.purge(PurchaseItem, cutoff));

    // Pass 2: dependem apenas do Pass 1
    results.push(await this.purge(Transaction, cutoff));
    results.push(await this.purge(CreditCardPurchase, cutoff));
    results.push(await this.purge(Purchase, cutoff));
    results.push(await this.purge(CreditCardInvoice, cutoff));
    results.push(await this.purge(ShoppingListItem, cutoff));

    // Pass 3: dependem do Pass 1/2
    results.push(await this.purge(CreditCard, cutoff));
    results.push(await this.purge(Account, cutoff));

    // Pass 4: dependem apenas de User
    results.push(await this.purge(AccountType, cutoff));
    results.push(await this.purge(Category, cutoff));
    results.push(await this.purge(CategoryGroup, cutoff));
    results.push(await this.purge(Budget, cutoff));
    results.push(await this.purge(Payee, cutoff));
    results.push(await this.purge(ShoppingList, cutoff));

    for (const { name, count } of results) {
      if (count > 0) {
        this.logger.info(`  ${name}: ${count} registro(s) excluído(s)`);
      }
    }

    const total = results.reduce((sum, r) => sum + r.count, 0);
    this.logger.success(`${total} registro(s) excluído(s) permanentemente`);
  }

  private async purge(Model: any, cutoff: DateTime) {
    const count = await Model.query()
      .where('archived', true)
      .where('archivedAt', '<', cutoff.toSQL()!)
      .delete();

    return { name: Model.name, count };
  }
}
