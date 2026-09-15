import type {
  CreateEventRequestDto,
  Event,
  EventFilters,
  EventFormValues,
  EventMember,
  EventMemberResponseDto,
  EventResponseDto,
  EventSummary,
  EventSummaryResponseDto,
  EventTeam,
  EventTeamFormValues,
  EventTeamResponseDto,
  UpdateEventRequestDto,
  UpdateEventTeamRequestDto,
} from "./event.types";

function mapEventTeamResponse(dto: EventTeamResponseDto): EventTeam {
  return {
    id: dto.id,
    version: dto.version,
    result: dto.result ?? "",
    numericResult: dto.numericResult ?? "",
    eventId: dto.idEvent,
    teamId: dto.idTeam,
    teamName: dto.teamName,
  };
}

function mapEventMemberResponse(dto: EventMemberResponseDto): EventMember {
  return {
    id: dto.id,
    personId: dto.personId,
    personName: dto.personName,
  };
}

function mapEventSummaryResponse(dto: EventSummaryResponseDto): EventSummary {
  return {
    id: dto.id,
    version: dto.version,
    description: dto.description,
    date: dto.date,
    duration: dto.duration,
    modalityId: dto.idModality,
    modalityName: dto.modalityName,
    complexId: dto.idComplex ?? null,
    complexName: dto.complexName ?? null,
    competitionId: dto.idCompetition ?? null,
    competitionName: dto.competitionName ?? null,
    teamsCount: dto.teams.length,
    presentAthletesPercent: dto.presentAthletesPercent ?? null,
    performanceEntriesPercent: dto.performanceEntriesPercent ?? null,
  };
}

function mapEventResponse(dto: EventResponseDto): Event {
  return {
    id: dto.id,
    version: dto.version,
    description: dto.description,
    date: dto.date,
    duration: dto.duration,
    modalityId: dto.idModality,
    modalityName: dto.modalityName,
    complexId: dto.idComplex ?? null,
    complexName: dto.complexName ?? null,
    competitionId: dto.idCompetition ?? null,
    competitionName: dto.competitionName ?? null,
    teamsCount: dto.teams.length,
    presentAthletesPercent: null,
    performanceEntriesPercent: null,
    teams: dto.teams.map(mapEventTeamResponse),
    members: Object.fromEntries(
      Object.entries(dto.members ?? {}).map(([teamId, members]) => [
        Number(teamId),
        members.map(mapEventMemberResponse),
      ]),
    ),
    statsTypes: dto.statsTypes ?? [],
  };
}

function mapEventFormToCreateRequest(
  values: EventFormValues,
): CreateEventRequestDto {
  return {
    description: values.description.trim(),
    date: values.date,
    duration: values.duration,
    modalityId: values.modalityId,
    complexId: values.complexId,
    competitionId: values.competitionId,
  };
}

function mapEventFormToUpdateRequest(
  values: EventFormValues,
  version: number,
): UpdateEventRequestDto {
  return {
    version,
    description: values.description.trim(),
    date: values.date,
    duration: values.duration,
    modalityId: values.modalityId,
    complexId: values.complexId,
    competitionId: values.competitionId,
  };
}

function mapEventTeamFormToRequest(
  values: EventTeamFormValues,
  version: number,
): UpdateEventTeamRequestDto {
  return {
    version,
    result: values.result.trim(),
    numericResult: values.numericResult.trim(),
  };
}

function buildEventQueryString(filters: EventFilters): string {
  const params = new URLSearchParams();

  if (filters.competitionId) {
    params.set("competitionId", String(filters.competitionId));
  }

  if (filters.status !== "ALL") {
    params.set("status", filters.status);
  }

  const search = filters.eventNameOrDescriptionOrCompetition.trim();
  if (search) {
    params.set("eventNameOrDescriptionOrCompetition", search);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function resolveEventTemporalStatus(
  date: string,
): "FUTURE" | "IN_PROGRESS" | "PAST" {
  const now = new Date();
  const eventDate = new Date(date);

  if (eventDate > now) {
    return "FUTURE";
  }

  const sameDay =
    eventDate.getFullYear() === now.getFullYear() &&
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getDate() === now.getDate();

  if (sameDay) {
    return "IN_PROGRESS";
  }

  return "PAST";
}

function toDateTimeLocalValue(value: string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export {
  buildEventQueryString,
  mapEventFormToCreateRequest,
  mapEventFormToUpdateRequest,
  mapEventResponse,
  mapEventSummaryResponse,
  mapEventTeamFormToRequest,
  mapEventTeamResponse,
  resolveEventTemporalStatus,
  toDateTimeLocalValue,
};