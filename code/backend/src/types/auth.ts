export type UserRole = "parent" | "driver" | "admin";

export interface JwtUserPayload {
  id: number;
  email: string;
  role: UserRole;
}