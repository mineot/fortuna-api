export interface AuthUserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface AuthUsersPort {
  findByEmail(email: string): Promise<AuthUserRecord | undefined>;
  findById(userId: number): Promise<AuthUserRecord | undefined>;
}

export interface PasswordHasherPort {
  verify(plainText: string, passwordHash: string): Promise<boolean>;
}

export interface AccessTokenSignerPort {
  sign(userId: number): Promise<string>;
}
