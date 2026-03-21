export interface Model<E> {
  listAll(): Promise<E[]>;
  findById(id: number): Promise<E | null>;
  create(entity: E): Promise<E>;
  update(entity: E): Promise<E>;
  delete(entity: E): Promise<void>;
}
