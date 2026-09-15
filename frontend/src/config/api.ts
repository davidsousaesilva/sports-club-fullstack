import { env } from "./env";

const apiConfig = {
  baseUrl: env.apiBaseUrl,
  timeoutMs: 10000,
  withCredentials: true,
} as const;

export { apiConfig };
