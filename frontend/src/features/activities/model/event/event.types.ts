import type { StatisticType } from "../../../sportscore/model/club-settings.types";

export type EventTemporalStatus = "ALL" | "FUTURE" | "IN_PROGRESS" | "PAST";

export type CoachEventScope = "ALL" | "MINE";

export interface EventSummaryResponseDto {
  id: number;
  version: number;
  description: string;
  date: string;
  duration: number;
  idModality: number;
  modalityName: string;
  idComplex: number | null;
  complexName: string | null;
  idCompetition: number | null;
  competitionName: string | null;
  teams: EventTeamResponseDto[];
  presentAthletesPercent: number | null;
  performanceEntriesPercent: number | null;
}

export interface EventResponseDto {
  id: number;
  version: number;
  description: string;
  date: string;
  duration: number;
  idModality: number;
  modalityName: string;
  idComplex: number | null;
  complexName: string | null;
  idCompetition: number | null;
  competitionName: string | null;
  teams: EventTeamResponseDto[];
  members: Record<number, EventMemberResponseDto[]>;
  statsTypes: StatisticType[];
}

export interface EventTeamResponseDto {
  id: number;
  version: number;
  result: string | null;
  numericResult: string | null;
  idEvent: number;
  idTeam: number;
  teamName: string;
}

export interface EventMemberResponseDto {
  id: number;
  personId: number;
  personName: string;
}

export interface CreateEventRequestDto {
  description: string;
  date: string;
  duration: number;
  modalityId: number;
  complexId: number | null;
  competitionId: number | null;
}

export interface UpdateEventRequestDto {
  version: number;
  description: string;
  date: string;
  duration: number;
  modalityId: number;
  complexId: number | null;
  competitionId: number | null;
}

export interface UpdateEventTeamRequestDto {
  version: number;
  result: string;
  numericResult: string;
}

export interface EnrollEventTeamRequestDto {
  teamId: number;
}

export interface EventTeam {
  id: number;
  version: number;
  result: string;
  numericResult: string;
  eventId: number;
  teamId: number;
  teamName: string;
}

export interface EventMember {
  id: number;
  personId: number;
  personName: string;
}

export interface EventSummary {
  id: number;
  version: number;
  description: string;
  date: string;
  duration: number;
  modalityId: number;
  modalityName: string;
  complexId: number | null;
  complexName: string | null;
  competitionId: number | null;
  competitionName: string | null;
  teamsCount: number;
  presentAthletesPercent: number | null;
  performanceEntriesPercent: number | null;
}

export interface Event extends EventSummary {
  teams: EventTeam[];
  members: Record<number, EventMember[]>;
  statsTypes: StatisticType[];
}

export interface EventFilters {
  competitionId?: number;
  status: EventTemporalStatus;
  eventNameOrDescriptionOrCompetition: string;
  coachScope?: CoachEventScope;
}

export interface EventFormValues {
  description: string;
  date: string;
  duration: number;
  modalityId: number;
  complexId: number | null;
  competitionId: number | null;
}

export interface EventTeamFormValues {
  result: string;
  numericResult: string;
}

export interface EventStats {
  total: number;
  future: number;
  inProgress: number;
  past: number;
}