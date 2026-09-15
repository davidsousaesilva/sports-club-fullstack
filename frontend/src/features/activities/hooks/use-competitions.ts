import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import {
  useCoachModalities,
  useModalities,
} from "../../sportscore/hooks/use-modalities";
import { useTeams } from "../../teams/hooks/use-teams";
import {
  createCompetition as createCompetitionRequest,
  deleteCompetition as deleteCompetitionRequest,
  enrollCompetitionTeam as enrollCompetitionTeamRequest,
  getCompetition,
  listAthleteCompetitions,
  listCoachCompetitions,
  listCompetitions,
  unenrollCompetitionTeam as unenrollCompetitionTeamRequest,
  updateCompetition as updateCompetitionRequest,
  updateCompetitionTeam as updateCompetitionTeamRequest,
} from "../api/competitions";
import {
  mapCompetitionFormToCreateRequest,
  mapCompetitionFormToUpdateRequest,
  mapCompetitionTeamFormToRequest,
  resolveCompetitionTemporalStatus,
} from "../model/competition/competition.mappers";
import type {
  Competition,
  CompetitionFilters,
  CompetitionFormValues,
  CompetitionStats,
  CompetitionSummary,
  CompetitionTeam,
  CompetitionTeamFormValues,
} from "../model/competition/competition.types";

const COMPETITIONS_QUERY_KEY = ["competitions"] as const;

function normalizeFilters(filters: CompetitionFilters): CompetitionFilters {
  return {
    modalityId: filters.modalityId,
    status: filters.status,
    coachScope: filters.coachScope ?? "ALL",
    competitionNameOrDescriptionOrModality:
      filters.competitionNameOrDescriptionOrModality.trim(),
  };
}

function useCompetitions(filters: CompetitionFilters) {
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

  const canManageCompetitions =
    activeRole === "MANAGER" || activeRole === "COACH";

  const teamsQuery = useTeams({
    modalityId: undefined,
    teamType: "ALL",
    active: "ACTIVE",
    teamOrModalityName: "",
  });

  const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);

  const competitionsQuery = useQuery({
    queryKey: [
      ...COMPETITIONS_QUERY_KEY,
      "list",
      activeRole,
      user?.id ?? null,
      normalizedFilters,
    ],
    queryFn: async () => {
      if (!activeRole) {
        return [] as CompetitionSummary[];
      }

      if (activeRole === "MANAGER") {
        return listCompetitions(normalizedFilters);
      }

      if (activeRole === "COACH") {
        if (normalizedFilters.coachScope === "MINE" && user?.id) {
          return listCoachCompetitions(user.id, normalizedFilters);
        }

        return listCompetitions(normalizedFilters);
      }

      if (activeRole === "ATHLETE") {
        if (!user?.id) {
          return [];
        }

        return listAthleteCompetitions(user.id, normalizedFilters);
      }

      return [] as CompetitionSummary[];
    },
    enabled: activeRole !== null,
  });

  const createMutation = useMutation({
    mutationFn: async (values: CompetitionFormValues) => {
      return createCompetitionRequest(mapCompetitionFormToCreateRequest(values));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: COMPETITIONS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      competition,
      values,
    }: {
      competition: Competition;
      values: CompetitionFormValues;
    }) => {
      await updateCompetitionRequest(
        competition.id,
        mapCompetitionFormToUpdateRequest(values, competition.version),
      );

      return { competitionId: competition.id };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: COMPETITIONS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: [
          ...COMPETITIONS_QUERY_KEY,
          "detail",
          variables.competitionId,
        ],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (competitionId: number) => {
      await deleteCompetitionRequest(competitionId);
    },
    onSuccess: async (_, competitionId) => {
      await queryClient.invalidateQueries({ queryKey: COMPETITIONS_QUERY_KEY });
      await queryClient.removeQueries({
        queryKey: [...COMPETITIONS_QUERY_KEY, "detail", competitionId],
      });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async ({
      competitionId,
      teamId,
    }: {
      competitionId: number;
      teamId: number;
    }) => {
      return enrollCompetitionTeamRequest(competitionId, { teamId });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...COMPETITIONS_QUERY_KEY,
          "detail",
          variables.competitionId,
        ],
      });
      await queryClient.invalidateQueries({ queryKey: COMPETITIONS_QUERY_KEY });
    },
  });

  const updateCompetitionTeamMutation = useMutation({
    mutationFn: async ({
      competitionId,
      competitionTeam,
      values,
    }: {
      competitionId: number;
      competitionTeam: CompetitionTeam;
      values: CompetitionTeamFormValues;
    }) => {
      await updateCompetitionTeamRequest(
        competitionTeam.id,
        mapCompetitionTeamFormToRequest(values, competitionTeam.version),
      );

      return { competitionId };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...COMPETITIONS_QUERY_KEY,
          "detail",
          variables.competitionId,
        ],
      });
      await queryClient.invalidateQueries({ queryKey: COMPETITIONS_QUERY_KEY });
    },
  });

  const unenrollMutation = useMutation({
    mutationFn: async ({
      competitionId,
      teamId,
    }: {
      competitionId: number;
      teamId: number;
    }) => {
      await unenrollCompetitionTeamRequest(competitionId, teamId);

      return { competitionId };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...COMPETITIONS_QUERY_KEY,
          "detail",
          variables.competitionId,
        ],
      });
      await queryClient.invalidateQueries({ queryKey: COMPETITIONS_QUERY_KEY });
    },
  });

  const getCompetitionDetails = async (
    competitionId: number,
  ): Promise<Competition> => {
    return getCompetition(competitionId);
  };

  const competitions = competitionsQuery.data ?? [];

  const stats = useMemo<CompetitionStats>(() => {
    const total = competitions.length;
    const future = competitions.filter(
      (item) =>
        resolveCompetitionTemporalStatus(item.startDate, item.endDate) ===
        "FUTURE",
    ).length;
    const inProgress = competitions.filter(
      (item) =>
        resolveCompetitionTemporalStatus(item.startDate, item.endDate) ===
        "IN_PROGRESS",
    ).length;
    const past = competitions.filter(
      (item) =>
        resolveCompetitionTemporalStatus(item.startDate, item.endDate) ===
        "PAST",
    ).length;

    return { total, future, inProgress, past };
  }, [competitions]);

  return {
    competitions,
    modalities,
    teams: canManageCompetitions ? teamsQuery.teams : [],
    stats,
    canManageCompetitions,
    isLoading: competitionsQuery.isLoading,
    isFetching: competitionsQuery.isFetching,
    isError: competitionsQuery.isError && competitionsQuery.data === undefined,
    error: competitionsQuery.error ?? null,
    getCompetitionDetails,
    createCompetition: createMutation.mutateAsync,
    updateCompetition: updateMutation.mutateAsync,
    deleteCompetition: deleteMutation.mutateAsync,
    enrollTeam: enrollMutation.mutateAsync,
    updateCompetitionTeam: updateCompetitionTeamMutation.mutateAsync,
    unenrollTeam: unenrollMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isEnrollingTeam: enrollMutation.isPending,
    isUpdatingCompetitionTeam: updateCompetitionTeamMutation.isPending,
    isUnenrollingTeam: unenrollMutation.isPending,
  };
}

export { COMPETITIONS_QUERY_KEY, useCompetitions };