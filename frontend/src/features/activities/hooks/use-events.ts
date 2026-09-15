import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import { useCompetitions } from "./use-competitions";
import {
  useCoachModalities,
  useModalities,
} from "../../sportscore/hooks/use-modalities";
import { useComplexes } from "../../sportscore/hooks/use-complexes";
import { useStatisticTypes } from "../../sportscore/hooks/use-statistic-types";
import { useTeams } from "../../teams/hooks/use-teams";
import {
  createEvent as createEventRequest,
  deleteEvent as deleteEventRequest,
  enrollEventTeam as enrollEventTeamRequest,
  getEvent,
  listAthleteEvents,
  listCoachEvents,
  listCompetitionEvents,
  listEvents,
  unenrollEventTeam as unenrollEventTeamRequest,
  updateEvent as updateEventRequest,
  updateEventTeam as updateEventTeamRequest,
} from "../api/events";
import {
  mapEventFormToCreateRequest,
  mapEventFormToUpdateRequest,
  mapEventTeamFormToRequest,
  resolveEventTemporalStatus,
} from "../model/event/event.mappers";
import type {
  Event,
  EventFilters,
  EventFormValues,
  EventStats,
  EventSummary,
  EventTeam,
  EventTeamFormValues,
} from "../model/event/event.types";

const EVENTS_QUERY_KEY = ["events"] as const;

function normalizeFilters(filters: EventFilters): EventFilters {
  return {
    competitionId: filters.competitionId,
    status: filters.status,
    coachScope: filters.coachScope ?? "ALL",
    eventNameOrDescriptionOrCompetition:
      filters.eventNameOrDescriptionOrCompetition.trim(),
  };
}

function useEvents(filters: EventFilters) {
  const queryClient = useQueryClient();
  const { activeRole } = usePermissions();
  const { user } = useCurrentUser();
  const generalModalitiesQuery = useModalities();
  const coachModalitiesQuery = useCoachModalities(
    activeRole === "COACH" ? (user?.id ?? null) : null,
  );

  const modalities =
    activeRole === "COACH"
      ? coachModalitiesQuery.modalities
      : generalModalitiesQuery.modalities;
  const complexesQuery = useComplexes();
  const statisticTypesQuery = useStatisticTypes();

  const canManageEvents = activeRole === "MANAGER" || activeRole === "COACH";

  const competitionsQuery = useCompetitions({
    modalityId: undefined,
    status: "ALL",
    coachScope: "ALL",
    competitionNameOrDescriptionOrModality: "",
  });

  const teamsQuery = useTeams({
    modalityId: undefined,
    teamType: "ALL",
    active: "ACTIVE",
    teamOrModalityName: "",
  });

  const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);

  const eventsQuery = useQuery({
    queryKey: [
      ...EVENTS_QUERY_KEY,
      "list",
      activeRole,
      user?.id ?? null,
      normalizedFilters,
    ],
    queryFn: async () => {
      if (!activeRole) {
        return [] as EventSummary[];
      }

      if (normalizedFilters.competitionId) {
        return listCompetitionEvents(normalizedFilters.competitionId);
      }

      if (activeRole === "MANAGER") {
        return listEvents(normalizedFilters);
      }

      if (activeRole === "COACH") {
        if (!user?.id) {
          return [];
        }

        if (normalizedFilters.coachScope === "MINE") {
          return listCoachEvents(user.id, normalizedFilters);
        }

        return listEvents(normalizedFilters);
      }

      if (activeRole === "ATHLETE") {
        if (!user?.id) {
          return [];
        }

        return listAthleteEvents(user.id, normalizedFilters);
      }

      return [] as EventSummary[];
    },
    enabled: activeRole !== null,
  });

  const createMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      return createEventRequest(mapEventFormToCreateRequest(values));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      event,
      values,
    }: {
      event: Event;
      values: EventFormValues;
    }) => {
      await updateEventRequest(
        event.id,
        mapEventFormToUpdateRequest(values, event.version),
      );

      return { eventId: event.id };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: [...EVENTS_QUERY_KEY, "detail", variables.eventId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await deleteEventRequest(eventId);
    },
    onSuccess: async (_, eventId) => {
      await queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      await queryClient.removeQueries({
        queryKey: [...EVENTS_QUERY_KEY, "detail", eventId],
      });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async ({
      eventId,
      teamId,
    }: {
      eventId: number;
      teamId: number;
    }) => {
      return enrollEventTeamRequest(eventId, { teamId });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...EVENTS_QUERY_KEY, "detail", variables.eventId],
      });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  const updateEventTeamMutation = useMutation({
    mutationFn: async ({
      eventId,
      eventTeam,
      values,
    }: {
      eventId: number;
      eventTeam: EventTeam;
      values: EventTeamFormValues;
    }) => {
      await updateEventTeamRequest(
        eventTeam.id,
        mapEventTeamFormToRequest(values, eventTeam.version),
      );

      return { eventId };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...EVENTS_QUERY_KEY, "detail", variables.eventId],
      });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  const unenrollMutation = useMutation({
    mutationFn: async ({
      eventId,
      teamId,
    }: {
      eventId: number;
      teamId: number;
    }) => {
      await unenrollEventTeamRequest(eventId, teamId);

      return { eventId };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...EVENTS_QUERY_KEY, "detail", variables.eventId],
      });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  const getEventDetails = async (eventId: number): Promise<Event> => {
    return getEvent(eventId);
  };

  const events = eventsQuery.data ?? [];

  const stats = useMemo<EventStats>(() => {
    const total = events.length;
    const future = events.filter(
      (item) => resolveEventTemporalStatus(item.date) === "FUTURE",
    ).length;
    const inProgress = events.filter(
      (item) => resolveEventTemporalStatus(item.date) === "IN_PROGRESS",
    ).length;
    const past = events.filter(
      (item) => resolveEventTemporalStatus(item.date) === "PAST",
    ).length;

    return { total, future, inProgress, past };
  }, [events]);

  return {
    events,
    modalities,
    complexes: complexesQuery.complexes,
    statisticTypes: statisticTypesQuery.statisticTypes,
    competitions: competitionsQuery.competitions,
    teams: canManageEvents ? teamsQuery.teams : [],
    stats,
    canManageEvents,
    isLoading:
    eventsQuery.isLoading ||
    (activeRole === "COACH"
      ? coachModalitiesQuery.isLoading
      : generalModalitiesQuery.isLoading) ||
    complexesQuery.isLoading,
    isFetching: eventsQuery.isFetching,
    isError: eventsQuery.isError && eventsQuery.data === undefined,
    error: eventsQuery.error ?? null,
    getEventDetails,
    createEvent: createMutation.mutateAsync,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
    enrollTeam: enrollMutation.mutateAsync,
    updateEventTeam: updateEventTeamMutation.mutateAsync,
    unenrollTeam: unenrollMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isEnrollingTeam: enrollMutation.isPending,
    isUpdatingEventTeam: updateEventTeamMutation.isPending,
    isUnenrollingTeam: unenrollMutation.isPending,
  };
}

export { EVENTS_QUERY_KEY, useEvents };