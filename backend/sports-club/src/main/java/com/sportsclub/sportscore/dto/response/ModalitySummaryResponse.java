package com.sportsclub.sportscore.dto.response;

public record ModalitySummaryResponse(
        Integer id,
        String name,
        String eventType,
        String description,
        Boolean trained,
        Integer maxWeeklyAttendances) {
}