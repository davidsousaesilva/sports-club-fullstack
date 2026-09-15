import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Euro,
  Info,
  Tag,
  Trophy,
  Users,
  Medal,
} from "lucide-react";

import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import { EventDetailsDialog } from "../event/EventDetailsDialog";
import { useEvents } from "../../hooks/use-events";
import { resolveCompetitionTemporalStatus } from "../../model/competition/competition.mappers";
import type { Competition } from "../../model/competition/competition.types";
import type {
  EventSummary,
  EventTemporalStatus,
} from "../../model/event/event.types";
import { TeamDetailsDialog } from "../../../teams/components/TeamDetailsDialog";
import { useTeams } from "../../../teams/hooks/use-teams";
import type { Team } from "../../../teams/model/team.types";

interface CompetitionDetailsDialogProps {
  open: boolean;
  competitionId: number | null;
  onOpenChange: (open: boolean) => void;
  getCompetitionDetails: (competitionId: number) => Promise<Competition>;
}

type DetailsTab = "TEAMS" | "EVENTS";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CompetitionDetailsDialog({
  open,
  competitionId,
  onOpenChange,
  getCompetitionDetails,
}: CompetitionDetailsDialogProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailsTab>("TEAMS");
  const [eventStatusFilter] = useState<EventTemporalStatus>("ALL");
  const [selectedEventSummary, setSelectedEventSummary] =
    useState<EventSummary | null>(null);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);

  const competitionEventsQuery = useEvents({
    competitionId: competitionId ?? undefined,
    status: eventStatusFilter,
    eventNameOrDescriptionOrCompetition: "",
  });

  const teamsQuery = useTeams({
    modalityId: competition?.modalityId,
    teamType: "ALL",
    active: "ALL",
    teamOrModalityName: "",
  });

  useEffect(() => {
    if (!open) {
      setCompetition(null);
      setIsLoading(false);
      setActiveTab("TEAMS");
      setSelectedEventSummary(null);
      setEventDetailsOpen(false);
      setSelectedTeam(null);
      setTeamDetailsOpen(false);
      return;
    }

    setActiveTab("TEAMS");
  }, [open, competitionId]);

  useEffect(() => {
    let cancelled = false;

    async function loadCompetition(): Promise<void> {
      if (!open || !competitionId) {
        setCompetition(null);
        return;
      }

      setIsLoading(true);

      try {
        const data = await getCompetitionDetails(competitionId);

        if (!cancelled) {
          setCompetition(data);
        }
      } catch {
        if (!cancelled) {
          setCompetition(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCompetition();

    return () => {
      cancelled = true;
    };
  }, [competitionId, getCompetitionDetails, open]);

  const status = useMemo(() => {
    if (!competition) {
      return null;
    }

    return resolveCompetitionTemporalStatus(
      competition.startDate,
      competition.endDate,
    );
  }, [competition]);

  const statusLabel =
    status === "FUTURE"
      ? "Agendada"
      : status === "IN_PROGRESS"
        ? "Em curso"
        : status === "PAST"
          ? "Terminada"
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
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto p-0">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <DialogHeader className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <DialogTitle className="text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
                    {competition?.name ?? "Detalhes da competição"}
                  </DialogTitle>

                  {competition ? (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                      <span>{competition.modalityName}</span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {formatDate(competition.startDate)} -{" "}
                        {formatDate(competition.endDate)}
                      </span>
                    </div>
                  ) : null}
                </div>

                {competition ? (
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
                  A carregar detalhes da competição...
                </CardContent>
              </Card>
            ) : !competition ? (
              <Card>
                <CardContent className="flex min-h-[260px] items-center justify-center p-6 text-sm text-slate-500">
                  Não foi possível carregar os detalhes da competição.
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
                          Data de início
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {formatDate(competition.startDate)}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          Data de fim
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {formatDate(competition.endDate)}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Euro className="h-4 w-4" />
                          Taxa de inscrição
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {competition.registrationFee > 0
                            ? `${competition.registrationFee.toFixed(2)} €`
                            : "Inscrição gratuita"}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Users className="h-4 w-4" />
                          Equipas inscritas
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {competition.registeredTeams.length}
                        </dd>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <Tag className="h-4 w-4" />
                          Modalidade
                        </dt>
                        <dd className="text-base font-semibold text-slate-950">
                          {competition.modalityName}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-slate-400" />
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Descrição
                      </h3>
                    </div>

                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                      {competition.description || "Sem descrição disponível."}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                    <button
                      type="button"
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        activeTab === "TEAMS"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      onClick={() => setActiveTab("TEAMS")}
                    >
                      Equipas
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        activeTab === "EVENTS"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      onClick={() => setActiveTab("EVENTS")}
                    >
                      Eventos
                    </button>
                  </div>

                  {activeTab === "TEAMS" ? (
                    <Card>
                      <CardContent className="p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-slate-400" />
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Equipas inscritas
                          </h3>
                        </div>

                        {competition.registeredTeams.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                            <p className="text-sm text-slate-500">
                              Ainda não há equipas inscritas nesta competição.
                            </p>
                          </div>
                        ) : (
                          <div className="grid gap-3 md:grid-cols-2">
                            {competition.registeredTeams.map((team) => (
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
                                    {team.resultPoints !== null ? (
                                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                        {team.resultPoints} pts
                                      </span>
                                    ) : null}
                                  </div>

                                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                    {team.finalResult ? (
                                      <span className="rounded-full bg-sky-100 px-2 py-0.5 font-medium text-sky-700">
                                        {team.finalResult}
                                      </span>
                                    ) : (
                                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                                        Sem resultado final
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
                  ) : (
                    <Card>
                      <CardContent className="p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <Medal className="h-4 w-4 text-slate-400" />
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Eventos associados
                          </h3>
                        </div>

                        {competitionEventsQuery.isLoading ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                            <p className="text-sm text-slate-500">
                              A carregar eventos...
                            </p>
                          </div>
                        ) : competitionEventsQuery.events.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                            <p className="text-sm text-slate-500">
                              Ainda não há eventos associados a esta competição.
                            </p>
                          </div>
                        ) : (
                          <div className="grid gap-3 md:grid-cols-2">
                            {competitionEventsQuery.events.map((event) => (
                              <button
                                key={event.id}
                                type="button"
                                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                                onClick={() => {
                                  setSelectedEventSummary(event);
                                  setEventDetailsOpen(true);
                                }}
                              >
                                <div className="space-y-2">
                                  <p className="line-clamp-2 font-medium text-slate-950">
                                    {event.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span>{formatEventDate(event.date)}</span>
                                    <span>•</span>
                                    <span>{event.teamsCount} equipas</span>
                                    {event.presentAthletesPercent !== null ? (
                                      <>
                                        <span>•</span>
                                        <span>
                                          Presença{" "}
                                          {event.presentAthletesPercent.toFixed(
                                            0,
                                          )}
                                          %
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EventDetailsDialog
        open={eventDetailsOpen}
        eventId={selectedEventSummary?.id ?? null}
        onOpenChange={setEventDetailsOpen}
        getEventDetails={competitionEventsQuery.getEventDetails}
      />

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

export { CompetitionDetailsDialog };
