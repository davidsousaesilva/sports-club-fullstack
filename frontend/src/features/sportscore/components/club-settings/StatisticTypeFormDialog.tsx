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
import { Checkbox } from "../../../../shared/components/ui";
import { useStatisticTypes } from "../../hooks/use-statistic-types";
import type {
  StatisticType,
  StatisticTypeFormValues,
} from "../../model/club-settings.types";

interface StatisticTypeFormDialogProps {
  open: boolean;
  statisticType: StatisticType | null;
  onOpenChange: (open: boolean) => void;
}

const defaultFormValues: StatisticTypeFormValues = {
  name: "",
  unit: "",
  mandatory: false,
};

function StatisticTypeFormDialog({
  open,
  statisticType,
  onOpenChange,
}: StatisticTypeFormDialogProps) {
  const [values, setValues] =
    useState<StatisticTypeFormValues>(defaultFormValues);

  const { createStatisticType, updateStatisticType, isCreating, isUpdating } =
    useStatisticTypes();

  const isEditing = statisticType !== null;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(
      statisticType
        ? {
            name: statisticType.name,
            unit: statisticType.unit,
            mandatory: statisticType.mandatory,
          }
        : defaultFormValues,
    );
  }, [open, statisticType]);

  const isSubmitDisabled = useMemo(() => {
    return !values.name.trim() || !values.unit.trim() || isPending;
  }, [isPending, values.name, values.unit]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    if (isEditing && statisticType) {
      await updateStatisticType({
        statisticType,
        values,
      });
    } else {
      await createStatisticType(values);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar tipo de estatística"
              : "Criar tipo de estatística"}
          </DialogTitle>
          <DialogDescription>
            Configura um tipo de estatística disponível para modalidades e
            registos de atletas.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="statistic-type-name">Nome</Label>
            <Input
              id="statistic-type-name"
              value={values.name}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Golos marcados"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statistic-type-unit">Unidade</Label>
            <Input
              id="statistic-type-unit"
              value={values.unit}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  unit: event.target.value,
                }))
              }
              placeholder="golos"
              disabled={isPending}
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Checkbox
              id="statistic-type-mandatory"
              checked={values.mandatory}
              onCheckedChange={(checked) =>
                setValues((current) => ({
                  ...current,
                  mandatory: checked === true,
                }))
              }
              disabled={isPending}
            />
            <div className="space-y-1">
              <Label
                htmlFor="statistic-type-mandatory"
                className="cursor-pointer"
              >
                Estatística obrigatória
              </Label>
              <p className="text-sm text-slate-500">
                Usa esta opção para estatísticas que devem existir sempre na
                configuração da modalidade.
              </p>
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
              {isPending
                ? "A guardar..."
                : isEditing
                  ? "Guardar alterações"
                  : "Criar tipo de estatística"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { StatisticTypeFormDialog };
