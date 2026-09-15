export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  authMode: import.meta.env.VITE_AUTH_MODE ?? "real",
} as const;
