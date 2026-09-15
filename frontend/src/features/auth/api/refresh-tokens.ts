import { apiConfig } from "../../../config/api";
import { authConfig } from "../../../config/auth";
import type { AuthTokens, LoginResponseDto } from "../model/auth.types";
import { toAuthTokens } from "./mappers";

function buildRequestUrl(path: string): string {
  const normalizedBaseUrl = apiConfig.baseUrl.endsWith("/")
    ? apiConfig.baseUrl
    : `${apiConfig.baseUrl}/`;

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBaseUrl).toString();
}

async function refreshToken(): Promise<AuthTokens | null> {
  if (authConfig.mode === "mock") {
    return null;
  }

  const response = await fetch(buildRequestUrl(authConfig.endpoints.refresh), {
    method: "POST",
    credentials: apiConfig.withCredentials ? "include" : "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as LoginResponseDto;

  return toAuthTokens(payload);
}

export { refreshToken };