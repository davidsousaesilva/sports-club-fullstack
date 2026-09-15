import { Briefcase, ShieldCheck, Users } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../../shared/components/data-display/stats-card";

interface PeopleStatsProps {
  stats: {
    totalPeople: number;
    athleteCount: number;
    coachCount: number;
    staffCount: number;
  };
  isLoading?: boolean;
}

const statItems = [
  {
    key: "totalPeople",
    title: "Pessoas",
    icon: Users,
    iconClassName: "bg-slate-100 text-slate-700",
  },
  {
    key: "athleteCount",
    title: "Atletas",
    icon: ShieldCheck,
    iconClassName: "bg-orange-100 text-orange-700",
  },
  {
    key: "coachCount",
    title: "Treinadores",
    icon: Users,
    iconClassName: "bg-blue-100 text-blue-700",
  },
  {
    key: "staffCount",
    title: "Staff",
    icon: Briefcase,
    iconClassName: "bg-violet-100 text-violet-700",
  },
] as const;

function PeopleStats({ stats, isLoading = false }: PeopleStatsProps) {
  return (
    <StatsGrid cols={4}>
      {statItems.map((item) => (
        <StatCard
          key={item.key}
          label={item.title}
          value={stats[item.key]}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
        />
      ))}
    </StatsGrid>
  );
}

export { PeopleStats };
