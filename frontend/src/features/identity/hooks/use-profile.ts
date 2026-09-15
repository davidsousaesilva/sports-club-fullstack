import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  alterPassword,
  assignRole,
  getProfile,
  getProfileStatistics,
  makeRolePrimary,
  setPasswordByStaff,
  terminateRole,
  updatePerson,
} from "../api/people";
import {
  mapAlterPasswordRequest,
  mapAssignRoleRequest,
  mapSetPasswordByStaffRequest,
  mapTerminateRoleRequest,
  mapUpdatePersonRequest,
} from "../model/person.mappers";
import type {
  AssignRoleFormValues,
  ChangeOwnPasswordFormValues,
  Person,
  ResetPasswordFormValues,
  TerminateRoleFormValues,
  UpdatePersonFormValues,
} from "../model/person.types";

function createProfileQueryKey(personId: number) {
  return ["identity", "profile", personId] as const;
}

function createProfileStatisticsQueryKey(personId: number) {
  return ["identity", "profile-statistics", personId] as const;
}

function useProfile(personId: number) {
  const queryClient = useQueryClient();
  const profileQueryKey = createProfileQueryKey(personId);
  const statisticsQueryKey = createProfileStatisticsQueryKey(personId);

  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: () => getProfile(personId),
    enabled: Number.isFinite(personId) && personId > 0,
  });

  const statisticsQuery = useQuery({
    queryKey: statisticsQueryKey,
    queryFn: () => getProfileStatistics(personId),
    enabled: Number.isFinite(personId) && personId > 0,
  });

  const invalidateProfile = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: profileQueryKey }),
      queryClient.invalidateQueries({ queryKey: statisticsQueryKey }),
      queryClient.invalidateQueries({ queryKey: ["identity", "people"] }),
    ]);
  };

  const updatePersonMutation = useMutation({
    mutationFn: ({
      person,
      values,
    }: {
      person: Person;
      values: UpdatePersonFormValues;
    }) =>
      updatePerson(
        personId,
        mapUpdatePersonRequest(values, person.version),
      ),
    onSuccess: invalidateProfile,
  });

  const alterPasswordMutation = useMutation({
    mutationFn: (values: ChangeOwnPasswordFormValues) =>
      alterPassword(personId, mapAlterPasswordRequest(values)),
  });

  const setPasswordByStaffMutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      setPasswordByStaff(personId, mapSetPasswordByStaffRequest(values)),
  });

  const assignRoleMutation = useMutation({
    mutationFn: (values: AssignRoleFormValues) =>
      assignRole(personId, mapAssignRoleRequest(values)),
    onSuccess: invalidateProfile,
  });

  const terminateRoleMutation = useMutation({
    mutationFn: ({
      personRoleId,
      version,
      values,
    }: {
      personRoleId: number;
      version: number;
      values: TerminateRoleFormValues;
    }) =>
      terminateRole(
        personRoleId,
        mapTerminateRoleRequest(values, version),
      ),
    onSuccess: invalidateProfile,
  });

  const makePrimaryRoleMutation = useMutation({
    mutationFn: (personRoleId: number) => makeRolePrimary(personRoleId),
    onSuccess: invalidateProfile,
  });

  return {
    profile: profileQuery.data ?? null,
    statistics: statisticsQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching || statisticsQuery.isFetching,
    isError: profileQuery.isError,
    error: profileQuery.error,
    isLoadingStatistics: statisticsQuery.isLoading,
    isStatisticsError: statisticsQuery.isError,
    statisticsError: statisticsQuery.error,
    refetch: profileQuery.refetch,
    updatePerson: updatePersonMutation.mutateAsync,
    isUpdatingPerson: updatePersonMutation.isPending,
    alterOwnPassword: alterPasswordMutation.mutateAsync,
    isAlteringOwnPassword: alterPasswordMutation.isPending,
    setPasswordByStaff: setPasswordByStaffMutation.mutateAsync,
    isSettingPasswordByStaff: setPasswordByStaffMutation.isPending,
    assignRole: assignRoleMutation.mutateAsync,
    isAssigningRole: assignRoleMutation.isPending,
    terminateRole: terminateRoleMutation.mutateAsync,
    isTerminatingRole: terminateRoleMutation.isPending,
    makePrimaryRole: makePrimaryRoleMutation.mutateAsync,
    isMakingPrimaryRole: makePrimaryRoleMutation.isPending,
  };
}

export { useProfile, createProfileQueryKey, createProfileStatisticsQueryKey };