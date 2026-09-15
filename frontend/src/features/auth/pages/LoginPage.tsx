import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogIn } from "lucide-react";

import { appPaths } from "../../../app/router/paths";
import { authConfig } from "../../../config/auth";
import { authSession } from "../../../lib/auth/auth-session";
import { Button, Card, Input, Label } from "../../../shared/components/ui";
import { useLogin } from "../hooks/use-login";
import type { LoginFormValues } from "../model/auth.types";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, errorMessage, clearError } = useLogin();
  const [formValues, setFormValues] = useState<LoginFormValues>(initialValues);

  const isMockMode = useMemo(() => authConfig.mode === "mock", []);

  useEffect(() => {
    if (authConfig.mode === "real" && authSession.isAuthenticated()) {
      navigate(authConfig.redirectAfterLogin, { replace: true });
    }
  }, [navigate]);

  function updateField<K extends keyof LoginFormValues>(
    field: K,
    value: LoginFormValues[K],
  ) {
    clearError();
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login(formValues);
    navigate(authConfig.redirectAfterLogin, { replace: true });
    } catch {
      return;
    }
  }

  function handleResetSession() {
    authSession.endSession();
    clearError();
    setFormValues(initialValues);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <Card className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="text-center">
            <img
              src="/club-mark.png"
              alt="Codfish United"
              className="mx-auto h-40 w-auto object-contain"
            />
            <h1 className="mt-6 text-3xl font-bold text-slate-950">
              Área de membro
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Inicie sessão para aceder à plataforma do clube.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={formValues.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formValues.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              fullWidth
              className="bg-black/90 hover:bg-sky-700"
              disabled={isLoading}
            >
              {isLoading ? (
                "A iniciar sessão..."
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Iniciar sessão
                </>
              )}
            </Button>
          </form>

          {isMockMode ? (
              <div className="mt-6 space-y-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-800">
                <p>O modo mock está ativo.</p>
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="font-medium text-sky-700 underline underline-offset-4 hover:text-sky-900"
                >
                  Limpar sessão mock atual
                </button>
              </div>
            ) : null}

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <Link
              to={appPaths.home}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Voltar à página inicial
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export { LoginPage };
