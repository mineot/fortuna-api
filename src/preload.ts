import { ACCOUNT_TYPES_CHANNELS } from '@shared/handlers/account-types/account-types.types';
import { ACCOUNTS_CHANNELS } from '@shared/handlers/accounts/accounts.types';
import { APP_CHANNELS } from '@shared/handlers/app/app.types';
import { CATEGORIES_CHANNELS } from '@shared/handlers/categories/categories.types';
import { CATEGORY_GROUPS_CHANNELS } from '@shared/handlers/category-groups/category-groups.types';
import { CREDIT_CARD_INSTALLMENTS_CHANNELS } from '@shared/handlers/credit-card-installments/credit-card-installments.types';
import { CREDIT_CARD_PURCHASES_CHANNELS } from '@shared/handlers/credit-card-purchases/credit-card-purchases.types';
import { CREDIT_CARD_STATEMENT_PAYMENTS_CHANNELS } from '@shared/handlers/credit-card-statement-payments/credit-card-statement-payments.types';
import { CREDIT_CARD_STATEMENTS_CHANNELS } from '@shared/handlers/credit-card-statements/credit-card-statements.types';
import { CREDIT_CARDS_CHANNELS } from '@shared/handlers/credit-cards/credit-cards.types';
import type { ListInput } from '@shared/handlers/crud/register.types';
import { PAYEES_CHANNELS } from '@shared/handlers/payees/payees.types';
import { RECURRING_TRANSACTIONS_CHANNELS } from '@shared/handlers/recurring-transactions/recurring-transactions.types';
import { TRANSACTIONS_CHANNELS } from '@shared/handlers/transactions/transactions.types';
import { TRANSFERS_CHANNELS } from '@shared/handlers/transfers/transfers.types';
import { USER_SETTINGS_CHANNELS } from '@shared/handlers/user-settings/user-settings.types';
import { USERS_CHANNELS } from '@shared/handlers/users/users.types';
import { contextBridge, ipcRenderer } from 'electron';

import type { RendererApi } from './shared/ipc';

const bindCrud = (channels: { list: string; findOne: string; add: string; change: string; remove: string }) => ({
  list: (input?: ListInput) => ipcRenderer.invoke(channels.list, input),
  findOne: (id: number) => ipcRenderer.invoke(channels.findOne, id),
  add: (input: unknown) => ipcRenderer.invoke(channels.add, input),
  change: (input: unknown) => ipcRenderer.invoke(channels.change, input),
  remove: (id: number) => ipcRenderer.invoke(channels.remove, id),
});

const api: RendererApi = {
  appGetMeta: () => ipcRenderer.invoke(APP_CHANNELS.getMeta),
  appGetLocale: () => ipcRenderer.invoke(APP_CHANNELS.getLocale),
  users: bindCrud(USERS_CHANNELS),
  userSettings: bindCrud(USER_SETTINGS_CHANNELS),
  accountTypes: bindCrud(ACCOUNT_TYPES_CHANNELS),
  accounts: bindCrud(ACCOUNTS_CHANNELS),
  categoryGroups: bindCrud(CATEGORY_GROUPS_CHANNELS),
  categories: bindCrud(CATEGORIES_CHANNELS),
  payees: bindCrud(PAYEES_CHANNELS),
  transactions: bindCrud(TRANSACTIONS_CHANNELS),
  transfers: bindCrud(TRANSFERS_CHANNELS),
  recurringTransactions: bindCrud(RECURRING_TRANSACTIONS_CHANNELS),
  creditCards: bindCrud(CREDIT_CARDS_CHANNELS),
  creditCardStatements: bindCrud(CREDIT_CARD_STATEMENTS_CHANNELS),
  creditCardPurchases: bindCrud(CREDIT_CARD_PURCHASES_CHANNELS),
  creditCardInstallments: bindCrud(CREDIT_CARD_INSTALLMENTS_CHANNELS),
  creditCardStatementPayments: bindCrud(CREDIT_CARD_STATEMENT_PAYMENTS_CHANNELS),
};

contextBridge.exposeInMainWorld('fortuna', api);
