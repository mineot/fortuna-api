import type { TransferResponse } from '@repo/shared';

import { DomainError } from '../../../errors/domain-error.js';
import type { TransferCreateInput, TransfersPort } from '../ports.js';

export interface CreateTransferUseCaseDeps {
  transfers: TransfersPort;
}

export const createCreateTransferUseCase = (deps: CreateTransferUseCaseDeps) => {
  return async (input: TransferCreateInput): Promise<TransferResponse> => {
    if (input.amount <= 0) {
      throw new DomainError({
        code: 'TRANSFER_INVALID_AMOUNT',
        message: 'Transfer amount must be greater than zero.',
      });
    }

    if (input.source_account_id === input.destination_account_id) {
      throw new DomainError({
        code: 'TRANSFER_SAME_ACCOUNT',
        message: 'Transfer source and destination accounts must be different.',
      });
    }

    return deps.transfers.create(input);
  };
};
