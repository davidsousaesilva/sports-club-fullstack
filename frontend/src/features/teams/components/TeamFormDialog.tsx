import { useEffect, useState } from "react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import { Input } from "../../../shared/components/ui/input/Input";
import { Label } from "../../../shared/components/ui/input/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/components/ui/select/Select";
import { TeamMembersManager } from "./TeamMembersManager";
import type {
  Team,
  TeamFormValues,
  TeamMember,
  TeamModalityOption,
  TeamRoleCandidate,
} from "../model/team.types";

interface TeamFormDialogProps {
  open: boolean;
  team: Team | null;
  modalities: TeamModalityOption[];
  athletes: TeamRoleCandidate[];
  coaches: TeamRoleCandidate[];
  isSubmitting: boolean;
  isAddingAthlete: boolean;
  isAddingCoach: boolean;
  isEndingMembership: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TeamFormValues) => Promise<void>;
  onAddAthlete: (teamId: number, personId: number) => Promise<void>;
  onAddCoach: (teamId: number, personId: number) => Promise<void>;
  onEndMembership: (teamId: number, teamMember: TeamMember) => Promise<void>;
}

function getDefaultSeasonYear(): string {
  const currentYear = new Date().getFullYear();

  return `${currentYear}/${currentYear + 1}`;
}

function TeamFormDialog({
  open,
  team,
  modalities,
  athletes,
  coaches,
  isSubmitting,
  isAddingAthlete,
  isAddingCoach,
  isEndingMembership,
  onOpenChange,
  onSubmit,
  onAddAthlete,
  onAddCoach,
  onEndMembership,
}: TeamFormDialogProps) {
  const [values, setValues] = useState<TeamFormValues>({
    name: "",
    teamType: "TEAM",
    seasonYear: getDefaultSeasonYear(),
    active: true,
    modalityId: 0,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (team) {
      setValues({
        name: team.name,
        teamType: team.teamType,
        seasonYear: team.seasonYear,
        active: team.active,
        modalityId: team.modalityId,
      });
      return;
    }

    setValues({
      name: "",
      teamType: "TEAM",
      seasonYear: getDefaultSeasonYear(),
      active: true,
      modalityId: modalities[0]?.id ?? 0,
    });
  }, [team, open, modalities]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.modalityId <= 0 || isSubmitting) {
      return;
    }

    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{team ? "Gerir equipa" : "Criar equipa"}</DialogTitle>
          <DialogDescription>
            {team
              ? "Atualiza a informação da equipa e gere os membros ativos."
              : "Cria uma nova equipa para uma modalidade e época."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="team-name">Nome da equipa</Label>
              <Input
                id="team-name"
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="ex.: Sub-17 Principal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-modality">Modalidade</Label>
              <Select
                value={values.modalityId > 0 ? String(values.modalityId) : ""}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    modalityId: Number(value),
                  }))
                }
              >
                <SelectTrigger id="team-modality">
                  <SelectValue placeholder="Selecionar modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {modalities.map((modality) => (
                    <SelectItem key={modality.id} value={String(modality.id)}>
                      {modality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-season">Época</Label>
              <Input
                id="team-season"
                value={values.seasonYear}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    seasonYear: event.target.value,
                  }))
                }
                placeholder="2025/2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-type">Tipo de equipa</Label>
              <Select
                value={values.teamType}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    teamType: value as TeamFormValues["teamType"],
                  }))
                }
              >
                <SelectTrigger id="team-type">
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEAM">Equipa</SelectItem>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-status">Estado</Label>
              <Select
                value={String(values.active)}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    active: value === "true",
                  }))
                }
              >
                <SelectTrigger id="team-status">
                  <SelectValue placeholder="Selecionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativa</SelectItem>
                  <SelectItem value="false">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {team && (
            <TeamMembersManager
              team={team}
              athletes={athletes}
              coaches={coaches}
              isAddingAthlete={isAddingAthlete}
              isAddingCoach={isAddingCoach}
              isEndingMembership={isEndingMembership}
              onAddAthlete={onAddAthlete}
              onAddCoach={onAddCoach}
              onEndMembership={onEndMembership}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || values.modalityId <= 0}
            >
              {team ? "Guardar alterações" : "Criar equipa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { TeamFormDialog };