import type { DashboardResponseDto } from "./dashboard.types";

const dashboardMockResponse: DashboardResponseDto = {
  totalAthletes: 148,
  totalNewAthletesThisMonth: 6,
  totalActiveTeams: 9,
  attendanceRate: "87.4",
  totalRevenueCurrentMonth: "4825.50",
  totalDebtsCurrentMonth: "1260.00",
  modalityTeamsPercentage: {
    Football: "34",
    Futsal: "22",
    Basketball: "18",
    Volleyball: "14",
    Swimming: "12",
  },
  financialSnapshotQuarter: [
    {
      revenue: "3910.25",
      expenses: "2485.40",
    },
    {
      revenue: "4280.00",
      expenses: "2660.75",
    },
    {
      revenue: "4825.50",
      expenses: "3015.20",
    },
  ],
  pendingFees: [
    {
      id: 101,
      amount: "35.00",
      dueDate: "2026-05-03",
    },
    {
      id: 102,
      amount: "42.50",
      dueDate: "2026-05-05",
    },
    {
      id: 103,
      amount: "30.00",
      dueDate: "2026-05-08",
    },
    {
      id: 104,
      amount: "55.00",
      dueDate: "2026-05-12",
    },
    {
      id: 105,
      amount: "28.75",
      dueDate: "2026-05-14",
    },
  ],
  upcomingActivities: [
    {
      id: 201,
      title: "U17 Football Training",
      date: "2026-05-02",
    },
    {
      id: 202,
      title: "Senior Futsal Match",
      date: "2026-05-04",
    },
    {
      id: 203,
      title: "Basketball Tactical Session",
      date: "2026-05-06",
    },
    {
      id: 204,
      title: "Swimming Performance Assessment",
      date: "2026-05-07",
    },
    {
      id: 205,
      title: "Volleyball Recovery Session",
      date: "2026-05-09",
    },
  ],
};

export { dashboardMockResponse };
