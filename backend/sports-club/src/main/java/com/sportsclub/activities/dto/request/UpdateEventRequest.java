package com.sportsclub.activities.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateEventRequest(
        @NotNull(message = "Version is required.") Long version,

        @NotBlank @Size(max = 255) String description,
        @NotNull LocalDateTime date,
        @NotNull @Min(1) Integer duration,
        @NotNull Integer modalityId,
        Integer complexId,
        Integer competitionId
) {
}