package com.sportsclub.activities.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateCompetitionTeamRequest(
        @NotNull(message = "Version is required.") Long version,

        @Size(max = 255) String note,
        @Size(max = 100) String finalResult,
        Integer resultPoints
) {
}