package com.sportsclub.teams.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public record EndMembershipRequest(
        @NotNull(message = "Version is required.") Long version,

        @NotNull(message = "End date is required.") LocalDateTime endDate
) {
}