import type { Modality } from "./modalities.types";

const mockModalities: Modality[] = [
  {
    id: 1,
    name: "Football",
    eventType: "MATCH",
    description: "Competitive team sport with regular training sessions.",
    trained: true,
    maxWeeklyAttendances: 2,
    statisticTypes: [
      { id: 1, name: "Goals scored", unit: "goals", mandatory: true },
      { id: 2, name: "Assists", unit: "assists", mandatory: false },
    ],
    prices: [
      {
        id: "1",
        registrationFee: 45,
        monthlyFee: 30,
        ageMin: 8,
        ageMax: 12,
      },
      {
        id: "2",
        registrationFee: 60,
        monthlyFee: 40,
        ageMin: 13,
        ageMax: 18,
      },
    ],
    teams: [
      {
        id: 101,
        name: "Football U13",
        teamType: "YOUTH",
        seasonYear: "2025/2026",
        active: true,
        modalityId: 1,
        modalityName: "Football",
      },
      {
        id: 102,
        name: "Football Seniors",
        teamType: "SENIOR",
        seasonYear: "2025/2026",
        active: true,
        modalityId: 1,
        modalityName: "Football",
      },
    ],
  },
  {
    id: 2,
    name: "Swimming",
    eventType: "RACE",
    description: "Individual modality focused on technique and timed events.",
    trained: true,
    maxWeeklyAttendances: 0,
    statisticTypes: [
      { id: 1, name: "Goals scored", unit: "goals", mandatory: true },
      { id: 3, name: "Average speed", unit: "km/h", mandatory: false },
    ],
    prices: [
      {
        id: "3",
        registrationFee: 35,
        monthlyFee: 27.5,
        ageMin: null,
        ageMax: null,
      },
    ],
    teams: [
      {
        id: 201,
        name: "Swimming Competition Group",
        teamType: "COMPETITION",
        seasonYear: "2025/2026",
        active: true,
        modalityId: 2,
        modalityName: "Swimming",
      },
    ],
  },
  {
    id: 3,
    name: "Gym Access",
    eventType: "SESSION",
    description: "Free attendance modality without fixed training schedule.",
    trained: false,
    maxWeeklyAttendances: 3,
    statisticTypes: [],
    prices: [
      {
        id: "4",
        registrationFee: 20,
        monthlyFee: 18,
        ageMin: null,
        ageMax: null,
      },
    ],
    teams: [],
  },
];

export { mockModalities };
