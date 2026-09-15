package com.sportsclub.finance.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportsclub.finance.domain.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public record UpdateInPersonPaymentRequest(
        @NotNull(message = "Version is required.") Long version,

        PaymentMethod method,
        BigDecimal confirmedAmount,
        String mbEntity,
        String mbReference,
        LocalDateTime limitDate,
        String terminalId
) {
}