import { Landmark, Loader2 } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import type { FeeItem, OnlinePaymentDetails } from "../model/finance.types";

type FinanceOnlinePaymentDialogProps = {
  isOpen: boolean;
  fee: FeeItem | null;
  payment: OnlinePaymentDetails | null;
  isStarting: boolean;
  isPolling: boolean;
  isSimulatingConfirmation: boolean;
  onSimulateConfirmation: (externalPaymentId: string) => Promise<unknown>;
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

function FinanceOnlinePaymentDialog({
  isOpen,
  fee,
  payment,
  isStarting,
  isPolling,
  isSimulatingConfirmation,
  onSimulateConfirmation,
  onClose,
}: FinanceOnlinePaymentDialogProps) {
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
          <DialogTitle>Pagamento Multibanco online</DialogTitle>
          <DialogDescription>
            Dados de referência da quota selecionada e estado atual do pagamento.
          </DialogDescription>
        </DialogHeader>

        {isStarting ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : payment ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Landmark className="h-4 w-4" />
                <p className="text-sm font-semibold">
                  Pagamento #{payment.paymentId}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-900">ID da quota:</span>{" "}
                  {payment.feeId}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Montante:</span>{" "}
                  {formatCurrency(payment.amount)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Entidade:</span>{" "}
                  {payment.entity}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Referência:</span>{" "}
                  {payment.reference}
                </p>
                <p>
                  <span className="font-medium text-slate-900">ID externo:</span>{" "}
                  {payment.externalId}
                </p>
                <p>
                  <span className="font-medium text-slate-900">
                    Válido até:
                  </span>{" "}
                  {formatDateTime(payment.validUntil)}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Estado:</span>{" "}
                  {payment.status}
                </p>
                <p>
                  <span className="font-medium text-slate-900">
                    Estado externo:
                  </span>{" "}
                  {payment.externalStatus}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Confirmado em:</span>{" "}
                  {formatDateTime(payment.confirmationDate)}
                </p>
              </div>
            </div>

            {payment.status === "PENDING" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-950">
                      Ambiente de teste
                    </p>
                    <p className="text-sm text-amber-800">
                      Em produção, esta confirmação seria enviada automaticamente
                      pelo gateway de pagamento através de callback/webhook após o pagamento
                      por Multibanco. Neste protótipo académico, este botão
                      simula essa confirmação externa.
                    </p>
                  </div>

                  <Button
                    type="button"
                    disabled={isSimulatingConfirmation}
                    onClick={() => {
                      void onSimulateConfirmation(payment.externalId);
                    }}
                  >
                    {isSimulatingConfirmation
                      ? "A confirmar..."
                      : "Simular confirmação do gateway"}
                  </Button>
                </div>
              </div>
            )}

            {fee && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Quota #{fee.id}
                </p>
                <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                  <p>
                    <span className="font-medium text-slate-900">Tipo:</span>{" "}
                    {fee.type}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Montante:</span>{" "}
                    {formatCurrency(fee.amount)}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Atleta:</span>{" "}
                    {fee.athleteName ?? "—"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Vencimento:</span>{" "}
                    {formatDateTime(fee.dueDate)}
                  </p>
                </div>
              </div>
            )}

            {isPolling && (
              <p className="text-sm text-slate-500">
                O estado do pagamento está a ser atualizado automaticamente.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Os dados do pagamento não estão disponíveis.
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

export { FinanceOnlinePaymentDialog };