import type { CalendarFilters, CalendarActivity } from "./calendar.types";

const mockCalendarActivities: CalendarActivity[] = [
  {
    id: 101,
    type: "TRAINING",
    description: "Morning strength session",
    start: "2026-05-20T09:00:00",
    end: "2026-05-20T10:30:00",
    modalityName: "Football",
    location: "Main Pavilion",
    teamName: "Senior Team A",
    teamNames: [],
    competitionName: null,
  },
  {
    id: 102,
    type: "EVENT",
    description: "Club open day",
    start: "2026-05-21T18:00:00",
    end: "2026-05-21T20:00:00",
    modalityName: null,
    location: "Central Hall",
    teamName: null,
    teamNames: ["Senior Team A", "Youth Team B"],
    competitionName: null,
  },
  {
    id: 103,
    type: "EVENT",
    description: "Regional finals",
    start: "2026-05-24T15:00:00",
    end: "2026-05-24T17:00:00",
    modalityName: "Football",
    location: "Municipal Stadium",
    teamName: null,
    teamNames: ["Youth Team B"],
    competitionName: "Regional Cup",
  },
  {
    id: 104,
    type: "TRAINING",
    description: "Technical recovery session",
    start: "2026-05-25T08:30:00",
    end: "2026-05-25T09:30:00",
    modalityName: "Athletics",
    location: "Track Field",
    teamName: "Athletics Sprint Squad",
    teamNames: [],
    competitionName: null,
  },
  {
    id: 105,
    type: "EVENT",
    description: "Coaches alignment meeting",
    start: "2026-05-26T19:00:00",
    end: "2026-05-26T20:00:00",
    modalityName: null,
    location: "Meeting Room 2",
    teamName: null,
    teamNames: ["Coaching Staff"],
    competitionName: null,
  },
  {
    id: 106,
    type: "TRAINING",
    description: "Individual athlete session",
    start: "2026-05-27T07:30:00",
    end: "2026-05-27T08:30:00",
    modalityName: "Swimming",
    location: "Aquatic Center",
    teamName: "Performance Unit",
    teamNames: [],
    competitionName: null,
  },
  {
    id: 107,
    type: "TRAINING",
    description: "Mobility recovery session",
    start: "2026-05-27T12:00:00",
    end: "2026-05-27T13:00:00",
    modalityName: "Swimming",
    location: "Recovery Room",
    teamName: "Performance Unit",
    teamNames: [],
    competitionName: null,
  },
  {
    id: 108,
    type: "EVENT",
    description: "Performance review briefing",
    start: "2026-05-27T17:00:00",
    end: "2026-05-27T18:00:00",
    modalityName: null,
    location: "Conference Room",
    teamName: null,
    teamNames: ["Performance Unit", "Coaching Staff"],
    competitionName: null,
  },
  {
    id: 201,
    type: "TRAINING",
    description: "Pre-season conditioning block",
    start: "2026-06-03T08:00:00",
    end: "2026-06-03T09:00:00",
    modalityName: "Football",
    location: "Outdoor Field",
    teamName: "Senior Team A",
    teamNames: [],
    competitionName: null,
  },
  {
    id: 202,
    type: "EVENT",
    description: "Summer tournament briefing",
    start: "2026-06-08T18:30:00",
    end: "2026-06-08T19:30:00",
    modalityName: null,
    location: "Auditorium",
    teamName: null,
    teamNames: ["Senior Team A", "Youth Team B", "Performance Unit"],
    competitionName: "Summer Invitational",
  },
];

function matchesRequestedMonth(
  activity: CalendarActivity,
  month: number,
  year: number,
): boolean {
  const activityDate = new Date(activity.start);

  return (
    activityDate.getMonth() + 1 === month && activityDate.getFullYear() === year
  );
}

function listMockCalendarActivities(
  filters: CalendarFilters,
): CalendarActivity[] {
  const { month, year, personId, view } = filters;

  const monthlyActivities = mockCalendarActivities.filter((activity) =>
    matchesRequestedMonth(activity, month, year),
  );

  if (!personId || !view) {
    return monthlyActivities;
  }

  if (view === "COACH") {
    return monthlyActivities.filter((activity) =>
      activity.type === "TRAINING" ? activity.id % 2 === personId % 2 : true,
    );
  }

  if (view === "ATHLETE") {
    return monthlyActivities.filter((activity) =>
      activity.type === "TRAINING"
        ? activity.id % 3 === personId % 3
        : activity.teamNames.length > 0,
    );
  }

  return monthlyActivities;
}

export { listMockCalendarActivities };
