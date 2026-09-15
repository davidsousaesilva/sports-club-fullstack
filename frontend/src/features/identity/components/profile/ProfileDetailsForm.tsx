import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select/Select";
import type {
  Person,
  PersonRoleItem,
  UpdatePersonFormValues,
} from "../../model/person.types";

interface ProfileDetailsFormProps {
  person: Person;
  isSubmitting: boolean;
  disabled?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UpdatePersonFormValues) => Promise<void>;
}

const roleLabels: Record<PersonRoleItem["role"], string> = {
  MANAGER: "Gerente",
  EMPLOYEE: "Colaborador",
  COACH: "Treinador",
  ATHLETE: "Atleta",
};

function buildInitialValues(person: Person): UpdatePersonFormValues {
  return {
    name: person.name,
    gender: person.gender,
    email: person.email,
    phone: person.phone,
    address: person.address,
    birthDate: person.birthDate,
    entryDate: person.entryDate,
    active: person.active,
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-PT");
}

function getRoleBadgeColor(role: PersonRoleItem["role"]) {
  switch (role) {
    case "MANAGER":
      return "bg-purple-100 text-purple-700";
    case "COACH":
      return "bg-blue-100 text-blue-700";
    case "EMPLOYEE":
      return "bg-emerald-100 text-emerald-700";
    case "ATHLETE":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function ProfileDetailsForm({
  person,
  isSubmitting,
  disabled = false,
  isOpen,
  onOpenChange,
  onSubmit,
}: ProfileDetailsFormProps) {
  const [values, setValues] = useState<UpdatePersonFormValues>(
    buildInitialValues(person),
  );

  useEffect(() => {
    setValues(buildInitialValues(person));
  }, [person, isOpen]);

  const sortedActiveRoles = [...person.activeRoles].sort((left, right) => {
    if (left.primaryRole && !right.primaryRole) {
      return -1;
    }

    if (!left.primaryRole && right.primaryRole) {
      return 1;
    }

    return (
      new Date(right.startDate).getTime() - new Date(left.startDate).getTime()
    );
  });

  const isDirty = useMemo(() => {
    const initialValues = buildInitialValues(person);
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [person, values]);

  const isSubmitDisabled = useMemo(() => {
    return (
      disabled ||
      !values.name.trim() ||
      !values.email.trim() ||
      !values.birthDate ||
      !values.entryDate ||
      isSubmitting ||
      !isDirty
    );
  }, [
    disabled,
    isDirty,
    isSubmitting,
    values.birthDate,
    values.email,
    values.entryDate,
    values.name,
  ]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    await onSubmit(values);
  };

  return (
    <>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-slate-950">
              Dados pessoais
            </CardTitle>

            {!disabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <UserRound className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h2 className="text-xl font-semibold text-slate-950">
                  {person.name}
                </h2>

                {person.active ? (
                  <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex w-fit rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                    Inativo
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {sortedActiveRoles.length > 0 ? (
                  sortedActiveRoles.map((role) => (
                    <span
                      key={role.id}
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(
                        role.role,
                      )}`}
                    >
                      {roleLabels[role.role]}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    Sem cargos ativos
                  </span>
                )}
              </div>
            </div>
          </div>

          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Email</dt>
                <dd>{person.email || "—"}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Telemóvel</dt>
                <dd>{person.phone || "—"}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Morada</dt>
                <dd>{person.address || "—"}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Género</dt>
                <dd>{person.gender === "MALE" ? "Masculino" : "Feminino"}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <CalendarDays className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">
                  Data de nascimento
                </dt>
                <dd>{formatDate(person.birthDate)}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <CalendarDays className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Data de entrada</dt>
                <dd>{formatDate(person.entryDate)}</dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar dados pessoais</DialogTitle>
            <DialogDescription>
              Atualiza as informações principais deste perfil.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-name">Nome</Label>
                <Input
                  id="profile-name"
                  value={values.name}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  disabled={disabled || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-gender">Género</Label>
                <Select
                  value={values.gender}
                  onValueChange={(value) =>
                    setValues((current) => ({
                      ...current,
                      gender: value as UpdatePersonFormValues["gender"],
                    }))
                  }
                  disabled={disabled || isSubmitting}
                >
                  <SelectTrigger id="profile-gender">
                    <SelectValue placeholder="Selecionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Masculino</SelectItem>
                    <SelectItem value="FEMALE">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={values.email}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  disabled={disabled || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Telemóvel</Label>
                <Input
                  id="profile-phone"
                  value={values.phone}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  disabled={disabled || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-address">Morada</Label>
                <Input
                  id="profile-address"
                  value={values.address}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  disabled={disabled || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-birth-date">Data de nascimento</Label>
                <Input
                  id="profile-birth-date"
                  type="date"
                  value={values.birthDate}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      birthDate: event.target.value,
                    }))
                  }
                  disabled={disabled || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-entry-date">Data de entrada</Label>
                <Input
                  id="profile-entry-date"
                  type="date"
                  value={values.entryDate}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      entryDate: event.target.value,
                    }))
                  }
                  disabled={disabled || isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitDisabled}>
                {isSubmitting ? "A guardar..." : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ProfileDetailsForm };
