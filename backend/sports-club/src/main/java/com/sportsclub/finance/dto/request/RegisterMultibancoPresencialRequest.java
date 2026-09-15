package com.sportsclub.finance.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RegisterMultibancoPresencialRequest(
        @NotNull(message = "Fee ID is required") Integer feeId,
        @NotNull(message = "Confirmed amount is required") @Min(value = 0, message = "Amount must be positive") BigDecimal confirmedAmount,
        @NotBlank(message = "MB entity is required") @Pattern(regexp = "^\\d{5}$", message = "MB entity must have 5 digits") String mbEntity,
        @NotBlank(message = "MB reference is required") @Pattern(regexp = "^\\d{9}$", message = "MB reference must have 9 digits") String mbReference,
        @NotNull(message = "Limit date is required") LocalDateTime limitDate,
        @NotBlank(message = "Terminal ID is required") @Pattern(regexp = "^T\\d{2}$", message = "Terminal must follow T01, T02 format") String terminalId,
        @NotNull(message = "Collaborator ID is required") Integer collaboratorId) {
}