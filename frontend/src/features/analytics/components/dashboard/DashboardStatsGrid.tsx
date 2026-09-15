import type { LucideIcon } from "lucide-react";

import { DashboardStatCard } from "./DashboardStatCard";

interface DashboardStatsGridItem {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

interface DashboardStatsGridProps {
  items: DashboardStatsGridItem[];
  isLoading?: boolean;
}

function DashboardStatsGrid({
  items,
  isLoading = false,
}: DashboardStatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <DashboardStatCard key={item.title} {...item} />
      ))}
    </div>
  );
}

export { DashboardStatsGrid };
