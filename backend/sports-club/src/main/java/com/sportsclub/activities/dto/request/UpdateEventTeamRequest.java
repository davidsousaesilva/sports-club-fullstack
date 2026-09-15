package com.sportsclub.activities.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateEventTeamRequest(
        @NotNull(message = "Version is required.") Long version,

        @Size(max = 100) String result,
        @Size(max = 100) String numericResult
) {
}