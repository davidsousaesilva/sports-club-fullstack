package com.sportsclub.teams.dto.request;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;

public record AddTeamMemberRequest(
        @NotNull(message = "Person id is required.") Integer personId,

        @NotNull(message = "Start date is required.") LocalDateTime startDate) {
}