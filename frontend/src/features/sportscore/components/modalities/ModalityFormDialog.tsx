import { Activity, Euro, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { cn } from "../../../../lib/utils/cn";
import { Button, Checkbox } from "../../../../shared/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import { Input, Label } from "../../../../shared/components/ui";
import { Textarea } from "../../../../shared/components/ui/textarea/Textarea";
import { useStatisticTypes } from "../../hooks/use-statistic-types";
import { useModalities } from "../../hooks/use-modalities";
import type {
  Modality,
  ModalityFormValues,
  ModalityPriceRule,
} from "../../model/modalities.types";

interface ModalityFormDialogProps {
  open: boolean;
  modality: Modality | null;
  onOpenChange: (open: boolean) => void;
}

const defaultPriceRule = (): ModalityPriceRule => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  registrationFee: 0,
  monthlyFee: 0,
  ageMin: null,
  ageMax: null,
});

const defaultValues: ModalityFormValues = {
  name: "",
  eventType: "",
  description: "",
  trained: true,
  maxWeeklyAttendances: 0,
  statisticTypeIds: [],
  prices: [],
};

function ModalityFormDialog({
  open,
  modality,
  onOpenChange,
}: ModalityFormDialogProps) {
  const [values, setValues] = useState<ModalityFormValues>(defaultValues);

  const { statisticTypes } = useStatisticTypes();
  const { createModality, updateModality, isCreating, isUpdating } =
    useModalities();

  const isEditing = modality !== null;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (modality) {
      setValues({
        name: modality.name,
        eventType: modality.eventType,
        description: modality.description,
        trained: modality.trained,
        maxWeeklyAttendances: modality.maxWeeklyAttendances,
        statisticTypeIds: modality.statisticTypes.map((item) => item.id),
        prices: modality.prices,
      });

      return;
    }

    const mandatoryStatisticTypeIds = statisticTypes
      .filter((item) => item.mandatory)
      .map((item) => item.id);

    setValues({
      ...defaultValues,
      statisticTypeIds: mandatoryStatisticTypeIds,
    });
  }, [modality, open, statisticTypes]);

  const mandatoryStatisticTypeIds = useMemo(() => {
    return statisticTypes
      .filter((item) => item.mandatory)
      .map((item) => item.id);
  }, [statisticTypes]);

  const isSubmitDisabled = useMemo(() => {
    const hasRequiredFields =
      values.name.trim() &&
      values.description.trim() &&
      values.eventType.trim();

    const hasMandatoryStatisticTypes = values.trained
      ? mandatoryStatisticTypeIds.every((id) =>
          values.statisticTypeIds.includes(id),
        )
      : true;

    const hasPrices = values.prices.length > 0;
    const hasInvalidPrice = values.prices.some((price) => {
      const hasNegativeValues =
        price.registrationFee < 0 || price.monthlyFee < 0;
      const hasInvalidAgeRange =
        price.ageMin !== null &&
        price.ageMax !== null &&
        price.ageMin > price.ageMax;

      return hasNegativeValues || hasInvalidAgeRange;
    });

    const hasInvalidAttendances =
      !values.trained && values.maxWeeklyAttendances < 0;

    return (
      !hasRequiredFields ||
      !hasMandatoryStatisticTypes ||
      !hasPrices ||
      hasInvalidPrice ||
      hasInvalidAttendances ||
      isPending
    );
  }, [isPending, mandatoryStatisticTypeIds, values]);

  const toggleStatisticType = (statisticTypeId: number) => {
    const isMandatory = mandatoryStatisticTypeIds.includes(statisticTypeId);

    if (isMandatory) {
      return;
    }

    setValues((current) => ({
      ...current,
      statisticTypeIds: current.statisticTypeIds.includes(statisticTypeId)
        ? current.statisticTypeIds.filter((id) => id !== statisticTypeId)
        : [...current.statisticTypeIds, statisticTypeId],
    }));
  };

  const handlePriceChange = (
    priceId: string,
    field: keyof ModalityPriceRule,
    value: number | null,
  ) => {
    setValues((current) => ({
      ...current,
      prices: current.prices.map((price) =>
        price.id === priceId ? { ...price, [field]: value } : price,
      ),
    }));
  };

  const handleRemovePrice = (priceId: string) => {
    setValues((current) => ({
      ...current,
      prices: current.prices.filter((price) => price.id !== priceId),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    if (modality) {
      await updateModality({
        id: modality.id,
        values,
        currentModality: modality,
      });
    } else {
      await createModality(values);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar modalidade" : "Criar modalidade"}
          </DialogTitle>
          <DialogDescription>
            Configura a modalidade, os tipos de estatística disponíveis e as
            regras de preços.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="modality-name">Nome</Label>
              <Input
                id="modality-name"
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Futebol"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modality-event-type">Tipo de evento</Label>
              <Input
                id="modality-event-type"
                value={values.eventType}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    eventType: event.target.value,
                  }))
                }
                placeholder="JOGO"
                disabled={isPending}
              />
              <p className="text-xs text-slate-500">
                Exemplo: MATCH, GAME, RACE, SESSION ou COMPETITION.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="modality-trained" className="cursor-pointer">
                    Modalidade com treino
                  </Label>
                  <p className="text-sm text-slate-500">
                    Ativa esta opção quando a modalidade tem atividade de treino
                    regular.
                  </p>
                </div>

                <Checkbox
                  id="modality-trained"
                  checked={values.trained}
                  onCheckedChange={(checked) =>
                    setValues((current) => ({
                      ...current,
                      trained: checked === true,
                      maxWeeklyAttendances:
                        checked === true ? 0 : current.maxWeeklyAttendances,
                      statisticTypeIds:
                        checked === true
                          ? Array.from(
                              new Set([
                                ...current.statisticTypeIds,
                                ...mandatoryStatisticTypeIds,
                              ]),
                            )
                          : [],
                    }))
                  }
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="modality-description">Descrição</Label>
              <Textarea
                id="modality-description"
                value={values.description}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Breve descrição da modalidade..."
                rows={4}
                disabled={isPending}
              />
            </div>
          </section>

          {!values.trained ? (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">
                    Configuração de presença livre
                  </h3>
                  <p className="text-sm text-amber-700">
                    Define o número máximo de presenças semanais para
                    modalidades sem treino.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-weekly-attendances">
                    Máximo de presenças semanais
                  </Label>
                  <Input
                    id="max-weekly-attendances"
                    type="number"
                    min="0"
                    value={values.maxWeeklyAttendances}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        maxWeeklyAttendances: Number(event.target.value || 0),
                      }))
                    }
                    disabled={isPending}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {values.trained ? (
            <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-sky-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Tipos de estatística
                  </h3>
                </div>
                <p className="text-sm text-slate-500">
                  Escolhe as métricas disponíveis para a modalidade durante
                  treinos e eventos.
                </p>
              </div>

              <div className="space-y-3">
                {statisticTypes.map((statisticType) => {
                  const isMandatory = mandatoryStatisticTypeIds.includes(
                    statisticType.id,
                  );
                  const isChecked = values.statisticTypeIds.includes(
                    statisticType.id,
                  );

                  return (
                    <div
                      key={statisticType.id}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-4 transition-colors",
                        isChecked
                          ? "border-sky-200 bg-sky-50"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <Checkbox
                        id={`statistic-type-${statisticType.id}`}
                        checked={isChecked}
                        onCheckedChange={() =>
                          toggleStatisticType(statisticType.id)
                        }
                        disabled={isMandatory || isPending}
                      />

                      <div className="space-y-1">
                        <Label
                          htmlFor={`statistic-type-${statisticType.id}`}
                          className="cursor-pointer"
                        >
                          {statisticType.name}
                        </Label>
                        <p className="text-sm text-slate-500">
                          Unidade: {statisticType.unit}
                        </p>
                        {isMandatory ? (
                          <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                            Obrigatória
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Regras de preços
                  </h3>
                </div>
                <p className="text-sm text-slate-500">
                  Adiciona uma ou mais regras de preços por faixa etária.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setValues((current) => ({
                    ...current,
                    prices: [...current.prices, defaultPriceRule()],
                  }))
                }
                disabled={isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar preço
              </Button>
            </div>

            {values.prices.length > 0 ? (
              <div className="space-y-4">
                {values.prices.map((price, index) => (
                  <div
                    key={price.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        Regra de preço #{index + 1}
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemovePrice(price.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`registration-fee-${price.id}`}>
                          Taxa de inscrição
                        </Label>
                        <Input
                          id={`registration-fee-${price.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={price.registrationFee}
                          onChange={(event) =>
                            handlePriceChange(
                              price.id,
                              "registrationFee",
                              Number(event.target.value || 0),
                            )
                          }
                          disabled={isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`monthly-fee-${price.id}`}>
                          Mensalidade
                        </Label>
                        <Input
                          id={`monthly-fee-${price.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={price.monthlyFee}
                          onChange={(event) =>
                            handlePriceChange(
                              price.id,
                              "monthlyFee",
                              Number(event.target.value || 0),
                            )
                          }
                          disabled={isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`age-min-${price.id}`}>
                          Idade mínima
                        </Label>
                        <Input
                          id={`age-min-${price.id}`}
                          type="number"
                          min="0"
                          value={price.ageMin ?? ""}
                          onChange={(event) =>
                            handlePriceChange(
                              price.id,
                              "ageMin",
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                            )
                          }
                          disabled={isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`age-max-${price.id}`}>
                          Idade máxima
                        </Label>
                        <Input
                          id={`age-max-${price.id}`}
                          type="number"
                          min="0"
                          value={price.ageMax ?? ""}
                          onChange={(event) =>
                            handlePriceChange(
                              price.id,
                              "ageMax",
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                            )
                          }
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Não foram adicionadas regras de preços.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Adiciona pelo menos uma regra de preços para criar a
                  modalidade.
                </p>
              </div>
            )}
          </section>

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
                  : "Criar modalidade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ModalityFormDialog };
