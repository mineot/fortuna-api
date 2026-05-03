import type { NewTransfer, Transfer, TransferUpdate } from '@db/schema';

import { CrudService } from './crud.service';

class TransfersService extends CrudService<Transfer, NewTransfer, TransferUpdate> {
  constructor() {
    super(window.fortuna.transfers);
  }
}

export const transfersService = new TransfersService();
