import { useCallback, useState } from "react";

import { authStore } from "../model/auth.store";
import { login } from "../api/login";
import type { LoginFormValues } from "../model/auth.types";
import { isApiError } from "../../../lib/api/api-error";

type UseLoginResult = {
  login: (values: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  clearError: () => void;
};

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.status === 401 || error.status === 403) {
      return "Email ou palavra-passe incorretos.";
    }

    if (error.status >= 500) {
      return "Erro no servidor. Tenta novamente dentro de instantes.";
    }

    return error.message || "Não foi possível iniciar sessão.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível iniciar sessão. Tenta novamente.";
}

function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleLogin = useCallback(async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const tokens = await login(values);
      authStore.setAccessToken(tokens.accessToken);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login: handleLogin,
    isLoading,
    errorMessage,
    clearError,
  };
}

export { useLogin };
