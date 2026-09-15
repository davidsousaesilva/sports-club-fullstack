package com.sportsclub.finance.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportsclub.finance.domain.enums.ExternalPaymentStatus;
import com.sportsclub.finance.domain.enums.PaymentChannel;
import com.sportsclub.finance.domain.enums.PaymentMethod;
import com.sportsclub.finance.domain.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

public record PaymentResponse(
        Integer id,
        Long version,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime creationDate,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime confirmationDate,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime limitDate,
        PaymentMethod method,
        PaymentChannel channel,
        BigDecimal originalAmount,
        BigDecimal confirmedAmount,
        String mbEntity,
        String mbReference,
        PaymentStatus status,
        String gateway,
        String externalId,
        ExternalPaymentStatus externalStatus,
        String terminalId,
        Integer collaboratorId,
        Integer feeId
) {
}