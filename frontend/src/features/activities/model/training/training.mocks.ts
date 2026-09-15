import type {
  Attendance,
  Performance,
} from "../../../activity-tracking/model/activity-records.types";
import type {
  Training,
  TrainingFilters,
  TrainingSummary,
} from "./training.types";
import { resolveTrainingTemporalStatus } from "./training.mappers";

let mockTrainings: Training[] = [
  {
    id: 701,
    description: "Strength and conditioning block",
    note: "Focus on acceleration and lower body stability.",
    date: "2026-05-08T18:30:00",
    duration: 90,
    complexId: 1,
    complexName: "Main Sports Complex",
    teamId: 101,
    teamName: "U17 Main Squad",
    presentAthletesPercent: 50,
    performanceEntriesPercent: 66.67,
    members: [
      {
        id: 9001,
        personId: 41,
        personName: "João Martins",
        relationship: "ATHLETE",
        startDate: "2025-08-20T00:00:00",
        endDate: null,
      },
      {
        id: 9002,
        personId: 42,
        personName: "Pedro Costa",
        relationship: "ATHLETE",
        startDate: "2025-08-21T00:00:00",
        endDate: null,
      },
      {
        id: 9003,
        personId: 11,
        personName: "Ricardo Almeida",
        relationship: "COACH",
        startDate: "2025-08-19T00:00:00",
        endDate: null,
      },
    ],
    statisticTypes: [
      { id: 1, name: "Rating", unit: "pts" },
      { id: 2, name: "Sprints", unit: "rep" },
      { id: 3, name: "Completed passes", unit: "rep" },
    ],
  },
  {
    id: 702,
    description: "Technical drills",
    note: "Short possession exercises and finishing.",
    date: "2026-05-06T20:00:00",
    duration: 75,
    complexId: 1,
    complexName: "Main Sports Complex",
    teamId: 103,
    teamName: "Junior Development",
    presentAthletesPercent: 50,
    performanceEntriesPercent: 50,
    members: [
      {
        id: 9004,
        personId: 43,
        personName: "Gonçalo Silva",
        relationship: "ATHLETE",
        startDate: "2025-08-28T00:00:00",
        endDate: null,
      },
      {
        id: 9005,
        personId: 44,
        personName: "Miguel Sousa",
        relationship: "ATHLETE",
        startDate: "2025-08-28T00:00:00",
        endDate: null,
      },
      {
        id: 9006,
        personId: 12,
        personName: "Marta Ribeiro",
        relationship: "COACH",
        startDate: "2025-08-20T00:00:00",
        endDate: null,
      },
    ],
    statisticTypes: [
      { id: 1, name: "Rating", unit: "pts" },
      { id: 4, name: "Shots on target", unit: "rep" },
    ],
  },
];

let mockAttendances: Attendance[] = [
  {
    id: 3001,
    present: true,
    trainingId: 701,
    eventId: null,
    athleteId: 41,
    athleteName: "João Martins",
    freeTraining: false,
    teamId: 101,
    teamName: "U17 Main Squad",
    date: "2026-05-08T18:30:00",
  },
  {
    id: 3002,
    present: false,
    trainingId: 701,
    eventId: null,
    athleteId: 42,
    athleteName: "Pedro Costa",
    freeTraining: false,
    teamId: 101,
    teamName: "U17 Main Squad",
    date: "2026-05-08T18:30:00",
  },
  {
    id: 3003,
    present: true,
    trainingId: 702,
    eventId: null,
    athleteId: 43,
    athleteName: "Gonçalo Silva",
    freeTraining: false,
    teamId: 103,
    teamName: "Junior Development",
    date: "2026-05-06T20:00:00",
  },
];

let mockPerformances: Performance[] = [
  {
    id: 4001,
    value: 8.5,
    note: "Strong intensity and consistency.",
    statisticTypeId: 1,
    statisticTypeName: "Rating",
    statisticTypeUnit: "pts",
    athleteId: 41,
    athleteName: "João Martins",
    coachId: 11,
    coachName: "Ricardo Almeida",
    trainingId: 701,
    eventId: null,
  },
  {
    id: 4002,
    value: 12,
    note: "Good acceleration on repeated runs.",
    statisticTypeId: 2,
    statisticTypeName: "Sprints",
    statisticTypeUnit: "rep",
    athleteId: 41,
    athleteName: "João Martins",
    coachId: 11,
    coachName: "Ricardo Almeida",
    trainingId: 701,
    eventId: null,
  },
];

function toTrainingSummary(training: Training): TrainingSummary {
  return {
    id: training.id,
    description: training.description,
    note: training.note,
    date: training.date,
    duration: training.duration,
    complexId: training.complexId,
    complexName: training.complexName,
    teamId: training.teamId,
    teamName: training.teamName,
    presentAthletesPercent: training.presentAthletesPercent,
    performanceEntriesPercent: training.performanceEntriesPercent,
  };
}

function filterMockTrainings(filters: TrainingFilters): Training[] {
  const normalizedSearch = filters.trainingDescriptionOrTeam
    .trim()
    .toLowerCase();

  return mockTrainings.filter((training) => {
    const matchesTeam = !filters.teamId || training.teamId === filters.teamId;
    const matchesComplex =
      !filters.complexId || training.complexId === filters.complexId;
    const matchesStatus =
      filters.status === "ALL" ||
      resolveTrainingTemporalStatus(training.date) === filters.status;
    const matchesSearch =
      !normalizedSearch ||
      training.description.toLowerCase().includes(normalizedSearch) ||
      training.teamName.toLowerCase().includes(normalizedSearch);

    return matchesTeam && matchesComplex && matchesStatus && matchesSearch;
  });
}

function filterMockTrainingsByMember(
  personId: number,
  relationship: "COACH" | "ATHLETE",
  filters: TrainingFilters,
): Training[] {
  return filterMockTrainings(filters).filter((training) =>
    training.members.some(
      (member) =>
        member.personId === personId &&
        member.relationship === relationship &&
        member.endDate === null,
    ),
  );
}

function listMockTrainings(filters: TrainingFilters): TrainingSummary[] {
  return filterMockTrainings(filters).map(toTrainingSummary);
}

function listMockCoachTrainings(
  coachId: number,
  filters: TrainingFilters,
): TrainingSummary[] {
  return filterMockTrainingsByMember(coachId, "COACH", filters).map(
    toTrainingSummary,
  );
}

function listMockAthleteTrainings(
  athleteId: number,
  filters: TrainingFilters,
): TrainingSummary[] {
  return filterMockTrainingsByMember(athleteId, "ATHLETE", filters).map(
    toTrainingSummary,
  );
}

function getMockTraining(trainingId: number): Training {
  const training = mockTrainings.find((item) => item.id === trainingId);

  if (!training) {
    throw new Error("Training not found.");
  }

  return training;
}

function listMockAttendances(trainingId: number): Attendance[] {
  return mockAttendances.filter(
    (attendance) => attendance.trainingId === trainingId,
  );
}

function saveMockAttendance(input: {
  trainingId: number;
  athleteId: number;
  present: boolean;
  teamId: number;
  teamName: string;
  athleteName: string;
}): void {
  const existing = mockAttendances.find(
    (attendance) =>
      attendance.trainingId === input.trainingId &&
      attendance.athleteId === input.athleteId,
  );

  const training = getMockTraining(input.trainingId);

  if (existing) {
    mockAttendances = mockAttendances.map((attendance) =>
      attendance.id === existing.id
        ? { ...attendance, present: input.present }
        : attendance,
    );
    return;
  }

  mockAttendances = [
    {
      id: Date.now(),
      present: input.present,
      trainingId: input.trainingId,
      eventId: null,
      athleteId: input.athleteId,
      athleteName: input.athleteName,
      freeTraining: false,
      teamId: input.teamId,
      teamName: input.teamName,
      date: training.date,
    },
    ...mockAttendances,
  ];
}

function listMockPerformances(trainingId: number): Performance[] {
  return mockPerformances.filter(
    (performance) => performance.trainingId === trainingId,
  );
}

function saveMockPerformances(input: {
  trainingId: number;
  athleteId: number;
  athleteName: string;
  entries: {
    statisticTypeId: number;
    value: number;
    note: string;
    statisticTypeName: string;
    statisticTypeUnit: string;
  }[];
}): void {
  mockPerformances = mockPerformances.filter(
    (performance) =>
      !(
        performance.trainingId === input.trainingId &&
        performance.athleteId === input.athleteId &&
        input.entries.some(
          (entry) => entry.statisticTypeId === performance.statisticTypeId,
        )
      ),
  );

  const newItems: Performance[] = input.entries.map((entry) => ({
    id: Date.now() + entry.statisticTypeId,
    value: entry.value,
    note: entry.note,
    statisticTypeId: entry.statisticTypeId,
    statisticTypeName: entry.statisticTypeName,
    statisticTypeUnit: entry.statisticTypeUnit,
    athleteId: input.athleteId,
    athleteName: input.athleteName,
    coachId: null,
    coachName: null,
    trainingId: input.trainingId,
    eventId: null,
  }));

  mockPerformances = [...newItems, ...mockPerformances];
}

export {
  getMockTraining,
  listMockAthleteTrainings,
  listMockAttendances,
  listMockCoachTrainings,
  listMockPerformances,
  listMockTrainings,
  saveMockAttendance,
  saveMockPerformances,
};
