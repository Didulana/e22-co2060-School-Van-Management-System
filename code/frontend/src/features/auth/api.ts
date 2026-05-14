import { AuthSession, AuthUser, DemoAccount } from "./types";
import { API_BASE_URL } from "../../config/api";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    const errorMsg = (data as any).details || data.error || "Request failed";
    throw new Error(errorMsg);
  }

  return data;
}

export async function fetchDemoAccounts(): Promise<DemoAccount[]> {
  const response = await fetch(`${API_BASE_URL}/auth/demo-accounts`);
  const data = await parseResponse<{ accounts: DemoAccount[] }>(response);
  return data.accounts;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return parseResponse<AuthSession>(response);
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse<{ user: AuthUser }>(response);
  return data.user;
}
