import { useMemo, useState } from "react";
import { Plus, Trophy } from "lucide-react";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { Button } from "../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import { usePermissions } from "../../auth";
import { AttendanceDialog } from "../../activity-tracking/components/AttendanceDialog";
import { PerformanceDialog } from "../../activity-tracking/components/PerformanceDialog";
import { useEventActivityRecords } from "../../activity-tracking/hooks/use-event-activity-records";
import type { ActivityMember } from "../../activity-tracking/model/activity-records.types";
import { EventCard } from "../components/event/EventCard";
import { EventDetailsDialog } from "../components/event/EventDetailsDialog";
import { EventFilters } from "../components/event/EventFilters";
import { EventFormDialog } from "../components/event/EventFormDialog";
import { EventStats } from "../components/event/EventStats";
import { EventTeamsManagerDialog } from "../components/event/EventTeamsManagerDialog";
import { useEvents } from "../hooks/use-events";
import type {
  CoachEventScope,
  Event,
  EventSummary,
  EventTemporalStatus,
} from "../model/event/event.types";

function EventPage() {
  const { activeRole } = usePermissions();
  const { user } = useCurrentUser();

  const personId = user?.id ?? null;
  const isAthlete = activeRole === "ATHLETE";
  const [searchValue, setSearchValue] = useState("");
  const [competitionIdFilter, setCompetitionIdFilter] = useState<
    number | undefined
  >();
  const [statusFilter, setStatusFilter] = useState<EventTemporalStatus>("ALL");
  const [coachScope, setCoachScope] = useState<CoachEventScope>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventSummary, setSelectedEventSummary] =
    useState<EventSummary | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);

  const eventsQuery = useEvents({
    competitionId: competitionIdFilter,
    status: statusFilter,
    coachScope,
    eventNameOrDescriptionOrCompetition: searchValue,
  });

  const events = useMemo(() => eventsQuery.events, [eventsQuery.events]);

  const canManageEvents = activeRole === "MANAGER" || activeRole === "COACH";
  const showCoachScopeFilter = activeRole === "COACH";

  const selectedEventMembers = useMemo<ActivityMember[]>(() => {
    if (!selectedEvent) {
      return [];
    }

    const allMembers = Object.entries(selectedEvent.members).flatMap(
      ([teamId, members]) =>
        members.map((member) => ({
          id: member.id,
          personId: member.personId,
          personName: member.personName,
          relationship:
            selectedEvent.teams.find(
              (team) => team.teamId === Number(teamId),
            ) !== undefined
              ? "ATHLETE"
              : "ATHLETE",
          startDate: selectedEvent.date,
          endDate: null,
        })),
    );

    if (!isAthlete || !personId) {
      return allMembers;
    }

    return allMembers.filter((member) => member.personId === personId);
  }, [selectedEvent, isAthlete, personId]);

  const eventActivityRecordsQuery = useEventActivityRecords({
    eventId: selectedEvent?.id ?? null,
    teamId: selectedEvent?.teams[0]?.teamId ?? null,
    teamName: selectedEvent?.teams[0]?.teamName ?? null,
    eventDate: selectedEvent?.date ?? null,
    members: selectedEventMembers,
    statisticTypes: selectedEvent?.statsTypes ?? [],
  });

  const visibleEventPerformances = useMemo(() => {
    if (!isAthlete || !personId) {
      return eventActivityRecordsQuery.performances;
    }

    return eventActivityRecordsQuery.performances.filter(
      (performance) => performance.athleteId === personId,
    );
  }, [isAthlete, personId, eventActivityRecordsQuery.performances]);

  function handleViewEventPerformances(event: Event) {
    setSelectedEvent(event);
    setPerformanceOpen(true);
  }

  
  function handleCreate() {
    setSelectedEvent(null);
    setFormOpen(true);
  }

  async function handleViewDetails(event: EventSummary) {
    setSelectedEventSummary(event);
    setDetailsOpen(true);
  }

  function handleManage(event: Event) {
    setSelectedEvent(event);
    setManageOpen(true);
  }

  async function handleManageAttendance(event: EventSummary) {
    const detailedEvent = await eventsQuery.getEventDetails(event.id);
    setSelectedEvent(detailedEvent);
    setAttendanceOpen(true);
  }

  async function handleManagePerformances(event: EventSummary) {
    const detailedEvent = await eventsQuery.getEventDetails(event.id);
    setSelectedEvent(detailedEvent);
    setPerformanceOpen(true);
  }

  async function refreshSelectedEvent(eventId: number) {
    const refreshed = await eventsQuery.getEventDetails(eventId);
    setSelectedEvent(refreshed);
  }

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-950">Eventos</h1>
          <p className="text-sm text-slate-600">
            Agenda, consulta e gere eventos em várias competições e modalidades.
          </p>
        </div>

        {canManageEvents ? (
          <Button type="button" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo evento
          </Button>
        ) : null}
      </header>

      <EventStats stats={eventsQuery.stats} isLoading={eventsQuery.isLoading} />

      <EventFilters
        searchValue={searchValue}
        competitionIdFilter={competitionIdFilter}
        statusFilter={statusFilter}
        coachScope={coachScope}
        showCoachScopeFilter={showCoachScopeFilter}
        competitions={eventsQuery.competitions}
        onSearchChange={setSearchValue}
        onCompetitionChange={setCompetitionIdFilter}
        onStatusChange={setStatusFilter}
        onCoachScopeChange={setCoachScope}
      />

      {eventsQuery.isLoading ? (
        <Card>
          <CardContent className="flex min-h-[240px] items-center justify-center p-6 text-sm text-slate-500">
            A carregar eventos...
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-950">
                Não foram encontrados eventos
              </h2>
              <p className="text-sm text-slate-500">
                Ajusta os filtros atuais ou cria um novo evento.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              canManage={canManageEvents}
              onViewDetails={handleViewDetails}
              onEdit={async (eventSummary) => {
                const detailedEvent = await eventsQuery.getEventDetails(
                  eventSummary.id,
                );

                setSelectedEvent(detailedEvent);
                setFormOpen(true);
              }}
              onManage={async (eventSummary) => {
                const detailedEvent = await eventsQuery.getEventDetails(
                  eventSummary.id,
                );

                handleManage(detailedEvent);
              }}
              onManageAttendance={handleManageAttendance}
              onManagePerformances={handleManagePerformances}
            />
          ))}
        </div>
      )}

      <EventDetailsDialog
        open={detailsOpen}
        eventId={selectedEventSummary?.id ?? null}
        onOpenChange={setDetailsOpen}
        getEventDetails={eventsQuery.getEventDetails}
        canViewPerformances={isAthlete}
        onViewPerformances={handleViewEventPerformances}
      />

      <EventFormDialog
        open={formOpen}
        event={selectedEvent}
        modalities={eventsQuery.modalities}
        complexes={eventsQuery.complexes}
        competitions={eventsQuery.competitions}
        isSubmitting={eventsQuery.isCreating || eventsQuery.isUpdating}
        onOpenChange={setFormOpen}
        onSubmit={async (values) => {
          if (selectedEvent) {
            await eventsQuery.updateEvent({
              event: selectedEvent,
              values,
            });
          } else {
            await eventsQuery.createEvent(values);
          }

          setFormOpen(false);
          setSelectedEvent(null);
        }}
      />

      <EventTeamsManagerDialog
        open={manageOpen}
        event={selectedEvent}
        teams={eventsQuery.teams}
        isSubmitting={
          eventsQuery.isDeleting ||
          eventsQuery.isEnrollingTeam ||
          eventsQuery.isUpdatingEventTeam ||
          eventsQuery.isUnenrollingTeam
        }
        onOpenChange={setManageOpen}
        onDeleteEvent={eventsQuery.deleteEvent}
        onEnrollTeam={async (input) => {
          await eventsQuery.enrollTeam(input);
          await refreshSelectedEvent(input.eventId);
        }}
        onUnenrollTeam={async (input) => {
          await eventsQuery.unenrollTeam(input);
          await refreshSelectedEvent(input.eventId);
        }}
        onUpdateEventTeam={async (input) => {
          await eventsQuery.updateEventTeam(input);
          await refreshSelectedEvent(input.eventId);
        }}
      />

      <AttendanceDialog
        open={attendanceOpen}
        title={
          selectedEvent
            ? `Presenças · ${selectedEvent.description}`
            : "Presenças"
        }
        description="Regista as presenças dos atletas para o evento selecionado."
        members={eventActivityRecordsQuery.members}
        attendances={eventActivityRecordsQuery.attendances}
        target={{
          eventId: selectedEvent?.id ?? undefined,
          teamId: selectedEvent?.teams[0]?.teamId ?? undefined,
          teamName: selectedEvent?.teams[0]?.teamName ?? null,
          freeTraining: false,
        }}
        isSubmitting={eventActivityRecordsQuery.isSubmittingAttendance}
        onOpenChange={setAttendanceOpen}
        onSubmit={eventActivityRecordsQuery.submitAttendances}
      />

      <PerformanceDialog
        open={performanceOpen}
        title={
          selectedEvent
            ? `Performances · ${selectedEvent.description}`
            : "Performances"
        }
        description="Consulta as performances do evento selecionado."
        members={eventActivityRecordsQuery.members}
        statisticTypes={eventActivityRecordsQuery.statisticTypes}
        attendances={eventActivityRecordsQuery.attendances}
        performances={visibleEventPerformances}
        target={{
          eventId: selectedEvent?.id ?? undefined,
        }}
        isSubmitting={eventActivityRecordsQuery.isSubmittingPerformances}
        readOnly={!canManageEvents}
        onOpenChange={setPerformanceOpen}
        onSubmit={eventActivityRecordsQuery.submitPerformances}
      />
    </section>
  );
}

export { EventPage };