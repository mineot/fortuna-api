export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface UsersPort {
  findById(userId: number): Promise<UserRecord | undefined>;
  findByEmail(email: string): Promise<UserRecord | undefined>;
  create(input: { name: string; email: string; password: string }): Promise<UserRecord>;
  updateById(
    userId: number,
    input: Partial<{ name: string; email: string; password: string }>,
  ): Promise<UserRecord | undefined>;
  deleteById(userId: number): Promise<boolean>;
}
