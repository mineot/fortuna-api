import { TransferSchema } from '#database/schema'
import Account from '#models/account'
import Transaction from '#models/transaction'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Transfer extends TransferSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account, {
    foreignKey: 'sourceAccountId',
  })
  declare sourceAccount: BelongsTo<typeof Account>

  @belongsTo(() => Account, {
    foreignKey: 'destinationAccountId',
  })
  declare destinationAccount: BelongsTo<typeof Account>

  @belongsTo(() => Transaction, {
    foreignKey: 'sourceTransactionId',
  })
  declare sourceTransaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Transaction, {
    foreignKey: 'destinationTransactionId',
  })
  declare destinationTransaction: BelongsTo<typeof Transaction>
}
