import type { Role } from "../../../lib/constants/roles";

type AuthTokens = {
  accessToken: string;
};

type AuthClaims = {
  subject: string;
  issuer: string;
  audience: string[];
  tokenId: string;
  issuedAt: number;
  notBefore: number;
  expiresAt: number;
  email: string;
  name: string;
  active: boolean;
  roles: Role[];
  mainRole: Role | null;
  tokenType: "access";
};

type AuthSession = {
  isAuthenticated: boolean;
  accessToken: string | null;
  claims: AuthClaims | null;
  availableViews: Role[];
  activeView: Role | null;
};

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginRequestDto = {
  email: string;
  password: string;
};

type LoginResponseDto = {
  accessToken: string;
};

export type {
  AuthClaims,
  AuthSession,
  AuthTokens,
  LoginFormValues,
  LoginRequestDto,
  LoginResponseDto,
};
