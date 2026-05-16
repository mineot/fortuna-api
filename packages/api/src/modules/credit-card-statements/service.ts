import type {
  CreateCreditCardStatementDto,
  CreditCardStatementResponse,
  CreditCardStatementStatus,
  CreditCardStatementUpdate,
  TransactionStatus,
  UpdateCreditCardStatementDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CreditCardStatementsListQuery extends PaginationInput {
  status?: CreditCardStatementStatus | undefined;
  due_date_from?: string | undefined;
  due_date_to?: string | undefined;
}

type CreateCreditCardStatementPayload = Omit<CreateCreditCardStatementDto, 'credit_card_id'>;
type UpdateCreditCardStatementPayload = UpdateCreditCardStatementDto;

export interface RegisterStatementPaymentPayload {
  account_id: number;
  amount: number;
  date: string;
  category_id: number;
  description: string;
  payee_id?: number | null | undefined;
  notes?: string | null | undefined;
  transaction_status?: TransactionStatus | undefined;
}

export const createCreditCardStatementsService = (repositories: ApiRepositories) => ({
  create: async (
    userId: number,
    creditCardId: number,
    payload: CreateCreditCardStatementPayload,
  ): Promise<CreditCardStatementResponse> => {
    return repositories.creditCardStatements.create({
      credit_card_id: creditCardId,
      ...payload,
    });
  },

  findById: async (userId: number, statementId: number): Promise<CreditCardStatementResponse> => {
    const statement = await repositories.creditCardStatements.findById(userId, statementId);

    if (!statement) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }

    return statement;
  },

  listByCard: async (userId: number, creditCardId: number, query: CreditCardStatementsListQuery) => {
    const data = await repositories.creditCardStatements.listByCard(userId, creditCardId, {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.due_date_from !== undefined ? { dueDateFrom: query.due_date_from } : {}),
      ...(query.due_date_to !== undefined ? { dueDateTo: query.due_date_to } : {}),
    });

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    statementId: number,
    payload: UpdateCreditCardStatementPayload,
  ): Promise<CreditCardStatementResponse> => {
    const statement = await repositories.creditCardStatements.updateById(
      userId,
      statementId,
      omitUndefined(payload) as CreditCardStatementUpdate,
    );

    if (!statement) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }

    return statement;
  },

  deleteById: async (userId: number, statementId: number): Promise<void> => {
    const deleted = await repositories.creditCardStatements.deleteById(userId, statementId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }
  },

  getTotals: async (userId: number, statementId: number) => {
    const [statementTotal, statementPaidTotal] = await Promise.all([
      repositories.creditCardStatements.getStatementTotal(userId, statementId),
      repositories.creditCardStatements.getStatementPaidTotal(userId, statementId),
    ]);

    if (statementTotal === undefined || statementPaidTotal === undefined) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_STATEMENT_NOT_FOUND',
        message: 'Credit card statement not found.',
      });
    }

    return {
      statement_total: statementTotal,
      statement_paid_total: statementPaidTotal,
      statement_remaining_total: statementTotal - statementPaidTotal,
    };
  },

  registerPayment: async (
    userId: number,
    statementId: number,
    payload: RegisterStatementPaymentPayload,
  ) => {
    try {
      const registerPayload = {
        creditCardStatementId: statementId,
        accountId: payload.account_id,
        amount: payload.amount,
        date: payload.date,
        categoryId: payload.category_id,
        description: payload.description,
        payeeId: payload.payee_id ?? null,
        notes: payload.notes ?? null,
        ...(payload.transaction_status !== undefined
          ? { transactionStatus: payload.transaction_status }
          : {}),
      };

      return await repositories.creditCardStatements.registerPayment(userId, {
        ...registerPayload,
      });
    } catch (error) {
      throw new DomainError(400, {
        code: 'CREDIT_CARD_STATEMENT_PAYMENT_ERROR',
        message: error instanceof Error ? error.message : 'Could not register statement payment.',
      });
    }
  },
});
