let accessToken: string | null = null;

function getAccessToken(): string | null {
  return accessToken;
}

function setAccessToken(token: string): void {
  accessToken = token;
}

function clearAccessToken(): void {
  accessToken = null;
}

export const tokenStorage = {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
};
