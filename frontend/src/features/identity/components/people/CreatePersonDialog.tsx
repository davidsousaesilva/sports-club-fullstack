import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Input } from "../../../../shared/components/ui/input/Input";
import { Label } from "../../../../shared/components/ui/input/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select/Select";
import { useCreatePerson } from "../../hooks/use-people";
import type { CreatePersonFormValues, Gender } from "../../model/person.types";

interface CreatePersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Feminino" },
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0] ?? "";
}

const defaultValues: CreatePersonFormValues = {
  name: "",
  gender: "MALE",
  email: "",
  phone: "",
  address: "",
  birthDate: "",
  entryDate: getTodayDate(),
  active: true,
};

function CreatePersonDialog({ open, onOpenChange }: CreatePersonDialogProps) {
  const [values, setValues] = useState<CreatePersonFormValues>(defaultValues);

  const { createPerson, isPending } = useCreatePerson();

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      ...defaultValues,
      entryDate: getTodayDate(),
    });
  }, [open]);

  const isSubmitDisabled = useMemo(() => {
    return (
      !values.name.trim() ||
      !values.email.trim() ||
      !values.birthDate ||
      !values.entryDate ||
      isPending
    );
  }, [
    isPending,
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

    await createPerson(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar pessoa</DialogTitle>
          <DialogDescription>
            Regista uma nova pessoa no diretório do clube.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="person-name">Nome completo</Label>
              <Input
                id="person-name"
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="João Silva"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="person-gender">Género</Label>
              <Select
                value={values.gender}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    gender: value as Gender,
                  }))
                }
              >
                <SelectTrigger id="person-gender">
                  <SelectValue placeholder="Selecionar género" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="person-email">Email</Label>
              <Input
                id="person-email"
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="joao.silva@example.com"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="person-phone">Telefone</Label>
              <Input
                id="person-phone"
                value={values.phone}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="+351 910 000 000"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="person-birth-date">Data de nascimento</Label>
              <Input
                id="person-birth-date"
                type="date"
                value={values.birthDate}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    birthDate: event.target.value,
                  }))
                }
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="person-entry-date">Data de entrada</Label>
              <Input
                id="person-entry-date"
                type="date"
                value={values.entryDate}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    entryDate: event.target.value,
                  }))
                }
                disabled={isPending}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="person-address">Morada</Label>
              <Input
                id="person-address"
                value={values.address}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                placeholder="Rua, código-postal, localidade"
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isPending ? "A guardar..." : "Criar pessoa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CreatePersonDialog };
