import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Info,
  MapPin,
  Percent,
  Tag,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import { TeamDetailsDialog } from "../../../teams/components/TeamDetailsDialog";
import { useTeams } from "../../../teams/hooks/use-teams";
import type { Team } from "../../../teams/model/team.types";
import { resolveEventTemporalStatus } from "../../model/event/event.mappers";
import type { Event } from "../../model/event/event.types";

interface EventDetailsDialogProps {
  open: boolean;
  eventId: number | null;
  onOpenChange: (open: boolean) => void;
  getEventDetails: (eventId: number) => Promise<Event>;
  canViewPerformances?: boolean;
  onViewPerformances?: (event: Event) => void;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function EventDetailsDialog({
  open,
  eventId,
  onOpenChange,
  getEventDetails,
  canViewPerformances = false,
  onViewPerformances,
}: EventDetailsDialogProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);

  const teamsQuery = useTeams({
    modalityId: event?.modalityId,
    teamType: "ALL",
    active: "ALL",
    teamOrModalityName: "",
  });

  useEffect(() => {
    if (!open) {
      setEvent(null);
      setIsLoading(false);
      setSelectedTeam(null);
      setTeamDetailsOpen(false);
      return;
    }
  }, [open]);

  useEffect(() => {
    let cancelled = false;

    async function loadEvent(): Promise<void> {
      if (!open || !eventId) {
        setEvent(null);
        return;
      }

      setIsLoading(true);

      try {
        const data = await getEventDetails(eventId);

        if (!cancelled) {
          setEvent(data);
        }
      } catch {
        if (!cancelled) {
          setEvent(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId, getEventDetails, open]);

  const status = useMemo(() => {
    if (!event) {
      return null;
    }

    return resolveEventTemporalStatus(event.date);
  }, [event]);

  const statusLabel =
    status === "FUTURE"
      ? "Agendado"
      : status === "IN_PROGRESS"
        ? "Em curso"
        : status === "PAST"
          ? "Terminado"
          : "";

  const statusTone =
    status === "FUTURE"
      ? "bg-sky-100 text-sky-700"
      : status === "IN_PROGRESS"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-700";

  async function handleOpenTeamDetails(teamId: number): Promise<void> {
    const detailedTeam = await teamsQuery.getTeamDetails(teamId);
    setSelectedTeam(detailedTeam);
    setTeamDetailsOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <DialogHeader className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <DialogTitle className="text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
                    {event?.description ?? "Detalhes do evento"}
                  </DialogTitle>

                  {event ? (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                      <span>{event.modalityName}</span>
                      <span className="text-slate-300">•</span>
                      <span>{formatDateTime(event.date)}</span>
                    </div>
                  ) : null}
                </div>

                {event ? (
                  <span
                    className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusTone}`}
                  >
                    {statusLabel}
                  </span>
                ) : null}
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8">
            {isLoading ? (
              <Card>
                <CardContent className="flex min-h-[260px] items-center justify-center p-6 text-sm text-slate-500">
                  A carregar detalhes do evento...
                </CardContent>
              </Card>
            ) : !event ? (
              <Card>
                <CardContent className="flex min-h-[260px] items-center justify-center p-6 text-sm text-slate-500">
                  Não foi possível carregar os detalhes do evento.
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4 text-slate-400" />
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Detalhes
                      </h3>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          Data
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {formatDateTime(event.date)}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Clock3 className="h-4 w-4" />
                          Duração
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {event.duration} minutos
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <MapPin className="h-4 w-4" />
                          Complexo
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {event.complexName ?? "Sem complexo atribuído"}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Trophy className="h-4 w-4" />
                          Competição
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {event.competitionName ?? "Sem competição associada"}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Users className="h-4 w-4" />
                          Equipas inscritas
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {event.teams.length}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Percent className="h-4 w-4" />
                          Conclusão
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          Presenças {event.presentAthletesPercent ?? 0}% ·
                          Desempenhos {event.performanceEntriesPercent ?? 0}%
                        </dd>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Tag className="h-4 w-4" />
                          Modalidade
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {event.modalityName}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {canViewPerformances && onViewPerformances ? (
                  <Card>
                    <CardContent className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                          Desempenhos
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Consulta as tuas estatísticas registadas neste evento.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onViewPerformances(event)}
                      >
                        <Percent className="mr-2 h-4 w-4" />
                        Ver desempenhos
                      </Button>
                    </CardContent>
                  </Card>
                    ) : null}
                    
                <Card>
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Equipas
                      </h3>
                    </div>

                    {event.teams.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                        <p className="text-sm text-slate-500">
                          Ainda não há equipas inscritas neste evento.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        {event.teams.map((team) => (
                          <button
                            key={team.id}
                            type="button"
                            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={() =>
                              void handleOpenTeamDetails(team.teamId)
                            }
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <p className="truncate font-medium text-slate-950">
                                  {team.teamName}
                                </p>

                                {team.numericResult ? (
                                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                    {team.numericResult}
                                  </span>
                                ) : null}
                              </div>

                              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                {team.result ? (
                                  <span className="rounded-full bg-sky-100 px-2 py-0.5 font-medium text-sky-700">
                                    {team.result}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                                    Sem resultado
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TeamDetailsDialog
        open={teamDetailsOpen}
        team={selectedTeam}
        onOpenChange={(open) => {
          setTeamDetailsOpen(open);

          if (!open) {
            setSelectedTeam(null);
          }
        }}
      />
    </>
  );
}

export { EventDetailsDialog };
