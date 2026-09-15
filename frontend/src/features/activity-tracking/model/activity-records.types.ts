export interface ActivityMember {
  id: number;
  personId: number;
  personName: string;
  relationship: string;
  startDate: string;
  endDate: string | null;
}

export interface ActivityStatisticType {
  id: number;
  name: string;
  unit: string;
}

export interface AttendanceResponseDto {
  id: number;
  version: number;
  present: boolean;
  trainingId: number | null;
  eventId: number | null;
  athleteId: number;
  athleteName: string;
  freeTraining: boolean;
  teamId: number | null;
  teamName: string | null;
  date: string;
}

export interface Attendance {
  id: number;
  version: number;
  present: boolean;
  trainingId: number | null;
  eventId: number | null;
  athleteId: number;
  athleteName: string;
  freeTraining: boolean;
  teamId: number | null;
  teamName: string | null;
  date: string;
}

export interface RegisterOrUpdateAttendanceRequestDto {
  version: number | null;
  present: boolean;
  trainingId: number | null;
  eventId: number | null;
  athleteId: number;
  freeTraining: boolean;
  teamId: number | null;
  attendanceDate: string | null;
}

export interface PerformanceResponseDto {
  id: number;
  version: number;
  value: number;
  note: string;
  statisticTypeId: number;
  statisticTypeName: string;
  statisticTypeUnit: string;
  athleteId: number;
  athleteName: string;
  coachId: number | null;
  coachName: string | null;
  trainingId: number | null;
  eventId: number | null;
}

export interface AggregatedPerformanceResponseDto {
  performances: PerformanceResponseDto[];
}

export interface Performance {
  id: number;
  version: number;
  value: number;
  note: string;
  statisticTypeId: number;
  statisticTypeName: string;
  statisticTypeUnit: string;
  athleteId: number;
  athleteName: string;
  coachId: number | null;
  coachName: string | null;
  trainingId: number | null;
  eventId: number | null;
}

export interface PerformanceEntryFormValue {
  version?: number | null;
  statisticTypeId: number;
  value: string;
  note: string;
}

export interface RegisterOrUpdatePerformancesRequestDto {
  athleteId: number;
  trainingId: number | null;
  eventId: number | null;
  performances: {
    version: number | null;
    statisticTypeId: number;
    value: number;
    note: string;
  }[];
}

export interface ActivityAttendanceTarget {
  trainingId?: number;
  eventId?: number;
  teamId?: number;
  teamName?: string | null;
  freeTraining?: boolean;
}

export interface ActivityPerformanceTarget {
  trainingId?: number;
  eventId?: number;
}