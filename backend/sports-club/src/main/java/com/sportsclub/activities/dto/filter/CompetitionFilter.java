package com.sportsclub.activities.dto.filter;

import com.sportsclub.activities.domain.enums.TemporalStatus;

public record CompetitionFilter(
                Integer modalityId,
                TemporalStatus temporalStatus,
                String competitionNameOrDescriptionOrModality) {
}