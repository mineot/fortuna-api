import type {
  CreateTransferDto,
  TransactionStatus,
  TransferResponse,
  TransferUpdate,
  UpdateTransferDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface TransfersListQuery extends PaginationInput {
  source_account_id?: number | undefined;
  destination_account_id?: number | undefined;
  status?: TransactionStatus | undefined;
  date_from?: string | undefined;
  date_to?: string | undefined;
}

type CreateTransferPayload = Omit<CreateTransferDto, 'user_id'>;
type UpdateTransferPayload = Omit<UpdateTransferDto, 'user_id'>;

export const createTransfersService = (repositories: ApiRepositories) => ({
  create: async (userId: number, payload: CreateTransferPayload): Promise<TransferResponse> => {
    return repositories.transfers.create({
      user_id: userId,
      ...payload,
      description: payload.description ?? null,
    });
  },

  findById: async (userId: number, transferId: number): Promise<TransferResponse> => {
    const transfer = await repositories.transfers.findById(userId, transferId);

    if (!transfer) {
      throw new DomainError(404, {
        code: 'TRANSFER_NOT_FOUND',
        message: 'Transfer not found.',
      });
    }

    return transfer;
  },

  listByUser: async (userId: number, query: TransfersListQuery) => {
    const filters = {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
      ...(query.source_account_id !== undefined ? { sourceAccountId: query.source_account_id } : {}),
      ...(query.destination_account_id !== undefined
        ? { destinationAccountId: query.destination_account_id }
        : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.date_from !== undefined ? { dateFrom: query.date_from } : {}),
      ...(query.date_to !== undefined ? { dateTo: query.date_to } : {}),
    };

    const data = await repositories.transfers.listByUser(userId, filters);

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    transferId: number,
    payload: UpdateTransferPayload,
  ): Promise<TransferResponse> => {
    const transfer = await repositories.transfers.updateById(
      userId,
      transferId,
      omitUndefined(payload) as TransferUpdate,
    );

    if (!transfer) {
      throw new DomainError(404, {
        code: 'TRANSFER_NOT_FOUND',
        message: 'Transfer not found.',
      });
    }

    return transfer;
  },

  deleteById: async (userId: number, transferId: number): Promise<void> => {
    const deleted = await repositories.transfers.deleteById(userId, transferId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'TRANSFER_NOT_FOUND',
        message: 'Transfer not found.',
      });
    }
  },
});

export type TransfersService = ReturnType<typeof createTransfersService>;
