import { CalendarClock, CalendarDays, Flag, Trophy } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../../shared/components/data-display/stats-card";
import type { CompetitionStats as CompetitionStatsValues } from "../../model/competition/competition.types";

interface CompetitionStatsProps {
  stats: CompetitionStatsValues;
  isLoading: boolean;
}

function CompetitionStats({ stats, isLoading }: CompetitionStatsProps) {
  const items = [
    {
      label: "Competições",
      value: stats.total,
      icon: Trophy,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      label: "Agendadas",
      value: stats.future,
      icon: CalendarDays,
      iconClassName: "bg-sky-50 text-sky-600",
    },
    {
      label: "Em curso",
      value: stats.inProgress,
      icon: CalendarClock,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Terminadas",
      value: stats.past,
      icon: Flag,
      iconClassName: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <StatsGrid cols={4}>
      {items.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
        />
      ))}
    </StatsGrid>
  );
}

export { CompetitionStats };
