export interface AccountTypeRecord {
  id: number;
  name: string;
}

export interface AccountTypesPort {
  create(input: { name: string }): Promise<AccountTypeRecord>;
  findById(id: number): Promise<AccountTypeRecord | undefined>;
  list(): Promise<AccountTypeRecord[]>;
  updateById(id: number, input: Partial<{ name: string }>): Promise<AccountTypeRecord | undefined>;
  deleteById(id: number): Promise<boolean>;
}
