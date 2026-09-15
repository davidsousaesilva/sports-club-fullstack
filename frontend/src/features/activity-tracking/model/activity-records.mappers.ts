import type {
  AggregatedPerformanceResponseDto,
  Attendance,
  AttendanceResponseDto,
  Performance,
  PerformanceEntryFormValue,
  RegisterOrUpdateAttendanceRequestDto,
  RegisterOrUpdatePerformancesRequestDto,
} from "./activity-records.types";

function mapAttendanceResponse(dto: AttendanceResponseDto): Attendance {
  return {
    id: dto.id,
    version: dto.version,
    present: dto.present,
    trainingId: dto.trainingId,
    eventId: dto.eventId,
    athleteId: dto.athleteId,
    athleteName: dto.athleteName,
    freeTraining: dto.freeTraining,
    teamId: dto.teamId,
    teamName: dto.teamName,
    date: dto.date,
  };
}

function mapPerformanceResponse(
  dto: AggregatedPerformanceResponseDto["performances"][number],
): Performance {
  return {
    id: dto.id,
    version: dto.version,
    value: Number(dto.value),
    note: dto.note ?? "",
    statisticTypeId: dto.statisticTypeId,
    statisticTypeName: dto.statisticTypeName,
    statisticTypeUnit: dto.statisticTypeUnit,
    athleteId: dto.athleteId,
    athleteName: dto.athleteName,
    coachId: dto.coachId,
    coachName: dto.coachName,
    trainingId: dto.trainingId,
    eventId: dto.eventId,
  };
}

function flattenAggregatedPerformances(
  response: AggregatedPerformanceResponseDto[],
): Performance[] {
  return response.flatMap((group) =>
    group.performances.map(mapPerformanceResponse),
  );
}

function buildAttendanceRequest(input: {
  version?: number | null;
  present: boolean;
  athleteId: number;
  trainingId?: number;
  eventId?: number;
  freeTraining?: boolean;
  teamId?: number;
  attendanceDate?: string | null;
}): RegisterOrUpdateAttendanceRequestDto {
  const freeTraining = input.freeTraining ?? false;

  return {
    version: input.version ?? null,
    present: input.present,
    trainingId: input.trainingId ?? null,
    eventId: input.eventId ?? null,
    athleteId: input.athleteId,
    freeTraining,
    teamId: input.teamId ?? null,
    attendanceDate: freeTraining ? input.attendanceDate ?? null : null,
  };
}

function buildPerformanceRequest(input: {
  athleteId: number;
  trainingId?: number;
  eventId?: number;
  entries: PerformanceEntryFormValue[];
}): RegisterOrUpdatePerformancesRequestDto {
  return {
    athleteId: input.athleteId,
    trainingId: input.trainingId ?? null,
    eventId: input.eventId ?? null,
    performances: input.entries
      .filter((entry) => entry.value.trim() !== "")
      .map((entry) => ({
        version: entry.version ?? null,
        statisticTypeId: entry.statisticTypeId,
        value: Number(entry.value),
        note: entry.note.trim(),
      })),
  };
}

export {
  buildAttendanceRequest,
  buildPerformanceRequest,
  flattenAggregatedPerformances,
  mapAttendanceResponse,
  mapPerformanceResponse,
};