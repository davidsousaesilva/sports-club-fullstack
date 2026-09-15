import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTraining as createTrainingRequest,
  deleteTraining as deleteTrainingRequest,
  getTraining as getTrainingRequest,
  listAthleteTrainings as listAthleteTrainingsRequest,
  listCoachTrainings as listCoachTrainingsRequest,
  listTrainings as listTrainingsRequest,
  updateTraining as updateTrainingRequest,
} from "../api/training";
import { mapTrainingFormToUpdateRequest } from "../model/training/training.mappers";
import type {
  Training,
  TrainingFilters,
  TrainingFormValues,
  TrainingSummary,
} from "../model/training/training.types";

const TRAININGS_QUERY_KEY = ["activities", "trainings"] as const;

function buildTrainingQueryKey(scope: string, filters: TrainingFilters) {
  return [...TRAININGS_QUERY_KEY, scope, filters] as const;
}

function useTrainings(filters: TrainingFilters, enabled = true) {
  return useQuery({
    queryKey: buildTrainingQueryKey("all", filters),
    queryFn: async (): Promise<TrainingSummary[]> => {
      return listTrainingsRequest(filters);
    },
    enabled,
    staleTime: 60_000,
  });
}

function useCoachTrainings(coachId: number | null, filters: TrainingFilters) {
  return useQuery({
    queryKey: buildTrainingQueryKey(`coach-${coachId ?? "none"}`, filters),
    queryFn: async (): Promise<TrainingSummary[]> => {
      if (!coachId) {
        return [];
      }

      return listCoachTrainingsRequest(coachId, filters);
    },
    enabled: coachId !== null,
    staleTime: 60_000,
  });
}

function useAthleteTrainings(
  athleteId: number | null,
  filters: TrainingFilters,
) {
  return useQuery({
    queryKey: buildTrainingQueryKey(`athlete-${athleteId ?? "none"}`, filters),
    queryFn: async (): Promise<TrainingSummary[]> => {
      if (!athleteId) {
        return [];
      }

      return listAthleteTrainingsRequest(athleteId, filters);
    },
    enabled: athleteId !== null,
    staleTime: 60_000,
  });
}

function useTrainingMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (values: TrainingFormValues) => {
      return createTrainingRequest(values);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRAININGS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      training,
      values,
    }: {
      training: Training;
      values: TrainingFormValues;
    }) => {
      await updateTrainingRequest(
        training.id,
        mapTrainingFormToUpdateRequest(values, training.version),
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRAININGS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (trainingId: number) => {
      await deleteTrainingRequest(trainingId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRAININGS_QUERY_KEY });
    },
  });

  const getTraining = async (trainingId: number): Promise<Training> => {
    return getTrainingRequest(trainingId);
  };

  return {
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createTraining: createMutation.mutateAsync,
    updateTraining: updateMutation.mutateAsync,
    deleteTraining: deleteMutation.mutateAsync,
    getTraining,
  };
}

export {
  TRAININGS_QUERY_KEY,
  useAthleteTrainings,
  useCoachTrainings,
  useTrainings,
  useTrainingMutations,
};