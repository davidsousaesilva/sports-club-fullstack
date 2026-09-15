import type {
  Competition,
  CompetitionFilters,
  CompetitionFormValues,
  CompetitionResponseDto,
  CompetitionSummary,
  CompetitionSummaryResponseDto,
  CompetitionTeam,
  CompetitionTeamFormValues,
  CompetitionTeamResponseDto,
  CreateCompetitionRequestDto,
  UpdateCompetitionRequestDto,
  UpdateCompetitionTeamRequestDto,
} from "./competition.types";

function mapCompetitionTeamResponse(
  dto: CompetitionTeamResponseDto,
): CompetitionTeam {
  return {
    id: dto.id,
    version: dto.version,
    note: dto.note ?? "",
    finalResult: dto.finalResult ?? "",
    resultPoints: dto.resultPoints ?? null,
    competitionId: dto.idCompetition,
    teamId: dto.idTeam,
    teamName: dto.teamName,
  };
}

function mapCompetitionSummaryResponse(
  dto: CompetitionSummaryResponseDto,
): CompetitionSummary {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    description: dto.description ?? "",
    startDate: dto.startDate,
    endDate: dto.endDate,
    registrationFee: dto.registrationFee,
    modalityId: dto.idModality,
    modalityName: dto.modalityName,
    registeredTeamsCount: dto.registredTeams,
    eventCount: dto.eventCount,
  };
}

function mapCompetitionResponse(dto: CompetitionResponseDto): Competition {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    description: dto.description ?? "",
    startDate: dto.startDate,
    endDate: dto.endDate,
    registrationFee: dto.registrationFee,
    modalityId: dto.idModality,
    modalityName: dto.modalityName,
    registeredTeamsCount: dto.registeredTeams.length,
    eventCount: dto.events.length,
    registeredTeams: dto.registeredTeams.map(mapCompetitionTeamResponse),
    events: dto.events,
  };
}

function mapCompetitionFormToCreateRequest(
  values: CompetitionFormValues,
): CreateCompetitionRequestDto {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    startDate: values.startDate,
    endDate: values.endDate,
    registrationFee: values.registrationFee,
    modalityId: values.modalityId,
  };
}

function mapCompetitionFormToUpdateRequest(
  values: CompetitionFormValues,
  version: number,
): UpdateCompetitionRequestDto {
  return {
    version,
    name: values.name.trim(),
    description: values.description.trim(),
    startDate: values.startDate,
    endDate: values.endDate,
    registrationFee: values.registrationFee,
    modalityId: values.modalityId,
  };
}

function mapCompetitionTeamFormToRequest(
  values: CompetitionTeamFormValues,
  version: number,
): UpdateCompetitionTeamRequestDto {
  return {
    version,
    note: values.note.trim(),
    finalResult: values.finalResult.trim(),
    resultPoints: values.resultPoints,
  };
}

function buildCompetitionQueryString(filters: CompetitionFilters): string {
  const params = new URLSearchParams();

  if (filters.modalityId) {
    params.set("modalityId", String(filters.modalityId));
  }

  if (filters.status !== "ALL") {
    params.set("status", filters.status);
  }

  const search = filters.competitionNameOrDescriptionOrModality.trim();
  if (search) {
    params.set("competitionNameOrDescriptionOrModality", search);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function resolveCompetitionTemporalStatus(
  startDate: string,
  endDate: string,
): "FUTURE" | "IN_PROGRESS" | "PAST" {
  const now = new Date();
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);

  if (start > now) {
    return "FUTURE";
  }

  if (end < now) {
    return "PAST";
  }

  return "IN_PROGRESS";
}

export {
  buildCompetitionQueryString,
  mapCompetitionFormToCreateRequest,
  mapCompetitionFormToUpdateRequest,
  mapCompetitionResponse,
  mapCompetitionSummaryResponse,
  mapCompetitionTeamFormToRequest,
  mapCompetitionTeamResponse,
  resolveCompetitionTemporalStatus,
};