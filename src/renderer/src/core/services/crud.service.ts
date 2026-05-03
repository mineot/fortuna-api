import type { ListInput, PaginatedResult } from '@shared/handlers/crud/register.types';

type CrudClient<Result, NewTable, TableUpdate> = {
  list: (input?: ListInput) => Promise<PaginatedResult<Result>>;
  findOne: (id: number) => Promise<Result | undefined>;
  add: (input: NewTable) => Promise<Result>;
  change: (input: { id: number; changes: TableUpdate }) => Promise<Result | undefined>;
  remove: (id: number) => Promise<boolean>;
};

export abstract class CrudService<Result, NewTable, TableUpdate> {
  protected constructor(private readonly client: CrudClient<Result, NewTable, TableUpdate>) {}

  list(input?: ListInput): Promise<PaginatedResult<Result>> {
    return this.client.list(input);
  }

  findOne(id: number): Promise<Result | undefined> {
    return this.client.findOne(id);
  }

  add(input: NewTable): Promise<Result> {
    return this.client.add(input);
  }

  change(input: { id: number; changes: TableUpdate }): Promise<Result | undefined> {
    return this.client.change(input);
  }

  remove(id: number): Promise<boolean> {
    return this.client.remove(id);
  }
}
