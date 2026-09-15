import type { LucideIcon } from "lucide-react";

import { SportsReportStatCard } from "./SportsReportStatCard";

interface SportsReportStatsGridItem {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

interface SportsReportStatsGridProps {
  items: SportsReportStatsGridItem[];
  isLoading?: boolean;
}

function SportsReportStatsGrid({
  items,
  isLoading = false,
}: SportsReportStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
      {items.map((item) => (
        <SportsReportStatCard
          key={item.title}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export { SportsReportStatsGrid };
