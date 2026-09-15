package com.sportsclub.sportscore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStatisticTypeRequest(
        @NotBlank(message = "Name is required.") String name,

        @NotBlank(message = "Unit is required.") String unit,

        @NotNull(message = "Mandatory flag is required.") Boolean mandatory) {
}