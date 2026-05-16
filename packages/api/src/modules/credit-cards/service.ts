import type {
  CreateCreditCardDto,
  CreditCardResponse,
  CreditCardUpdate,
  UpdateCreditCardDto,
} from '@repo/shared';
import { createCreditCardsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export type CreditCardsListQuery = PaginationInput;

type CreateCreditCardPayload = Omit<CreateCreditCardDto, 'user_id'>;
type UpdateCreditCardPayload = Omit<UpdateCreditCardDto, 'user_id'>;

export const createCreditCardsService = (repositories: ApiRepositories) => {
  const useCases = createCreditCardsUseCases(repositories.creditCards);

  return {
    create: async (userId: number, payload: CreateCreditCardPayload): Promise<CreditCardResponse> =>
      useCases.create({ user_id: userId, ...payload, notes: payload.notes ?? null }),

    findById: async (userId: number, creditCardId: number): Promise<CreditCardResponse> => {
      try {
        return await useCases.findById(userId, creditCardId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByUser: async (userId: number, query: CreditCardsListQuery) => {
      const data = await useCases.listByUser(userId, {
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
      try {
        return await useCases.updateById(userId, creditCardId, omitUndefined(payload) as CreditCardUpdate);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, creditCardId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, creditCardId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};
