package com.sportsclub.activities.dto.request;

import jakarta.validation.constraints.NotNull;

public record EnrollTeamRequest(
        @NotNull(message = "Team id is required.") Integer teamId) {
}