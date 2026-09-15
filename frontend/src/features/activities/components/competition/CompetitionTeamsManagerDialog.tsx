import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Trophy, UserMinus } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import { DeleteConfirmationDialog } from "../../../../shared/components/ui/dialog/DeleteConfirmationDialog";
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
import type { TeamSummary } from "../../../teams/model/team.types";
import type {
  Competition,
  CompetitionTeam,
  CompetitionTeamFormValues,
} from "../../model/competition/competition.types";

interface CompetitionTeamsManagerDialogProps {
  open: boolean;
  competition: Competition | null;
  teams: TeamSummary[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteCompetition: (competitionId: number) => Promise<void>;
  onEnrollTeam: (input: {
    competitionId: number;
    teamId: number;
  }) => Promise<unknown>;
  onUnenrollTeam: (input: {
    competitionId: number;
    teamId: number;
  }) => Promise<unknown>;
  onUpdateCompetitionTeam: (input: {
    competitionId: number;
    competitionTeam: CompetitionTeam;
    values: CompetitionTeamFormValues;
  }) => Promise<unknown>;
}

function CompetitionTeamsManagerDialog({
  open,
  competition,
  teams,
  isSubmitting,
  onOpenChange,
  onDeleteCompetition,
  onEnrollTeam,
  onUnenrollTeam,
  onUpdateCompetitionTeam,
}: CompetitionTeamsManagerDialogProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [editingTeam, setEditingTeam] = useState<CompetitionTeam | null>(null);
  const [formValues, setFormValues] = useState<CompetitionTeamFormValues>({
    note: "",
    finalResult: "",
    resultPoints: null,
  });
  const [deleteCompetitionOpen, setDeleteCompetitionOpen] = useState(false);
  const [unenrollTeamTarget, setUnenrollTeamTarget] =
    useState<CompetitionTeam | null>(null);

  useEffect(() => {
    if (!open || !competition) {
      return;
    }

    setSelectedTeamId(undefined);
    setEditingTeam(null);
    setDeleteCompetitionOpen(false);
    setUnenrollTeamTarget(null);
    setFormValues({
      note: "",
      finalResult: "",
      resultPoints: null,
    });
  }, [competition, open]);

  const availableTeams = useMemo(() => {
    if (!competition) {
      return [];
    }

    return teams.filter(
      (team) =>
        team.modalityId === competition.modalityId &&
        !competition.registeredTeams.some((item) => item.teamId === team.id),
    );
  }, [competition, teams]);

  async function handleEnroll(): Promise<void> {
    if (!competition || !selectedTeamId) {
      return;
    }

    await onEnrollTeam({
      competitionId: competition.id,
      teamId: selectedTeamId,
    });

    setSelectedTeamId(undefined);
  }

  async function handleDeleteCompetition(): Promise<void> {
    if (!competition) {
      return;
    }

    await onDeleteCompetition(competition.id);
    setDeleteCompetitionOpen(false);
    onOpenChange(false);
  }

  async function handleConfirmUnenroll(): Promise<void> {
    if (!competition || !unenrollTeamTarget) {
      return;
    }

    await onUnenrollTeam({
      competitionId: competition.id,
      teamId: unenrollTeamTarget.teamId,
    });

    setUnenrollTeamTarget(null);
  }

  async function handleSaveTeam(): Promise<void> {
    if (!competition || !editingTeam) {
      return;
    }

    await onUpdateCompetitionTeam({
      competitionId: competition.id,
      competitionTeam: editingTeam,
      values: formValues,
    });

    setEditingTeam(null);
    setFormValues({
      note: "",
      finalResult: "",
      resultPoints: null,
    });
  }

  if (!competition) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerir competição</DialogTitle>
            <p className="text-sm text-slate-500">
              {competition.name} · {competition.modalityName}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Inscrever equipa
                  </h3>
                  <p className="text-sm text-slate-600">
                    Só estão disponíveis equipas ativas da mesma modalidade.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Select
                      value={selectedTeamId ? String(selectedTeamId) : ""}
                      onValueChange={(value) =>
                        setSelectedTeamId(Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar equipa" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeams.length > 0 ? (
                          availableTeams.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)}>
                              {team.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0" disabled>
                            Não há equipas disponíveis
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    onClick={() => void handleEnroll()}
                    disabled={!selectedTeamId || isSubmitting}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Inscrever
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Equipas inscritas
              </h3>

              {competition.registeredTeams.length === 0 ? (
                <Card>
                  <CardContent className="flex min-h-[180px] flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-slate-500">
                      Ainda não há equipas inscritas.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {competition.registeredTeams.map((team) => (
                    <Card key={team.id}>
                      <CardContent className="space-y-4 p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium text-slate-950">
                              {team.teamName}
                            </p>

                            {team.note ? (
                              <p className="break-words text-sm text-slate-500">
                                {team.note}
                              </p>
                            ) : null}

                            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                              {team.finalResult ? (
                                <span>{team.finalResult}</span>
                              ) : null}
                              {team.resultPoints !== null ? (
                                <span>{team.resultPoints} pts</span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingTeam(team);
                                setFormValues({
                                  note: team.note,
                                  finalResult: team.finalResult,
                                  resultPoints: team.resultPoints,
                                });
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setUnenrollTeamTarget(team)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remover inscrição
                            </Button>
                          </div>
                        </div>

                        {editingTeam?.id === team.id ? (
                          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="space-y-2">
                              <Label htmlFor={`note-${team.id}`}>Nota</Label>
                              <Textarea
                                id={`note-${team.id}`}
                                value={formValues.note}
                                onChange={(event) =>
                                  setFormValues((current) => ({
                                    ...current,
                                    note: event.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`result-${team.id}`}>
                                  Resultado final
                                </Label>
                                <Input
                                  id={`result-${team.id}`}
                                  value={formValues.finalResult}
                                  onChange={(event) =>
                                    setFormValues((current) => ({
                                      ...current,
                                      finalResult: event.target.value,
                                    }))
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`points-${team.id}`}>
                                  Pontos
                                </Label>
                                <Input
                                  id={`points-${team.id}`}
                                  type="number"
                                  value={formValues.resultPoints ?? ""}
                                  onChange={(event) =>
                                    setFormValues((current) => ({
                                      ...current,
                                      resultPoints:
                                        event.target.value === ""
                                          ? null
                                          : Number(event.target.value),
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingTeam(null)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => void handleSaveTeam()}
                              >
                                Guardar
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="justify-between">
            <Button
              type="button"
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeleteCompetitionOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar competição
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteCompetitionOpen}
        onOpenChange={setDeleteCompetitionOpen}
        title="Eliminar competição"
        description={`Esta ação não pode ser anulada. Isto eliminará permanentemente a competição "${competition.name}".`}
        confirmLabel="Eliminar"
        isPending={isSubmitting}
        onConfirm={() => void handleDeleteCompetition()}
      />

      <DeleteConfirmationDialog
        open={Boolean(unenrollTeamTarget)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setUnenrollTeamTarget(null);
          }
        }}
        title="Remover inscrição da equipa"
        description={
          unenrollTeamTarget
            ? `Esta ação não pode ser anulada. Isto removerá permanentemente a inscrição de "${unenrollTeamTarget.teamName}" da competição "${competition.name}".`
            : ""
        }
        confirmLabel="Remover"
        isPending={isSubmitting}
        onConfirm={() => void handleConfirmUnenroll()}
      />
    </>
  );
}

export { CompetitionTeamsManagerDialog };