import type {
  AddTeamMemberFormValues,
  AddTeamMemberRequestDto,
  CreateTeamRequestDto,
  EndMembershipFormValues,
  EndMembershipRequestDto,
  Team,
  TeamFilterValues,
  TeamFormValues,
  TeamMember,
  TeamMemberResponseDto,
  TeamResponseDto,
  TeamSummary,
  TeamSummaryResponseDto,
  UpdateTeamRequestDto,
} from "./team.types";

function mapTeamMemberResponse(dto: TeamMemberResponseDto): TeamMember {
  return {
    id: dto.id,
    version: dto.version,
    teamId: dto.teamId,
    teamName: dto.teamName,
    personId: dto.personId,
    personName: dto.personName,
    relationship: dto.relationship,
    startDate: dto.startDate,
    endDate: dto.endDate,
  };
}

function mapTeamSummaryResponse(dto: TeamSummaryResponseDto): TeamSummary {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    teamType: dto.teamType,
    seasonYear: dto.seasonYear,
    active: dto.active,
    modalityId: dto.modalityId,
    modalityName: dto.modalityName,
    athleteCount: dto.athleteCount,
    coachCount: dto.coachCount,
  };
}

function mapTeamResponse(dto: TeamResponseDto): Team {
  const members = dto.members.map(mapTeamMemberResponse);

  const athleteCount = members.filter(
    (member) => member.relationship === "ATHLETE" && member.endDate === null,
  ).length;

  const coachCount = members.filter(
    (member) => member.relationship === "COACH" && member.endDate === null,
  ).length;

  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    teamType: dto.teamType,
    seasonYear: dto.seasonYear,
    active: dto.active,
    modalityId: dto.modalityId,
    modalityName: dto.modalityName,
    athleteCount,
    coachCount,
    members,
  };
}

function mapCreateTeamRequest(values: TeamFormValues): CreateTeamRequestDto {
  return {
    name: values.name.trim(),
    teamType: values.teamType,
    seasonYear: values.seasonYear.trim(),
    active: values.active,
    modalityId: values.modalityId,
  };
}

function mapUpdateTeamRequest(
  values: TeamFormValues,
  version: number,
): UpdateTeamRequestDto {
  return {
    version,
    name: values.name.trim(),
    teamType: values.teamType,
    seasonYear: values.seasonYear.trim(),
    active: values.active,
    modalityId: values.modalityId,
  };
}

function mapAddTeamMemberRequest(
  values: AddTeamMemberFormValues,
): AddTeamMemberRequestDto {
  return {
    personId: values.personId,
    startDate: values.startDate,
  };
}

function mapEndMembershipRequest(
  values: EndMembershipFormValues,
  version: number,
): EndMembershipRequestDto {
  return {
    version,
    endDate: values.endDate,
  };
}

function buildTeamQueryString(filters: TeamFilterValues): string {
  const searchParams = new URLSearchParams();

  if (filters.modalityId && filters.modalityId > 0) {
    searchParams.set("idModality", String(filters.modalityId));
  }

  if (filters.teamType !== "ALL") {
    searchParams.set("teamType", filters.teamType);
  }

  if (filters.active !== "ALL") {
    searchParams.set("active", String(filters.active === "ACTIVE"));
  }

  if (typeof filters.freeTrainingEligible === "boolean") {
    searchParams.set(
      "freeTrainingEligible",
      String(filters.freeTrainingEligible),
    );
  }

  const normalizedSearch = filters.teamOrModalityName.trim();

  if (normalizedSearch) {
    searchParams.set("teamOrModalityName", normalizedSearch);
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export {
  buildTeamQueryString,
  mapAddTeamMemberRequest,
  mapCreateTeamRequest,
  mapEndMembershipRequest,
  mapTeamMemberResponse,
  mapTeamResponse,
  mapTeamSummaryResponse,
  mapUpdateTeamRequest,
};