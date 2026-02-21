// Responsible for auth API calls and localStorage token management.

const TOKEN_KEY = "auth_token";

export interface UserInfo {
  username: string;
  permission: string;
}

export interface AuthenticateResult {
  token: string;
}

export interface ValidateResult {
  valid: true;
  username: string;
  permission: string;
}

export type ValidateResponse = ValidateResult | { valid: false };

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function authenticate(
  username: string,
  password: string,
): Promise<{ token: string } | { error: string }> {
  try {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await response.json()) as { token?: string; error?: string };
    if (!response.ok || !data.token) {
      return { error: data.error ?? "登录失败" };
    }
    return { token: data.token };
  } catch {
    return { error: "网络错误，请稍后重试" };
  }
}

export async function validateToken(token: string): Promise<ValidateResponse> {
  try {
    const response = await fetch("/api/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { valid: false };
    return (await response.json()) as ValidateResponse;
  } catch {
    return { valid: false };
  }
}
