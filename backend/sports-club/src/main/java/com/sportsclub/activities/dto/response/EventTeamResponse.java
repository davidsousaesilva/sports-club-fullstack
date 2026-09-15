package com.sportsclub.activities.dto.response;

public record EventTeamResponse(
        Integer id,
        Long version,
        String result,
        String numericResult,
        Integer idEvent,
        Integer idTeam,
        String teamName
) {
}