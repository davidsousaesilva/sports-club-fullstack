import type { Team, TeamMember, TeamSummary, TeamType } from "./team.types";

let mockTeamMembers: TeamMember[] = [
  {
    id: 1001,
    version: 0,
    teamId: 101,
    teamName: "Football U13",
    personId: 41,
    personName: "João Martins",
    relationship: "ATHLETE",
    startDate: "2025-08-20T10:00:00",
    endDate: null,
  },
  {
    id: 1002,
    version: 0,
    teamId: 101,
    teamName: "Football U13",
    personId: 42,
    personName: "Pedro Costa",
    relationship: "ATHLETE",
    startDate: "2025-08-22T10:00:00",
    endDate: null,
  },
  {
    id: 1003,
    version: 0,
    teamId: 101,
    teamName: "Football U13",
    personId: 11,
    personName: "Ricardo Almeida",
    relationship: "COACH",
    startDate: "2025-08-18T10:00:00",
    endDate: null,
  },
  {
    id: 1004,
    version: 0,
    teamId: 102,
    teamName: "Football Seniors",
    personId: 51,
    personName: "Tiago Fernandes",
    relationship: "ATHLETE",
    startDate: "2025-09-01T09:00:00",
    endDate: null,
  },
  {
    id: 1005,
    version: 0,
    teamId: 102,
    teamName: "Football Seniors",
    personId: 12,
    personName: "Marta Ribeiro",
    relationship: "COACH",
    startDate: "2025-09-01T09:00:00",
    endDate: null,
  },
  {
    id: 1006,
    version: 0,
    teamId: 201,
    teamName: "Swimming Competition Group",
    personId: 43,
    personName: "Gonçalo Silva",
    relationship: "ATHLETE",
    startDate: "2025-08-28T08:30:00",
    endDate: null,
  },
  {
    id: 1007,
    version: 0,
    teamId: 201,
    teamName: "Swimming Competition Group",
    personId: 13,
    personName: "Marta Sousa",
    relationship: "COACH",
    startDate: "2025-08-28T08:30:00",
    endDate: null,
  },
];

let mockTeams: Team[] = [
  {
    id: 101,
    version: 0,
    name: "Football U13",
    teamType: "TEAM",
    seasonYear: "2025/2026",
    active: true,
    modalityId: 1,
    modalityName: "Football",
    athleteCount: 2,
    coachCount: 1,
    members: mockTeamMembers.filter((member) => member.teamId === 101),
  },
  {
    id: 102,
    version: 0,
    name: "Football Seniors",
    teamType: "TEAM",
    seasonYear: "2025/2026",
    active: true,
    modalityId: 1,
    modalityName: "Football",
    athleteCount: 1,
    coachCount: 1,
    members: mockTeamMembers.filter((member) => member.teamId === 102),
  },
  {
    id: 201,
    version: 0,
    name: "Swimming Competition Group",
    teamType: "INDIVIDUAL",
    seasonYear: "2025/2026",
    active: true,
    modalityId: 2,
    modalityName: "Swimming",
    athleteCount: 1,
    coachCount: 1,
    members: mockTeamMembers.filter((member) => member.teamId === 201),
  },
];

function buildTeamSummary(
  team: Omit<Team, "athleteCount" | "coachCount">,
): TeamSummary {
  const athleteCount = team.members.filter(
    (member) => member.relationship === "ATHLETE" && member.endDate === null,
  ).length;

  const coachCount = team.members.filter(
    (member) => member.relationship === "COACH" && member.endDate === null,
  ).length;

  return {
    id: team.id,
    version: team.version,
    name: team.name,
    teamType: team.teamType,
    seasonYear: team.seasonYear,
    active: team.active,
    modalityId: team.modalityId,
    modalityName: team.modalityName,
    athleteCount,
    coachCount,
  };
}

function buildTeam(team: Omit<Team, "athleteCount" | "coachCount">): Team {
  const summary = buildTeamSummary(team);

  return {
    ...summary,
    members: team.members,
  };
}

function syncMockTeams(): void {
  mockTeams = mockTeams.map((team) =>
    buildTeam({
      id: team.id,
      version: team.version,
      name: team.name,
      teamType: team.teamType,
      seasonYear: team.seasonYear,
      active: team.active,
      modalityId: team.modalityId,
      modalityName: team.modalityName,
      members: mockTeamMembers.filter((member) => member.teamId === team.id),
    }),
  );
}

function filterMockTeams(filters: {
  modalityId?: number;
  teamType: TeamType | "ALL";
  active: "ALL" | "ACTIVE" | "INACTIVE";
  teamOrModalityName: string;
}): Team[] {
  const normalizedSearch = filters.teamOrModalityName.trim().toLowerCase();

  syncMockTeams();

  return mockTeams.filter((team) => {
    const matchesModality =
      !filters.modalityId || team.modalityId === filters.modalityId;

    const matchesType =
      filters.teamType === "ALL" || team.teamType === filters.teamType;

    const matchesActive =
      filters.active === "ALL" ||
      (filters.active === "ACTIVE" && team.active) ||
      (filters.active === "INACTIVE" && !team.active);

    const matchesSearch =
      normalizedSearch.length === 0 ||
      team.name.toLowerCase().includes(normalizedSearch) ||
      team.modalityName.toLowerCase().includes(normalizedSearch);

    return matchesModality && matchesType && matchesActive && matchesSearch;
  });
}

function filterMockTeamsByMember(
  personId: number,
  relationship: "COACH" | "ATHLETE",
  filters: Parameters<typeof filterMockTeams>[0],
): Team[] {
  return filterMockTeams(filters).filter((team) =>
    team.members.some(
      (member) =>
        member.personId === personId &&
        member.relationship === relationship &&
        member.endDate === null,
    ),
  );
}

function listMockTeamSummaries(
  filters: Parameters<typeof filterMockTeams>[0],
): TeamSummary[] {
  return filterMockTeams(filters).map((team) => buildTeamSummary(team));
}

function listMockCoachTeamSummaries(
  coachId: number,
  filters: Parameters<typeof filterMockTeams>[0],
): TeamSummary[] {
  return filterMockTeamsByMember(coachId, "COACH", filters).map((team) =>
    buildTeamSummary(team),
  );
}

function listMockAthleteTeamSummaries(
  athleteId: number,
  filters: Parameters<typeof filterMockTeams>[0],
): TeamSummary[] {
  return filterMockTeamsByMember(athleteId, "ATHLETE", filters).map((team) =>
    buildTeamSummary(team),
  );
}

function getMockTeam(teamId: number): Team {
  syncMockTeams();

  const team = mockTeams.find((item) => item.id === teamId);

  if (!team) {
    throw new Error("Team not found.");
  }

  return team;
}

function createMockTeam(input: {
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
  modalityName: string;
}): Team {
  const team = buildTeam({
    id: Date.now(),
    version: 0,
    name: input.name,
    teamType: input.teamType,
    seasonYear: input.seasonYear,
    active: input.active,
    modalityId: input.modalityId,
    modalityName: input.modalityName,
    members: [],
  });

  mockTeams = [team, ...mockTeams];
  syncMockTeams();

  return team;
}

function updateMockTeam(
  teamId: number,
  input: {
    name: string;
    teamType: TeamType;
    seasonYear: string;
    active: boolean;
    modalityId: number;
    modalityName: string;
  },
): void {
  mockTeams = mockTeams.map((team) =>
    team.id === teamId
      ? buildTeam({
          id: team.id,
          version: team.version + 1,
          name: input.name,
          teamType: input.teamType,
          seasonYear: input.seasonYear,
          active: input.active,
          modalityId: input.modalityId,
          modalityName: input.modalityName,
          members: team.members,
        })
      : team,
  );

  mockTeamMembers = mockTeamMembers.map((member) =>
    member.teamId === teamId ? { ...member, teamName: input.name } : member,
  );

  syncMockTeams();
}

function addMockTeamMember(input: {
  teamId: number;
  personId: number;
  personName: string;
  relationship: "ATHLETE" | "COACH";
  startDate: string;
}): TeamMember {
  const team = getMockTeam(input.teamId);

  const teamMember: TeamMember = {
    id: Date.now(),
    version: 0,
    teamId: input.teamId,
    teamName: team.name,
    personId: input.personId,
    personName: input.personName,
    relationship: input.relationship,
    startDate: input.startDate,
    endDate: null,
  };

  mockTeamMembers = [teamMember, ...mockTeamMembers];
  syncMockTeams();

  return teamMember;
}

function endMockMembership(teamMemberId: number, endDate: string): void {
  mockTeamMembers = mockTeamMembers.map((member) =>
    member.id === teamMemberId
      ? { ...member, version: member.version + 1, endDate }
      : member,
  );

  syncMockTeams();
}

export {
  addMockTeamMember,
  createMockTeam,
  endMockMembership,
  filterMockTeams,
  getMockTeam,
  listMockAthleteTeamSummaries,
  listMockCoachTeamSummaries,
  listMockTeamSummaries,
  updateMockTeam,
};