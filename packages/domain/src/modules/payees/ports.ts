import type { NewPayee, PayeeResponse, PayeeUpdate } from '@repo/shared';

export interface PayeesListFilters {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface PayeesPort {
  create(payload: NewPayee): Promise<PayeeResponse>;
  findById(userId: number, payeeId: number): Promise<PayeeResponse | undefined>;
  listByUser(userId: number, filters?: PayeesListFilters): Promise<PayeeResponse[]>;
  updateById(userId: number, payeeId: number, payload: PayeeUpdate): Promise<PayeeResponse | undefined>;
  deleteById(userId: number, payeeId: number): Promise<boolean>;
}
