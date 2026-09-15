import type { StatisticType } from "../../../sportscore/model/club-settings.types";
import type {
  Event,
  EventFilters,
  EventSummary,
  EventTeam,
} from "./event.types";
import { resolveEventTemporalStatus } from "./event.mappers";

const defaultStatsTypes: StatisticType[] = [
  {
    id: 1,
    version: 0,
    name: "Goals scored",
    unit: "goals",
    mandatory: true,
  },
  {
    id: 2,
    version: 0,
    name: "Assists",
    unit: "assists",
    mandatory: false,
  },
];

const mockEvents: Event[] = [
  {
    id: 1,
    version: 0,
    description: "Football U13 semifinal",
    date: "2026-06-12T10:00:00",
    duration: 90,
    modalityId: 1,
    modalityName: "Football",
    complexId: 1,
    complexName: "Main Stadium",
    competitionId: 1,
    competitionName: "Football Youth Cup",
    teamsCount: 1,
    presentAthletesPercent: 92,
    performanceEntriesPercent: 80,
    teams: [
      {
        id: 1,
        version: 0,
        result: "Win",
        numericResult: "3",
        eventId: 1,
        teamId: 101,
        teamName: "Football U13",
      },
    ],
    members: {
      101: [
        {
          id: 1,
          personId: 41,
          personName: "João Martins",
        },
      ],
    },
    statsTypes: defaultStatsTypes,
  },
  {
    id: 2,
    version: 0,
    description: "100m freestyle final",
    date: "2026-04-11T18:30:00",
    duration: 60,
    modalityId: 2,
    modalityName: "Swimming",
    complexId: 2,
    complexName: "Municipal Pool",
    competitionId: 2,
    competitionName: "Swimming Regional Meet",
    teamsCount: 1,
    presentAthletesPercent: 100,
    performanceEntriesPercent: 70,
    teams: [
      {
        id: 2,
        version: 0,
        result: "2nd place",
        numericResult: "52.31",
        eventId: 2,
        teamId: 201,
        teamName: "Swimming Competition Group",
      },
    ],
    members: {
      201: [
        {
          id: 2,
          personId: 43,
          personName: "Gonçalo Silva",
        },
      ],
    },
    statsTypes: defaultStatsTypes,
  },
];

function filterEvents(items: Event[], filters: EventFilters) {
  const search = filters.eventNameOrDescriptionOrCompetition
    .trim()
    .toLowerCase();

  return items.filter((item) => {
    const matchesCompetition =
      filters.competitionId === undefined ||
      item.competitionId === filters.competitionId;

    const matchesStatus =
      filters.status === "ALL" ||
      resolveEventTemporalStatus(item.date) === filters.status;

    const matchesSearch =
      search.length === 0 ||
      item.description.toLowerCase().includes(search) ||
      (item.competitionName ?? "").toLowerCase().includes(search);

    return matchesCompetition && matchesStatus && matchesSearch;
  });
}

function listMockEventSummaries(filters: EventFilters): EventSummary[] {
  return filterEvents(mockEvents, filters).map((item) => ({
    id: item.id,
    version: item.version,
    description: item.description,
    date: item.date,
    duration: item.duration,
    modalityId: item.modalityId,
    modalityName: item.modalityName,
    complexId: item.complexId,
    complexName: item.complexName,
    competitionId: item.competitionId,
    competitionName: item.competitionName,
    teamsCount: item.teams.length,
    presentAthletesPercent: item.presentAthletesPercent,
    performanceEntriesPercent: item.performanceEntriesPercent,
  }));
}

function listMockCompetitionEventSummaries(
  competitionId: number,
): EventSummary[] {
  return listMockEventSummaries({
    competitionId,
    status: "ALL",
    eventNameOrDescriptionOrCompetition: "",
  });
}

function listMockCoachEventSummaries(
  _coachId: number,
  filters: EventFilters,
): EventSummary[] {
  return listMockEventSummaries(filters);
}

function listMockAthleteEventSummaries(
  _athleteId: number,
  filters: EventFilters,
): EventSummary[] {
  return listMockEventSummaries(filters);
}

function getMockEvent(eventId: number): Event {
  return (
    mockEvents.find((item) => item.id === eventId) ?? {
      id: eventId,
      version: 0,
      description: "Unknown event",
      date: "2026-01-01T10:00:00",
      duration: 60,
      modalityId: 0,
      modalityName: "Unknown modality",
      complexId: null,
      complexName: null,
      competitionId: null,
      competitionName: null,
      teamsCount: 0,
      presentAthletesPercent: null,
      performanceEntriesPercent: null,
      teams: [],
      members: {},
      statsTypes: [],
    }
  );
}

function createMockEvent(
  input: Omit<
    Event,
    | "id"
    | "version"
    | "teams"
    | "members"
    | "statsTypes"
    | "teamsCount"
    | "presentAthletesPercent"
    | "performanceEntriesPercent"
  >,
): Event {
  const item: Event = {
    id: Date.now(),
    version: 0,
    ...input,
    teamsCount: 0,
    presentAthletesPercent: null,
    performanceEntriesPercent: null,
    teams: [],
    members: {},
    statsTypes: defaultStatsTypes,
  };

  mockEvents.unshift(item);
  return item;
}

function updateMockEvent(
  eventId: number,
  input: Omit<
    Event,
    | "id"
    | "version"
    | "teams"
    | "members"
    | "statsTypes"
    | "teamsCount"
    | "presentAthletesPercent"
    | "performanceEntriesPercent"
  >,
) {
  const index = mockEvents.findIndex((item) => item.id === eventId);

  if (index === -1) {
    return;
  }

  mockEvents[index] = {
    ...mockEvents[index],
    ...input,
    version: mockEvents[index].version + 1,
    teamsCount: mockEvents[index].teams.length,
  };
}

function deleteMockEvent(eventId: number) {
  const index = mockEvents.findIndex((item) => item.id === eventId);
  if (index >= 0) {
    mockEvents.splice(index, 1);
  }
}

function enrollMockEventTeam(input: {
  eventId: number;
  teamId: number;
  teamName: string;
}): EventTeam {
  const event = mockEvents.find((item) => item.id === input.eventId);

  if (!event) {
    throw new Error("Event not found.");
  }

  const team: EventTeam = {
    id: Date.now(),
    version: 0,
    result: "",
    numericResult: "",
    eventId: input.eventId,
    teamId: input.teamId,
    teamName: input.teamName,
  };

  event.teams.push(team);
  event.teamsCount = event.teams.length;
  event.members[input.teamId] = [];
  return team;
}

function updateMockEventTeam(
  eventTeamId: number,
  input: {
    result: string;
    numericResult: string;
  },
) {
  mockEvents.forEach((event) => {
    const index = event.teams.findIndex((item) => item.id === eventTeamId);

    if (index >= 0) {
      event.teams[index] = {
        ...event.teams[index],
        ...input,
        version: event.teams[index].version + 1,
      };
    }
  });
}

function unenrollMockEventTeam(eventId: number, teamId: number) {
  const event = mockEvents.find((item) => item.id === eventId);

  if (!event) {
    return;
  }

  event.teams = event.teams.filter((item) => item.teamId !== teamId);
  event.teamsCount = event.teams.length;
  delete event.members[teamId];
}

export {
  createMockEvent,
  deleteMockEvent,
  enrollMockEventTeam,
  getMockEvent,
  listMockAthleteEventSummaries,
  listMockCoachEventSummaries,
  listMockCompetitionEventSummaries,
  listMockEventSummaries,
  unenrollMockEventTeam,
  updateMockEvent,
  updateMockEventTeam,
};