import { httpClient } from "../../../lib/api/http-client";
import {
  mapModalityResponse,
  mapModalitySummaryResponse,
} from "../model/modalities.mappers";
import type {
  CreateModalityRequestDto,
  Modality,
  ModalityResponseDto,
  ModalitySummary,
  ModalitySummaryResponseDto,
  UpdateModalityRequestDto,
} from "../model/modalities.types";

async function listModalities(): Promise<ModalitySummary[]> {
  const modalities =
    await httpClient.get<ModalitySummaryResponseDto[]>("api/modalities");

  return modalities.map(mapModalitySummaryResponse);
}

async function listCoachModalities(
  coachId: number,
): Promise<ModalitySummary[]> {
  const modalities = await httpClient.get<ModalitySummaryResponseDto[]>(
    `api/coaches/${coachId}/modalities`,
  );

  return modalities.map(mapModalitySummaryResponse);
}

async function createModality(payload: CreateModalityRequestDto) {
  const created = await httpClient.post<ModalityResponseDto>(
    "api/modalities",
    payload,
  );

  return mapModalityResponse(created);
}

async function updateModality(
  id: number,
  payload: UpdateModalityRequestDto,
): Promise<void> {
  await httpClient.put<void>(`api/modalities/${id}`, payload);
}

async function deleteModality(id: number): Promise<void> {
  await httpClient.delete<void>(`api/modalities/${id}`);
}

async function getModality(id: number): Promise<Modality> {
  const modality = await httpClient.get<ModalityResponseDto>(
    `api/modalities/${id}`,
  );

  return mapModalityResponse(modality);
}

export {
  createModality,
  deleteModality,
  getModality,
  listCoachModalities,
  listModalities,
  updateModality,
};
