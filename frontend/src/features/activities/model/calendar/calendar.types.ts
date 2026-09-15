import type { Role } from "../../../../lib/constants/roles";

type CalendarActivityType = "TRAINING" | "EVENT";

type CalendarScopeMode = "FULL" | "SCOPED";

type CalendarActivityResponseDto = {
  id: number;
  type: CalendarActivityType;
  description: string;
  start: string;
  end: string | null;
  modalityName: string | null;
  location: string | null;
  teamName: string | null;
  teamNames: string[];
  competionName: string | null;
};

type CalendarActivity = {
  id: number;
  type: CalendarActivityType;
  description: string;
  start: string;
  end: string | null;
  modalityName: string | null;
  location: string | null;
  teamName: string | null;
  teamNames: string[];
  competitionName: string | null;
};

type CalendarFilters = {
  month: number;
  year: number;
  personId: number | null;
  view: Role | null;
};

type CalendarDayCell = {
  id: string;
  dateKey: string | null;
  dayOfMonth: number | null;
  isToday: boolean;
  activities: CalendarActivity[];
};

export type {
  CalendarActivity,
  CalendarActivityResponseDto,
  CalendarActivityType,
  CalendarDayCell,
  CalendarFilters,
  CalendarScopeMode,
};
