import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "../../../../shared/components/ui/card/Card";

interface FinanceReportStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  isLoading?: boolean;
}

function FinanceReportStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  isLoading = false,
}: FinanceReportStatCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-8 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-3xl font-semibold tracking-tight text-slate-950">
                {value}
              </p>
              <p className="text-sm text-slate-500">{description}</p>
            </div>

            <div
              className={`rounded-xl p-3 ${iconClassName ?? "bg-slate-100 text-slate-700"}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { FinanceReportStatCard };
