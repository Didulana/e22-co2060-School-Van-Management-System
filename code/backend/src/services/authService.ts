import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { demoUsers } from "../data/demoUsers";
import { AuthUser, DemoAuthUser, JwtUserPayload } from "../types/auth";

function buildPasswordHash(password: string, salt: string): Buffer {
  return scryptSync(password, salt, 64);
}

function findUserByEmail(email: string): DemoAuthUser | undefined {
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function sanitizeUser(user: DemoAuthUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function verifyPassword(user: DemoAuthUser, password: string): boolean {
  const incomingHash = buildPasswordHash(password, user.passwordSalt);
  const storedHash = Buffer.from(user.passwordHash, "hex");

  if (incomingHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, storedHash);
}

export function authenticateDemoUser(
  email: string,
  password: string
): AuthUser | null {
  const user = findUserByEmail(email);

  if (!user || !verifyPassword(user, password)) {
    return null;
  }

  return sanitizeUser(user);
}

export function signAuthToken(payload: JwtUserPayload): string {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = (process.env.JWT_EXPIRES_IN || "8h") as SignOptions["expiresIn"];

  if (!jwtSecret) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign(payload, jwtSecret as Secret, {
    expiresIn,
  });
}

export function getDemoCredentials() {
  return demoUsers.map(({ passwordHash, passwordSalt, ...user }) => ({
    ...user,
    passwordHint: `${user.role === "admin" ? "Admin" : user.role === "driver" ? "Driver" : "Parent"}@123`,
  }));
}

export function createPasswordRecord(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = buildPasswordHash(password, salt).toString("hex");

  return {
    salt,
    hash,
  };
}
