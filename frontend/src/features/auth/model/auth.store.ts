import { authConfig } from "../../../config/auth";
import { roles, type Role } from "../../../lib/constants/roles";
import { tokenStorage } from "../../../lib/auth/token-storage";
import type { AuthClaims, AuthSession } from "./auth.types";
import { refreshToken } from "../api/refresh-tokens";

type AuthStoreState = {
  accessToken: string | null;
  claims: AuthClaims | null;
  activeView: Role | null;
};

const mockClaims: AuthClaims = {
  subject: "9",
  issuer: "mock-auth",
  audience: ["codfish-united-frontend"],
  tokenId: "mock-token-id",
  issuedAt: 0,
  notBefore: 0,
  expiresAt: 4102444800,
  email: "luis.goncalves@club.local",
  name: "Luis Goncalves",
  active: true,
  roles: [...roles],
  mainRole: roles[0] ?? null,
  tokenType: "access",
};

const defaultState: AuthStoreState = {
  accessToken: tokenStorage.getAccessToken(),
  claims: null,
  activeView: null,
};

let state: AuthStoreState = { ...defaultState };
let sessionSnapshot: AuthSession = createSessionSnapshot(state);
const listeners = new Set<() => void>();

function resolveInitialActiveView(claims: AuthClaims | null): Role | null {
  if (!claims) {
    return null;
  }

  if (claims.mainRole && claims.roles.includes(claims.mainRole)) {
    return claims.mainRole;
  }

  return claims.roles[0] ?? null;
}

function isTokenExpired(claims: AuthClaims | null): boolean {
  if (!claims?.expiresAt) {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  return claims.expiresAt <= nowInSeconds;
}

function createSessionSnapshot(storeState: AuthStoreState): AuthSession {
  const claims = storeState.claims;
  const availableViews = claims?.roles ?? [];
  const fallbackActiveView = resolveInitialActiveView(claims);
  const activeView =
    storeState.activeView && availableViews.includes(storeState.activeView)
      ? storeState.activeView
      : fallbackActiveView;

  return {
    isAuthenticated: Boolean(
      storeState.accessToken &&
      claims?.active !== false &&
      !isTokenExpired(claims),
    ),
    accessToken: storeState.accessToken,
    claims,
    availableViews,
    activeView,
  };
}

function syncSessionSnapshot(): void {
  sessionSnapshot = createSessionSnapshot(state);
}

function emitChange(): void {
  syncSessionSnapshot();
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<AuthStoreState>): void {
  state = {
    ...state,
    ...nextState,
  };
  emitChange();
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder("utf-8").decode(bytes);
}

function parseJwtClaims(accessToken: string): AuthClaims | null {
  try {
    const payload = accessToken.split(".")[1];

    if (!payload) {
      return null;
    }

    const parsed = JSON.parse(decodeBase64Url(payload)) as Record<
      string,
      unknown
    >;

    const extractedRoles = Array.isArray(parsed.roles)
      ? parsed.roles.filter((value): value is Role =>
          roles.includes(value as Role),
        )
      : [];

    const rawMainRole =
      parsed.main_role ?? parsed.mainRole ?? parsed.mainrole ?? null;

    const parsedMainRole = roles.includes(rawMainRole as Role)
      ? (rawMainRole as Role)
      : null;

    const mainRole =
      parsedMainRole && extractedRoles.includes(parsedMainRole)
        ? parsedMainRole
        : null;

    return {
      subject: String(parsed.sub ?? ""),
      issuer: String(parsed.iss ?? ""),
      audience: Array.isArray(parsed.aud)
        ? parsed.aud.map((item) => String(item))
        : [],
      tokenId: String(parsed.jti ?? ""),
      issuedAt: Number(parsed.iat ?? 0),
      notBefore: Number(parsed.nbf ?? 0),
      expiresAt: Number(parsed.exp ?? 0),
      email: String(parsed.email ?? ""),
      name: String(parsed.name ?? ""),
      active: Boolean(parsed.active ?? false),
      roles: extractedRoles,
      mainRole,
      tokenType: "access",
    };
  } catch {
    return null;
  }
}

function applyMockSession(): void {
  state = {
    accessToken: "mock-access-token",
    claims: mockClaims,
    activeView: resolveInitialActiveView(mockClaims),
  };
  emitChange();
}

function hydrateFromToken(accessToken: string | null): void {
  if (authConfig.mode === "mock") {
    applyMockSession();
    return;
  }

  if (!accessToken) {
    state = {
      accessToken: null,
      claims: null,
      activeView: null,
    };
    emitChange();
    return;
  }

  const claims = parseJwtClaims(accessToken);

  state = {
    accessToken,
    claims,
    activeView: resolveInitialActiveView(claims),
  };

  emitChange();
}

function initializeAuthStore(): void {
  hydrateFromToken(tokenStorage.getAccessToken());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getState(): AuthStoreState {
  return state;
}

function getSession(): AuthSession {
  return sessionSnapshot;
}

function setAccessToken(accessToken: string): void {
  if (authConfig.mode === "mock") {
    applyMockSession();
    return;
  }

  tokenStorage.setAccessToken(accessToken);
  hydrateFromToken(accessToken);
}

function clearSession(): void {
  if (authConfig.mode === "mock") {
    applyMockSession();
    return;
  }

  tokenStorage.clearAccessToken();
  setState({
    accessToken: null,
    claims: null,
    activeView: null,
  });
}

function setActiveView(role: Role): void {
  const availableViews = state.claims?.roles ?? [];

  if (!availableViews.includes(role)) {
    return;
  }

  setState({ activeView: role });
}

async function restoreSession(): Promise<boolean> {
  if (authConfig.mode === "mock") {
    applyMockSession();
    return true;
  }

  const currentAccessToken = tokenStorage.getAccessToken();

  if (currentAccessToken) {
    const claims = parseJwtClaims(currentAccessToken);

    if (claims && !isTokenExpired(claims)) {
      hydrateFromToken(currentAccessToken);
      return true;
    }
  }

  const refreshedTokens = await refreshToken();

  if (!refreshedTokens?.accessToken) {
    clearSession();
    return false;
  }

  setAccessToken(refreshedTokens.accessToken);
  return true;
}

export const authStore = {
  subscribe,
  getState,
  getSession,
  setAccessToken,
  clearSession,
  setActiveView,
  initializeAuthStore,
  restoreSession,
};
