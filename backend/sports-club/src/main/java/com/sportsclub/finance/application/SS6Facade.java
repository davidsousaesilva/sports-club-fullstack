package com.sportsclub.finance.application;

import java.util.List;

import com.sportsclub.finance.dto.filter.FeeFilterQuery;
import com.sportsclub.finance.dto.request.*;
import com.sportsclub.finance.dto.response.*;

public interface SS6Facade {

        List<FeeResponse> listFees(FeeFilterQuery filter);

        List<FeeResponse> listAthleteFees(Integer athleteId, FeeFilterQuery filter);

        List<FeeResponse> listAthleteDebts(Integer athleteId);

        List<PaymentResponse> listPayments();

        List<PaymentResponse> listAthletePayments(Integer athleteId);

        PaymentResponse registerCashPayment(RegisterCashPaymentRequest request, Integer by);

        PaymentResponse registerMultibancoInPersonPayment(RegisterMultibancoPresencialRequest request, Integer by);

        StartMultibancoOnlineResponse startMultibancoOnlinePayment(StartMultibancoOnlineRequest request, Integer by);

        MultibancoPaymentDataResponse getMultibancoPaymentData(Integer paymentId);

        PaymentStatusResponse getPaymentStatus(Integer paymentId);

        FeeResponse getFeeByPayment(Integer paymentId);

        PaymentResponse getPaymentByFee(Integer feeId);

        void processGatewayNotification(GatewayNotificationRequest request);

        PaymentResponse updateInPersonPayment(Integer paymentId, UpdateInPersonPaymentRequest request, Integer by);
        
        void cancelPendingPayment(Integer paymentId, Long version, Integer by);

        void deleteInPersonPayment(Integer paymentId, Long version, Integer by);
}