import type {
  CreditCardStatementResponse,
  CreditCardStatementStatus,
  CreditCardStatementUpdate,
  NewCreditCardStatement,
} from '@repo/shared';

export interface CreditCardStatementsListFilters {
  status?: CreditCardStatementStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreditCardStatementsPort {
  create(payload: NewCreditCardStatement): Promise<CreditCardStatementResponse>;
  findById(userId: number, statementId: number): Promise<CreditCardStatementResponse | undefined>;
  listByCard(
    userId: number,
    creditCardId: number,
    filters?: CreditCardStatementsListFilters,
  ): Promise<CreditCardStatementResponse[]>;
  updateById(
    userId: number,
    statementId: number,
    payload: CreditCardStatementUpdate,
  ): Promise<CreditCardStatementResponse | undefined>;
  deleteById(userId: number, statementId: number): Promise<boolean>;
  getStatementTotal(userId: number, statementId: number): Promise<number | undefined>;
  getStatementPaidTotal(userId: number, statementId: number): Promise<number | undefined>;
}
