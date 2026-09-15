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
import type { FeeItem, PaymentItem } from "../model/finance.types";

type FinanceFeePaymentDetailsDialogProps = {
  isOpen: boolean;
  fee: FeeItem | null;
  payment: PaymentItem | null;
  isLoading: boolean;
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

function FinanceFeePaymentDetailsDialog({
  isOpen,
  fee,
  payment,
  isLoading,
  onClose,
}: FinanceFeePaymentDetailsDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagamento associado</DialogTitle>
          <DialogDescription>
            Dados contextuais do pagamento para a quota selecionada.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : !fee ? null : payment ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Wallet className="h-4 w-4" />
                <p className="text-sm font-semibold">Pagamento #{payment.id}</p>
              </div>
              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-900">Estado:</span>{" "}
                  {payment.status}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Método:</span>{" "}
                  {payment.method}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Canal:</span>{" "}
                  {payment.channel}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Montante:</span>{" "}
                  {formatCurrency(payment.confirmedAmount)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Criado em:</span>{" "}
                  {formatDateTime(payment.creationDate)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Confirmado em:</span>{" "}
                  {formatDateTime(payment.confirmationDate)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Receipt className="h-4 w-4" />
                <p className="text-sm font-semibold">Quota #{fee.id}</p>
              </div>
              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-900">Tipo:</span>{" "}
                  {fee.type}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Estado:</span>{" "}
                  {fee.status}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Montante:</span>{" "}
                  {formatCurrency(fee.amount)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Vencimento:</span>{" "}
                  {formatDateTime(fee.dueDate)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Não existe atualmente nenhum pagamento associado a esta quota.
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

export { FinanceFeePaymentDetailsDialog };