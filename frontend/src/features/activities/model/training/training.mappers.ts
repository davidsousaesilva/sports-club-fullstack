import type {
  ActivityMember,
  ActivityStatisticType,
} from "../../../activity-tracking/model/activity-records.types";
import type {
  CreateTrainingRequestDto,
  TemporalStatus,
  Training,
  TrainingFilters,
  TrainingFormValues,
  TrainingResponseDto,
  TrainingSummary,
  TrainingSummaryResponseDto,
  UpdateTrainingRequestDto,
} from "./training.types";

function mapTrainingSummaryResponse(
  dto: TrainingSummaryResponseDto,
): TrainingSummary {
  return {
    id: dto.id,
    version: dto.version,
    description: dto.description,
    note: dto.note,
    date: dto.date,
    duration: dto.duration,
    complexId: dto.idComplex,
    complexName: dto.complexName,
    teamId: dto.idTeam,
    teamName: dto.teamName,
    presentAthletesPercent: dto.presentAthletesPercent,
    performanceEntriesPercent: dto.performanceEntriesPercent,
  };
}

function mapActivityMembers(
  members: TrainingResponseDto["members"],
): ActivityMember[] {
  return members.map((member) => ({
    id: member.id,
    personId: member.personId,
    personName: member.personName,
    relationship: member.relationship,
    startDate: member.startDate,
    endDate: member.endDate,
  }));
}

function mapStatisticTypes(
  statsTypes: TrainingResponseDto["statsTypes"],
): ActivityStatisticType[] {
  return statsTypes.map((statisticType) => ({
    id: statisticType.id,
    name: statisticType.name,
    unit: statisticType.unit,
  }));
}

function mapTrainingResponse(dto: TrainingResponseDto): Training {
  return {
    ...mapTrainingSummaryResponse({
      id: dto.id,
      version: dto.version,
      description: dto.description,
      note: dto.note,
      date: dto.date,
      duration: dto.duration,
      idComplex: dto.idComplex,
      complexName: dto.complexName,
      idTeam: dto.idTeam,
      teamName: dto.teamName,
      presentAthletesPercent: null,
      performanceEntriesPercent: null,
    }),
    members: mapActivityMembers(dto.members),
    statisticTypes: mapStatisticTypes(dto.statsTypes),
  };
}

function buildTrainingQueryString(filters: TrainingFilters): string {
  const searchParams = new URLSearchParams();

  if (filters.teamId && filters.teamId > 0) {
    searchParams.set("teamId", String(filters.teamId));
  }

  if (filters.complexId && filters.complexId > 0) {
    searchParams.set("complexId", String(filters.complexId));
  }

  if (filters.status !== "ALL") {
    searchParams.set("status", filters.status);
  }

  const normalizedSearch = filters.trainingDescriptionOrTeam.trim();

  if (normalizedSearch) {
    searchParams.set("trainingDescriptionOrTeam", normalizedSearch);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

function mapTrainingFormToRequest(
  values: TrainingFormValues,
): CreateTrainingRequestDto {
  return {
    description: values.description.trim(),
    note: values.note.trim() ? values.note.trim() : null,
    date: `${values.date}T${values.time}:00`,
    duration: values.duration,
    complexId:
      values.complexId && values.complexId > 0 ? values.complexId : null,
    teamId: values.teamId,
  };
}

function mapTrainingFormToUpdateRequest(
  values: TrainingFormValues,
  version: number,
): UpdateTrainingRequestDto {
  return {
    version,
    description: values.description.trim(),
    note: values.note.trim() ? values.note.trim() : null,
    date: `${values.date}T${values.time}:00`,
    duration: values.duration,
    complexId:
      values.complexId && values.complexId > 0 ? values.complexId : null,
    teamId: values.teamId,
  };
}

function mapTrainingToFormValues(
  training: Training | TrainingSummary,
): TrainingFormValues {
  const [datePart, timePart = "18:00:00"] = training.date.split("T");

  return {
    description: training.description,
    note: training.note ?? "",
    date: datePart,
    time: timePart.slice(0, 5),
    duration: training.duration,
    complexId: training.complexId ?? undefined,
    teamId: training.teamId,
  };
}

function resolveTrainingTemporalStatus(date: string): TemporalStatus {
  const trainingDate = new Date(date).getTime();
  const now = Date.now();
  const differenceInMinutes = (trainingDate - now) / (1000 * 60);

  if (differenceInMinutes > 0 && differenceInMinutes <= 120) {
    return "IN_PROGRESS";
  }

  if (trainingDate > now) {
    return "FUTURE";
  }

  return "PAST";
}

export {
  buildTrainingQueryString,
  mapActivityMembers,
  mapStatisticTypes,
  mapTrainingFormToRequest,
  mapTrainingFormToUpdateRequest,
  mapTrainingResponse,
  mapTrainingSummaryResponse,
  mapTrainingToFormValues,
  resolveTrainingTemporalStatus,
};