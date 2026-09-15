import { authConfig } from "../../../config/auth";
import { httpClient } from "../../../lib/api/http-client";
import type {
  AuthTokens,
  LoginFormValues,
  LoginResponseDto,
} from "../model/auth.types";
import { toAuthTokens, toLoginRequest } from "./mappers";

function createMockToken(email: string): string {
  return `mock-access-token:${email}:${Date.now()}`;
}

async function mockLogin(values: LoginFormValues): Promise<AuthTokens> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));

  if (!values.email || !values.password) {
    throw new Error("Email and password are required.");
  }

  return {
    accessToken: createMockToken(values.email),
  };
}

async function realLogin(values: LoginFormValues): Promise<AuthTokens> {
  const response = await httpClient.post<LoginResponseDto>(
    authConfig.endpoints.login,
    toLoginRequest(values),
  );

  return toAuthTokens(response);
}

async function login(values: LoginFormValues): Promise<AuthTokens> {
  if (authConfig.mode === "mock") {
    return mockLogin(values);
  }

  return realLogin(values);
}

export { login };
