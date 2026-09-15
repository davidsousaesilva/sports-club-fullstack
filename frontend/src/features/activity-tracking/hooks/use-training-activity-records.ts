import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listTrainingAttendances,
  listTrainingPerformances,
  registerOrUpdateAttendance,
  registerOrUpdatePerformances,
} from "../api/activity-records";
import {
  buildAttendanceRequest,
  buildPerformanceRequest,
} from "../model/activity-records.mappers";
import type {
  ActivityMember,
  ActivityStatisticType,
  Attendance,
  Performance,
  PerformanceEntryFormValue,
} from "../model/activity-records.types";

const TRAINING_ATTENDANCES_QUERY_KEY = [
  "activity-records",
  "trainings",
  "attendances",
] as const;

const TRAINING_PERFORMANCES_QUERY_KEY = [
  "activity-records",
  "trainings",
  "performances",
] as const;

function useTrainingActivityRecords(input: {
  trainingId: number | null;
  teamId: number | null;
  teamName: string | null;
  trainingDate: string | null;
  members: ActivityMember[];
  statisticTypes: ActivityStatisticType[];
}) {
  const queryClient = useQueryClient();

  const attendancesQuery = useQuery({
    queryKey: [...TRAINING_ATTENDANCES_QUERY_KEY, input.trainingId],
    queryFn: async (): Promise<Attendance[]> => {
      if (!input.trainingId) {
        return [];
      }

      return listTrainingAttendances(input.trainingId);
    },
    enabled: input.trainingId !== null,
  });

  const performancesQuery = useQuery({
    queryKey: [...TRAINING_PERFORMANCES_QUERY_KEY, input.trainingId],
    queryFn: async (): Promise<Performance[]> => {
      if (!input.trainingId) {
        return [];
      }

      return listTrainingPerformances(input.trainingId);
    },
    enabled: input.trainingId !== null,
  });

  const attendanceMutation = useMutation({
    mutationFn: async (values: { athleteId: number; present: boolean }[]) => {
      const trainingId = input.trainingId;

      if (!trainingId) {
        return;
      }

      const currentAttendances = attendancesQuery.data ?? [];

      await Promise.all(
        values.map((value) => {
          const existingAttendance = currentAttendances.find(
            (attendance) =>
              attendance.athleteId === value.athleteId &&
              attendance.trainingId === trainingId,
          );

          return registerOrUpdateAttendance(
            buildAttendanceRequest({
              version: existingAttendance?.version ?? null,
              athleteId: value.athleteId,
              present: value.present,
              trainingId,
              teamId: input.teamId ?? undefined,
              freeTraining: false,
            }),
          );
        }),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...TRAINING_ATTENDANCES_QUERY_KEY, input.trainingId],
      });
    },
  });

  const performancesMutation = useMutation({
    mutationFn: async (
      values: { athleteId: number; entries: PerformanceEntryFormValue[] }[],
    ) => {
      const trainingId = input.trainingId;

      if (!trainingId) {
        return;
      }

      const currentPerformances = performancesQuery.data ?? [];

      await Promise.all(
        values.map((value) => {
          const entriesWithVersion = value.entries.map((entry) => {
            const existingPerformance = currentPerformances.find(
              (performance) =>
                performance.athleteId === value.athleteId &&
                performance.statisticTypeId === entry.statisticTypeId &&
                performance.trainingId === trainingId,
            );

            return {
              ...entry,
              version: existingPerformance?.version ?? entry.version ?? null,
            };
          });

          return registerOrUpdatePerformances(
            buildPerformanceRequest({
              athleteId: value.athleteId,
              trainingId,
              entries: entriesWithVersion,
            }),
          );
        }),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...TRAINING_PERFORMANCES_QUERY_KEY, input.trainingId],
      });
    },
  });

  return {
    members: input.members,
    statisticTypes: input.statisticTypes,
    attendances: attendancesQuery.data ?? [],
    performances: performancesQuery.data ?? [],
    isLoading: attendancesQuery.isLoading || performancesQuery.isLoading,
    isSubmitting:
      attendanceMutation.isPending || performancesMutation.isPending,
    isSubmittingAttendance: attendanceMutation.isPending,
    isSubmittingPerformances: performancesMutation.isPending,
    submitAttendances: attendanceMutation.mutateAsync,
    submitPerformances: performancesMutation.mutateAsync,
  };
}

export {
  TRAINING_ATTENDANCES_QUERY_KEY,
  TRAINING_PERFORMANCES_QUERY_KEY,
  useTrainingActivityRecords,
};