import type { SportReportResponseDto } from "./sports-report.types";

const sportsReportMockResponse: SportReportResponseDto = {
  totalAthletes: 148,
  totalCoaches: 16,
  totalActiveTeams: 9,
  attendanceRate: "87.40",
  trainingAttendanceEvolution: {
    january: {
      totalTrainings: 22,
      attendanceRate: "84.20",
    },
    february: {
      totalTrainings: 25,
      attendanceRate: "86.90",
    },
    march: {
      totalTrainings: 27,
      attendanceRate: "88.10",
    },
    april: {
      totalTrainings: 24,
      attendanceRate: "85.30",
    },
    may: {
      totalTrainings: 29,
      attendanceRate: "91.20",
    },
    june: {
      totalTrainings: 26,
      attendanceRate: "89.40",
    },
  },
  multidimensionalPerformance: {
    football: {
      attendance: 88,
      performance: 82,
      competitiveness: 90,
    },
    futsal: {
      attendance: 84,
      performance: 80,
      competitiveness: 86,
    },
    basketball: {
      attendance: 79,
      performance: 85,
      competitiveness: 77,
    },
    volleyball: {
      attendance: 83,
      performance: 78,
      competitiveness: 74,
    },
    swimming: {
      attendance: 91,
      performance: 88,
      competitiveness: 72,
    },
  },
  teamAttendanceRate: {
    "U17 Football": "92",
    "Senior Football": "88",
    "U19 Futsal": "84",
    "Senior Futsal": "81",
    "Basketball A": "86",
    "Basketball B": "79",
    "Volleyball Women": "83",
    "Swimming Team": "94",
  },
  averagePerformanceByModality: {
    football: "8.4",
    futsal: "7.9",
    basketball: "8.1",
    volleyball: "7.6",
    swimming: "8.8",
  },
  modalityTeamsPercentage: {
    football: "34",
    futsal: "22",
    basketball: "18",
    volleyball: "14",
    swimming: "12",
  },
  modalityAthletesPercentage: {
    football: "36",
    futsal: "20",
    basketball: "17",
    volleyball: "13",
    swimming: "14",
  },
  competitionAwards: {
    "National Cup": {
      gold: 2,
      silver: 1,
      bronze: 0,
    },
    "Regional League": {
      gold: 1,
      silver: 2,
      bronze: 1,
    },
    "Youth Championship": {
      gold: 0,
      silver: 1,
      bronze: 2,
    },
  },
};

export { sportsReportMockResponse };
