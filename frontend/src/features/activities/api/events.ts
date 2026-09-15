import { httpClient } from "../../../lib/api/http-client";
import {
  buildEventQueryString,
  mapEventResponse,
  mapEventSummaryResponse,
  mapEventTeamResponse,
} from "../model/event/event.mappers";
import type {
  CreateEventRequestDto,
  EnrollEventTeamRequestDto,
  Event,
  EventFilters,
  EventResponseDto,
  EventSummary,
  EventSummaryResponseDto,
  EventTeam,
  EventTeamResponseDto,
  UpdateEventRequestDto,
  UpdateEventTeamRequestDto,
} from "../model/event/event.types";

async function listEvents(filters: EventFilters): Promise<EventSummary[]> {
  const response = await httpClient.get<EventSummaryResponseDto[]>(
    `api/events${buildEventQueryString(filters)}`,
  );

  return response.map(mapEventSummaryResponse);
}

async function listCoachEvents(
  coachId: number,
  filters: EventFilters,
): Promise<EventSummary[]> {
  const response = await httpClient.get<EventSummaryResponseDto[]>(
    `api/coaches/${coachId}/events${buildEventQueryString(filters)}`,
  );

  return response.map(mapEventSummaryResponse);
}

async function listAthleteEvents(
  athleteId: number,
  filters: EventFilters,
): Promise<EventSummary[]> {
  const response = await httpClient.get<EventSummaryResponseDto[]>(
    `api/athletes/${athleteId}/events${buildEventQueryString(filters)}`,
  );

  return response.map(mapEventSummaryResponse);
}

async function listCompetitionEvents(
  competitionId: number,
): Promise<EventSummary[]> {
  const response = await httpClient.get<EventSummaryResponseDto[]>(
    `api/competitions/${competitionId}/events`,
  );

  return response.map(mapEventSummaryResponse);
}

async function getEvent(eventId: number): Promise<Event> {
  const response = await httpClient.get<EventResponseDto>(
    `api/events/${eventId}`,
  );

  return mapEventResponse(response);
}

async function createEvent(payload: CreateEventRequestDto): Promise<Event> {
  const response = await httpClient.post<EventResponseDto>(
    "api/events",
    payload,
  );

  return mapEventResponse(response);
}

async function updateEvent(
  eventId: number,
  payload: UpdateEventRequestDto,
): Promise<void> {
  await httpClient.put<void>(`api/events/${eventId}`, payload);
}

async function deleteEvent(eventId: number): Promise<void> {
  await httpClient.delete<void>(`api/events/${eventId}`);
}

async function enrollEventTeam(
  eventId: number,
  payload: EnrollEventTeamRequestDto,
): Promise<EventTeam> {
  const response = await httpClient.post<EventTeamResponseDto>(
    `api/events/${eventId}/teams`,
    payload,
  );

  return mapEventTeamResponse(response);
}

async function updateEventTeam(
  eventTeamId: number,
  payload: UpdateEventTeamRequestDto,
): Promise<void> {
  await httpClient.put<void>(`api/event-teams/${eventTeamId}`, payload);
}

async function unenrollEventTeam(
  eventId: number,
  teamId: number,
): Promise<void> {
  await httpClient.delete<void>(`api/events/${eventId}/teams/${teamId}`);
}

export {
  createEvent,
  deleteEvent,
  enrollEventTeam,
  getEvent,
  listAthleteEvents,
  listCoachEvents,
  listCompetitionEvents,
  listEvents,
  unenrollEventTeam,
  updateEvent,
  updateEventTeam,
};