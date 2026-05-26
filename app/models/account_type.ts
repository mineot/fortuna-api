import { AccountTypeSchema } from '#database/schema'
import Account from '#models/account'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class AccountType extends AccountTypeSchema {
  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>
}
