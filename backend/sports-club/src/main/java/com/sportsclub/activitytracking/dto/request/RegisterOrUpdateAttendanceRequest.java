package com.sportsclub.activitytracking.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record RegisterOrUpdateAttendanceRequest(
        Long version,

        @NotNull(message = "Present flag is required.") Boolean present,

        Integer trainingId,

        Integer eventId,

        @NotNull(message = "Athlete id is required.") Integer athleteId,

        @NotNull(message = "Free training flag is required.") Boolean freeTraining,

        Integer teamId,

        LocalDate attendanceDate
) {
}