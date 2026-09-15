package com.sportsclub.finance.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportsclub.finance.domain.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

public record StartMultibancoOnlineResponse(
                Integer paymentId,
                String entity,
                String reference,
                String externalId,
                BigDecimal amount,
                @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime validUntil,
                PaymentStatus status) {
}