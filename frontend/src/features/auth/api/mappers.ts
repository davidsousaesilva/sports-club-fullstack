import type {
  AuthTokens,
  LoginFormValues,
  LoginRequestDto,
  LoginResponseDto,
} from "../model/auth.types";

function toLoginRequest(values: LoginFormValues): LoginRequestDto {
  return {
    email: values.email.trim(),
    password: values.password,
  };
}

function toAuthTokens(response: LoginResponseDto): AuthTokens {
  return {
    accessToken: response.accessToken,
  };
}

export { toAuthTokens, toLoginRequest };
