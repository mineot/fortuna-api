export interface LocalStatementPaymentInput {
  user_id: number;
  credit_card_statement_id: number;
  account_id: number;
  amount: number;
  date: string;
  category_id: number;
  description: string;
  payee_id: number | null;
  notes: string | null;
  transaction_status?: 'pending' | 'confirmed' | 'cancelled';
}

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createCreditCardStatementsRepository: (db: unknown) => {
    registerPayment: (
      userId: number,
      payload: {
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
    ) => Promise<unknown>;
  };
};

async function loadDbModule(): Promise<DbModule> {
  const modulePath = '../../../../database/dist/index.js';
  return import(modulePath) as unknown as Promise<DbModule>;
}

export async function createLocalStatementPayment(
  payload: LocalStatementPaymentInput
): Promise<unknown> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createCreditCardStatementsRepository(db);
    return await repo.registerPayment(payload.user_id, {
      creditCardStatementId: payload.credit_card_statement_id,
      accountId: payload.account_id,
      amount: payload.amount,
      date: payload.date,
      categoryId: payload.category_id,
      description: payload.description,
      payeeId: payload.payee_id,
      notes: payload.notes,
      ...(payload.transaction_status ? { transactionStatus: payload.transaction_status } : {})
    });
  } finally {
    await db.destroy();
  }
}

