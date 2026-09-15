package com.sportsclub.activitytracking.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record RegisterOrUpdatePerformancesRequest(
                @NotNull(message = "Athlete id is required.") Integer athleteId,

                Integer trainingId,

                Integer eventId,

                @NotNull(message = "Performances are required.") @NotEmpty(message = "At least one performance is required.") List<@Valid PerformanceItemRequest> performances) {
}