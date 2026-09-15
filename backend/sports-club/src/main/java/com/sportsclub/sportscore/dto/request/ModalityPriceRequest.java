package com.sportsclub.sportscore.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ModalityPriceRequest(
        @NotNull(message = "Registration fee is required.") @DecimalMin(value = "0.0", inclusive = true, message = "Registration fee must be greater than or equal to zero.") BigDecimal registrationFee,

        @NotNull(message = "Monthly fee is required.") @DecimalMin(value = "0.0", inclusive = true, message = "Monthly fee must be greater than or equal to zero.") BigDecimal monthlyFee,

        @NotNull(message = "Minimum age is required.") @PositiveOrZero(message = "Minimum age must be greater than or equal to zero.") Integer ageRangeMin,

        @NotNull(message = "Maximum age is required.") @PositiveOrZero(message = "Maximum age must be greater than or equal to zero.") Integer ageRangeMax) {
}