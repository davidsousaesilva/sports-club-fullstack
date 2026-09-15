package com.sportsclub.activities.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateTrainingRequest(
        @NotNull(message = "Version is required.") Long version,

        @NotBlank @Size(max = 255) String description,
        @Size(max = 255) String note,
        @NotNull LocalDateTime date,
        @NotNull @Min(1) Integer duration,
        Integer complexId,
        @NotNull Integer teamId
) {
}