import type { TransactionType } from '@repo/shared';

export const DEFAULT_ACCOUNT_TYPES = [
  'Checking',
  'Savings',
  'Wallet',
  'Investment',
  'Other',
] as const;

export interface DefaultCategoryTemplate {
  name: string;
  type: TransactionType;
}

export interface DefaultCategoryGroupTemplate {
  name: string;
  categories: readonly DefaultCategoryTemplate[];
}

export const DEFAULT_CATEGORY_GROUPS: readonly DefaultCategoryGroupTemplate[] = [
  {
    name: 'Income',
    categories: [
      { name: 'Salary', type: 'income' },
      { name: 'Freelance', type: 'income' },
      { name: 'Refund', type: 'income' },
    ],
  },
  {
    name: 'Fixed Expenses',
    categories: [
      { name: 'Rent', type: 'expense' },
      { name: 'Electricity', type: 'expense' },
      { name: 'Internet', type: 'expense' },
    ],
  },
  {
    name: 'Variable Expenses',
    categories: [
      { name: 'Food', type: 'expense' },
      { name: 'Transportation', type: 'expense' },
      { name: 'Entertainment', type: 'expense' },
    ],
  },
  {
    name: 'Investments',
    categories: [
      { name: 'Investment Contribution', type: 'expense' },
      { name: 'Investment Yield', type: 'income' },
    ],
  },
  {
    name: 'Credit Card',
    categories: [{ name: 'Credit Card Payment', type: 'expense' }],
  },
] as const;
