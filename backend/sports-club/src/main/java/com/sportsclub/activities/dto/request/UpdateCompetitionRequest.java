package com.sportsclub.activities.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateCompetitionRequest(
        @NotNull(message = "Version is required.") Long version,

        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 255) String description,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @DecimalMin(value = "0.0", inclusive = true) BigDecimal registrationFee,
        @NotNull Integer modalityId
) {
}