import { Banknote, CreditCard, Landmark, Link2, Loader2 } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import type { FeeItem } from "../model/finance.types";

type FinanceFeeCardProps = {
  fee: FeeItem;
  canManageFinance: boolean;
  isStartingOnlinePayment: boolean;
  activeOnlineFeeId: number | null;
  onOpenCashPayment: (fee: FeeItem) => void;
  onOpenInPersonPayment: (fee: FeeItem) => void;
  onOpenPaymentDetails: (fee: FeeItem) => void;
  onStartOnlinePayment: (fee: FeeItem) => Promise<unknown>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString("pt-PT");
}

function getFeeStatusTone(status: FeeItem["status"]): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700";
    case "DEBT":
      return "bg-rose-100 text-rose-700";
    case "UNPAID":
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function getFeeStatusLabel(status: FeeItem["status"]): string {
  switch (status) {
    case "UNPAID":
      return "Por pagar";
    case "PAID":
      return "Paga";
    case "DEBT":
      return "Em dívida";
    default:
      return status;
  }
}

function getFeeTypeLabel(type: FeeItem["type"]): string {
  switch (type) {
    case "MONTHLYFEE":
      return "Quota mensal";
    case "REGISTRATION":
      return "Inscrição";
    case "COMPETITIONFEE":
      return "Taxa de competição";
    default:
      return type;
  }
}

function FinanceFeeCard({
  fee,
  canManageFinance,
  isStartingOnlinePayment,
  activeOnlineFeeId,
  onOpenCashPayment,
  onOpenInPersonPayment,
  onOpenPaymentDetails,
  onStartOnlinePayment,
}: FinanceFeeCardProps) {
  const isCurrentOnlineAction =
    isStartingOnlinePayment && activeOnlineFeeId === fee.id;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-slate-950">
              Quota #{fee.id}
            </p>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getFeeStatusTone(
                fee.status,
              )}`}
            >
              {getFeeStatusLabel(fee.status)}
            </span>

            <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
              {getFeeTypeLabel(fee.type)}
            </span>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
            <p>
              <span className="font-medium text-slate-900">Atleta:</span>{" "}
              {fee.athleteName ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Equipa:</span>{" "}
              {fee.teamName ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Criada em:</span>{" "}
              {formatDateTime(fee.creationDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Vencimento:</span>{" "}
              {formatDateTime(fee.dueDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Próximo ciclo:</span>{" "}
              {formatDateTime(fee.nextCycle)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Recorrente:</span>{" "}
              {fee.recurrent ? "Sim" : "Não"}
            </p>
            <p>
              <span className="font-medium text-slate-900">ID do atleta:</span>{" "}
              {fee.athleteId}
            </p>
            <p>
              <span className="font-medium text-slate-900">ID da equipa:</span>{" "}
              {fee.teamId ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex min-w-[220px] flex-col items-start gap-3 xl:items-end">
          <div className="text-left xl:text-right">
            <p className="text-xl font-semibold text-slate-950">
              {formatCurrency(fee.amount)}
            </p>
            <p className="text-sm text-slate-500">
              Pagamento associado #{fee.paymentId ?? "—"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenPaymentDetails(fee)}
            >
              <Link2 className="h-4 w-4" />
              Ver pagamento
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void onStartOnlinePayment(fee);
              }}
              disabled={isStartingOnlinePayment}
            >
              {isCurrentOnlineAction ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Landmark className="h-4 w-4" />
              )}
              MB online
            </Button>

            {canManageFinance && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onOpenCashPayment(fee)}
                >
                  <Banknote className="h-4 w-4" />
                  Numerário
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenInPersonPayment(fee)}
                >
                  <CreditCard className="h-4 w-4" />
                  MB presencial
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export { FinanceFeeCard };