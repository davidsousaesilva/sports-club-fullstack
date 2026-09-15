import type { LucideIcon } from "lucide-react";

import { FinanceReportStatCard } from "./FinanceReportStatCard";

interface FinanceReportStatsGridItem {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

interface FinanceReportStatsGridProps {
  items: FinanceReportStatsGridItem[];
  isLoading?: boolean;
}

function FinanceReportStatsGrid({
  items,
  isLoading = false,
}: FinanceReportStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
      {items.map((item) => (
        <FinanceReportStatCard
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

export { FinanceReportStatsGrid };
