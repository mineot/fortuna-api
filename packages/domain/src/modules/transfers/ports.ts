import type { TransferResponse } from '@repo/shared';

export interface TransferCreateInput {
  user_id: number;
  source_account_id: number;
  destination_account_id: number;
  amount: number;
  date: string;
  description: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface TransfersPort {
  create(input: TransferCreateInput): Promise<TransferResponse>;
}
