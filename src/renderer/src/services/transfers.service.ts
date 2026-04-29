import type { NewTransfer, Transfer,TransferUpdate } from '@db/schema';

class TransfersService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.transfers.list(input);
  }

  listAll(): Promise<Transfer[]> {
    return window.fortuna.transfers.listAll() as Promise<Transfer[]>;
  }

  findOne(id: number): Promise<Transfer | undefined> {
    return window.fortuna.transfers.findOne(id) as Promise<Transfer | undefined>;
  }

  add(input: NewTransfer): Promise<Transfer> {
    return window.fortuna.transfers.add(input) as Promise<Transfer>;
  }

  change(input: { id: number; changes: Partial<TransferUpdate> }): Promise<Transfer | undefined> {
    return window.fortuna.transfers.change(input) as Promise<Transfer | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.transfers.remove(id) as Promise<boolean>;
  }
}

export const transfersService = new TransfersService();
