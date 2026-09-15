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
} from "../../../../shared/components/ui";
import { useComplexes } from "../../hooks/use-complexes";
import type {
  ClubComplex,
  ComplexFormValues,
} from "../../model/club-settings.types";

interface ComplexFormDialogProps {
  open: boolean;
  complex: ClubComplex | null;
  onOpenChange: (open: boolean) => void;
}

const defaultFormValues: ComplexFormValues = {
  name: "",
  address: "",
  phone: "",
};

function ComplexFormDialog({
  open,
  complex,
  onOpenChange,
}: ComplexFormDialogProps) {
  const [values, setValues] = useState<ComplexFormValues>(defaultFormValues);

  const { createComplex, updateComplex, isCreating, isUpdating } =
    useComplexes();

  const isEditing = complex !== null;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(
      complex
        ? {
            name: complex.name,
            address: complex.address,
            phone: complex.phone,
          }
        : defaultFormValues,
    );
  }, [complex, open]);

  const isSubmitDisabled = useMemo(() => {
    return (
      !values.name.trim() ||
      !values.address.trim() ||
      !values.phone.trim() ||
      isPending
    );
  }, [isPending, values.address, values.name, values.phone]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    if (isEditing && complex) {
      await updateComplex({
        complex,
        values,
      });
    } else {
      await createComplex(values);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar complexo" : "Criar complexo"}
          </DialogTitle>
          <DialogDescription>
            Regista e mantém as instalações desportivas disponíveis no clube.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="complex-name">Nome</Label>
            <Input
              id="complex-name"
              value={values.name}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Complexo Desportivo Municipal"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complex-address">Morada</Label>
            <Input
              id="complex-address"
              value={values.address}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              placeholder="Rua do Estádio 123, Porto"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complex-phone">Telefone</Label>
            <Input
              id="complex-phone"
              value={values.phone}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              placeholder="+351 220 000 000"
              disabled={isPending}
            />
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
              {isPending
                ? "A guardar..."
                : isEditing
                  ? "Guardar alterações"
                  : "Criar complexo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ComplexFormDialog };
