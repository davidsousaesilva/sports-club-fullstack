export type CompetitionTemporalStatus =
  | "ALL"
  | "FUTURE"
  | "IN_PROGRESS"
  | "PAST";

export type CoachCompetitionScope = "ALL" | "MINE";

export interface CompetitionSummaryResponseDto {
  id: number;
  version: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  idModality: number;
  modalityName: string;
  registredTeams: number;
  eventCount: number;
}

export interface CompetitionTeamResponseDto {
  id: number;
  version: number;
  note: string | null;
  finalResult: string | null;
  resultPoints: number | null;
  idCompetition: number;
  idTeam: number;
  teamName: string;
}

export interface CompetitionEventSummary {
  id: number;
  version?: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface CompetitionResponseDto {
  id: number;
  version: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  idModality: number;
  modalityName: string;
  registeredTeams: CompetitionTeamResponseDto[];
  events: CompetitionEventSummary[];
}

export interface CreateCompetitionRequestDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  modalityId: number;
}

export interface UpdateCompetitionRequestDto {
  version: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  modalityId: number;
}

export interface EnrollTeamRequestDto {
  teamId: number;
}

export interface UpdateCompetitionTeamRequestDto {
  version: number;
  note: string;
  finalResult: string;
  resultPoints: number | null;
}

export interface CompetitionSummary {
  id: number;
  version: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  modalityId: number;
  modalityName: string;
  registeredTeamsCount: number;
  eventCount: number;
}

export interface CompetitionTeam {
  id: number;
  version: number;
  note: string;
  finalResult: string;
  resultPoints: number | null;
  competitionId: number;
  teamId: number;
  teamName: string;
}

export interface Competition extends CompetitionSummary {
  registeredTeams: CompetitionTeam[];
  events: CompetitionEventSummary[];
}

export interface CompetitionFilters {
  modalityId?: number;
  status: CompetitionTemporalStatus;
  competitionNameOrDescriptionOrModality: string;
  coachScope?: CoachCompetitionScope;
}

export interface CompetitionFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  modalityId: number;
}

export interface CompetitionTeamFormValues {
  note: string;
  finalResult: string;
  resultPoints: number | null;
}

export interface CompetitionStats {
  total: number;
  future: number;
  inProgress: number;
  past: number;
}