import { Activity, CheckCircle2, CircleSlash } from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../../shared/components/data-display/stats-card";
import type { ModalityFilterStatus } from "../../model/modalities.types";

interface ModalitiesStatsProps {
  totalCount: number;
  trainedCount: number;
  untrainedCount: number;
  activeFilter: ModalityFilterStatus;
  onFilterChange: (value: ModalityFilterStatus) => void;
}

function ModalitiesStats({
  totalCount,
  trainedCount,
  untrainedCount,
  activeFilter,
  onFilterChange,
}: ModalitiesStatsProps) {
  const items = [
    {
      value: "ALL" as const,
      label: "Total de modalidades",
      count: totalCount,
      icon: Activity,
      iconClassName: "bg-sky-100 text-sky-700",
    },
    {
      value: "TRAINED" as const,
      label: "Com treino ativo",
      count: trainedCount,
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      value: "UNTRAINED" as const,
      label: "Sem treino ativo",
      count: untrainedCount,
      icon: CircleSlash,
      iconClassName: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <StatsGrid cols={3}>
      {items.map((item) => (
        <StatCard
          key={item.value}
          label={item.label}
          value={item.count}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isActive={activeFilter === item.value}
          onClick={() => onFilterChange(item.value)}
        />
      ))}
    </StatsGrid>
  );
}

export { ModalitiesStats };
