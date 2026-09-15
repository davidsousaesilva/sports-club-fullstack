import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card/Card";
import type {
  PaymentMethod,
  UpdateInPersonPaymentFormValues,
} from "../model/finance.types";

type FinanceFormsSectionProps = {
  initialEditingPaymentId?: string;
  initialEditingMethod?: PaymentMethod;
  initialEditingAmount?: string;
  initialEditingEntity?: string;
  initialEditingReference?: string;
  initialEditingLimitDate?: string;
  initialEditingTerminalId?: string;
  onUpdateInPersonPayment: (
    paymentId: number,
    values: UpdateInPersonPaymentFormValues,
  ) => Promise<unknown>;
  isUpdatingPayment: boolean;
};

function FinanceFormsSection({
  initialEditingPaymentId = "",
  initialEditingMethod = "MULTIBANCO",
  initialEditingAmount = "",
  initialEditingEntity = "",
  initialEditingReference = "",
  initialEditingLimitDate = "",
  initialEditingTerminalId = "",
  onUpdateInPersonPayment,
  isUpdatingPayment,
}: FinanceFormsSectionProps) {
  const [editingPaymentId, setEditingPaymentId] = useState(
    initialEditingPaymentId,
  );
  const [editingMethod, setEditingMethod] =
    useState<PaymentMethod>(initialEditingMethod);
  const [editingAmount, setEditingAmount] = useState(initialEditingAmount);
  const [editingEntity, setEditingEntity] = useState(initialEditingEntity);
  const [editingReference, setEditingReference] = useState(
    initialEditingReference,
  );
  const [editingLimitDate, setEditingLimitDate] = useState(
    initialEditingLimitDate,
  );
  const [editingTerminalId, setEditingTerminalId] = useState(
    initialEditingTerminalId,
  );

  useEffect(() => {
    setEditingPaymentId(initialEditingPaymentId);
  }, [initialEditingPaymentId]);

  useEffect(() => {
    setEditingMethod(initialEditingMethod);
  }, [initialEditingMethod]);

  useEffect(() => {
    setEditingAmount(initialEditingAmount);
  }, [initialEditingAmount]);

  useEffect(() => {
    setEditingEntity(initialEditingEntity);
  }, [initialEditingEntity]);

  useEffect(() => {
    setEditingReference(initialEditingReference);
  }, [initialEditingReference]);

  useEffect(() => {
    setEditingLimitDate(initialEditingLimitDate);
  }, [initialEditingLimitDate]);

  useEffect(() => {
    setEditingTerminalId(initialEditingTerminalId);
  }, [initialEditingTerminalId]);

  const handleUpdatePaymentSubmit = async () => {
    const paymentId = Number(editingPaymentId);
    const confirmedAmount = Number(editingAmount);

    if (!paymentId || !confirmedAmount) {
      return;
    }

    await onUpdateInPersonPayment(paymentId, {
      method: editingMethod,
      confirmedAmount,
      mbEntity: editingEntity || null,
      mbReference: editingReference || null,
      limitDate: editingLimitDate
        ? new Date(editingLimitDate).toISOString()
        : null,
      terminalId: editingTerminalId || null,
    });

    setEditingPaymentId("");
    setEditingAmount("");
    setEditingEntity("");
    setEditingReference("");
    setEditingLimitDate("");
    setEditingTerminalId("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizar pagamento presencial</CardTitle>
        <CardDescription>
          Edite os principais campos de um registo de pagamento presencial.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <input
          value={editingPaymentId}
          onChange={(event) => setEditingPaymentId(event.target.value)}
          placeholder="ID do pagamento"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <select
          value={editingMethod}
          onChange={(event) =>
            setEditingMethod(event.target.value as PaymentMethod)
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="CASH">Numerário</option>
          <option value="MULTIBANCO">Multibanco</option>
          <option value="CARD">Cartão</option>
        </select>
        <input
          value={editingAmount}
          onChange={(event) => setEditingAmount(event.target.value)}
          placeholder="Montante confirmado"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          value={editingEntity}
          onChange={(event) => setEditingEntity(event.target.value)}
          placeholder="Entidade MB"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          value={editingReference}
          onChange={(event) => setEditingReference(event.target.value)}
          placeholder="Referência MB"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          type="datetime-local"
          value={editingLimitDate}
          onChange={(event) => setEditingLimitDate(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          value={editingTerminalId}
          onChange={(event) => setEditingTerminalId(event.target.value)}
          placeholder="ID do terminal"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <div className="md:col-span-2 xl:col-span-3">
          <Button
            onClick={() => {
              void handleUpdatePaymentSubmit();
            }}
            disabled={isUpdatingPayment}
          >
            {isUpdatingPayment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            Atualizar pagamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { FinanceFormsSection };
