package com.sportsclub.finance.dto.request;

import jakarta.validation.constraints.NotNull;

public record PaymentVersionRequest(
        @NotNull(message = "Version is required.") Long version
) {
}