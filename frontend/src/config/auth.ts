import { env } from "./env";

const authConfig = {
  mode: env.authMode === "real" ? "real" : "mock",
  storageKey: "codfish-united.access-token",
  endpoints: {
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
  },
  redirectAfterLogin: "/app",
} as const;

export { authConfig };
