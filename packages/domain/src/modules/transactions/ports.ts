import type { TransactionResponse } from '@repo/shared';

export interface TransactionCreateInput {
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
}

export interface TransactionsPort {
  create(input: TransactionCreateInput): Promise<TransactionResponse>;
}
