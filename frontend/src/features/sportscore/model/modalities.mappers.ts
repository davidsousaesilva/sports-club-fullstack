import type { StatisticType } from "./club-settings.types";
import type {
  CreateModalityRequestDto,
  Modality,
  ModalityFormValues,
  ModalityPriceRequestDto,
  ModalityPriceResponseDto,
  ModalityPriceRule,
  ModalityResponseDto,
  ModalitySummary,
  ModalitySummaryResponseDto,
  ModalityTeamSummary,
  TeamSummaryResponseDto,
  UpdateModalityRequestDto,
} from "./modalities.types";

function mapPriceResponse(dto: ModalityPriceResponseDto): ModalityPriceRule {
  return {
    id: String(dto.id),
    version: dto.version,
    registrationFee: dto.registrationFee,
    monthlyFee: dto.monthlyFee,
    ageMin: dto.ageRangeMin,
    ageMax: dto.ageRangeMax,
  };
}

function mapPriceRequest(price: ModalityPriceRule): ModalityPriceRequestDto {
  return {
    registrationFee: price.registrationFee,
    monthlyFee: price.monthlyFee,
    ageRangeMin: price.ageMin,
    ageRangeMax: price.ageMax,
  };
}

function mapTeamSummaryResponse(
  dto: TeamSummaryResponseDto,
): ModalityTeamSummary {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    teamType: dto.teamType,
    seasonYear: dto.seasonYear,
    active: dto.active,
    modalityId: dto.modalityId,
    modalityName: dto.modalityName,
  };
}

function mapModalitySummaryResponse(
  dto: ModalitySummaryResponseDto,
): ModalitySummary {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    eventType: dto.eventType,
    description: dto.description ?? "",
    trained: dto.trained,
    maxWeeklyAttendances: dto.maxWeeklyAttendances,
  };
}

function mapModalityResponse(dto: ModalityResponseDto): Modality {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    eventType: dto.eventType,
    description: dto.description ?? "",
    trained: dto.trained,
    maxWeeklyAttendances: dto.maxWeeklyAttendances,
    statisticTypes: dto.statisticTypes as StatisticType[],
    prices: dto.prices.map(mapPriceResponse),
    teams: dto.teams.map(mapTeamSummaryResponse),
  };
}

function mapModalityToSummary(modality: Modality): ModalitySummary {
  return {
    id: modality.id,
    version: modality.version,
    name: modality.name,
    eventType: modality.eventType,
    description: modality.description,
    trained: modality.trained,
    maxWeeklyAttendances: modality.maxWeeklyAttendances,
  };
}

function mapCreateModalityRequest(
  values: ModalityFormValues,
): CreateModalityRequestDto {
  return {
    name: values.name.trim(),
    eventType: values.eventType.trim(),
    description: values.description.trim(),
    trained: values.trained,
    maxWeeklyAttendances: values.trained ? 0 : values.maxWeeklyAttendances,
    statisticTypes: values.statisticTypeIds.map((id) => ({ id })),
    prices: values.prices.map(mapPriceRequest),
  };
}

function mapUpdateModalityRequest(
  values: ModalityFormValues,
  version: number,
): UpdateModalityRequestDto {
  return {
    version,
    name: values.name.trim(),
    eventType: values.eventType.trim(),
    description: values.description.trim(),
    trained: values.trained,
    maxWeeklyAttendances: values.trained ? 0 : values.maxWeeklyAttendances,
    statisticTypes: values.statisticTypeIds.map((id) => ({ id })),
    prices: values.prices.map(mapPriceRequest),
  };
}

export {
  mapCreateModalityRequest,
  mapModalityResponse,
  mapModalitySummaryResponse,
  mapModalityToSummary,
  mapTeamSummaryResponse,
  mapUpdateModalityRequest,
};