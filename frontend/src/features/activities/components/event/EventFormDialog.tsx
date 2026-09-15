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
import type { CompetitionSummary } from "../../model/competition/competition.types";
import { toDateTimeLocalValue } from "../../model/event/event.mappers";
import type { Event, EventFormValues } from "../../model/event/event.types";
import type { ClubComplex } from "../../../sportscore/model/club-settings.types";
import type { ModalitySummary } from "../../../sportscore/model/modalities.types";

interface EventFormDialogProps {
  open: boolean;
  event: Event | null;
  modalities: ModalitySummary[];
  complexes: ClubComplex[];
  competitions: CompetitionSummary[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EventFormValues) => Promise<void>;
}

function getTodayDateTimeInputValue(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
}

function EventFormDialog({
  open,
  event,
  modalities,
  complexes,
  competitions,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: EventFormDialogProps) {
  const defaultModalityId = modalities[0]?.id ?? 0;

  const initialValues = useMemo<EventFormValues>(
    () => ({
      description: event?.description ?? "",
      date: event
        ? toDateTimeLocalValue(event.date)
        : getTodayDateTimeInputValue(),
      duration: event?.duration ?? 60,
      modalityId: event?.modalityId ?? defaultModalityId,
      complexId: event?.complexId ?? null,
      competitionId: event?.competitionId ?? null,
    }),
    [defaultModalityId, event],
  );

  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(initialValues);
    setFormError(null);
  }, [initialValues, open]);

  const availableCompetitions = useMemo(
    () =>
      competitions.filter(
        (competition) =>
          !values.modalityId || competition.modalityId === values.modalityId,
      ),
    [competitions, values.modalityId],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.modalityId) {
      setFormError("Tem de selecionar uma modalidade.");
      return;
    }

    if (!values.date) {
      setFormError("Tem de selecionar uma data e hora válidas.");
      return;
    }

    if (values.duration < 1) {
      setFormError("A duração tem de ser de pelo menos 1 minuto.");
      return;
    }

    setFormError(null);

    await onSubmit({
      ...values,
      date: new Date(values.date).toISOString(),
    });
  }

  const hasModalities = modalities.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? "Editar evento" : "Criar evento"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="event-description">Descrição</Label>
            <Textarea
              id="event-description"
              value={values.description}
              onChange={(targetEvent) =>
                setValues((current) => ({
                  ...current,
                  description: targetEvent.target.value,
                }))
              }
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-date">Data e hora</Label>
              <Input
                id="event-date"
                type="datetime-local"
                value={values.date}
                onChange={(targetEvent) =>
                  setValues((current) => ({
                    ...current,
                    date: targetEvent.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-duration">Duração (minutos)</Label>
              <Input
                id="event-duration"
                type="number"
                min="1"
                value={values.duration}
                onChange={(targetEvent) =>
                  setValues((current) => ({
                    ...current,
                    duration: Number(targetEvent.target.value) || 0,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="event-modality">Modalidade</Label>
              <Select
                value={values.modalityId > 0 ? String(values.modalityId) : ""}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    modalityId: Number(value),
                    competitionId: null,
                  }))
                }
              >
                <SelectTrigger id="event-modality">
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
              <Label htmlFor="event-complex">Complexo</Label>
              <Select
                value={values.complexId ? String(values.complexId) : "NONE"}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    complexId: value === "NONE" ? null : Number(value),
                  }))
                }
              >
                <SelectTrigger id="event-complex">
                  <SelectValue placeholder="Selecionar complexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Sem complexo</SelectItem>
                  {complexes.map((complex) => (
                    <SelectItem key={complex.id} value={String(complex.id)}>
                      {complex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-competition">Competição</Label>
              <Select
                value={
                  values.competitionId ? String(values.competitionId) : "NONE"
                }
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    competitionId: value === "NONE" ? null : Number(value),
                  }))
                }
              >
                <SelectTrigger id="event-competition">
                  <SelectValue placeholder="Selecionar competição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Sem competição</SelectItem>
                  {availableCompetitions.map((competition) => (
                    <SelectItem
                      key={competition.id}
                      value={String(competition.id)}
                    >
                      {competition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}

          {!hasModalities ? (
            <p className="text-sm text-amber-600">
              Crie uma modalidade antes de criar um evento.
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
                : event
                  ? "Guardar alterações"
                  : "Criar evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { EventFormDialog };
