import { Activity, CalendarClock, History, ListChecks } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../../shared/components/data-display/stats-card";
import type {
  TemporalStatus,
  TrainingStats as TrainingStatsValues,
} from "../../model/training/training.types";

interface TrainingStatsProps {
  stats: TrainingStatsValues;
  isLoading: boolean;
  onStatusSelect: (status: TemporalStatus | "ALL") => void;
}

function TrainingStats({
  stats,
  isLoading,
  onStatusSelect,
}: TrainingStatsProps) {
  const items = [
    {
      key: "ALL" as const,
      label: "Total de treinos",
      value: stats.total,
      icon: ListChecks,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      key: "FUTURE" as const,
      label: "Agendados",
      value: stats.future,
      icon: CalendarClock,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      key: "IN_PROGRESS" as const,
      label: "Em curso",
      value: stats.inProgress,
      icon: Activity,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      key: "PAST" as const,
      label: "Terminados",
      value: stats.past,
      icon: History,
      iconClassName: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <StatsGrid cols={4}>
      {items.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          value={item.value}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
          onClick={() => onStatusSelect(item.key)}
        />
      ))}
    </StatsGrid>
  );
}

export { TrainingStats };
