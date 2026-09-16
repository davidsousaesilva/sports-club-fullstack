import { useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound, Lock, Shield } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import { Input } from "../../../../shared/components/ui/input/Input";
import { Label } from "../../../../shared/components/ui/input/Label";
import type {
  ChangeOwnPasswordFormValues,
  ResetPasswordFormValues,
} from "../../model/person.types";

interface ProfileSecurityCardProps {
  canChangeOwnPassword: boolean;
  canManagePasswordReset: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isChangingOwnPassword: boolean;
  isResettingPassword: boolean;
  onChangeOwnPassword: (values: ChangeOwnPasswordFormValues) => Promise<void>;
  onResetPassword: (values: ResetPasswordFormValues) => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const maybeApiError = error as {
      message?: string;
      payload?: {
        message?: string;
        error?: string;
        errors?: Array<{
          defaultMessage?: string;
          field?: string;
        }>;
      };
    };

    if (maybeApiError.payload?.errors?.length) {
      return maybeApiError.payload.errors
        .map((item) => item.defaultMessage)
        .filter(Boolean)
        .join("\n");
    }

    if (maybeApiError.payload?.message) {
      return maybeApiError.payload.message;
    }

    if (maybeApiError.payload?.error) {
      return maybeApiError.payload.error;
    }

    if (maybeApiError.message) {
      return maybeApiError.message;
    }
  }

  return "Não foi possível definir a password.";
}

function isValidPassword(value: string): boolean {
  return /^(?=.*\d).{4,}$/.test(value);
}

function ProfileSecurityCard({
  canChangeOwnPassword,
  canManagePasswordReset,
  isOpen,
  onOpenChange,
  isChangingOwnPassword,
  isResettingPassword,
  onChangeOwnPassword,
  onResetPassword,
}: ProfileSecurityCardProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changePasswordError, setChangePasswordError] = useState<string | null>(
    null,
  );

  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null,
  );

  const [changePasswordValues, setChangePasswordValues] =
    useState<ChangeOwnPasswordFormValues>({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  const [resetPasswordValues, setResetPasswordValues] =
    useState<ResetPasswordFormValues>({
      newPassword: "",
      confirmNewPassword: "",
    });

  const isChangeOwnPasswordDisabled = useMemo(() => {
    return (
      !changePasswordValues.currentPassword ||
      !changePasswordValues.newPassword ||
      !changePasswordValues.confirmNewPassword ||
      changePasswordValues.newPassword !==
        changePasswordValues.confirmNewPassword ||
      !isValidPassword(changePasswordValues.newPassword) ||
      isChangingOwnPassword
    );
  }, [changePasswordValues, isChangingOwnPassword]);

  const isResetPasswordDisabled = useMemo(() => {
    return (
      !resetPasswordValues.newPassword ||
      !resetPasswordValues.confirmNewPassword ||
      resetPasswordValues.newPassword !==
        resetPasswordValues.confirmNewPassword ||
      !isValidPassword(resetPasswordValues.newPassword) ||
      isResettingPassword
    );
  }, [isResettingPassword, resetPasswordValues]);

  const handleChangeOwnPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isChangeOwnPasswordDisabled) {
      return;
    }

    setChangePasswordError(null);

    try {
      await onChangeOwnPassword(changePasswordValues);

      setChangePasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setChangePasswordError(getErrorMessage(error));
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isResetPasswordDisabled) {
      return;
    }

    setResetPasswordError(null);

    try {
      await onResetPassword(resetPasswordValues);

      setResetPasswordValues({
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setResetPasswordError(getErrorMessage(error));
    }
  };

  const dialogTitle = canChangeOwnPassword
    ? "Alterar password"
    : "Definir password";

  const dialogDescription = canChangeOwnPassword
    ? "Atualize a password da sua conta."
    : "Defina uma nova password diretamente para esta pessoa.";

  return (
    <>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-950">
              <Shield className="h-5 w-5 text-blue-600" />
              Segurança
            </CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(true)}
            >
              {canChangeOwnPassword ? "Alterar password" : "Definir password"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Password</p>
                <p className="text-xs text-slate-500">••••••••</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          {canChangeOwnPassword && (
            <form className="space-y-4" onSubmit={handleChangeOwnPassword}>
              <div>
                <Label className="mb-2 block" htmlFor="current-password">
                  Password atual
                </Label>

                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.current ? "text" : "password"}
                    value={changePasswordValues.currentPassword}
                    onChange={(event) =>
                      setChangePasswordValues((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    disabled={isChangingOwnPassword}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        current: !current.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPasswords.current
                        ? "Ocultar password atual"
                        : "Mostrar password atual"
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block" htmlFor="new-password">
                  Nova password
                </Label>

                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={changePasswordValues.newPassword}
                    onChange={(event) =>
                      setChangePasswordValues((current) => ({
                        ...current,
                        newPassword: event.target.value,
                      }))
                    }
                    disabled={isChangingOwnPassword}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        new: !current.new,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPasswords.new
                        ? "Ocultar nova password"
                        : "Mostrar nova password"
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block" htmlFor="confirm-new-password">
                  Confirmar nova password
                </Label>

                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={changePasswordValues.confirmNewPassword}
                    onChange={(event) =>
                      setChangePasswordValues((current) => ({
                        ...current,
                        confirmNewPassword: event.target.value,
                      }))
                    }
                    disabled={isChangingOwnPassword}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        confirm: !current.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPasswords.confirm
                        ? "Ocultar confirmação da nova password"
                        : "Mostrar confirmação da nova password"
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                A password deve ter pelo menos 4 caracteres e pelo menos 1
                dígito.
              </div>

              {changePasswordError ? (
                <p className="whitespace-pre-line rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {changePasswordError}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isChangingOwnPassword}
                >
                  Cancelar
                </Button>

                <Button type="submit" disabled={isChangeOwnPasswordDisabled}>
                  {isChangingOwnPassword ? "A atualizar..." : "Confirmar"}
                </Button>
              </div>
            </form>
          )}

          {canManagePasswordReset && (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <KeyRound className="h-4 w-4 text-amber-700" />

                <p className="text-sm text-amber-800">
                  Esta ação define uma password diretamente para este perfil.
                </p>
              </div>

              <div>
                <Label className="mb-2 block" htmlFor="staff-new-password">
                  Nova password
                </Label>

                <Input
                  id="staff-new-password"
                  type="password"
                  value={resetPasswordValues.newPassword}
                  onChange={(event) =>
                    setResetPasswordValues((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  disabled={isResettingPassword}
                />
              </div>

              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="staff-confirm-new-password"
                >
                  Confirmar nova password
                </Label>

                <Input
                  id="staff-confirm-new-password"
                  type="password"
                  value={resetPasswordValues.confirmNewPassword}
                  onChange={(event) =>
                    setResetPasswordValues((current) => ({
                      ...current,
                      confirmNewPassword: event.target.value,
                    }))
                  }
                  disabled={isResettingPassword}
                />
              </div>

              {resetPasswordError ? (
                <p className="whitespace-pre-line rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {resetPasswordError}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isResettingPassword}
                >
                  Cancelar
                </Button>

                <Button type="submit" disabled={isResetPasswordDisabled}>
                  {isResettingPassword ? "A guardar..." : "Confirmar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ProfileSecurityCard };
