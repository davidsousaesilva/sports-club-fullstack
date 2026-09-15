import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listEventAttendances,
  listEventPerformances,
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

const EVENT_ATTENDANCES_QUERY_KEY = [
  "activity-records",
  "events",
  "attendances",
] as const;

const EVENT_PERFORMANCES_QUERY_KEY = [
  "activity-records",
  "events",
  "performances",
] as const;

function useEventActivityRecords(input: {
  eventId: number | null;
  teamId: number | null;
  teamName: string | null;
  eventDate: string | null;
  members: ActivityMember[];
  statisticTypes: ActivityStatisticType[];
}) {
  const queryClient = useQueryClient();

  const attendancesQuery = useQuery({
    queryKey: [...EVENT_ATTENDANCES_QUERY_KEY, input.eventId],
    queryFn: async (): Promise<Attendance[]> => {
      if (!input.eventId) {
        return [];
      }

      return listEventAttendances(input.eventId);
    },
    enabled: input.eventId !== null,
  });

  const performancesQuery = useQuery({
    queryKey: [...EVENT_PERFORMANCES_QUERY_KEY, input.eventId],
    queryFn: async (): Promise<Performance[]> => {
      if (!input.eventId) {
        return [];
      }

      return listEventPerformances(input.eventId);
    },
    enabled: input.eventId !== null,
  });

  const attendanceMutation = useMutation({
    mutationFn: async (values: { athleteId: number; present: boolean }[]) => {
      const eventId = input.eventId;

      if (!eventId) {
        return;
      }

      const currentAttendances = attendancesQuery.data ?? [];

      await Promise.all(
        values.map((value) => {
          const existingAttendance = currentAttendances.find(
            (attendance) =>
              attendance.athleteId === value.athleteId &&
              attendance.eventId === eventId,
          );

          return registerOrUpdateAttendance(
            buildAttendanceRequest({
              version: existingAttendance?.version ?? null,
              athleteId: value.athleteId,
              present: value.present,
              eventId,
              freeTraining: false,
            }),
          );
        }),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...EVENT_ATTENDANCES_QUERY_KEY, input.eventId],
      });
    },
  });

  const performancesMutation = useMutation({
    mutationFn: async (
      values: { athleteId: number; entries: PerformanceEntryFormValue[] }[],
    ) => {
      const eventId = input.eventId;

      if (!eventId) {
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
                performance.eventId === eventId,
            );

            return {
              ...entry,
              version: existingPerformance?.version ?? entry.version ?? null,
            };
          });

          return registerOrUpdatePerformances(
            buildPerformanceRequest({
              athleteId: value.athleteId,
              eventId,
              entries: entriesWithVersion,
            }),
          );
        }),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...EVENT_PERFORMANCES_QUERY_KEY, input.eventId],
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
  EVENT_ATTENDANCES_QUERY_KEY,
  EVENT_PERFORMANCES_QUERY_KEY,
  useEventActivityRecords,
};