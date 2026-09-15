package com.sportsclub.activitytracking.dto.response;

import java.time.LocalDate;

public record AttendanceResponse(
        Integer id,
        Long version,
        Boolean present,
        Integer trainingId,
        Integer eventId,
        Integer athleteId,
        String athleteName,
        Boolean freeTraining,
        Integer teamId,
        String teamName,
        LocalDate date
) {
}