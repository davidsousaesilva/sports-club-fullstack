import type { Role } from "../../../../lib/constants/roles";
import type {
  CalendarActivity,
  CalendarActivityResponseDto,
  CalendarDayCell,
  CalendarFilters,
} from "./calendar.types";

function mapCalendarActivityResponse(
  response: CalendarActivityResponseDto,
): CalendarActivity {
  return {
    id: response.id,
    type: response.type,
    description: response.description,
    start: response.start,
    end: response.end,
    modalityName: response.modalityName,
    location: response.location,
    teamName: response.teamName,
    teamNames: response.teamNames,
    competitionName: response.competionName ?? null,
  };
}

function mapCalendarActivitiesResponse(
  response: CalendarActivityResponseDto[],
): CalendarActivity[] {
  return response
    .map(mapCalendarActivityResponse)
    .sort(
      (left, right) =>
        new Date(left.start).getTime() - new Date(right.start).getTime(),
    );
}

function getCalendarPeriod(referenceDate: Date): {
  month: number;
  year: number;
} {
  return {
    month: referenceDate.getMonth() + 1,
    year: referenceDate.getFullYear(),
  };
}

function normalizeCalendarFilters(filters: CalendarFilters): CalendarFilters {
  return {
    month: filters.month,
    year: filters.year,
    personId:
      typeof filters.personId === "number" && filters.personId > 0
        ? filters.personId
        : null,
    view: filters.view ?? null,
  };
}

function buildCalendarQueryString(filters: CalendarFilters): string {
  const normalizedFilters = normalizeCalendarFilters(filters);
  const searchParams = new URLSearchParams();

  searchParams.set("month", String(normalizedFilters.month));
  searchParams.set("year", String(normalizedFilters.year));

  if (normalizedFilters.personId !== null) {
    searchParams.set("personId", String(normalizedFilters.personId));
  }

  if (normalizedFilters.view) {
    searchParams.set("view", normalizedFilters.view);
  }

  return `?${searchParams.toString()}`;
}

function toDateKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameDay(left: string | Date, right: string | Date): boolean {
  return toDateKey(left) === toDateKey(right);
}

function buildCalendarMonthLabel(referenceDate: Date): string {
  return referenceDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function getDayNames(): string[] {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

function getTodayDateKey(): string {
  return toDateKey(new Date());
}

function getDateLabel(dateKey: string | null): string {
  if (!dateKey) {
    return "";
  }

  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getActivitiesByDate(
  activities: CalendarActivity[],
  dateKey: string | null,
): CalendarActivity[] {
  if (!dateKey) {
    return [];
  }

  return activities
    .filter((activity) => isSameDay(activity.start, dateKey))
    .sort(
      (left, right) =>
        new Date(left.start).getTime() - new Date(right.start).getTime(),
    );
}

function buildCalendarMonthDays(
  referenceDate: Date,
  activities: CalendarActivity[],
): CalendarDayCell[] {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days: CalendarDayCell[] = [];

  for (let index = 0; index < startingDayOfWeek; index += 1) {
    days.push({
      id: `empty-${year}-${month}-${index}`,
      dateKey: null,
      dayOfMonth: null,
      isToday: false,
      activities: [],
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(year, month, day);
    const dateKey = toDateKey(currentDate);

    days.push({
      id: dateKey,
      dateKey,
      dayOfMonth: day,
      isToday: dateKey === getTodayDateKey(),
      activities: getActivitiesByDate(activities, dateKey),
    });
  }

  return days;
}

function buildUpcomingActivities(
  activities: CalendarActivity[],
  fromDateKey: string,
  limit: number,
): CalendarActivity[] {
  const threshold = new Date(`${fromDateKey}T00:00:00`).getTime();

  return activities
    .filter((activity) => new Date(activity.start).getTime() >= threshold)
    .sort(
      (left, right) =>
        new Date(left.start).getTime() - new Date(right.start).getTime(),
    )
    .slice(0, limit);
}

function createScopedCalendarFilters(
  month: number,
  year: number,
  userId: number | null,
  activeRole: Role | null,
): CalendarFilters {
  return normalizeCalendarFilters({
    month,
    year,
    personId: userId,
    view: activeRole,
  });
}

export {
  buildCalendarMonthDays,
  buildCalendarMonthLabel,
  buildCalendarQueryString,
  buildUpcomingActivities,
  createScopedCalendarFilters,
  getActivitiesByDate,
  getCalendarPeriod,
  getDateLabel,
  getDayNames,
  getTodayDateKey,
  mapCalendarActivitiesResponse,
  mapCalendarActivityResponse,
  normalizeCalendarFilters,
  toDateKey,
};
