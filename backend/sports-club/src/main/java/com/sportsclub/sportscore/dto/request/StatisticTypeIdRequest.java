package com.sportsclub.sportscore.dto.request;

import jakarta.validation.constraints.NotNull;

public record StatisticTypeIdRequest(
        @NotNull(message = "Statistic type id is required.") Integer id) {
}