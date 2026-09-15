import type { StatisticType } from "./club-settings.types";

export type ModalityFilterStatus = "ALL" | "TRAINED" | "UNTRAINED";

export interface StatisticTypeIdRequestDto {
  id: number;
}

export interface ModalityPriceRequestDto {
  registrationFee: number;
  monthlyFee: number;
  ageRangeMin: number | null;
  ageRangeMax: number | null;
}

export interface ModalityPriceResponseDto {
  id: number;
  version: number;
  registrationFee: number;
  monthlyFee: number;
  ageRangeMin: number | null;
  ageRangeMax: number | null;
}

export interface CreateModalityRequestDto {
  name: string;
  eventType: string;
  description: string;
  trained: boolean;
  maxWeeklyAttendances: number;
  statisticTypes: StatisticTypeIdRequestDto[];
  prices: ModalityPriceRequestDto[];
}

export interface UpdateModalityRequestDto {
  version: number;
  name: string;
  eventType: string;
  description: string;
  trained: boolean;
  maxWeeklyAttendances: number;
  statisticTypes: StatisticTypeIdRequestDto[];
  prices: ModalityPriceRequestDto[];
}

export interface ModalitySummaryResponseDto {
  id: number;
  version: number;
  name: string;
  eventType: string;
  description: string | null;
  trained: boolean;
  maxWeeklyAttendances: number;
}

export interface TeamSummaryResponseDto {
  id: number;
  version: number;
  name: string;
  teamType: string;
  seasonYear: string;
  active: boolean;
  modalityId: number;
  modalityName: string;
}

export interface ModalityResponseDto {
  id: number;
  version: number;
  name: string;
  eventType: string;
  description: string | null;
  trained: boolean;
  maxWeeklyAttendances: number;
  statisticTypes: StatisticType[];
  prices: ModalityPriceResponseDto[];
  teams: TeamSummaryResponseDto[];
}

export interface ModalityPriceRule {
  id: string;
  version?: number;
  registrationFee: number;
  monthlyFee: number;
  ageMin: number | null;
  ageMax: number | null;
}

export interface ModalityTeamSummary {
  id: number;
  version: number;
  name: string;
  teamType: string;
  seasonYear: string;
  active: boolean;
  modalityId: number;
  modalityName: string;
}

export interface ModalitySummary {
  id: number;
  version: number;
  name: string;
  eventType: string;
  description: string;
  trained: boolean;
  maxWeeklyAttendances: number;
}

export interface Modality {
  id: number;
  version: number;
  name: string;
  eventType: string;
  description: string;
  trained: boolean;
  maxWeeklyAttendances: number;
  statisticTypes: StatisticType[];
  prices: ModalityPriceRule[];
  teams: ModalityTeamSummary[];
}

export interface ModalityFormValues {
  name: string;
  eventType: string;
  description: string;
  trained: boolean;
  maxWeeklyAttendances: number;
  statisticTypeIds: number[];
  prices: ModalityPriceRule[];
}