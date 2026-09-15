package com.sportsclub.finance.service;

import org.springframework.stereotype.Component;

import com.sportsclub.finance.domain.entities.Fee;
import com.sportsclub.finance.domain.entities.Payment;
import com.sportsclub.finance.domain.enums.ExternalPaymentStatus;
import com.sportsclub.finance.dto.response.*;

import java.util.List;

@Component
public class SS6Mapper {

    public FeeResponse toFeeResponse(Fee fee) {
        if (fee == null) {
            return null;
        }

        return new FeeResponse(
                fee.getId(),
                fee.getVersion(),
                fee.getCreationDate(),
                fee.getDueDate(),
                fee.getType(),
                fee.getAmount(),
                fee.getStatus(),
                resolvePaymentId(fee),
                fee.getNextCycle(),
                fee.isRecurrent(),
                fee.getAthlete() != null ? fee.getAthlete().getId() : null,
                fee.getAthlete() != null ? fee.getAthlete().getName() : null,
                fee.getCompetitionTeamOrigin() != null ? fee.getCompetitionTeamOrigin().getId() : null,
                fee.getTeam() != null ? fee.getTeam().getId() : null,
                fee.getTeam() != null ? fee.getTeam().getName() : null
        );
    }

    public PaymentResponse toPaymentResponse(Payment payment) {
        if (payment == null)
            return null;

        return new PaymentResponse(
            payment.getId(),
            payment.getVersion(),
            payment.getCreationDate(),
            payment.getConfirmationDate(),
            payment.getLimitDate(),
            payment.getMethod(),
            payment.getChannel(),
            payment.getOriginalAmount(),
            payment.getConfirmedAmount(),
            payment.getMbEntity(),
            payment.getMbReference(),
            payment.getStatus(),
            payment.getGateway(),
            payment.getExternalId(),
            payment.getExternalStatus(),
            payment.getTerminalId(),
            payment.getCollaborator() != null ? payment.getCollaborator().getId() : null,
            payment.getFee().getId());
    }

    public MultibancoPaymentDataResponse toMultibancoPaymentData(Payment payment) {
        return new MultibancoPaymentDataResponse(
                payment.getMbEntity(),
                payment.getMbReference(),
                payment.getOriginalAmount(),
                payment.getLimitDate(),
                payment.getStatus());
    }

    public PaymentStatusResponse toPaymentStatus(Payment payment) {
        return new PaymentStatusResponse(
                payment.getId(),
                payment.getStatus(),
                payment.getExternalStatus(),
                payment.getConfirmationDate(),
                payment.canBeCancelled());
    }

    public List<FeeResponse> toFeeResponses(List<Fee> fees) {
        return fees == null ? List.of() : fees.stream().map(this::toFeeResponse).toList();
    }

    public List<PaymentResponse> toPaymentResponses(List<Payment> payments) {
        return payments == null ? List.of() : payments.stream().map(this::toPaymentResponse).toList();
    }

    public ExternalPaymentStatus parseExternalStatus(String rawStatus) {
        if (rawStatus == null) {
            return ExternalPaymentStatus.PENDING;
        }
        try {
            return ExternalPaymentStatus.valueOf(rawStatus.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ExternalPaymentStatus.PENDING;
        }
    }

    private Integer resolvePaymentId(Fee fee) {
        return fee.getPayments()
                .stream()
                .sorted((p1, p2) -> p2.getCreationDate().compareTo(p1.getCreationDate()))
                .map(Payment::getId)
                .findFirst()
                .orElse(null);
    }
}