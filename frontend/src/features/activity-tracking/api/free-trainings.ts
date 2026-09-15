import { httpClient } from "../../../lib/api/http-client";
import { mapAttendanceResponse } from "../model/activity-records.mappers";
import type {
  Attendance,
  AttendanceResponseDto,
  RegisterOrUpdateAttendanceRequestDto,
} from "../model/activity-records.types";

function buildFreeTrainingQueryString(teamId: number, date: string): string {
  const searchParams = new URLSearchParams();
  searchParams.set("teamId", String(teamId));
  searchParams.set("date", date);

  return `?${searchParams.toString()}`;
}

async function listFreeTrainingAttendancesByTeamAndWeek(
  teamId: number,
  date: string,
): Promise<Attendance[]> {
  const response = await httpClient.get<AttendanceResponseDto[]>(
    `api/attendances/free-trainings${buildFreeTrainingQueryString(teamId, date)}`,
  );

  return response.map(mapAttendanceResponse);
}

async function registerOrUpdateFreeTrainingAttendance(
  payload: RegisterOrUpdateAttendanceRequestDto,
): Promise<Attendance> {
  const response = await httpClient.post<AttendanceResponseDto>(
    "api/attendances/free-trainings",
    payload,
  );

  return mapAttendanceResponse(response);
}

export {
  listFreeTrainingAttendancesByTeamAndWeek,
  registerOrUpdateFreeTrainingAttendance,
};