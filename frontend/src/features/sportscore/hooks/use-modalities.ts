import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createModality,
  deleteModality as deleteModalityRequest,
  getModality as getModalityRequest,
  listCoachModalities,
  listModalities,
  updateModality as updateModalityRequest,
} from "../api/modalities";
import {
  mapCreateModalityRequest,
  mapModalityToSummary,
  mapUpdateModalityRequest,
} from "../model/modalities.mappers";
import type {
  Modality,
  ModalityFormValues,
  ModalitySummary,
} from "../model/modalities.types";

const MODALITIES_QUERY_KEY = ["sportscore", "modalities"];

function useModalities() {
  const queryClient = useQueryClient();

  const modalitiesQuery = useQuery({
    queryKey: MODALITIES_QUERY_KEY,
    queryFn: listModalities,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (values: ModalityFormValues) => {
      return createModality(mapCreateModalityRequest(values));
    },
    onSuccess: (createdModality) => {
      queryClient.setQueryData<ModalitySummary[]>(
        MODALITIES_QUERY_KEY,
        (current = []) => [mapModalityToSummary(createdModality), ...current],
      );

      queryClient.invalidateQueries({ queryKey: MODALITIES_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
      currentModality,
    }: {
      id: number;
      values: ModalityFormValues;
      currentModality: Modality;
    }) => {
      await updateModalityRequest(
        id,
        mapUpdateModalityRequest(values, currentModality.version),
      );

      return getModalityRequest(id);
    },
    onSuccess: (updatedModality) => {
      queryClient.setQueryData<ModalitySummary[]>(
        MODALITIES_QUERY_KEY,
        (current = []) =>
          current.map((item) =>
            item.id === updatedModality.id
              ? mapModalityToSummary(updatedModality)
              : item,
          ),
      );

      queryClient.invalidateQueries({ queryKey: MODALITIES_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModalityRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODALITIES_QUERY_KEY });
    },
  });

  const getModality = async (id: number): Promise<Modality> => {
    return getModalityRequest(id);
  };

  return {
    modalities: modalitiesQuery.data ?? [],
    isLoading: modalitiesQuery.isLoading,
    isFetching: modalitiesQuery.isFetching,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createModality: createMutation.mutateAsync,
    updateModality: updateMutation.mutateAsync,
    deleteModality: deleteMutation.mutateAsync,
    getModality,
  };
}

function useCoachModalities(coachId: number | null) {
  const modalitiesQuery = useQuery({
    queryKey: [...MODALITIES_QUERY_KEY, "coach", coachId],
    queryFn: async () => {
      if (!coachId) {
        return [];
      }

      return listCoachModalities(coachId);
    },
    enabled: coachId !== null,
    staleTime: 60_000,
  });

  return {
    modalities: modalitiesQuery.data ?? [],
    isLoading: modalitiesQuery.isLoading,
    isFetching: modalitiesQuery.isFetching,
    isError: modalitiesQuery.isError,
    error: modalitiesQuery.error ?? null,
  };
}

export { useCoachModalities, useModalities, MODALITIES_QUERY_KEY };