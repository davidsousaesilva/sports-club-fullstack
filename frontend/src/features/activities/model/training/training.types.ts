import type {
  ActivityMember,
  ActivityStatisticType,
} from "../../../activity-tracking/model/activity-records.types";

export type TemporalStatus = "IN_PROGRESS" | "FUTURE" | "PAST";

export interface TrainingSummaryResponseDto {
  id: number;
  version: number;
  description: string;
  note: string | null;
  date: string;
  duration: number;
  idComplex: number | null;
  complexName: string | null;
  idTeam: number;
  teamName: string;
  presentAthletesPercent: number | null;
  performanceEntriesPercent: number | null;
}

export interface TrainingResponseDto {
  id: number;
  version: number;
  description: string;
  note: string | null;
  date: string;
  duration: number;
  idComplex: number | null;
  complexName: string | null;
  idTeam: number;
  teamName: string;
  members: {
    id: number;
    teamId: number;
    teamName: string;
    personId: number;
    personName: string;
    relationship: string;
    startDate: string;
    endDate: string | null;
  }[];
  statsTypes: {
    id: number;
    version?: number;
    name: string;
    unit: string;
  }[];
}

export interface CreateTrainingRequestDto {
  description: string;
  note: string | null;
  date: string;
  duration: number;
  complexId: number | null;
  teamId: number;
}

export interface UpdateTrainingRequestDto {
  version: number;
  description: string;
  note: string | null;
  date: string;
  duration: number;
  complexId: number | null;
  teamId: number;
}

export interface TrainingSummary {
  id: number;
  version: number;
  description: string;
  note: string | null;
  date: string;
  duration: number;
  complexId: number | null;
  complexName: string | null;
  teamId: number;
  teamName: string;
  presentAthletesPercent: number | null;
  performanceEntriesPercent: number | null;
}

export interface Training extends TrainingSummary {
  members: ActivityMember[];
  statisticTypes: ActivityStatisticType[];
}

export interface TrainingFilters {
  teamId?: number;
  complexId?: number;
  status: TemporalStatus | "ALL";
  trainingDescriptionOrTeam: string;
}

export interface TrainingFormValues {
  description: string;
  note: string;
  date: string;
  time: string;
  duration: number;
  complexId?: number;
  teamId: number;
}

export interface TrainingStats {
  total: number;
  future: number;
  inProgress: number;
  past: number;
}