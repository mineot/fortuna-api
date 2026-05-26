import Account from '#models/account'
import Transaction from '#models/transaction'
import Transfer from '#models/transfer'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type CreateTransferInput = {
  userId: number
  sourceAccountId: number
  destinationAccountId: number
  amountCents: number
  transferDate: string
  description?: string | null
  notes?: string | null
}

export default class TransferService {
  async createTransfer(input: CreateTransferInput) {
    if (input.sourceAccountId === input.destinationAccountId) {
      throw new Error('Source and destination accounts must be different')
    }

    if (input.amountCents <= 0) {
      throw new Error('Transfer amount must be greater than zero')
    }

    return db.transaction(async (trx) => {
      const sourceAccount = await Account.query({ client: trx })
        .where('id', input.sourceAccountId)
        .where('user_id', input.userId)
        .first()

      const destinationAccount = await Account.query({ client: trx })
        .where('id', input.destinationAccountId)
        .where('user_id', input.userId)
        .first()

      if (!sourceAccount || !destinationAccount) {
        throw new Error('Accounts must belong to the same user')
      }

      const sourceTransaction = await Transaction.create(
        {
          userId: input.userId,
          accountId: input.sourceAccountId,
          type: 'transfer',
          description: input.description ?? null,
          notes: input.notes ?? null,
          amountCents: input.amountCents,
          transactionDate: DateTime.fromISO(input.transferDate),
          status: 'paid',
          archived: false,
        },
        { client: trx }
      )

      const destinationTransaction = await Transaction.create(
        {
          userId: input.userId,
          accountId: input.destinationAccountId,
          type: 'transfer',
          description: input.description ?? null,
          notes: input.notes ?? null,
          amountCents: input.amountCents,
          transactionDate: DateTime.fromISO(input.transferDate),
          status: 'paid',
          archived: false,
        },
        { client: trx }
      )

      return Transfer.create(
        {
          userId: input.userId,
          sourceAccountId: input.sourceAccountId,
          destinationAccountId: input.destinationAccountId,
          sourceTransactionId: sourceTransaction.id,
          destinationTransactionId: destinationTransaction.id,
          amountCents: input.amountCents,
          transferDate: DateTime.fromISO(input.transferDate),
          description: input.description ?? null,
          notes: input.notes ?? null,
          status: 'paid',
          archived: false,
        },
        { client: trx }
      )
    })
  }
}
