package com.sportsclub.activities.dto.filter;

import com.sportsclub.activities.domain.enums.TemporalStatus;

public record EventFilter(
        Integer competitionId,
        TemporalStatus status,
        String eventNameOrDescriptionOrCompetition) {
}