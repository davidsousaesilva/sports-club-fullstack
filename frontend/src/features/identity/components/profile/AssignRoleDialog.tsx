import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import { Input } from "../../../../shared/components/ui/input/Input";
import { Label } from "../../../../shared/components/ui/input/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select/Select";
import type {
  AssignRoleFormValues,
  PersonRole,
} from "../../model/person.types";

interface AssignRoleDialogProps {
  open: boolean;
  hasExistingRoles: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AssignRoleFormValues) => Promise<void>;
}

const roleOptions: Array<{ value: PersonRole; label: string }> = [
  { value: "ATHLETE", label: "Atleta" },
  { value: "COACH", label: "Treinador" },
  { value: "EMPLOYEE", label: "Colaborador" },
  { value: "MANAGER", label: "Gerente" },
];

function AssignRoleDialog({
  open,
  hasExistingRoles,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: AssignRoleDialogProps) {
  const [values, setValues] = useState<AssignRoleFormValues>({
    role: "ATHLETE",
    startDate: new Date().toISOString().split("T")[0] ?? "",
    primaryRole: !hasExistingRoles,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      role: "ATHLETE",
      startDate: new Date().toISOString().split("T")[0] ?? "",
      primaryRole: !hasExistingRoles,
    });
  }, [hasExistingRoles, open]);

  const isSubmitDisabled = useMemo(() => {
    return !values.startDate || isSubmitting;
  }, [isSubmitting, values.startDate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Atribuir cargo</DialogTitle>
          <DialogDescription>
            Adiciona um novo cargo ativo a este perfil.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="assign-role-role">Cargo</Label>
            <Select
              value={values.role}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  role: value as PersonRole,
                }))
              }
            >
              <SelectTrigger id="assign-role-role">
                <SelectValue placeholder="Selecionar cargo" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-role-start-date">Data de início</Label>
            <Input
              id="assign-role-start-date"
              type="date"
              value={values.startDate}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
              disabled={isSubmitting}
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={values.primaryRole}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  primaryRole: event.target.checked,
                }))
              }
              disabled={isSubmitting || !hasExistingRoles}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Definir como cargo principal
            </span>
          </label>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? "A atribuir..." : "Atribuir cargo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AssignRoleDialog };
