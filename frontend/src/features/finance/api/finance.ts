import { httpClient } from "../../../lib/api/http-client";
import {
  mapCashPaymentRequest,
  mapFee,
  mapMultibancoInPersonPaymentRequest,
  mapMultibancoPaymentData,
  mapPayment,
  mapPaymentStatus,
  mapStartMultibancoOnlineRequest,
  mapStartMultibancoOnlineResponse,
  mapUpdateInPersonPaymentRequest,
} from "../model/finance.mappers";
import type {
  FeeFilterValues,
  FeeItem,
  FeeResponseDto,
  MultibancoPaymentData,
  MultibancoPaymentDataResponseDto,
  PaymentItem,
  PaymentResponseDto,
  PaymentStatusData,
  PaymentStatusResponseDto,
  PaymentVersionRequestDto,
  RegisterCashPaymentFormValues,
  RegisterMultibancoInPersonPaymentFormValues,
  StartMultibancoOnlineFormValues,
  StartMultibancoOnlineResponse,
  StartMultibancoOnlineResponseDto,
  UpdateInPersonPaymentFormValues,
} from "../model/finance.types";

function buildQueryString(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    searchParams.set(key, value);
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

function buildFeeQueryParams(filters: FeeFilterValues) {
  return {
    status: filters.status === "ALL" ? undefined : filters.status,
    type: filters.type === "ALL" ? undefined : filters.type,
    athleteName: filters.athleteName.trim() || undefined,
  };
}

async function listFees(filters: FeeFilterValues): Promise<FeeItem[]> {
  const response = await httpClient.get<FeeResponseDto[]>(
    `api/fees${buildQueryString(buildFeeQueryParams(filters))}`,
  );

  return response.map(mapFee);
}

async function listAthleteFees(
  athleteId: number,
  filters: FeeFilterValues,
): Promise<FeeItem[]> {
  const response = await httpClient.get<FeeResponseDto[]>(
    `api/athletes/${athleteId}/fees${buildQueryString(
      buildFeeQueryParams(filters),
    )}`,
  );

  return response.map(mapFee);
}

async function listAthleteDebts(athleteId: number): Promise<FeeItem[]> {
  const response = await httpClient.get<FeeResponseDto[]>(
    `api/athletes/${athleteId}/debts`,
  );

  return response.map(mapFee);
}

async function listPayments(): Promise<PaymentItem[]> {
  const response = await httpClient.get<PaymentResponseDto[]>("api/payments");

  return response.map(mapPayment);
}

async function listAthletePayments(athleteId: number): Promise<PaymentItem[]> {
  const response = await httpClient.get<PaymentResponseDto[]>(
    `api/athletes/${athleteId}/payments`,
  );

  return response.map(mapPayment);
}

async function registerCashPayment(
  values: RegisterCashPaymentFormValues,
): Promise<PaymentItem> {
  const response = await httpClient.post<PaymentResponseDto>(
    "api/payments/cash",
    mapCashPaymentRequest(values),
  );

  return mapPayment(response);
}

async function registerMultibancoInPersonPayment(
  values: RegisterMultibancoInPersonPaymentFormValues,
): Promise<PaymentItem> {
  const response = await httpClient.post<PaymentResponseDto>(
    "api/payments/multibanco/in-person",
    mapMultibancoInPersonPaymentRequest(values),
  );

  return mapPayment(response);
}

async function startMultibancoOnlinePayment(
  values: StartMultibancoOnlineFormValues,
): Promise<StartMultibancoOnlineResponse> {
  const response = await httpClient.post<StartMultibancoOnlineResponseDto>(
    "api/payments/multibanco/online",
    mapStartMultibancoOnlineRequest(values),
  );

  return mapStartMultibancoOnlineResponse(response);
}

async function getMultibancoPaymentData(
  paymentId: number,
): Promise<MultibancoPaymentData> {
  const response = await httpClient.get<MultibancoPaymentDataResponseDto>(
    `api/payments/${paymentId}/multibanco`,
  );

  return mapMultibancoPaymentData(response);
}

async function getPaymentStatus(paymentId: number): Promise<PaymentStatusData> {
  const response = await httpClient.get<PaymentStatusResponseDto>(
    `api/payments/${paymentId}/status`,
  );

  return mapPaymentStatus(response);
}

async function cancelPendingPayment(payment: PaymentItem): Promise<void> {
  const payload: PaymentVersionRequestDto = {
    version: payment.version,
  };

  await httpClient.post(`api/payments/${payment.id}/cancellation`, payload);
}

async function getFeeByPayment(paymentId: number): Promise<FeeItem> {
  const response = await httpClient.get<FeeResponseDto>(
    `api/payments/${paymentId}/fee`,
  );

  return mapFee(response);
}

async function getPaymentByFee(feeId: number): Promise<PaymentItem> {
  const response = await httpClient.get<PaymentResponseDto>(
    `api/fees/${feeId}/payment`,
  );

  return mapPayment(response);
}

async function updateInPersonPayment(
  payment: PaymentItem,
  values: UpdateInPersonPaymentFormValues,
): Promise<PaymentItem> {
  const response = await httpClient.put<PaymentResponseDto>(
    `api/payments/${payment.id}/in-person`,
    mapUpdateInPersonPaymentRequest(values, payment.version),
  );

  return mapPayment(response);
}

async function deleteInPersonPayment(payment: PaymentItem): Promise<void> {
  const payload: PaymentVersionRequestDto = {
    version: payment.version,
  };

  await httpClient.deleteWithBody(
    `api/payments/${payment.id}/in-person`,
    payload,
  );
}

async function simulateGatewayConfirmation(input: {
  externalPaymentId: string;
}): Promise<void> {
  await httpClient.post<void>("api/gateway/notifications", {
    gateway: "MOCK_GATEWAY",
    notificationId: `SIM-${input.externalPaymentId}-${Date.now()}`,
    externalPaymentId: input.externalPaymentId,
    payload: JSON.stringify({
      status: "PAID",
    }),
    receivedAt: new Date().toISOString(),
  });
}

export {
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
};