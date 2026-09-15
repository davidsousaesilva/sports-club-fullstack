import { httpClient } from "../../../lib/api/http-client";
import {
  buildTeamQueryString,
  mapTeamMemberResponse,
  mapTeamResponse,
  mapTeamSummaryResponse,
} from "../model/team.mappers";
import type {
  AddTeamMemberRequestDto,
  CreateTeamRequestDto,
  EndMembershipRequestDto,
  Team,
  TeamFilterValues,
  TeamMember,
  TeamMemberResponseDto,
  TeamResponseDto,
  TeamSummary,
  TeamSummaryResponseDto,
  UpdateTeamRequestDto,
} from "../model/team.types";

async function listTeams(filters: TeamFilterValues): Promise<TeamSummary[]> {
  const response = await httpClient.get<TeamSummaryResponseDto[]>(
    `api/teams${buildTeamQueryString(filters)}`,
  );

  return response.map(mapTeamSummaryResponse);
}

async function listCoachTeams(
  coachId: number,
  filters: TeamFilterValues,
): Promise<TeamSummary[]> {
  const response = await httpClient.get<TeamSummaryResponseDto[]>(
    `api/coaches/${coachId}/teams${buildTeamQueryString(filters)}`,
  );

  return response.map(mapTeamSummaryResponse);
}

async function listAthleteTeams(
  athleteId: number,
  filters: TeamFilterValues,
): Promise<TeamSummary[]> {
  const response = await httpClient.get<TeamSummaryResponseDto[]>(
    `api/athletes/${athleteId}/teams${buildTeamQueryString(filters)}`,
  );

  return response.map(mapTeamSummaryResponse);
}

async function getTeam(teamId: number): Promise<Team> {
  const response = await httpClient.get<TeamResponseDto>(`api/teams/${teamId}`);

  return mapTeamResponse(response);
}

async function createTeam(payload: CreateTeamRequestDto): Promise<Team> {
  const response = await httpClient.post<TeamResponseDto>("api/teams", payload);

  return mapTeamResponse(response);
}

async function updateTeam(
  teamId: number,
  payload: UpdateTeamRequestDto,
): Promise<void> {
  await httpClient.put<void>(`api/teams/${teamId}`, payload);
}

async function addAthlete(
  teamId: number,
  payload: AddTeamMemberRequestDto,
): Promise<TeamMember> {
  const response = await httpClient.post<TeamMemberResponseDto>(
    `api/teams/${teamId}/athletes`,
    payload,
  );

  return mapTeamMemberResponse(response);
}

async function addCoach(
  teamId: number,
  payload: AddTeamMemberRequestDto,
): Promise<TeamMember> {
  const response = await httpClient.post<TeamMemberResponseDto>(
    `api/teams/${teamId}/coaches`,
    payload,
  );

  return mapTeamMemberResponse(response);
}

async function endMembership(
  teamMemberId: number,
  payload: EndMembershipRequestDto,
): Promise<void> {
  await httpClient.post<void>(
    `api/team-members/${teamMemberId}/termination`,
    payload,
  );
}

export {
  addAthlete,
  addCoach,
  createTeam,
  endMembership,
  getTeam,
  listAthleteTeams,
  listCoachTeams,
  listTeams,
  updateTeam,
};