import type {
  AveragePerformanceByModalityItem,
  CompetitionAwardsItem,
  CompetitionAwardsResponseDto,
  ModalityDistributionItem,
  MultidimensionalPerformanceItem,
  MultidimensionalPerformanceResponseDto,
  SportReportData,
  SportReportResponseDto,
  TeamAttendanceRateItem,
  TeamTrainingEvolutionResponseDto,
  TrainingAttendanceEvolutionItem,
} from "./sports-report.types";

const MONTH_ABBREVIATIONS: Record<string, string> = {
  january: "Jan",
  february: "Feb",
  march: "Mar",
  april: "Apr",
  may: "May",
  june: "Jun",
  july: "Jul",
  august: "Aug",
  september: "Sep",
  october: "Oct",
  november: "Nov",
  december: "Dec",
};

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function toPercentNumber(value: number | string | null | undefined): number {
  const parsed = toNumber(value);

  if (parsed <= 1) {
    return Math.round(parsed * 100);
  }

  return Math.round(parsed);
}

function toPercentageString(value: number | string | null | undefined): string {
  return String(toPercentNumber(value));
}

function capitalizeLabel(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function formatLabel(value: string): string {
  const normalizedValue = value.trim().toLowerCase();

  if (MONTH_ABBREVIATIONS[normalizedValue]) {
    return MONTH_ABBREVIATIONS[normalizedValue];
  }

  return value
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((part) => {
      const normalizedPart = part.toLowerCase();

      return (
        MONTH_ABBREVIATIONS[normalizedPart] ?? capitalizeLabel(normalizedPart)
      );
    })
    .join(" ");
}

function truncateLabel(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

function mapTrainingAttendanceEvolution(
  items: Record<string, TeamTrainingEvolutionResponseDto> | null | undefined,
): TrainingAttendanceEvolutionItem[] {
  return Object.entries(items ?? {})
    .slice(0, 12)
    .map(([label, item]) => ({
      id: createId(label),
      label: formatLabel(label),
      totalTrainings: item.totalTrainings,
      attendanceRate: toPercentNumber(item.attendanceRate),
    }));
}

function mapMultidimensionalPerformance(
  items: Record<string, MultidimensionalPerformanceResponseDto> | null | undefined,
): MultidimensionalPerformanceItem[] {
  return Object.entries(items ?? {})
    .slice(0, 8)
    .map(([label, item]) => ({
      id: createId(label),
      label: truncateLabel(formatLabel(label), 14),
      attendance: toPercentNumber(item.attendance),
      performance: toNumber(item.performance),
      competitiveness: toNumber(item.competitiveness),
    }));
}

function mapTeamAttendanceRate(
  items: Record<string, number | string> | null | undefined,
): TeamAttendanceRateItem[] {
  return Object.entries(items ?? {})
    .map(([label, value]) => ({
      id: createId(label),
      label: truncateLabel(formatLabel(label), 18),
      rate: toPercentNumber(value),
    }))
    .sort((left, right) => right.rate - left.rate)
    .slice(0, 8);
}

function mapAveragePerformanceByModality(
  items: Record<string, number | string> | null | undefined,
): AveragePerformanceByModalityItem[] {
  return Object.entries(items ?? {}).map(([label, value]) => ({
    id: createId(label),
    label: truncateLabel(formatLabel(label), 16),
    value: toNumber(value),
  }));
}

function mapDistribution(
  items: Record<string, number | string> | null | undefined,
): ModalityDistributionItem[] {
  return Object.entries(items ?? {}).map(([label, value]) => ({
    id: createId(label),
    label: formatLabel(label),
    percentage: toNumber(value),
  }));
}

function mapCompetitionAwards(
  items: Record<string, CompetitionAwardsResponseDto> | null | undefined,
): CompetitionAwardsItem[] {
  return Object.entries(items ?? {})
    .map(([label, value]) => ({
      id: createId(label),
      label: truncateLabel(formatLabel(label), 20),
      gold: value.gold,
      silver: value.silver,
      bronze: value.bronze,
    }))
    .filter((item) => item.gold > 0 || item.silver > 0 || item.bronze > 0);
}

function mapSportReportResponse(dto: SportReportResponseDto): SportReportData {
  return {
    totalAthletes: dto.totalAthletes ?? 0,
    totalCoaches: dto.totalCoaches ?? 0,
    totalActiveTeams: dto.totalActiveTeams ?? 0,
    attendanceRate: toPercentageString(dto.attendanceRate),
    trainingAttendanceEvolution: mapTrainingAttendanceEvolution(
      dto.trainingAttendanceEvolution,
    ),
    multidimensionalPerformance: mapMultidimensionalPerformance(
      dto.multidimensionalPerformance,
    ),
    teamAttendanceRate: mapTeamAttendanceRate(dto.teamAttendanceRate),
    averagePerformanceByModality: mapAveragePerformanceByModality(
      dto.averagePerformanceByModality,
    ),
    modalityTeamsPercentage: mapDistribution(dto.modalityTeamsPercentage),
    modalityAthletesPercentage: mapDistribution(dto.modalityAthletesPercentage),
    competitionAwards: mapCompetitionAwards(dto.competitionAwards),
  };
}

export { mapSportReportResponse };