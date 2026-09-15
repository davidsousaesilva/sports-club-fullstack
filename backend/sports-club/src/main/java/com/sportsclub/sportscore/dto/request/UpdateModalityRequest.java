package com.sportsclub.sportscore.dto.request;

import java.util.List;

import com.sportsclub.shared.validation.ValidationPatterns;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

public record UpdateModalityRequest(
        @NotNull(message = "Version is required.")
        Long version,

        @NotBlank(message = "Name is required.")
        @Pattern(
                regexp = ValidationPatterns.MODALITY_NAME,
                message = "Modality name contains invalid characters."
        )
        String name,

        @NotNull(message = "Event type is required.")
        String eventType,

        String description,

        @NotNull(message = "Trained flag is required.")
        Boolean trained,

        @PositiveOrZero(message = "Maximum weekly attendances must be greater than or equal to zero.")
        Integer maxWeeklyAttendances,

        @NotNull(message = "Statistic types are required.")
        List<@Valid StatisticTypeIdRequest> statisticTypes,

        @NotNull(message = "Prices are required.")
        @NotEmpty(message = "At least one price rule is required.")
        List<@Valid ModalityPriceRequest> prices
) {
}