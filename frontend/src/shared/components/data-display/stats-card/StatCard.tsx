import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "../../ui/card/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
  isLoading?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-slate-100 text-slate-700",
  valueClassName = "text-slate-950",
  isLoading = false,
  isActive = false,
  onClick,
  className = "",
}: StatCardProps) {
  const content = (
    <Card
      className={[
        "border border-slate-200 shadow-sm transition-all",
        onClick ? "hover:border-slate-300 hover:shadow-md" : "",
        isActive ? "border-slate-300 ring-1 ring-slate-200" : "",
        className,
      ].join(" ")}
    >
      <CardContent className="flex items-center justify-between gap-3 p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-14 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p
                className={`mt-1 truncate text-lg font-semibold ${valueClassName}`}
              >
                {value}
              </p>
            </div>

            {Icon ? (
              <div className={`rounded-xl p-2.5 ${iconClassName}`}>
                <Icon className="h-4 w-4" />
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (!onClick) {
    return content;
  }

  return (
    <button type="button" onClick={onClick} className="text-left">
      {content}
    </button>
  );
}

export { StatCard };
export type { StatCardProps };
