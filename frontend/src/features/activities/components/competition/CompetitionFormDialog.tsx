import { useEffect, useMemo, useState } from "react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "../../../../shared/components/ui/textarea/Textarea";
import type { ModalitySummary } from "../../../sportscore/model/modalities.types";
import type {
  Competition,
  CompetitionFormValues,
} from "../../model/competition/competition.types";

interface CompetitionFormDialogProps {
  open: boolean;
  competition: Competition | null;
  modalities: ModalitySummary[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CompetitionFormValues) => Promise<void>;
}

function getTodayDateInputValue(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function CompetitionFormDialog({
  open,
  competition,
  modalities,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: CompetitionFormDialogProps) {
  const defaultModalityId = modalities[0]?.id ?? 0;

  const initialValues = useMemo<CompetitionFormValues>(
    () => ({
      name: competition?.name ?? "",
      description: competition?.description ?? "",
      startDate: competition?.startDate ?? getTodayDateInputValue(),
      endDate: competition?.endDate ?? getTodayDateInputValue(),
      registrationFee: competition?.registrationFee ?? 0,
      modalityId: competition?.modalityId ?? defaultModalityId,
    }),
    [competition, defaultModalityId],
  );

  const [values, setValues] = useState<CompetitionFormValues>(initialValues);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(initialValues);
    setFormError(null);
  }, [initialValues, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.modalityId) {
      setFormError("Tem de selecionar uma modalidade.");
      return;
    }

    if (new Date(values.endDate) < new Date(values.startDate)) {
      setFormError(
        "A data de fim tem de ser igual ou posterior à data de início.",
      );
      return;
    }

    setFormError(null);
    await onSubmit(values);
  }

  const hasModalities = modalities.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {competition ? "Editar competição" : "Criar competição"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="competition-name">Nome</Label>
            <Input
              id="competition-name"
              value={values.name}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competition-description">Descrição</Label>
            <Textarea
              id="competition-description"
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competition-start-date">Data de início</Label>
              <Input
                id="competition-start-date"
                type="date"
                value={values.startDate}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-end-date">Data de fim</Label>
              <Input
                id="competition-end-date"
                type="date"
                value={values.endDate}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competition-modality">Modalidade</Label>
              <Select
                value={values.modalityId > 0 ? String(values.modalityId) : ""}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    modalityId: Number(value),
                  }))
                }
              >
                <SelectTrigger id="competition-modality">
                  <SelectValue placeholder="Selecionar modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {hasModalities ? (
                    modalities.map((modality) => (
                      <SelectItem key={modality.id} value={String(modality.id)}>
                        {modality.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0" disabled>
                      Não há modalidades disponíveis
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-registration-fee">
                Taxa de inscrição
              </Label>
              <Input
                id="competition-registration-fee"
                type="number"
                min="0"
                step="0.01"
                value={values.registrationFee}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    registrationFee: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          {formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}

          {!hasModalities ? (
            <p className="text-sm text-amber-600">
              Crie uma modalidade antes de criar uma competição.
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !hasModalities}>
              {isSubmitting
                ? "A guardar..."
                : competition
                  ? "Guardar alterações"
                  : "Criar competição"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CompetitionFormDialog };
