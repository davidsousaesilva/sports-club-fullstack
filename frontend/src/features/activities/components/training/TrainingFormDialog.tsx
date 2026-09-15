import { useEffect, useState } from "react";

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
import { Textarea } from "../../../../shared/components/ui/textarea/Textarea";
import type { ClubComplex } from "../../../sportscore/model/club-settings.types";
import type { TeamSummary } from "../../../teams/model/team.types";
import { mapTrainingToFormValues } from "../../model/training/training.mappers";
import type {
  Training,
  TrainingFormValues,
} from "../../model/training/training.types";

interface TrainingFormDialogProps {
  open: boolean;
  training: Training | null;
  teams: TeamSummary[];
  complexes: ClubComplex[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TrainingFormValues) => Promise<void>;
}

function getDefaultFormValues(teamId?: number): TrainingFormValues {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);

  return {
    description: "",
    note: "",
    date,
    time: "18:00",
    duration: 60,
    complexId: undefined,
    teamId: teamId ?? 0,
  };
}

function TrainingFormDialog({
  open,
  training,
  teams,
  complexes,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: TrainingFormDialogProps) {
  const [values, setValues] = useState<TrainingFormValues>(
    getDefaultFormValues(),
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (training) {
      setValues(mapTrainingToFormValues(training));
      return;
    }

    setValues(getDefaultFormValues(teams[0]?.id));
  }, [training, open, teams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {training ? "Editar treino" : "Criar treino"}
          </DialogTitle>
          <DialogDescription>
            {training
              ? "Atualize os detalhes do treino selecionado."
              : "Agende uma nova sessão de treino."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="training-description">Descrição</Label>
            <Input
              id="training-description"
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Ex.: Sessão técnica e tática"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="training-date">Data</Label>
              <Input
                id="training-date"
                type="date"
                value={values.date}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-time">Hora</Label>
              <Input
                id="training-time"
                type="time"
                value={values.time}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    time: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="training-team">Equipa</Label>
              <Select
                value={values.teamId > 0 ? String(values.teamId) : ""}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    teamId: Number(value),
                  }))
                }
              >
                <SelectTrigger id="training-team">
                  <SelectValue placeholder="Selecionar equipa" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-duration">Duração (minutos)</Label>
              <Input
                id="training-duration"
                type="number"
                min="1"
                value={values.duration}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    duration: Number(event.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="training-complex">Complexo</Label>
            <Select
              value={values.complexId ? String(values.complexId) : "NONE"}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  complexId: value === "NONE" ? undefined : Number(value),
                }))
              }
            >
              <SelectTrigger id="training-complex">
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
            <Label htmlFor="training-note">Nota</Label>
            <Textarea
              id="training-note"
              value={values.note}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              placeholder="Notas opcionais para a sessão"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !values.description.trim() ||
                !values.date ||
                !values.time ||
                values.duration < 1 ||
                values.teamId <= 0
              }
            >
              {training ? "Guardar alterações" : "Criar treino"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { TrainingFormDialog };
