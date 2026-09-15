import { httpClient } from "../../../lib/api/http-client";
import type { Role } from "../../../lib/constants/roles";
import {
  buildCalendarQueryString,
  mapCalendarActivitiesResponse,
} from "../model/calendar/calendar.mappers";
import type {
  CalendarActivity,
  CalendarActivityResponseDto,
  CalendarFilters,
} from "../model/calendar/calendar.types";

async function listCalendarActivities(
  filters: CalendarFilters,
): Promise<CalendarActivity[]> {
  const response = await httpClient.get<CalendarActivityResponseDto[]>(
    `api/calendar${buildCalendarQueryString(filters)}`,
  );

  return mapCalendarActivitiesResponse(response);
}

function shouldUseScopedCalendarView(activeRole: Role | null): boolean {
  return activeRole === "COACH" || activeRole === "ATHLETE";
}

export { listCalendarActivities, shouldUseScopedCalendarView };
