import { CalendarCheck2, UserCheck, Users } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../../shared/components/data-display/stats-card";

interface SelfGuidedTrainingStatsProps {
  stats: {
    totalAthletes: number;
    presentToday: number;
    weeklyRegistered: number;
  };
}

function SelfGuidedTrainingStats({ stats }: SelfGuidedTrainingStatsProps) {
  const items = [
    {
      label: "Atletas",
      value: stats.totalAthletes,
      icon: Users,
      iconClassName: "bg-slate-100 text-slate-700",
      valueClassName: "text-slate-950",
    },
    {
      label: "Presentes hoje",
      value: stats.presentToday,
      icon: UserCheck,
      iconClassName: "bg-emerald-100 text-emerald-700",
      valueClassName: "text-emerald-600",
    },
    {
      label: "Registos semanais",
      value: stats.weeklyRegistered,
      icon: CalendarCheck2,
      iconClassName: "bg-blue-100 text-blue-700",
      valueClassName: "text-slate-950",
    },
  ];

  return (
    <StatsGrid cols={3}>
      {items.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          iconClassName={item.iconClassName}
          valueClassName={item.valueClassName}
        />
      ))}
    </StatsGrid>
  );
}

export { SelfGuidedTrainingStats };
