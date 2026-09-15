import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { DashboardDebtFeeItem } from "../../model/dashboard/dashboard.types";

interface DebtFeesCardProps {
  items: DashboardDebtFeeItem[];
  isLoading?: boolean;
  icon: LucideIcon;
}

function DebtFeesCard({
  items,
  isLoading = false,
  icon: Icon,
}: DebtFeesCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Quotas em dívida
            </CardTitle>
            <p className="text-sm text-slate-500">
              Itens de quota em aberto à espera de pagamento
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não foram encontradas quotas em dívida.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">
                    Quota #{item.id}
                  </p>
                  <p className="text-sm text-slate-500">
                    Data limite:{" "}
                    {new Date(item.dueDate).toLocaleDateString("pt-PT")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-base font-semibold text-slate-950">
                    €{item.amount.toFixed(2)}
                  </p>
                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Dívida
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { DebtFeesCard };
