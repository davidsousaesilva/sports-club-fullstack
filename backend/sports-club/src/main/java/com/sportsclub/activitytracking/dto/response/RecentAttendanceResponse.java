package com.sportsclub.activitytracking.dto.response;

import java.time.LocalDate;

public record RecentAttendanceResponse(
        String athleteName,
        String description,
        Boolean present,
        LocalDate date) {
}