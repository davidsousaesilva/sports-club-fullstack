import type {
  Competition,
  CompetitionFilters,
  CompetitionSummary,
  CompetitionTeam,
} from "./competition.types";
import { resolveCompetitionTemporalStatus } from "./competition.mappers";

const mockCompetitions: Competition[] = [
  {
    id: 1,
    version: 0,
    name: "Football Youth Cup",
    description: "Preparatory competition for youth football squads.",
    startDate: "2026-06-12",
    endDate: "2026-06-14",
    registrationFee: 15,
    modalityId: 1,
    modalityName: "Football",
    registeredTeamsCount: 1,
    eventCount: 1,
    registeredTeams: [
      {
        id: 1,
        version: 0,
        note: "Under-13 squad",
        finalResult: "",
        resultPoints: null,
        competitionId: 1,
        teamId: 101,
        teamName: "Football U13",
      },
    ],
    events: [
      {
        id: 1,
        version: 0,
        name: "Football U13 semifinal",
        startDate: "2026-06-12",
        endDate: "2026-06-12",
      },
    ],
  },
  {
    id: 2,
    version: 0,
    name: "Swimming Regional Meet",
    description: "Regional event for competition swimmers.",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    registrationFee: 25,
    modalityId: 2,
    modalityName: "Swimming",
    registeredTeamsCount: 1,
    eventCount: 1,
    registeredTeams: [
      {
        id: 2,
        version: 0,
        note: "",
        finalResult: "2nd place",
        resultPoints: 12,
        competitionId: 2,
        teamId: 201,
        teamName: "Swimming Competition Group",
      },
    ],
    events: [
      {
        id: 2,
        version: 0,
        name: "100m freestyle final",
        startDate: "2026-04-11",
        endDate: "2026-04-11",
      },
    ],
  },
];

function filterCompetitions(items: Competition[], filters: CompetitionFilters) {
  const search = filters.competitionNameOrDescriptionOrModality
    .trim()
    .toLowerCase();

  return items.filter((item) => {
    const matchesModality =
      filters.modalityId === undefined ||
      item.modalityId === filters.modalityId;

    const matchesStatus =
      filters.status === "ALL" ||
      resolveCompetitionTemporalStatus(item.startDate, item.endDate) ===
        filters.status;

    const matchesSearch =
      search.length === 0 ||
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.modalityName.toLowerCase().includes(search);

    return matchesModality && matchesStatus && matchesSearch;
  });
}

function listMockCompetitionSummaries(
  filters: CompetitionFilters,
): CompetitionSummary[] {
  return filterCompetitions(mockCompetitions, filters).map((item) => ({
    id: item.id,
    version: item.version,
    name: item.name,
    description: item.description,
    startDate: item.startDate,
    endDate: item.endDate,
    registrationFee: item.registrationFee,
    modalityId: item.modalityId,
    modalityName: item.modalityName,
    registeredTeamsCount: item.registeredTeams.length,
    eventCount: item.events.length,
  }));
}

function listMockCoachCompetitionSummaries(
  _coachId: number,
  filters: CompetitionFilters,
): CompetitionSummary[] {
  return listMockCompetitionSummaries(filters);
}

function listMockAthleteCompetitionSummaries(
  _athleteId: number,
  filters: CompetitionFilters,
): CompetitionSummary[] {
  return listMockCompetitionSummaries(filters);
}

function getMockCompetition(competitionId: number): Competition {
  return (
    mockCompetitions.find((item) => item.id === competitionId) ?? {
      id: competitionId,
      version: 0,
      name: "Unknown competition",
      description: "",
      startDate: "2026-01-01",
      endDate: "2026-01-01",
      registrationFee: 0,
      modalityId: 0,
      modalityName: "Unknown modality",
      registeredTeamsCount: 0,
      eventCount: 0,
      registeredTeams: [],
      events: [],
    }
  );
}

function createMockCompetition(
  input: Omit<
    Competition,
    | "id"
    | "version"
    | "registeredTeams"
    | "events"
    | "registeredTeamsCount"
    | "eventCount"
  >,
) {
  const item: Competition = {
    id: Date.now(),
    version: 0,
    ...input,
    registeredTeamsCount: 0,
    eventCount: 0,
    registeredTeams: [],
    events: [],
  };

  mockCompetitions.unshift(item);
  return item;
}

function updateMockCompetition(
  competitionId: number,
  input: Omit<
    Competition,
    | "id"
    | "version"
    | "registeredTeams"
    | "events"
    | "registeredTeamsCount"
    | "eventCount"
  >,
) {
  const index = mockCompetitions.findIndex((item) => item.id === competitionId);

  if (index === -1) {
    return;
  }

  mockCompetitions[index] = {
    ...mockCompetitions[index],
    ...input,
    version: mockCompetitions[index].version + 1,
    registeredTeamsCount: mockCompetitions[index].registeredTeams.length,
    eventCount: mockCompetitions[index].events.length,
  };
}

function deleteMockCompetition(competitionId: number) {
  const index = mockCompetitions.findIndex((item) => item.id === competitionId);

  if (index >= 0) {
    mockCompetitions.splice(index, 1);
  }
}

function enrollMockCompetitionTeam(input: {
  competitionId: number;
  teamId: number;
  teamName: string;
}): CompetitionTeam {
  const competition = mockCompetitions.find(
    (item) => item.id === input.competitionId,
  );

  if (!competition) {
    throw new Error("Competition not found.");
  }

  const team: CompetitionTeam = {
    id: Date.now(),
    version: 0,
    note: "",
    finalResult: "",
    resultPoints: null,
    competitionId: input.competitionId,
    teamId: input.teamId,
    teamName: input.teamName,
  };

  competition.registeredTeams.push(team);
  competition.registeredTeamsCount = competition.registeredTeams.length;
  return team;
}

function updateMockCompetitionTeam(
  competitionTeamId: number,
  input: {
    note: string;
    finalResult: string;
    resultPoints: number | null;
  },
) {
  mockCompetitions.forEach((competition) => {
    const index = competition.registeredTeams.findIndex(
      (item) => item.id === competitionTeamId,
    );

    if (index >= 0) {
      competition.registeredTeams[index] = {
        ...competition.registeredTeams[index],
        ...input,
        version: competition.registeredTeams[index].version + 1,
      };
    }
  });
}

function unenrollMockCompetitionTeam(competitionId: number, teamId: number) {
  const competition = mockCompetitions.find(
    (item) => item.id === competitionId,
  );

  if (!competition) {
    return;
  }

  competition.registeredTeams = competition.registeredTeams.filter(
    (item) => item.teamId !== teamId,
  );
  competition.registeredTeamsCount = competition.registeredTeams.length;
}

export {
  createMockCompetition,
  deleteMockCompetition,
  enrollMockCompetitionTeam,
  getMockCompetition,
  listMockAthleteCompetitionSummaries,
  listMockCoachCompetitionSummaries,
  listMockCompetitionSummaries,
  mockCompetitions,
  unenrollMockCompetitionTeam,
  updateMockCompetition,
  updateMockCompetitionTeam,
};