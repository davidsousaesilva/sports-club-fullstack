package com.sportsclub.activities.dto.response;

public record CompetitionTeamResponse(
        Integer id,
        Long version,
        String note,
        String finalResult,
        Integer resultPoints,
        Integer idCompetition,
        Integer idTeam,
        String teamName
) {
}