import { Activity, ShieldCheck, Users } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../shared/components/data-display/stats-card";
import type { TeamStats as TeamStatsValues } from "../model/team.types";

interface TeamStatsProps {
  stats: TeamStatsValues;
  isLoading: boolean;
  onFilterSelect: (value: "ALL" | "ACTIVE" | "INACTIVE") => void;
}

function TeamStats({ stats, isLoading, onFilterSelect }: TeamStatsProps) {
  const items = [
    {
      key: "ALL" as const,
      label: "Total de equipas",
      value: stats.totalTeams,
      icon: Users,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      key: "ACTIVE" as const,
      label: "Equipas ativas",
      value: stats.activeTeams,
      icon: ShieldCheck,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      key: "INACTIVE" as const,
      label: "Equipas inativas",
      value: stats.inactiveTeams,
      icon: Activity,
      iconClassName: "bg-slate-100 text-slate-500",
    },
  ];

  return (
    <StatsGrid cols={3}>
      {items.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          value={item.value}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
          onClick={() => onFilterSelect(item.key)}
        />
      ))}
    </StatsGrid>
  );
}

export { TeamStats };
