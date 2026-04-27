import { AuthSession, AuthUser, DemoAccount } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001/api";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
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
