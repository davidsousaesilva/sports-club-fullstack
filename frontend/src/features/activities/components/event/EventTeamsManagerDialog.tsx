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
import type { TeamSummary } from "../../../teams/model/team.types";
import type {
  Event,
  EventTeam,
  EventTeamFormValues,
} from "../../model/event/event.types";

interface EventTeamsManagerDialogProps {
  open: boolean;
  event: Event | null;
  teams: TeamSummary[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteEvent: (eventId: number) => Promise<void>;
  onEnrollTeam: (input: {
    eventId: number;
    teamId: number;
  }) => Promise<unknown>;
  onUnenrollTeam: (input: {
    eventId: number;
    teamId: number;
  }) => Promise<unknown>;
  onUpdateEventTeam: (input: {
    eventId: number;
    eventTeam: EventTeam;
    values: EventTeamFormValues;
  }) => Promise<unknown>;
}

function EventTeamsManagerDialog({
  open,
  event,
  teams,
  isSubmitting,
  onOpenChange,
  onDeleteEvent,
  onEnrollTeam,
  onUnenrollTeam,
  onUpdateEventTeam,
}: EventTeamsManagerDialogProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [editingTeam, setEditingTeam] = useState<EventTeam | null>(null);
  const [formValues, setFormValues] = useState<EventTeamFormValues>({
    result: "",
    numericResult: "",
  });
  const [deleteEventOpen, setDeleteEventOpen] = useState(false);
  const [unenrollTeamTarget, setUnenrollTeamTarget] =
    useState<EventTeam | null>(null);

  useEffect(() => {
    if (!open || !event) {
      return;
    }

    setSelectedTeamId(undefined);
    setEditingTeam(null);
    setDeleteEventOpen(false);
    setUnenrollTeamTarget(null);
    setFormValues({
      result: "",
      numericResult: "",
    });
  }, [event, open]);

  const availableTeams = useMemo(() => {
    if (!event) {
      return [];
    }

    return teams.filter(
      (team) =>
        team.modalityId === event.modalityId &&
        !event.teams.some((item) => item.teamId === team.id),
    );
  }, [event, teams]);

  async function handleEnroll(): Promise<void> {
    if (!event || !selectedTeamId) {
      return;
    }

    await onEnrollTeam({
      eventId: event.id,
      teamId: selectedTeamId,
    });

    setSelectedTeamId(undefined);
  }

  async function handleDeleteEvent(): Promise<void> {
    if (!event) {
      return;
    }

    await onDeleteEvent(event.id);
    setDeleteEventOpen(false);
    onOpenChange(false);
  }

  async function handleConfirmUnenroll(): Promise<void> {
    if (!event || !unenrollTeamTarget) {
      return;
    }

    await onUnenrollTeam({
      eventId: event.id,
      teamId: unenrollTeamTarget.teamId,
    });

    setUnenrollTeamTarget(null);
  }

  async function handleSaveTeam(): Promise<void> {
    if (!event || !editingTeam) {
      return;
    }

    await onUpdateEventTeam({
      eventId: event.id,
      eventTeam: editingTeam,
      values: formValues,
    });

    setEditingTeam(null);
    setFormValues({
      result: "",
      numericResult: "",
    });
  }

  if (!event) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerir evento</DialogTitle>
            <p className="text-sm text-slate-500">
              {event.description} · {event.modalityName}
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

              {event.teams.length === 0 ? (
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
                  {event.teams.map((team) => (
                    <Card key={team.id}>
                      <CardContent className="space-y-4 p-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium text-slate-950">
                              {team.teamName}
                            </p>

                            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                              {team.result ? <span>{team.result}</span> : null}
                              {team.numericResult ? (
                                <span>{team.numericResult}</span>
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
                                  result: team.result,
                                  numericResult: team.numericResult,
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
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`result-${team.id}`}>
                                  Resultado
                                </Label>
                                <Input
                                  id={`result-${team.id}`}
                                  value={formValues.result}
                                  onChange={(targetEvent) =>
                                    setFormValues((current) => ({
                                      ...current,
                                      result: targetEvent.target.value,
                                    }))
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`numeric-result-${team.id}`}>
                                  Resultado numérico
                                </Label>
                                <Input
                                  id={`numeric-result-${team.id}`}
                                  value={formValues.numericResult}
                                  onChange={(targetEvent) =>
                                    setFormValues((current) => ({
                                      ...current,
                                      numericResult: targetEvent.target.value,
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
              onClick={() => setDeleteEventOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar evento
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
        open={deleteEventOpen}
        onOpenChange={setDeleteEventOpen}
        title="Eliminar evento"
        description={`Esta ação não pode ser anulada. Isto eliminará permanentemente o evento "${event.description}".`}
        confirmLabel="Eliminar"
        isPending={isSubmitting}
        onConfirm={() => void handleDeleteEvent()}
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
            ? `Esta ação não pode ser anulada. Isto removerá permanentemente a inscrição de "${unenrollTeamTarget.teamName}" do evento "${event.description}".`
            : ""
        }
        confirmLabel="Remover"
        isPending={isSubmitting}
        onConfirm={() => void handleConfirmUnenroll()}
      />
    </>
  );
}

export { EventTeamsManagerDialog };