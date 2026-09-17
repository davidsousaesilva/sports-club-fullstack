import { apiConfig } from "../../config/api";
import { refreshToken } from "../../features/auth/api/refresh-tokens";
import { ApiError } from "./api-error";
import { tokenStorage } from "../auth/token-storage";
import { authConfig } from "../../config/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

function buildRequestUrl(path: string): string {
  const normalizedBaseUrl = apiConfig.baseUrl.endsWith("/")
    ? apiConfig.baseUrl
    : `${apiConfig.baseUrl}/`;

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBaseUrl).toString();
}

function redirectToLogin(): void {
  tokenStorage.clearAccessToken();

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

async function executeRequest(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { method = "GET", body, headers, signal } = options;

  const token = tokenStorage.getAccessToken();

  return fetch(buildRequestUrl(path), {
    method,
    credentials: apiConfig.withCredentials ? "include" : "same-origin",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
}

async function parsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!isJson) {
    return null;
  }

  return response.json().catch(() => null);
}

async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
  retryAfterRefresh = true,
): Promise<TResponse> {
  let response = await executeRequest(path, options);

  if (response.status === 401 && retryAfterRefresh) {
    const refreshedTokens = await refreshToken();

    if (refreshedTokens?.accessToken) {
      tokenStorage.setAccessToken(refreshedTokens.accessToken);

      response = await executeRequest(path, options);
    } else {
      redirectToLogin();
      throw new ApiError("Sessão expirada. Inicie sessão novamente.", 401);
    }
  }

  const payload = await parsePayload(response);

  if (!response.ok) {
    const message =
      (payload as { message?: string } | null)?.message ??
      (payload as { error?: string } | null)?.error ??
      "An unexpected API error occurred.";

    throw new ApiError(message, response.status, undefined, payload);
  }

  return (payload ?? null) as TResponse;
}

const httpClient = {
  get<TResponse>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<TResponse>(path, { ...options, method: "GET" });
  },

  post<TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<TResponse>(path, { ...options, method: "POST", body });
  },

  put<TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<TResponse>(path, { ...options, method: "PUT", body });
  },

  delete<TResponse>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<TResponse>(path, { ...options, method: "DELETE" });
  },

  deleteWithBody<TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return request<TResponse>(path, {
      ...options,
      method: "DELETE",
      body,
    });
  },
};

export { httpClient };
