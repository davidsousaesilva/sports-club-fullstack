package com.sportsclub.teams.dto.response;

import java.util.List;

import com.sportsclub.teams.domain.enums.TeamType;

public record TeamResponse(
        Integer id,
        Long version,
        String name,
        TeamType teamType,
        String seasonYear,
        Boolean active,
        Integer modalityId,
        String modalityName,
        List<TeamMemberResponse> members
) {
}