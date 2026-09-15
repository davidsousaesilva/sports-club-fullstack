package com.sportsclub.finance.dto.response;

import java.time.LocalDateTime;

import com.sportsclub.finance.domain.enums.ExternalPaymentStatus;
import com.sportsclub.finance.domain.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

public record PaymentStatusResponse(
                Integer paymentId,
                PaymentStatus status,
                ExternalPaymentStatus externalStatus,
                @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime confirmationDate,
                boolean canBeCancelled) {
}