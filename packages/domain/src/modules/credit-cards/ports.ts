import type {
  CreditCardInstallmentResponse,
  CreditCardPurchaseResponse,
  CreditCardStatementPaymentResponse,
  CreditCardStatementStatus,
  TransactionResponse,
} from '@repo/shared';

export interface CreditCardStatementPaymentInput {
  creditCardStatementId: number;
  accountId: number;
  amount: number;
  date: string;
  categoryId: number;
  description: string;
  payeeId: number | null;
  notes: string | null;
  transactionStatus?: 'pending' | 'confirmed' | 'cancelled';
}

export interface CreditCardInstallmentInput {
  credit_card_statement_id: number;
  installment_number: number;
  amount: number;
  competence_date: string;
}

export interface CreditCardPurchaseInput {
  credit_card_id: number;
  category_id: number;
  payee_id: number | null;
  description: string;
  total_amount: number;
  installment_count: number;
  purchase_date: string;
}

export interface RegisterStatementPaymentResult {
  payment: CreditCardStatementPaymentResponse;
  transaction: TransactionResponse;
  statementTotal: number;
  statementPaidTotal: number;
  statementStatus: CreditCardStatementStatus;
}

export interface PurchaseWithInstallmentsResult {
  purchase: CreditCardPurchaseResponse;
  installments: CreditCardInstallmentResponse[];
}

export interface CreditCardsPort {
  registerStatementPayment(
    userId: number,
    input: CreditCardStatementPaymentInput,
  ): Promise<RegisterStatementPaymentResult>;
  createPurchaseWithInstallments(
    userId: number,
    purchase: CreditCardPurchaseInput,
    installments: CreditCardInstallmentInput[],
  ): Promise<PurchaseWithInstallmentsResult>;
}
