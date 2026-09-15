package com.sportsclub.activitytracking.service;

import java.time.LocalDate;
import java.util.Map;

public class MaxWeeklyAttendancesExceededException extends RuntimeException {

    private final String code;
    private final Map<String, Object> details;

    public MaxWeeklyAttendancesExceededException(
            Integer athleteId,
            Integer teamId,
            Integer modalityId,
            long currentWeeklyAttendances,
            Integer maxWeeklyAttendances,
            LocalDate weekStartDate,
            LocalDate weekEndDate) {

        super("The athlete has already reached the maximum number of weekly attendances for this modality.");

        this.code = "MAX_WEEKLY_ATTENDANCES_EXCEEDED";
        this.details = Map.of(
                "athleteId", athleteId,
                "teamId", teamId,
                "modalityId", modalityId,
                "currentWeeklyAttendances", currentWeeklyAttendances,
                "maxWeeklyAttendances", maxWeeklyAttendances,
                "weekStartDate", weekStartDate,
                "weekEndDate", weekEndDate
        );
    }

    public String getCode() {
        return code;
    }

    public Map<String, Object> getDetails() {
        return details;
    }
}