import { CalendarClock, Clock3, History, TimerReset } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../../shared/components/data-display/stats-card";
import type { EventStats as EventStatsType } from "../../model/event/event.types";

interface EventStatsProps {
  stats: EventStatsType;
  isLoading: boolean;
}

const items = [
  {
    key: "total",
    label: "Total de eventos",
    icon: CalendarClock,
    iconClassName: "bg-slate-100 text-slate-700",
  },
  {
    key: "future",
    label: "Agendados",
    icon: TimerReset,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    key: "inProgress",
    label: "Em curso",
    icon: Clock3,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "past",
    label: "Terminados",
    icon: History,
    iconClassName: "bg-slate-100 text-slate-500",
  },
] as const;

function EventStats({ stats, isLoading }: EventStatsProps) {
  return (
    <StatsGrid cols={4}>
      {items.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          value={stats[item.key]}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
        />
      ))}
    </StatsGrid>
  );
}

export { EventStats };
