import { Link2, Pencil, Trash2, XCircle } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import type {
  ExternalPaymentStatus,
  PaymentChannel,
  PaymentItem,
  PaymentMethod,
  PaymentStatus,
} from "../model/finance.types";

type FinancePaymentCardProps = {
  payment: PaymentItem;
  canManageFinance: boolean;
  isCancellingPayment: boolean;
  isDeletingPayment: boolean;
  onOpenRelatedFee: (payment: PaymentItem) => void;
  onCancelPayment: (payment: PaymentItem) => Promise<unknown>;
  onEditPayment: (payment: PaymentItem) => void;
  onDeleteInPersonPayment: (payment: PaymentItem) => Promise<unknown>;
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

function getPaymentStatusTone(status: PaymentStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-slate-200 text-slate-700";
    case "FAILED":
    case "EXPIRED":
      return "bg-rose-100 text-rose-700";
    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "CONFIRMED":
      return "Confirmado";
    case "CANCELLED":
      return "Cancelado";
    case "FAILED":
      return "Falhado";
    case "EXPIRED":
      return "Expirado";
    default:
      return status;
  }
}

function getMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "CASH":
      return "Numerário";
    case "MULTIBANCO":
      return "Multibanco";
    case "CARD":
      return "Cartão";
    default:
      return method;
  }
}

function getChannelLabel(channel: PaymentChannel): string {
  switch (channel) {
    case "INPERSON":
      return "Presencial";
    case "ONLINE":
      return "Online";
    default:
      return channel;
  }
}

function getExternalStatusLabel(status: ExternalPaymentStatus): string {
  switch (status) {
    case "NONE":
      return "Sem estado";
    case "PENDING":
      return "Pendente";
    case "WAITING":
      return "Em espera";
    case "AUTHORIZED":
      return "Autorizado";
    case "CAPTURED":
      return "Capturado";
    case "FAILED":
      return "Falhado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
}

function FinancePaymentCard({
  payment,
  canManageFinance,
  isCancellingPayment,
  isDeletingPayment,
  onOpenRelatedFee,
  onCancelPayment,
  onEditPayment,
  onDeleteInPersonPayment,
}: FinancePaymentCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-slate-950">
              Pagamento #{payment.id}
            </p>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusTone(
                payment.status,
              )}`}
            >
              {getPaymentStatusLabel(payment.status)}
            </span>

            <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
              {getMethodLabel(payment.method)}
            </span>

            <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              {getChannelLabel(payment.channel)}
            </span>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
            <p>
              <span className="font-medium text-slate-900">ID da quota:</span>{" "}
              {payment.feeId}
            </p>
            <p>
              <span className="font-medium text-slate-900">Versão:</span>{" "}
              {payment.version}
            </p>
            <p>
              <span className="font-medium text-slate-900">Criado em:</span>{" "}
              {formatDateTime(payment.creationDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Confirmado em:</span>{" "}
              {formatDateTime(payment.confirmationDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Limite:</span>{" "}
              {formatDateTime(payment.limitDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Gateway:</span>{" "}
              {payment.gateway ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">ID externo:</span>{" "}
              {payment.externalId ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">
                Estado externo:
              </span>{" "}
              {getExternalStatusLabel(payment.externalStatus)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Entidade MB:</span>{" "}
              {payment.mbEntity ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Referência MB:</span>{" "}
              {payment.mbReference ?? "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">
                ID do terminal:
              </span>{" "}
              {payment.terminalId ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex min-w-[220px] flex-col items-start gap-3 xl:items-end">
          <div className="text-left xl:text-right">
            <p className="text-xl font-semibold text-slate-950">
              {formatCurrency(payment.confirmedAmount)}
            </p>
            <p className="text-sm text-slate-500">
              Original: {formatCurrency(payment.originalAmount)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenRelatedFee(payment)}
            >
              <Link2 className="h-4 w-4" />
              Ver quota
            </Button>

            {payment.canBeCancelled && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void onCancelPayment(payment);
                }}
                disabled={isCancellingPayment}
              >
                <XCircle className="h-4 w-4" />
                Cancelar
              </Button>
            )}

            {canManageFinance && payment.channel === "INPERSON" && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEditPayment(payment)}
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    void onDeleteInPersonPayment(payment);
                  }}
                  disabled={isDeletingPayment}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export { FinancePaymentCard };