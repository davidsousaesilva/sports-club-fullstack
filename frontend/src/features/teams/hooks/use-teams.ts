import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import { usePeople } from "../../identity/hooks/use-people";
import {
  addAthlete,
  addCoach,
  createTeam as createTeamRequest,
  endMembership as endMembershipRequest,
  getTeam,
  listAthleteTeams,
  listCoachTeams,
  listTeams,
  updateTeam as updateTeamRequest,
} from "../api/teams";
import {
  mapAddTeamMemberRequest,
  mapCreateTeamRequest,
  mapEndMembershipRequest,
  mapUpdateTeamRequest,
} from "../model/team.mappers";
import type {
  AddTeamMemberFormValues,
  EndMembershipFormValues,
  Team,
  TeamFilterValues,
  TeamFormValues,
  TeamMember,
  TeamRoleCandidate,
  TeamSummary,
} from "../model/team.types";

const TEAMS_QUERY_KEY = ["teams"] as const;

function normalizeFilters(filters: TeamFilterValues): TeamFilterValues {
  return {
    modalityId: filters.modalityId,
    teamType: filters.teamType,
    active: filters.active,
    teamOrModalityName: filters.teamOrModalityName.trim(),
    freeTrainingEligible: filters.freeTrainingEligible,
  };
}

function useTeams(filters: TeamFilterValues) {
  const queryClient = useQueryClient();
  const { activeRole } = usePermissions();
  const { user } = useCurrentUser();

  const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);

  const teamsQuery = useQuery({
    queryKey: [
      ...TEAMS_QUERY_KEY,
      "list",
      activeRole,
      user?.id ?? null,
      normalizedFilters,
    ],
    queryFn: async () => {
      if (!activeRole) {
        return [] as TeamSummary[];
      }

      if (activeRole === "MANAGER" || activeRole === "EMPLOYEE") {
        return listTeams(normalizedFilters);
      }

      if (activeRole === "COACH") {
        if (!user?.id) {
          return [];
        }

        return listCoachTeams(user.id, normalizedFilters);
      }

      if (activeRole === "ATHLETE") {
        if (!user?.id) {
          return [];
        }

        return listAthleteTeams(user.id, normalizedFilters);
      }

      return [] as TeamSummary[];
    },
    enabled: activeRole !== null,
  });

  const createMutation = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      return createTeamRequest(mapCreateTeamRequest(values));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      team,
      values,
    }: {
      team: Team;
      values: TeamFormValues;
    }) => {
      await updateTeamRequest(
        team.id,
        mapUpdateTeamRequest(values, team.version),
      );

      return { teamId: team.id };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: [...TEAMS_QUERY_KEY, "detail", variables.team.id],
      });
    },
  });

  const candidatesCache = useTeamRoleCandidates();

  const addAthleteMutation = useMutation({
    mutationFn: async ({
      teamId,
      values,
    }: {
      teamId: number;
      values: AddTeamMemberFormValues;
    }) => {
      return addAthlete(teamId, mapAddTeamMemberRequest(values));
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...TEAMS_QUERY_KEY, "detail", variables.teamId],
      });
      await queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    },
  });

  const addCoachMutation = useMutation({
    mutationFn: async ({
      teamId,
      values,
    }: {
      teamId: number;
      values: AddTeamMemberFormValues;
    }) => {
      return addCoach(teamId, mapAddTeamMemberRequest(values));
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...TEAMS_QUERY_KEY, "detail", variables.teamId],
      });
      await queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    },
  });

  const endMembershipMutation = useMutation({
    mutationFn: async ({
      teamId,
      teamMember,
      values,
    }: {
      teamId: number;
      teamMember: TeamMember;
      values: EndMembershipFormValues;
    }) => {
      await endMembershipRequest(
        teamMember.id,
        mapEndMembershipRequest(values, teamMember.version),
      );

      return { teamId };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...TEAMS_QUERY_KEY, "detail", variables.teamId],
      });
      await queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    },
  });

  const getTeamDetails = useCallback(async (teamId: number): Promise<Team> => {
    return getTeam(teamId);
  }, []);

  return {
    teams: teamsQuery.data ?? [],
    isLoading: teamsQuery.isLoading,
    isFetching: teamsQuery.isFetching,
    isError: teamsQuery.isError,
    error: teamsQuery.error ?? null,
    getTeamDetails,
    createTeam: createMutation.mutateAsync,
    updateTeam: updateMutation.mutateAsync,
    addAthlete: addAthleteMutation.mutateAsync,
    addCoach: addCoachMutation.mutateAsync,
    endMembership: endMembershipMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isAddingAthlete: addAthleteMutation.isPending,
    isAddingCoach: addCoachMutation.isPending,
    isEndingMembership: endMembershipMutation.isPending,
  };
}

function useTeamRoleCandidates() {
  const athletesQuery = usePeople({
    role: "ATHLETE",
    active: "ACTIVE",
    personNameOrEmail: "",
  });

  const coachesQuery = usePeople({
    role: "COACH",
    active: "ACTIVE",
    personNameOrEmail: "",
  });

  const athletes = useMemo<TeamRoleCandidate[]>(
    () =>
      athletesQuery.people.map((person) => ({
        id: person.id,
        name: person.name,
        email: person.email,
        activeRoles: person.activeRoles.map((role) => role.role),
      })),
    [athletesQuery.people],
  );

  const coaches = useMemo<TeamRoleCandidate[]>(
    () =>
      coachesQuery.people.map((person) => ({
        id: person.id,
        name: person.name,
        email: person.email,
        activeRoles: person.activeRoles.map((role) => role.role),
      })),
    [coachesQuery.people],
  );

  return {
    athletes,
    coaches,
    isLoading: athletesQuery.isLoading || coachesQuery.isLoading,
    isFetching: athletesQuery.isFetching || coachesQuery.isFetching,
  };
}

export { useTeams, useTeamRoleCandidates, TEAMS_QUERY_KEY };