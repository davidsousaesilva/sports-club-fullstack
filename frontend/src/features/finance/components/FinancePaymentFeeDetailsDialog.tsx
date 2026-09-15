import { Loader2, Receipt, Wallet } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import type {
  FeeItem,
  FeeType,
  PaymentItem,
  PaymentMethod,
  PaymentStatus,
} from "../model/finance.types";

type RelatedFeeDialogState = {
  isOpen: boolean;
  payment: PaymentItem | null;
};

type FinancePaymentFeeDetailsDialogProps = {
  dialog: RelatedFeeDialogState;
  relatedFee: FeeItem | null;
  isLoadingRelatedFee: boolean;
  onClose: () => void;
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
    default:
      return status;
  }
}

function getPaymentMethodLabel(method: PaymentMethod): string {
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

function getFeeTypeLabel(type: FeeType): string {
  switch (type) {
    case "REGISTRATION":
      return "Inscrição";
    case "MONTHLYFEE":
      return "Quota mensal";
    case "COMPETITIONFEE":
      return "Taxa de competição";
    default:
      return type;
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

function FinancePaymentFeeDetailsDialog({
  dialog,
  relatedFee,
  isLoadingRelatedFee,
  onClose,
}: FinancePaymentFeeDetailsDialogProps) {
  return (
    <Dialog
      open={dialog.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quota associada</DialogTitle>
          <DialogDescription>
            Dados contextuais da quota para o pagamento selecionado.
          </DialogDescription>
        </DialogHeader>

        {isLoadingRelatedFee ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : dialog.payment && relatedFee ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Wallet className="h-4 w-4" />
                <p className="text-sm font-semibold">
                  Pagamento #{dialog.payment.id}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-900">Estado:</span>{" "}
                  {getPaymentStatusLabel(dialog.payment.status)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Método:</span>{" "}
                  {getPaymentMethodLabel(dialog.payment.method)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Montante:</span>{" "}
                  {formatCurrency(dialog.payment.confirmedAmount)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">
                    ID da quota:
                  </span>{" "}
                  {dialog.payment.feeId}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Receipt className="h-4 w-4" />
                <p className="text-sm font-semibold">Quota #{relatedFee.id}</p>
              </div>

              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-900">Tipo:</span>{" "}
                  {getFeeTypeLabel(relatedFee.type)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Estado:</span>{" "}
                  {getFeeStatusLabel(relatedFee.status)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Atleta:</span>{" "}
                  {relatedFee.athleteName ?? "—"}
                </p>
                <p>
                  <span className="font-medium text-slate-900">
                    Vencimento:
                  </span>{" "}
                  {formatDateTime(relatedFee.dueDate)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Não foi possível carregar uma quota para este pagamento.
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { RelatedFeeDialogState };
export { FinancePaymentFeeDetailsDialog };
