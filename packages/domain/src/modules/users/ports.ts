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
    input: {
      name?: string | undefined;
      email?: string | undefined;
      password?: string | undefined;
    },
  ): Promise<UserRecord | undefined>;
  deleteById(userId: number): Promise<boolean>;
}
