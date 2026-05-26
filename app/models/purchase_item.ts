import { PurchaseItemSchema } from '#database/schema'
import Purchase from '#models/purchase'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PurchaseItem extends PurchaseItemSchema {
  @belongsTo(() => Purchase)
  declare purchase: BelongsTo<typeof Purchase>
}
