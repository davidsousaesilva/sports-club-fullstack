package com.sportsclub.teams.dto.filter;

import com.sportsclub.teams.domain.enums.TeamType;

public record TeamFilter(
        Integer modalityId,
        TeamType teamType,
        Boolean active,
        String teamOrModalityName,
        Boolean freeTrainingEligible) {
}