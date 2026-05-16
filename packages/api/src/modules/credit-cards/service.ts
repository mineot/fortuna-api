import type {
  CreateCreditCardDto,
  CreditCardResponse,
  CreditCardUpdate,
  UpdateCreditCardDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export type CreditCardsListQuery = PaginationInput;

type CreateCreditCardPayload = Omit<CreateCreditCardDto, 'user_id'>;
type UpdateCreditCardPayload = Omit<UpdateCreditCardDto, 'user_id'>;

export const createCreditCardsService = (repositories: ApiRepositories) => ({
  create: async (userId: number, payload: CreateCreditCardPayload): Promise<CreditCardResponse> => {
    return repositories.creditCards.create({
      user_id: userId,
      ...payload,
      notes: payload.notes ?? null,
    });
  },

  findById: async (userId: number, creditCardId: number): Promise<CreditCardResponse> => {
    const creditCard = await repositories.creditCards.findById(userId, creditCardId);

    if (!creditCard) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_NOT_FOUND',
        message: 'Credit card not found.',
      });
    }

    return creditCard;
  },

  listByUser: async (userId: number, query: CreditCardsListQuery) => {
    const data = await repositories.creditCards.listByUser(userId, {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
    });

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    creditCardId: number,
    payload: UpdateCreditCardPayload,
  ): Promise<CreditCardResponse> => {
    const creditCard = await repositories.creditCards.updateById(
      userId,
      creditCardId,
      omitUndefined(payload) as CreditCardUpdate,
    );

    if (!creditCard) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_NOT_FOUND',
        message: 'Credit card not found.',
      });
    }

    return creditCard;
  },

  deleteById: async (userId: number, creditCardId: number): Promise<void> => {
    const deleted = await repositories.creditCards.deleteById(userId, creditCardId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'CREDIT_CARD_NOT_FOUND',
        message: 'Credit card not found.',
      });
    }
  },
});
