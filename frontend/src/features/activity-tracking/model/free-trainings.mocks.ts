import type { Attendance } from "./activity-records.types";

const FREE_TRAINING_ATTENDANCES: Attendance[] = [
  {
    id: 9001,
    version: 0,
    date: "2026-05-05",
    present: true,
    trainingId: null,
    eventId: null,
    athleteId: 101,
    athleteName: "João Silva",
    freeTraining: true,
    teamId: 1,
    teamName: "U19 Football",
  },
  {
    id: 9002,
    version: 0,
    date: "2026-05-06",
    present: true,
    trainingId: null,
    eventId: null,
    athleteId: 101,
    athleteName: "João Silva",
    freeTraining: true,
    teamId: 1,
    teamName: "U19 Football",
  },
  {
    id: 9003,
    version: 0,
    date: "2026-05-06",
    present: true,
    trainingId: null,
    eventId: null,
    athleteId: 102,
    athleteName: "Miguel Costa",
    freeTraining: true,
    teamId: 1,
    teamName: "U19 Football",
  },
  {
    id: 9004,
    version: 0,
    date: "2026-05-07",
    present: true,
    trainingId: null,
    eventId: null,
    athleteId: 201,
    athleteName: "Rita Ferreira",
    freeTraining: true,
    teamId: 2,
    teamName: "Senior Athletics",
  },
];

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function getWeekRange(selectedDate: string): { start: Date; end: Date } {
  const date = parseDate(selectedDate);
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const sundayOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const start = new Date(date);
  start.setDate(date.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setDate(date.getDate() + sundayOffset);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function listMockFreeTrainingAttendancesByTeamAndWeek(
  teamId: number,
  selectedDate: string,
): Attendance[] {
  const { start, end } = getWeekRange(selectedDate);

  return FREE_TRAINING_ATTENDANCES.filter((attendance) => {
    if (attendance.teamId !== teamId || !attendance.freeTraining) {
      return false;
    }

    const attendanceDate = parseDate(attendance.date);

    return attendanceDate >= start && attendanceDate <= end;
  });
}

function saveMockFreeTrainingAttendance(input: {
  athleteId: number;
  athleteName: string;
  teamId: number;
  teamName: string;
  date: string;
}): Attendance {
  const existingAttendance = FREE_TRAINING_ATTENDANCES.find(
    (attendance) =>
      attendance.athleteId === input.athleteId &&
      attendance.teamId === input.teamId &&
      attendance.date === input.date &&
      attendance.freeTraining,
  );

  if (existingAttendance) {
    existingAttendance.present = true;
    existingAttendance.version += 1;
    return existingAttendance;
  }

  const createdAttendance: Attendance = {
    id: Date.now(),
    version: 0,
    date: input.date,
    present: true,
    trainingId: null,
    eventId: null,
    athleteId: input.athleteId,
    athleteName: input.athleteName,
    freeTraining: true,
    teamId: input.teamId,
    teamName: input.teamName,
  };

  FREE_TRAINING_ATTENDANCES.push(createdAttendance);

  return createdAttendance;
}

export {
  listMockFreeTrainingAttendancesByTeamAndWeek,
  saveMockFreeTrainingAttendance,
};