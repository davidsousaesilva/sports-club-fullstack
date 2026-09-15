package com.sportsclub.finance.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportsclub.finance.domain.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

public record MultibancoPaymentDataResponse(
                String entity,
                String reference,
                BigDecimal amount,
                @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime limitDate,
                PaymentStatus status) {
}