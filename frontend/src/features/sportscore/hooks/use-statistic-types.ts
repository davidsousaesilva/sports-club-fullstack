import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStatisticType,
  deleteStatisticType as deleteStatisticTypeRequest,
  listStatisticTypes,
  updateStatisticType,
} from "../api/club-settings";
import {
  mapCreateStatisticTypeRequest,
  mapUpdateStatisticTypeRequest,
} from "../model/club-settings.mappers";
import type {
  StatisticType,
  StatisticTypeFormValues,
} from "../model/club-settings.types";

const STATISTIC_TYPES_QUERY_KEY = [
  "sportscore",
  "club-settings",
  "statistic-types",
];

function useStatisticTypes() {
  const queryClient = useQueryClient();

  const statisticTypesQuery = useQuery({
    queryKey: STATISTIC_TYPES_QUERY_KEY,
    queryFn: listStatisticTypes,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (values: StatisticTypeFormValues) => {
      return createStatisticType(mapCreateStatisticTypeRequest(values));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATISTIC_TYPES_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      statisticType,
      values,
    }: {
      statisticType: StatisticType;
      values: StatisticTypeFormValues;
    }) => {
      return updateStatisticType(
        statisticType.id,
        mapUpdateStatisticTypeRequest(values, statisticType.version),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATISTIC_TYPES_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStatisticTypeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATISTIC_TYPES_QUERY_KEY });
    },
  });

  return {
    statisticTypes: statisticTypesQuery.data ?? [],
    isLoading: statisticTypesQuery.isLoading,
    isFetching: statisticTypesQuery.isFetching,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createStatisticType: createMutation.mutateAsync,
    updateStatisticType: updateMutation.mutateAsync,
    deleteStatisticType: deleteMutation.mutateAsync,
  };
}

export { useStatisticTypes, STATISTIC_TYPES_QUERY_KEY };