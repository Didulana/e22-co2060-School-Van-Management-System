export type UserRole = "parent" | "driver" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface DemoAccount extends AuthUser {
  passwordHint: string;
}
