import { useEffect, useMemo, useState } from "react";

import { useModalities } from "../../sportscore/hooks/use-modalities";
import { useTeams } from "../../teams/hooks/use-teams";
import type { Team, TeamSummary } from "../../teams/model/team.types";
import { AttendanceLimitExceededError } from "../api/activity-records";
import {
  listFreeTrainingAttendancesByTeamAndWeek,
  registerOrUpdateFreeTrainingAttendance,
} from "../api/free-trainings";
import { buildAttendanceRequest } from "../model/activity-records.mappers";
import type { Attendance } from "../model/activity-records.types";

type AthleteMember = Team["members"][number];

interface UseFreeTrainingsOptions {
  selectedDate: string;
}

interface UseFreeTrainingsResult {
  teams: TeamSummary[];
  selectedTeamId?: number;
  selectedTeam: Team | null;
  athletes: AthleteMember[];
  weeklyAttendances: Attendance[];
  maxWeeklyAttendances: number | null;
  stats: {
    totalAthletes: number;
    presentToday: number;
    weeklyRegistered: number;
  };
  isLoading: boolean;
  isSavingByAthlete: Record<number, boolean>;
  error: string | null;
  setSelectedTeamId: (teamId: number | undefined) => void;
  markAttendance: (athlete: AthleteMember) => Promise<void>;
  getWeeklyCount: (athleteId: number) => number;
  hasAttendanceOnSelectedDay: (athleteId: number) => boolean;
  hasReachedWeeklyLimit: (athleteId: number) => boolean;
}

function useFreeTrainings({
  selectedDate,
}: UseFreeTrainingsOptions): UseFreeTrainingsResult {
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [weeklyAttendances, setWeeklyAttendances] = useState<Attendance[]>([]);
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(false);
  const [isLoadingSelectedTeam, setIsLoadingSelectedTeam] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingByAthlete, setIsSavingByAthlete] = useState<
    Record<number, boolean>
  >({});

  const teamsQuery = useTeams({
    modalityId: undefined,
    teamType: "ALL",
    active: "ACTIVE",
    teamOrModalityName: "",
    freeTrainingEligible: true,
  });
  const modalitiesQuery = useModalities();

  const teams = useMemo(
    () => teamsQuery.teams.filter((team) => team.active),
    [teamsQuery.teams],
  );

  const { getTeamDetails } = teamsQuery;

  useEffect(() => {
    if (teams.length === 0) {
      setSelectedTeamId(undefined);
      setSelectedTeam(null);
      return;
    }

    setSelectedTeamId((current) => {
      if (current && teams.some((team) => team.id === current)) {
        return current;
      }

      return teams[0]?.id;
    });
  }, [teams]);

  useEffect(() => {
    let cancelled = false;

    async function loadSelectedTeam(): Promise<void> {
      if (!selectedTeamId) {
        setSelectedTeam(null);
        return;
      }

      setIsLoadingSelectedTeam(true);

      try {
        const team = await getTeamDetails(selectedTeamId);

        if (!cancelled) {
          setSelectedTeam(team);
        }
      } catch {
        if (!cancelled) {
          setSelectedTeam(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSelectedTeam(false);
        }
      }
    }

    void loadSelectedTeam();

    return () => {
      cancelled = true;
    };
  }, [selectedTeamId, getTeamDetails]);

  const selectedModality = useMemo(() => {
    if (!selectedTeam) {
      return null;
    }

    return (
      modalitiesQuery.modalities.find(
        (modality) => modality.id === selectedTeam.modalityId,
      ) ?? null
    );
  }, [modalitiesQuery.modalities, selectedTeam]);

  const maxWeeklyAttendances = useMemo(() => {
    if (!selectedModality) {
      return null;
    }

    if (selectedModality.maxWeeklyAttendances === -1) {
      return null;
    }

    return selectedModality.maxWeeklyAttendances;
  }, [selectedModality]);

  const athletes = useMemo<AthleteMember[]>(() => {
    if (!selectedTeam) {
      return [];
    }

    return selectedTeam.members.filter(
      (member) => member.relationship === "ATHLETE" && member.endDate === null,
    );
  }, [selectedTeam]);

  async function loadAttendances(teamId: number): Promise<void> {
    setIsLoadingAttendances(true);
    setError(null);

    try {
      const data = await listFreeTrainingAttendancesByTeamAndWeek(
        teamId,
        selectedDate,
      );

      setWeeklyAttendances(data);
    } catch {
      setWeeklyAttendances([]);
      setError("Não foi possível carregar as presenças de treino livre.");
    } finally {
      setIsLoadingAttendances(false);
    }
  }

  useEffect(() => {
    if (!selectedTeamId) {
      setWeeklyAttendances([]);
      setError(null);
      return;
    }

    void loadAttendances(selectedTeamId);
  }, [selectedDate, selectedTeamId]);

  const stats = useMemo(() => {
    const totalAthletes = athletes.length;

    const presentToday = athletes.filter((athlete) =>
      weeklyAttendances.some(
        (attendance) =>
          attendance.athleteId === athlete.personId &&
          attendance.present &&
          attendance.freeTraining &&
          attendance.date === selectedDate,
      ),
    ).length;

    const weeklyRegistered = athletes.filter((athlete) =>
      weeklyAttendances.some(
        (attendance) =>
          attendance.athleteId === athlete.personId &&
          attendance.present &&
          attendance.freeTraining,
      ),
    ).length;

    return {
      totalAthletes,
      presentToday,
      weeklyRegistered,
    };
  }, [athletes, selectedDate, weeklyAttendances]);

  function getWeeklyAttendancesForAthlete(athleteId: number): Attendance[] {
    return weeklyAttendances.filter(
      (attendance) =>
        attendance.athleteId === athleteId &&
        attendance.present &&
        attendance.freeTraining,
    );
  }

  function getWeeklyCount(athleteId: number): number {
    return getWeeklyAttendancesForAthlete(athleteId).length;
  }

  function getAttendanceOnSelectedDay(athleteId: number): Attendance | null {
    return (
      weeklyAttendances.find(
        (attendance) =>
          attendance.athleteId === athleteId &&
          attendance.freeTraining &&
          attendance.date === selectedDate,
      ) ?? null
    );
  }

  function hasAttendanceOnSelectedDay(athleteId: number): boolean {
    return Boolean(getAttendanceOnSelectedDay(athleteId)?.present);
  }

  function hasReachedWeeklyLimit(athleteId: number): boolean {
    if (maxWeeklyAttendances === null) {
      return false;
    }

    return getWeeklyCount(athleteId) >= maxWeeklyAttendances;
  }

  async function reloadAttendances(): Promise<void> {
    if (!selectedTeamId) {
      return;
    }

    await loadAttendances(selectedTeamId);
  }

  function isFutureDate(date: string): boolean {
    const today = new Date().toISOString().slice(0, 10);

    return date > today;
  }
  

  async function markAttendance(athlete: AthleteMember): Promise<void> {
    if (!selectedTeam) {
      return;
    }

    if (isFutureDate(selectedDate)) {
      setError("Não é possível marcar presença de treino livre numa data futura.");
      return;
    }

    const existingAttendance = getAttendanceOnSelectedDay(athlete.personId);

    setIsSavingByAthlete((current) => ({
      ...current,
      [athlete.personId]: true,
    }));
    setError(null);

    try {
      await registerOrUpdateFreeTrainingAttendance(
        buildAttendanceRequest({
          version: existingAttendance?.version ?? null,
          present: true,
          athleteId: athlete.personId,
          trainingId: undefined,
          eventId: undefined,
          freeTraining: true,
          teamId: selectedTeam.id,
          attendanceDate: selectedDate,
        }),
      );

      await reloadAttendances();
    } catch (caughtError) {
      if (caughtError instanceof AttendanceLimitExceededError) {
        setError(caughtError.message);
      } else {
        setError("Não foi possível guardar a presença de treino livre.");
      }
    } finally {
      setIsSavingByAthlete((current) => ({
        ...current,
        [athlete.personId]: false,
      }));
    }
  }

  return {
    teams,
    selectedTeamId,
    selectedTeam,
    athletes,
    weeklyAttendances,
    maxWeeklyAttendances,
    stats,
    isLoading:
      teamsQuery.isLoading ||
      modalitiesQuery.isLoading ||
      isLoadingSelectedTeam ||
      isLoadingAttendances,
    isSavingByAthlete,
    error,
    setSelectedTeamId,
    markAttendance,
    getWeeklyCount,
    hasAttendanceOnSelectedDay,
    hasReachedWeeklyLimit,
  };
}

export { useFreeTrainings };