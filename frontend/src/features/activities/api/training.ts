import { httpClient } from "../../../lib/api/http-client";
import {
  buildTrainingQueryString,
  mapTrainingFormToRequest,
  mapTrainingResponse,
  mapTrainingSummaryResponse,
} from "../model/training/training.mappers";
import type {
  Training,
  TrainingFilters,
  TrainingFormValues,
  TrainingResponseDto,
  TrainingSummary,
  TrainingSummaryResponseDto,
  UpdateTrainingRequestDto,
} from "../model/training/training.types";

async function listTrainings(
  filters: TrainingFilters,
): Promise<TrainingSummary[]> {
  const query = buildTrainingQueryString(filters);
  const response = await httpClient.get<TrainingSummaryResponseDto[]>(
    `api/trainings${query}`,
  );

  return response.map(mapTrainingSummaryResponse);
}

async function listCoachTrainings(
  coachId: number,
  filters: TrainingFilters,
): Promise<TrainingSummary[]> {
  const query = buildTrainingQueryString(filters);
  const response = await httpClient.get<TrainingSummaryResponseDto[]>(
    `api/coaches/${coachId}/trainings${query}`,
  );

  return response.map(mapTrainingSummaryResponse);
}

async function listAthleteTrainings(
  athleteId: number,
  filters: TrainingFilters,
): Promise<TrainingSummary[]> {
  const query = buildTrainingQueryString(filters);
  const response = await httpClient.get<TrainingSummaryResponseDto[]>(
    `api/athletes/${athleteId}/trainings${query}`,
  );

  return response.map(mapTrainingSummaryResponse);
}

async function getTraining(trainingId: number): Promise<Training> {
  const response = await httpClient.get<TrainingResponseDto>(
    `api/trainings/${trainingId}`,
  );

  return mapTrainingResponse(response);
}

async function createTraining(values: TrainingFormValues): Promise<Training> {
  const response = await httpClient.post<TrainingResponseDto>(
    "api/trainings",
    mapTrainingFormToRequest(values),
  );

  return mapTrainingResponse(response);
}

async function updateTraining(
  trainingId: number,
  payload: UpdateTrainingRequestDto,
): Promise<void> {
  await httpClient.put<void>(`api/trainings/${trainingId}`, payload);
}

async function deleteTraining(trainingId: number): Promise<void> {
  await httpClient.delete<void>(`api/trainings/${trainingId}`);
}

export {
  createTraining,
  deleteTraining,
  getTraining,
  listAthleteTrainings,
  listCoachTrainings,
  listTrainings,
  updateTraining,
};