package com.sportsclub.activitytracking.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

public record PerformanceItemRequest(
        Long version,

        @NotNull(message = "Statistic type id is required.") Integer statisticTypeId,

        @NotNull(message = "Value is required.") BigDecimal value,

        String note
) {
}