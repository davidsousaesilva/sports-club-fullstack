package com.sportsclub.finance.dto.request;

import java.math.BigDecimal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RegisterCashPaymentRequest(
                @NotNull(message = "Fee ID is required") Integer feeId,
                @NotNull(message = "Confirmed amount is required") @Min(value = 0, message = "Amount must be positive") BigDecimal confirmedAmount,
                @NotNull(message = "Collaborator ID is required") Integer collaboratorId) {
}