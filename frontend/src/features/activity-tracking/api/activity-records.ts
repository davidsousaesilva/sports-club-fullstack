import { httpClient } from "../../../lib/api/http-client";
import {
  flattenAggregatedPerformances,
  mapAttendanceResponse,
} from "../model/activity-records.mappers";
import type {
  AggregatedPerformanceResponseDto,
  Attendance,
  AttendanceResponseDto,
  Performance,
  RegisterOrUpdateAttendanceRequestDto,
  RegisterOrUpdatePerformancesRequestDto,
} from "../model/activity-records.types";

interface AttendanceLimitExceededErrorDetails {
  athleteId: number;
  teamId: number;
  modalityId: number;
  currentWeeklyAttendances: number;
  maxWeeklyAttendances: number;
  weekStartDate: string;
  weekEndDate: string;
}

interface AttendanceLimitExceededErrorResponse {
  code: "MAX_WEEKLY_ATTENDANCES_EXCEEDED";
  message: string;
  details: AttendanceLimitExceededErrorDetails;
}

class AttendanceLimitExceededError extends Error {
  readonly code = "MAX_WEEKLY_ATTENDANCES_EXCEEDED";
  readonly details: AttendanceLimitExceededErrorDetails;

  constructor(payload: AttendanceLimitExceededErrorResponse) {
    super(payload.message);
    this.name = "AttendanceLimitExceededError";
    this.details = payload.details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAttendanceLimitExceededError(
  error: unknown,
): AttendanceLimitExceededError | null {
  if (!isRecord(error)) {
    return null;
  }

  const response = error.response;
  if (!isRecord(response)) {
    return null;
  }

  const data = response.data;
  if (!isRecord(data)) {
    return null;
  }

  if (data.code !== "MAX_WEEKLY_ATTENDANCES_EXCEEDED") {
    return null;
  }

  if (typeof data.message !== "string") {
    return null;
  }

  const details = data.details;
  if (!isRecord(details)) {
    return null;
  }

  if (
    typeof details.athleteId !== "number" ||
    typeof details.teamId !== "number" ||
    typeof details.modalityId !== "number" ||
    typeof details.currentWeeklyAttendances !== "number" ||
    typeof details.maxWeeklyAttendances !== "number" ||
    typeof details.weekStartDate !== "string" ||
    typeof details.weekEndDate !== "string"
  ) {
    return null;
  }

  return new AttendanceLimitExceededError({
    code: "MAX_WEEKLY_ATTENDANCES_EXCEEDED",
    message: data.message,
    details: {
      athleteId: details.athleteId,
      teamId: details.teamId,
      modalityId: details.modalityId,
      currentWeeklyAttendances: details.currentWeeklyAttendances,
      maxWeeklyAttendances: details.maxWeeklyAttendances,
      weekStartDate: details.weekStartDate,
      weekEndDate: details.weekEndDate,
    },
  });
}

async function registerOrUpdateAttendance(
  payload: RegisterOrUpdateAttendanceRequestDto,
): Promise<Attendance> {
  try {
    const response = await httpClient.post<AttendanceResponseDto>(
      "api/attendances",
      payload,
    );

    return mapAttendanceResponse(response);
  } catch (error) {
    const parsedError = parseAttendanceLimitExceededError(error);

    if (parsedError) {
      throw parsedError;
    }

    throw error;
  }
}

async function registerOrUpdatePerformances(
  payload: RegisterOrUpdatePerformancesRequestDto,
): Promise<void> {
  await httpClient.post<void>("api/performances", payload);
}

async function listTrainingAttendances(
  trainingId: number,
): Promise<Attendance[]> {
  const response = await httpClient.get<AttendanceResponseDto[]>(
    `api/trainings/${trainingId}/attendances`,
  );

  return response.map(mapAttendanceResponse);
}

async function listTrainingPerformances(
  trainingId: number,
): Promise<Performance[]> {
  const response = await httpClient.get<AggregatedPerformanceResponseDto[]>(
    `api/trainings/${trainingId}/performances`,
  );

  return flattenAggregatedPerformances(response);
}

async function listEventAttendances(eventId: number): Promise<Attendance[]> {
  const response = await httpClient.get<AttendanceResponseDto[]>(
    `api/events/${eventId}/attendances`,
  );

  return response.map(mapAttendanceResponse);
}

async function listEventPerformances(eventId: number): Promise<Performance[]> {
  const response = await httpClient.get<AggregatedPerformanceResponseDto[]>(
    `api/events/${eventId}/performances`,
  );

  return flattenAggregatedPerformances(response);
}

export {
  AttendanceLimitExceededError,
  listEventAttendances,
  listEventPerformances,
  listTrainingAttendances,
  listTrainingPerformances,
  registerOrUpdateAttendance,
  registerOrUpdatePerformances,
};
export type {
  AttendanceLimitExceededErrorDetails,
  AttendanceLimitExceededErrorResponse,
};
