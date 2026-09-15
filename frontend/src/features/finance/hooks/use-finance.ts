import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth/hooks/use-permissions";
import {
  cancelPendingPayment,
  deleteInPersonPayment,
  getFeeByPayment,
  getMultibancoPaymentData,
  getPaymentByFee,
  getPaymentStatus,
  listAthleteDebts,
  listAthleteFees,
  listAthletePayments,
  listFees,
  listPayments,
  registerCashPayment,
  registerMultibancoInPersonPayment,
  simulateGatewayConfirmation,
  startMultibancoOnlinePayment,
  updateInPersonPayment,
} from "../api/finance";
import type {
  FeeFilterStatus,
  FeeFilterType,
  FeeFilterValues,
  FeeItem,
  FinanceScope,
  MultibancoPaymentData,
  OnlinePaymentDetails,
  PaymentItem,
  PaymentStatus,
  PaymentStatusData,
  RegisterCashPaymentFormValues,
  RegisterMultibancoInPersonPaymentFormValues,
  StartMultibancoOnlineFormValues,
  StartMultibancoOnlineResponse,
  UpdateInPersonPaymentFormValues,
} from "../model/finance.types";

const FINANCE_QUERY_KEY = ["finance"];
const ONLINE_PAYMENT_STATUS_QUERY_KEY = [
  ...FINANCE_QUERY_KEY,
  "online-payment-status",
];
const ONLINE_PAYMENT_POLLING_INTERVAL = 5000;

function isTerminalStatus(status: PaymentStatus): boolean {
  return (
    status === "CONFIRMED" ||
    status === "CANCELLED" ||
    status === "EXPIRED" ||
    status === "FAILED"
  );
}

function buildOnlinePaymentDetails(
  startResponse: StartMultibancoOnlineResponse,
  paymentData: MultibancoPaymentData | null,
  statusData: PaymentStatusData | null,
  feeId: number,
): OnlinePaymentDetails {
  return {
    paymentId: startResponse.paymentId,
    feeId,
    entity: paymentData?.entity ?? startResponse.entity,
    reference: paymentData?.reference ?? startResponse.reference,
    externalId: startResponse.externalId,
    amount: paymentData?.amount ?? startResponse.amount,
    validUntil: paymentData?.limitDate ?? startResponse.validUntil,
    status: statusData?.status ?? paymentData?.status ?? startResponse.status,
    externalStatus: statusData?.externalStatus ?? "PENDING",
    confirmationDate: statusData?.confirmationDate ?? null,
    canBeCancelled: statusData?.canBeCancelled ?? true,
  };
}

function useFinance() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { activeRole } = usePermissions();

  const scope: FinanceScope = activeRole === "ATHLETE" ? "ATHLETE" : "MANAGER";

  const [filters, setFilters] = useState<FeeFilterValues>({
    status: "ALL",
    type: "ALL",
    athleteName: "",
  });
  const [relatedPayment, setRelatedPayment] = useState<PaymentItem | null>(
    null,
  );
  const [relatedFee, setRelatedFee] = useState<FeeItem | null>(null);
  const [onlinePayment, setOnlinePayment] =
    useState<OnlinePaymentDetails | null>(null);
  const [activeOnlineFeeId, setActiveOnlineFeeId] = useState<number | null>(
    null,
  );
  const [activeOnlinePaymentId, setActiveOnlinePaymentId] = useState<
    number | null
  >(null);
  const [isOnlinePaymentDialogOpen, setIsOnlinePaymentDialogOpen] =
    useState(false);

  const athleteId = scope === "ATHLETE" ? (user?.id ?? null) : null;
  const athleteName = scope === "ATHLETE" ? (user?.name ?? null) : null;
  const canManageFinance =
    activeRole === "MANAGER" || activeRole === "EMPLOYEE";

  const feesQuery = useQuery({
    queryKey: [...FINANCE_QUERY_KEY, "fees", scope, athleteId, filters],
    queryFn: async () => {
      if (scope === "ATHLETE" && athleteId) {
        return listAthleteFees(athleteId, filters);
      }

      return listFees(filters);
    },
    retry: false,
  });

  const debtsQuery = useQuery({
    queryKey: [...FINANCE_QUERY_KEY, "debts", athleteId],
    queryFn: async () => {
      if (!athleteId) {
        return [];
      }

      return listAthleteDebts(athleteId);
    },
    enabled: scope === "ATHLETE" && athleteId !== null,
    retry: false,
  });

  const paymentsQuery = useQuery({
    queryKey: [...FINANCE_QUERY_KEY, "payments", scope, athleteId],
    queryFn: async () => {
      if (scope === "ATHLETE" && athleteId) {
        return listAthletePayments(athleteId);
      }

      return listPayments();
    },
    retry: false,
  });

  const onlinePaymentStatusQuery = useQuery({
    queryKey: [...ONLINE_PAYMENT_STATUS_QUERY_KEY, activeOnlinePaymentId],
    queryFn: async () => {
      if (!activeOnlinePaymentId || !onlinePayment) {
        return null;
      }

      const [paymentStatusData, multibancoPaymentData] = await Promise.all([
        getPaymentStatus(activeOnlinePaymentId),
        getMultibancoPaymentData(activeOnlinePaymentId),
      ]);

      return {
        paymentStatusData,
        multibancoPaymentData,
      };
    },
    enabled:
      isOnlinePaymentDialogOpen &&
      activeOnlinePaymentId !== null &&
      onlinePayment !== null,
    refetchInterval: (query) => {
      const data = query.state.data as
        | {
            paymentStatusData: PaymentStatusData;
            multibancoPaymentData: MultibancoPaymentData;
          }
        | null
        | undefined;

      if (
        !isOnlinePaymentDialogOpen ||
        !activeOnlinePaymentId ||
        !onlinePayment
      ) {
        return false;
      }

      const status = data?.paymentStatusData?.status ?? onlinePayment.status;

      return isTerminalStatus(status) ? false : ONLINE_PAYMENT_POLLING_INTERVAL;
    },
    refetchIntervalInBackground: true,
    retry: false,
  });

  useEffect(() => {
    const statusData = onlinePaymentStatusQuery.data?.paymentStatusData;
    const paymentData = onlinePaymentStatusQuery.data?.multibancoPaymentData;

    if (!onlinePayment || !statusData) {
      return;
    }

    setOnlinePayment((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        entity: paymentData?.entity ?? current.entity,
        reference: paymentData?.reference ?? current.reference,
        amount: paymentData?.amount ?? current.amount,
        validUntil: paymentData?.limitDate ?? current.validUntil,
        status: statusData.status,
        externalStatus: statusData.externalStatus,
        confirmationDate: statusData.confirmationDate,
        canBeCancelled: statusData.canBeCancelled,
      };
    });
  }, [onlinePayment, onlinePaymentStatusQuery.data]);

  const invalidateFinance = async () => {
    await queryClient.invalidateQueries({
      queryKey: FINANCE_QUERY_KEY,
    });
  };

  const registerCashPaymentMutation = useMutation({
    mutationFn: (values: RegisterCashPaymentFormValues) =>
      registerCashPayment(values),
    onSuccess: invalidateFinance,
  });

  const registerMultibancoInPersonPaymentMutation = useMutation({
    mutationFn: (values: RegisterMultibancoInPersonPaymentFormValues) =>
      registerMultibancoInPersonPayment(values),
    onSuccess: invalidateFinance,
  });

  const startMultibancoOnlinePaymentMutation = useMutation({
    mutationFn: async (values: StartMultibancoOnlineFormValues) => {
      const startResponse = await startMultibancoOnlinePayment(values);

      let paymentData: MultibancoPaymentData | null = null;
      let statusData: PaymentStatusData | null = null;

      try {
        paymentData = await getMultibancoPaymentData(startResponse.paymentId);
      } catch {
        paymentData = null;
      }

      try {
        statusData = await getPaymentStatus(startResponse.paymentId);
      } catch {
        statusData = null;
      }

      return buildOnlinePaymentDetails(
        startResponse,
        paymentData,
        statusData,
        values.feeId,
      );
    },
    onSuccess: async (details) => {
      setActiveOnlineFeeId(details.feeId);
      setActiveOnlinePaymentId(details.paymentId);
      setOnlinePayment(details);
      setIsOnlinePaymentDialogOpen(true);
      await invalidateFinance();
    },
  });

  const simulateGatewayConfirmationMutation = useMutation({
    mutationFn: async (externalPaymentId: string) => {
      await simulateGatewayConfirmation({ externalPaymentId });
    },
    onSuccess: async () => {
      await invalidateFinance();

      if (!activeOnlinePaymentId) {
        return;
      }

      const [paymentStatusData, multibancoPaymentData] = await Promise.all([
        getPaymentStatus(activeOnlinePaymentId),
        getMultibancoPaymentData(activeOnlinePaymentId),
      ]);

      setOnlinePayment((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          entity: multibancoPaymentData.entity,
          reference: multibancoPaymentData.reference,
          amount: multibancoPaymentData.amount,
          validUntil: multibancoPaymentData.limitDate,
          status: paymentStatusData.status,
          externalStatus: paymentStatusData.externalStatus,
          confirmationDate: paymentStatusData.confirmationDate,
          canBeCancelled: paymentStatusData.canBeCancelled,
        };
      });
    },
  });

  const cancelPaymentMutation = useMutation({
    mutationFn: (payment: PaymentItem) => cancelPendingPayment(payment),
    onSuccess: invalidateFinance,
  });

  const updateInPersonPaymentMutation = useMutation({
    mutationFn: ({
      payment,
      values,
    }: {
      payment: PaymentItem;
      values: UpdateInPersonPaymentFormValues;
    }) => updateInPersonPayment(payment, values),
    onSuccess: invalidateFinance,
  });

  const deleteInPersonPaymentMutation = useMutation({
    mutationFn: (payment: PaymentItem) => deleteInPersonPayment(payment),
    onSuccess: invalidateFinance,
  });

  const loadPaymentByFeeMutation = useMutation({
    mutationFn: async (feeId: number) => getPaymentByFee(feeId),
    onSuccess: (payment) => {
      setRelatedPayment(payment);
    },
  });

  const loadFeeByPaymentMutation = useMutation({
    mutationFn: async (paymentId: number) => getFeeByPayment(paymentId),
    onSuccess: (fee) => {
      setRelatedFee(fee);
    },
  });

  const isLoading =
    feesQuery.isLoading || paymentsQuery.isLoading || debtsQuery.isLoading;
  const isFetching =
    feesQuery.isFetching || paymentsQuery.isFetching || debtsQuery.isFetching;

  const closeOnlinePayment = () => {
    setIsOnlinePaymentDialogOpen(false);
    setOnlinePayment(null);
    setActiveOnlineFeeId(null);
    setActiveOnlinePaymentId(null);
    void queryClient.removeQueries({
      queryKey: ONLINE_PAYMENT_STATUS_QUERY_KEY,
    });
  };

  const openOnlinePayment = async (
    values: StartMultibancoOnlineFormValues,
  ): Promise<OnlinePaymentDetails> => {
    setActiveOnlineFeeId(values.feeId);
    setIsOnlinePaymentDialogOpen(true);

    return startMultibancoOnlinePaymentMutation.mutateAsync(values);
  };

  return {
    scope,
    athleteId,
    athleteName,
    canManageFinance,
    fees: feesQuery.data ?? [],
    debts: debtsQuery.data ?? [],
    payments: paymentsQuery.data ?? [],
    relatedPayment,
    relatedFee,
    onlinePayment,
    activeOnlineFeeId,
    isOnlinePaymentDialogOpen,
    selectedStatus: filters.status,
    selectedType: filters.type,
    athleteSearch: filters.athleteName,
    setStatus: (status: FeeFilterStatus) =>
      setFilters((current) => ({ ...current, status })),
    setType: (type: FeeFilterType) =>
      setFilters((current) => ({ ...current, type })),
    setAthleteSearch: (athleteNameValue: string) =>
      setFilters((current) => ({
        ...current,
        athleteName: athleteNameValue,
      })),
    refetch: invalidateFinance,
    registerCashPayment: registerCashPaymentMutation.mutateAsync,
    registerMultibancoInPersonPayment:
      registerMultibancoInPersonPaymentMutation.mutateAsync,
    startMultibancoOnlinePayment: openOnlinePayment,
    simulateGatewayConfirmation:
      simulateGatewayConfirmationMutation.mutateAsync,
    closeOnlinePayment,
    cancelPayment: cancelPaymentMutation.mutateAsync,
    updateInPersonPayment: (
      payment: PaymentItem,
      values: UpdateInPersonPaymentFormValues,
    ) =>
      updateInPersonPaymentMutation.mutateAsync({
        payment,
        values,
      }),
    deleteInPersonPayment: deleteInPersonPaymentMutation.mutateAsync,
    loadPaymentByFee: async (feeId: number) => {
      setRelatedPayment(null);
      return loadPaymentByFeeMutation.mutateAsync(feeId);
    },
    loadFeeByPayment: async (paymentId: number) => {
      setRelatedFee(null);
      return loadFeeByPaymentMutation.mutateAsync(paymentId);
    },
    isLoadingRelatedPayment: loadPaymentByFeeMutation.isPending,
    isLoadingRelatedFee: loadFeeByPaymentMutation.isPending,
    isLoading,
    isFetching,
    isSubmittingCashPayment: registerCashPaymentMutation.isPending,
    isSubmittingInPersonMbPayment:
      registerMultibancoInPersonPaymentMutation.isPending,
    isStartingOnlinePayment: startMultibancoOnlinePaymentMutation.isPending,
    isSimulatingGatewayConfirmation:
      simulateGatewayConfirmationMutation.isPending,
    isPollingOnlinePaymentStatus:
      isOnlinePaymentDialogOpen &&
      onlinePaymentStatusQuery.isFetching &&
      activeOnlinePaymentId !== null,
    isCancellingPayment: cancelPaymentMutation.isPending,
    isUpdatingPayment: updateInPersonPaymentMutation.isPending,
    isDeletingPayment: deleteInPersonPaymentMutation.isPending,
    isError: feesQuery.isError || paymentsQuery.isError || debtsQuery.isError,
    error: feesQuery.error ?? paymentsQuery.error ?? debtsQuery.error ?? null,
  };
}

export { useFinance, FINANCE_QUERY_KEY };