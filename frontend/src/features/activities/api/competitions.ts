import { httpClient } from "../../../lib/api/http-client";
import {
  buildCompetitionQueryString,
  mapCompetitionResponse,
  mapCompetitionSummaryResponse,
  mapCompetitionTeamResponse,
} from "../model/competition/competition.mappers";
import type {
  Competition,
  CompetitionFilters,
  CompetitionResponseDto,
  CompetitionSummary,
  CompetitionSummaryResponseDto,
  CompetitionTeam,
  CompetitionTeamResponseDto,
  CreateCompetitionRequestDto,
  EnrollTeamRequestDto,
  UpdateCompetitionRequestDto,
  UpdateCompetitionTeamRequestDto,
} from "../model/competition/competition.types";

async function listCompetitions(
  filters: CompetitionFilters,
): Promise<CompetitionSummary[]> {
  const response = await httpClient.get<CompetitionSummaryResponseDto[]>(
    `api/competitions${buildCompetitionQueryString(filters)}`,
  );

  return response.map(mapCompetitionSummaryResponse);
}

async function listCoachCompetitions(
  coachId: number,
  filters: CompetitionFilters,
): Promise<CompetitionSummary[]> {
  const response = await httpClient.get<CompetitionSummaryResponseDto[]>(
    `api/coaches/${coachId}/competitions${buildCompetitionQueryString(filters)}`,
  );

  return response.map(mapCompetitionSummaryResponse);
}

async function listAthleteCompetitions(
  athleteId: number,
  filters: CompetitionFilters,
): Promise<CompetitionSummary[]> {
  const response = await httpClient.get<CompetitionSummaryResponseDto[]>(
    `api/athletes/${athleteId}/competitions${buildCompetitionQueryString(filters)}`,
  );

  return response.map(mapCompetitionSummaryResponse);
}

async function getCompetition(competitionId: number): Promise<Competition> {
  const response = await httpClient.get<CompetitionResponseDto>(
    `api/competitions/${competitionId}`,
  );

  return mapCompetitionResponse(response);
}

async function createCompetition(
  payload: CreateCompetitionRequestDto,
): Promise<Competition> {
  const response = await httpClient.post<CompetitionResponseDto>(
    "api/competitions",
    payload,
  );

  return mapCompetitionResponse(response);
}

async function updateCompetition(
  competitionId: number,
  payload: UpdateCompetitionRequestDto,
): Promise<void> {
  await httpClient.put<void>(`api/competitions/${competitionId}`, payload);
}

async function deleteCompetition(competitionId: number): Promise<void> {
  await httpClient.delete<void>(`api/competitions/${competitionId}`);
}

async function listCompetitionTeams(
  competitionId: number,
): Promise<CompetitionTeam[]> {
  const response = await httpClient.get<CompetitionTeamResponseDto[]>(
    `api/competitions/${competitionId}/teams`,
  );

  return response.map(mapCompetitionTeamResponse);
}

async function enrollCompetitionTeam(
  competitionId: number,
  payload: EnrollTeamRequestDto,
): Promise<CompetitionTeam> {
  const response = await httpClient.post<CompetitionTeamResponseDto>(
    `api/competitions/${competitionId}/teams`,
    payload,
  );

  return mapCompetitionTeamResponse(response);
}

async function updateCompetitionTeam(
  competitionTeamId: number,
  payload: UpdateCompetitionTeamRequestDto,
): Promise<void> {
  await httpClient.put<void>(
    `api/competition-teams/${competitionTeamId}`,
    payload,
  );
}

async function unenrollCompetitionTeam(
  competitionId: number,
  teamId: number,
): Promise<void> {
  await httpClient.delete<void>(
    `api/competitions/${competitionId}/teams/${teamId}`,
  );
}

export {
  createCompetition,
  deleteCompetition,
  enrollCompetitionTeam,
  getCompetition,
  listAthleteCompetitions,
  listCoachCompetitions,
  listCompetitionTeams,
  listCompetitions,
  unenrollCompetitionTeam,
  updateCompetition,
  updateCompetitionTeam,
};