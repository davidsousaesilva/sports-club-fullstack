import { tokenStorage } from "./token-storage";

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return atob(padded);
}

function isAccessTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return true;
    }

    const parsed = JSON.parse(decodeBase64Url(payload)) as { exp?: number };
    const nowInSeconds = Math.floor(Date.now() / 1000);

    return !parsed.exp || parsed.exp <= nowInSeconds;
  } catch {
    return true;
  }
}

function isAuthenticated(): boolean {
  const token = tokenStorage.getAccessToken();

  if (!token) {
    return false;
  }

  return !isAccessTokenExpired(token);
}

function startSession(accessToken: string): void {
  tokenStorage.setAccessToken(accessToken);
}

function endSession(): void {
  tokenStorage.clearAccessToken();
}

export const authSession = {
  isAuthenticated,
  startSession,
  endSession,
};