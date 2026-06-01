import TransferService, { TransferValidationError } from '#services/transfer_service';
import Transfer from '#models/transfer';
import { createTransferValidator } from '#validators/transfer';
import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';
import { tHttp } from '#services/http_i18n';

export default class TransfersController {
  private transferService = new TransferService();

  private parseTransferDate(value: string) {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed : null;
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createTransferValidator);

    const transferDate = this.parseTransferDate(payload.transferDate);
    if (!transferDate) {
      return response.unprocessableEntity({ message: tHttp(i18n, 'Invalid transfer date') });
    }

    try {
      const transfer = await this.transferService.create({
        userId,
        fromAccountId: payload.fromAccountId,
        toAccountId: payload.toAccountId,
        amount: payload.amount,
        transferDate,
        status: payload.status,
        description: payload.description,
        notes: payload.notes,
        locale: i18n?.locale,
        i18n,
      });

      return response.created({ data: transfer });
    } catch (error) {
      const message =
        error instanceof TransferValidationError
          ? error.message
          : tHttp(i18n, 'Transfer could not be created');
      return response.unprocessableEntity({ message });
    }
  }

  async show({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const transfer = await Transfer.query()
      .where('id', params.id)
      .where('user_id', userId)
      .preload('fromAccount')
      .preload('toAccount')
      .preload('outTransaction')
      .preload('inTransaction')
      .first();

    if (!transfer) {
      return response.notFound({ message: tHttp(i18n, 'Transfer not found') });
    }

    return response.ok({ data: transfer });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const transfer = await Transfer.query().where('id', params.id).where('user_id', userId).first();

    if (!transfer) {
      return response.notFound({ message: tHttp(i18n, 'Transfer not found') });
    }

    if (!transfer.archived) {
      transfer.archived = true;
      transfer.archivedAt = DateTime.now();
      await transfer.save();
    }

    return response.ok({ data: transfer });
  }
}
