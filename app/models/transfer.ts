import Account from '#models/account'
import Transaction from '#models/transaction'
import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Transfer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare fromAccountId: number

  @column()
  declare toAccountId: number

  @column()
  declare outTransactionId: number | null

  @column()
  declare inTransactionId: number | null

  @column()
  declare amount: string

  @column.date()
  declare transferDate: DateTime

  @column()
  declare status: string

  @column()
  declare description: string | null

  @column()
  declare notes: string | null

  @column()
  declare archived: boolean

  @column.dateTime()
  declare archivedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account, { foreignKey: 'fromAccountId' })
  declare fromAccount: BelongsTo<typeof Account>

  @belongsTo(() => Account, { foreignKey: 'toAccountId' })
  declare toAccount: BelongsTo<typeof Account>

  @belongsTo(() => Transaction, { foreignKey: 'outTransactionId' })
  declare outTransaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Transaction, { foreignKey: 'inTransactionId' })
  declare inTransaction: BelongsTo<typeof Transaction>
}
