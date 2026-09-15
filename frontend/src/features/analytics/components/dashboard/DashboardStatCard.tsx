import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "../../../../shared/components/ui/card/Card";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: DashboardStatCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-slate-950">
              {value}
            </p>
            <p className="text-sm text-slate-600">{description}</p>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClassName ?? "bg-slate-100 text-slate-700"}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { DashboardStatCard };
