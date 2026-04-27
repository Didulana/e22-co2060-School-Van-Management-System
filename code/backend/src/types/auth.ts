export type UserRole = "parent" | "driver" | "admin";

export interface JwtUserPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthUser extends JwtUserPayload {
  name: string;
}

export interface DemoAuthUser extends AuthUser {
  passwordSalt: string;
  passwordHash: string;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}
