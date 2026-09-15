package com.sportsclub.activities.dto.request;

import java.time.LocalDateTime;

public record CreateEventRequest(
        String description,
        LocalDateTime date,
        Integer duration,
        Integer modalityId,
        Integer complexId,
        Integer competitionId) {
}