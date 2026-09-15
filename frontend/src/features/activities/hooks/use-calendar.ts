import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import {
  listCalendarActivities,
  shouldUseScopedCalendarView,
} from "../api/calendar";
import {
  buildCalendarMonthDays,
  buildCalendarMonthLabel,
  buildUpcomingActivities,
  getActivitiesByDate,
  getCalendarPeriod,
  getDateLabel,
  getTodayDateKey,
  normalizeCalendarFilters,
} from "../model/calendar/calendar.mappers";
import type {
  CalendarActivity,
  CalendarDayCell,
  CalendarFilters,
  CalendarScopeMode,
} from "../model/calendar/calendar.types";

const CALENDAR_QUERY_KEY = ["activities", "calendar"] as const;

type UseCalendarReturn = {
  activities: CalendarActivity[];
  monthLabel: string;
  days: CalendarDayCell[];
  selectedDateActivities: CalendarActivity[];
  selectedDateLabel: string;
  hasSelectedDate: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  upcomingActivities: CalendarActivity[];
  filters: CalendarFilters;
  isScopeSelectable: boolean;
};

function useCalendar(
  referenceDate: Date,
  selectedDateKey: string | null,
  scopeMode: CalendarScopeMode,
): UseCalendarReturn {
  const { user } = useCurrentUser();
  const { activeRole } = usePermissions();

  const isScopeSelectable = shouldUseScopedCalendarView(activeRole);
  const period = useMemo(
    () => getCalendarPeriod(referenceDate),
    [referenceDate],
  );

  const filters = useMemo<CalendarFilters>(() => {
    if (!isScopeSelectable || scopeMode === "FULL") {
      return normalizeCalendarFilters({
        month: period.month,
        year: period.year,
        personId: null,
        view: null,
      });
    }

    return normalizeCalendarFilters({
      month: period.month,
      year: period.year,
      personId: user?.id ?? null,
      view: activeRole,
    });
  }, [
    activeRole,
    isScopeSelectable,
    period.month,
    period.year,
    scopeMode,
    user?.id,
  ]);

  const calendarQuery = useQuery({
    queryKey: [...CALENDAR_QUERY_KEY, filters],
    queryFn: () => listCalendarActivities(filters),
    staleTime: 60_000,
  });

  const activities = calendarQuery.data ?? [];

  const monthLabel = useMemo(
    () => buildCalendarMonthLabel(referenceDate),
    [referenceDate],
  );

  const days = useMemo(
    () => buildCalendarMonthDays(referenceDate, activities),
    [referenceDate, activities],
  );

  const selectedDateActivities = useMemo(
    () => getActivitiesByDate(activities, selectedDateKey),
    [activities, selectedDateKey],
  );

  const selectedDateLabel = useMemo(
    () => getDateLabel(selectedDateKey),
    [selectedDateKey],
  );

  const upcomingActivities = useMemo(
    () => buildUpcomingActivities(activities, getTodayDateKey(), 6),
    [activities],
  );

  return {
    activities,
    monthLabel,
    days,
    selectedDateActivities,
    selectedDateLabel,
    hasSelectedDate: selectedDateKey !== null,
    isLoading: calendarQuery.isLoading,
    isFetching: calendarQuery.isFetching,
    isError: calendarQuery.isError,
    error: (calendarQuery.error as Error | null) ?? null,
    upcomingActivities,
    filters,
    isScopeSelectable,
  };
}

export { CALENDAR_QUERY_KEY, useCalendar };
