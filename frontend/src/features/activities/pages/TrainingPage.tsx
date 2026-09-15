import { useMemo, useState } from "react";
import { Activity, Plus } from "lucide-react";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import { Button } from "../../../shared/components/ui/button/Button";
import { AttendanceDialog } from "../../activity-tracking/components/AttendanceDialog";
import { PerformanceDialog } from "../../activity-tracking/components/PerformanceDialog";
import { useTrainingActivityRecords } from "../../activity-tracking/hooks/use-training-activity-records";
import { useComplexes } from "../../sportscore/hooks/use-complexes";
import { useTeams } from "../../teams/hooks/use-teams";
import { DeleteTrainingDialog } from "../components/training/DeleteTrainingDialog";
import { TrainingCard } from "../components/training/TrainingCard";
import { TrainingFilters } from "../components/training/TrainingFilters";
import { TrainingFormDialog } from "../components/training/TrainingFormDialog";
import { TrainingStats } from "../components/training/TrainingStats";
import {
  useAthleteTrainings,
  useCoachTrainings,
  useTrainings,
  useTrainingMutations,
} from "../hooks/use-training";
import { resolveTrainingTemporalStatus } from "../model/training/training.mappers";
import type {
  Training,
  TrainingFilters as TrainingFiltersType,
  TrainingFormValues,
  TrainingStats as TrainingStatsValues,
  TrainingSummary,
} from "../model/training/training.types";
import type { TeamFilterValues } from "../../teams/model/team.types";

const DEFAULT_FILTERS: TrainingFiltersType = {
  status: "ALL",
  trainingDescriptionOrTeam: "",
  teamId: undefined,
  complexId: undefined,
};

const TEAM_FILTERS: TeamFilterValues = {
  modalityId: undefined,
  teamType: "ALL",
  active: "ACTIVE",
  teamOrModalityName: "",
};

const TRAINING_FORM_TEAM_FILTERS: TeamFilterValues = {
  modalityId: undefined,
  teamType: "ALL",
  active: "ACTIVE",
  teamOrModalityName: "",
  freeTrainingEligible: false,
};

function TrainingPage() {
  const { user } = useCurrentUser();
  const { activeRole } = usePermissions();

  const personId = user?.id ?? null;
  const isManager = activeRole === "MANAGER";
  const isCoach = activeRole === "COACH";
  const isAthlete = activeRole === "ATHLETE";

  const canManageTraining = isManager || isCoach;
  const canCreateTraining = canManageTraining;

  const [filters, setFilters] = useState<TrainingFiltersType>(DEFAULT_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTrainingDetail, setSelectedTrainingDetail] =
    useState<Training | null>(null);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(
    null,
  );
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = useState(false);

  const managerTrainingsQuery = useTrainings(filters, isManager);
  const coachTrainingsQuery = useCoachTrainings(
    isCoach && !isManager ? personId : null,
    filters,
  );
  const athleteTrainingsQuery = useAthleteTrainings(
    isAthlete && !isCoach && !isManager ? personId : null,
    filters,
  );

  const trainingsQuery = isManager
    ? managerTrainingsQuery
    : isCoach
      ? coachTrainingsQuery
      : athleteTrainingsQuery;
  const trainings = trainingsQuery.data ?? [];
  const isLoading = trainingsQuery.isLoading;

  const complexesQuery = useComplexes();
  const complexes = complexesQuery.complexes ?? [];

  const teamsQuery = useTeams(TEAM_FILTERS);
  const teams = teamsQuery.teams ?? [];

  const formTeamsQuery = useTeams(TRAINING_FORM_TEAM_FILTERS);
  const formTeams = formTeamsQuery.teams ?? [];

  const {
    isCreating,
    isUpdating,
    isDeleting,
    createTraining,
    updateTraining,
    deleteTraining,
    getTraining,
  } = useTrainingMutations();

  const trainingActivityRecordsQuery = useTrainingActivityRecords({
    trainingId: selectedTrainingDetail?.id ?? null,
    teamId: selectedTrainingDetail?.teamId ?? null,
    teamName: selectedTrainingDetail?.teamName ?? null,
    trainingDate: selectedTrainingDetail?.date ?? null,
    members: selectedTrainingDetail?.members ?? [],
    statisticTypes: selectedTrainingDetail?.statisticTypes ?? [],
  });

  const visibleTrainingMembers = useMemo(() => {
    if (!isAthlete || !personId) {
      return trainingActivityRecordsQuery.members;
    }

    return trainingActivityRecordsQuery.members.filter(
      (member) => member.personId === personId,
    );
  }, [isAthlete, personId, trainingActivityRecordsQuery.members]);

  const visibleTrainingPerformances = useMemo(() => {
    if (!isAthlete || !personId) {
      return trainingActivityRecordsQuery.performances;
    }

    return trainingActivityRecordsQuery.performances.filter(
      (performance) => performance.athleteId === personId,
    );
  }, [isAthlete, personId, trainingActivityRecordsQuery.performances]);

  const stats = useMemo<TrainingStatsValues>(() => {
    return trainings.reduce<TrainingStatsValues>(
      (accumulator, training) => {
        accumulator.total += 1;

        const status = resolveTrainingTemporalStatus(training.date);

        if (status === "FUTURE") {
          accumulator.future += 1;
        } else if (status === "IN_PROGRESS") {
          accumulator.inProgress += 1;
        } else {
          accumulator.past += 1;
        }

        return accumulator;
      },
      {
        total: 0,
        future: 0,
        inProgress: 0,
        past: 0,
      },
    );
  }, [trainings]);

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setSelectedTrainingDetail(null);
  };

  const handleCreate = () => {
    setSelectedTrainingDetail(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (training: TrainingSummary) => {
    const detail = await getTraining(training.id);
    setSelectedTrainingDetail(detail);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = async (training: TrainingSummary) => {
    const detail = await getTraining(training.id);
    setTrainingToDelete(detail);
  };

  const handleSubmit = async (values: TrainingFormValues) => {
    if (selectedTrainingDetail) {
      await updateTraining({
        training: selectedTrainingDetail,
        values,
      });
    } else {
      await createTraining(values);
    }

    closeFormDialog();
  };

  const openAttendanceDialog = async (training: TrainingSummary) => {
    const detail = await getTraining(training.id);
    setSelectedTrainingDetail(detail);
    setAttendanceDialogOpen(true);
  };

  const openPerformanceDialog = async (training: TrainingSummary) => {
    const detail = await getTraining(training.id);
    setSelectedTrainingDetail(detail);
    setPerformanceDialogOpen(true);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-950">Treinos</h1>
          <p className="text-sm text-slate-600">
            Gere sessões de treino, registos de presenças e acompanhamento de
            performance.
          </p>
        </div>

        {canCreateTraining ? (
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Criar treino
          </Button>
        ) : null}
      </header>

      <TrainingStats
        stats={stats}
        isLoading={isLoading}
        onStatusSelect={(status) =>
          setFilters((current) => ({
            ...current,
            status,
          }))
        }
      />

      <TrainingFilters
        searchValue={filters.trainingDescriptionOrTeam}
        teamIdFilter={filters.teamId}
        complexIdFilter={filters.complexId}
        statusFilter={filters.status}
        teams={teams}
        complexes={complexes}
        onSearchChange={(value) =>
          setFilters((current) => ({
            ...current,
            trainingDescriptionOrTeam: value,
          }))
        }
        onTeamChange={(value) =>
          setFilters((current) => ({
            ...current,
            teamId: value,
          }))
        }
        onComplexChange={(value) =>
          setFilters((current) => ({
            ...current,
            complexId: value,
          }))
        }
        onStatusChange={(value) =>
          setFilters((current) => ({
            ...current,
            status: value,
          }))
        }
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : trainings.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {trainings.map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
              onEdit={
                canManageTraining ? (item) => void handleEdit(item) : undefined
              }
              onDelete={
                canManageTraining
                  ? (item) => void handleDeleteRequest(item)
                  : undefined
              }
              onManageAttendance={
                canManageTraining
                  ? (item) => void openAttendanceDialog(item)
                  : undefined
              }
              onManagePerformances={
                canManageTraining || isAthlete
                  ? (item) => void openPerformanceDialog(item)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <Activity className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900">
            Não foram encontrados treinos
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ajusta os filtros ou cria uma nova sessão de treino.
          </p>
        </div>
      )}

      <TrainingFormDialog
        open={isFormOpen}
        training={selectedTrainingDetail}
        teams={formTeams}
        complexes={complexes}
        isSubmitting={isCreating || isUpdating}
        onOpenChange={(open) => {
          if (!open) {
            closeFormDialog();
          }
        }}
        onSubmit={handleSubmit}
      />


      <DeleteTrainingDialog
        open={trainingToDelete !== null}
        training={trainingToDelete}
        isDeleting={isDeleting}
        onOpenChange={(open) => {
          if (!open) {
            setTrainingToDelete(null);
          }
        }}
        onConfirm={async () => {
          if (!trainingToDelete) {
            return;
          }

          await deleteTraining(trainingToDelete.id);
          setTrainingToDelete(null);
        }}
      />

      <AttendanceDialog
        open={attendanceDialogOpen}
        title={
          selectedTrainingDetail
            ? `Presenças · ${selectedTrainingDetail.description}`
            : "Presenças"
        }
        description={
          selectedTrainingDetail
            ? `Regista as presenças de ${selectedTrainingDetail.teamName}.`
            : ""
        }
        members={trainingActivityRecordsQuery.members}
        attendances={trainingActivityRecordsQuery.attendances}
        target={{
          trainingId: selectedTrainingDetail?.id ?? undefined,
          teamId: selectedTrainingDetail?.teamId ?? undefined,
          teamName: selectedTrainingDetail?.teamName ?? null,
          freeTraining: false,
        }}
        isSubmitting={trainingActivityRecordsQuery.isSubmittingAttendance}
        onOpenChange={setAttendanceDialogOpen}
        onSubmit={trainingActivityRecordsQuery.submitAttendances}
      />

      <PerformanceDialog
        open={performanceDialogOpen}
        title={
          selectedTrainingDetail
            ? `Performances · ${selectedTrainingDetail.description}`
            : "Performances"
        }
        description={
          selectedTrainingDetail
            ? canManageTraining
              ? `Regista as performances de ${selectedTrainingDetail.teamName}.`
              : `Consulta as tuas performances em ${selectedTrainingDetail.teamName}.`
            : ""
        }
        members={visibleTrainingMembers}
        statisticTypes={trainingActivityRecordsQuery.statisticTypes}
        attendances={trainingActivityRecordsQuery.attendances}
        performances={visibleTrainingPerformances}
        target={{ trainingId: selectedTrainingDetail?.id ?? undefined }}
        isSubmitting={trainingActivityRecordsQuery.isSubmittingPerformances}
        readOnly={!canManageTraining}
        onOpenChange={setPerformanceDialogOpen}
        onSubmit={trainingActivityRecordsQuery.submitPerformances}
      />
    </section>
  );
}

export { TrainingPage };