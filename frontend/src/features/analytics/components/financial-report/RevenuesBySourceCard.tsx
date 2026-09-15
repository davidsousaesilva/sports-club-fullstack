import { Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { RevenueSourceItem } from "../../model/financial-report/financial-report.types";

interface RevenuesBySourceCardProps {
  items: RevenueSourceItem[];
  isLoading?: boolean;
}

function RevenuesBySourceCard({
  items,
  isLoading = false,
}: RevenuesBySourceCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Receitas por origem
            </CardTitle>
            <p className="text-sm text-slate-500">
              Distribuição das origens de receita
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
              <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existem dados disponíveis sobre origens de receita.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-950">
                    €{item.value.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">{item.percentage}%</p>
                </div>
              </div>

              <div className="h-2.5 rounded-full bg-slate-200">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export { RevenuesBySourceCard };
