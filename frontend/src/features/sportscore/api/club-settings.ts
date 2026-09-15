import { httpClient } from "../../../lib/api/http-client";
import type {
  ComplexResponseDto,
  CreateComplexRequestDto,
  CreateStatisticTypeRequestDto,
  StatisticTypeResponseDto,
  UpdateComplexRequestDto,
  UpdateStatisticTypeRequestDto,
} from "../model/club-settings.types";
import {
  mapComplexResponse,
  mapStatisticTypeResponse,
} from "../model/club-settings.mappers";

export async function listStatisticTypes() {
  const data = await httpClient.get<StatisticTypeResponseDto[]>(
    "api/statistic-types",
  );

  return data.map(mapStatisticTypeResponse);
}

export async function createStatisticType(
  payload: CreateStatisticTypeRequestDto,
) {
  const data = await httpClient.post<StatisticTypeResponseDto>(
    "api/statistic-types",
    payload,
  );

  return mapStatisticTypeResponse(data);
}

export async function updateStatisticType(
  id: number,
  payload: UpdateStatisticTypeRequestDto,
) {
  const data = await httpClient.put<StatisticTypeResponseDto>(
    `api/statistic-types/${id}`,
    payload,
  );

  return mapStatisticTypeResponse(data);
}

export async function deleteStatisticType(id: number) {
  await httpClient.delete(`api/statistic-types/${id}`);
}

export async function listComplexes() {
  const data = await httpClient.get<ComplexResponseDto[]>("api/complexes");

  return data.map(mapComplexResponse);
}

export async function createComplex(payload: CreateComplexRequestDto) {
  const data = await httpClient.post<ComplexResponseDto>(
    "api/complexes",
    payload,
  );

  return mapComplexResponse(data);
}

export async function updateComplex(
  id: number,
  payload: UpdateComplexRequestDto,
) {
  const data = await httpClient.put<ComplexResponseDto>(
    `api/complexes/${id}`,
    payload,
  );

  return mapComplexResponse(data);
}

export async function deleteComplex(id: number) {
  await httpClient.delete(`api/complexes/${id}`);
}
