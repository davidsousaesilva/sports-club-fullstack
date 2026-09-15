package com.sportsclub.teams.dto.response;

import java.time.LocalDateTime;

import com.sportsclub.teams.domain.enums.TeamRelation;

public record TeamMemberResponse(
        Integer id,
        Long version,
        Integer teamId,
        String teamName,
        Integer personId,
        String personName,
        TeamRelation relationship,
        LocalDateTime startDate,
        LocalDateTime endDate
) {
}