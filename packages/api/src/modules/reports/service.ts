import { createReportsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface ReportsSummaryQuery {
  date_from?: string | undefined;
  date_to?: string | undefined;
}

export const createReportsService = (repositories: ApiRepositories) => {
  const useCases = createReportsUseCases(repositories.reports);

  return {
    getSummary: async (userId: number, query: ReportsSummaryQuery) =>
      useCases.getSummary(userId, omitUndefined(query)),

    getAccountBalances: async (userId: number) => useCases.getAccountBalances(userId),

    getStatementBalance: async (userId: number, statementId: number) => {
      try {
        return await useCases.getStatementBalance(userId, statementId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};
