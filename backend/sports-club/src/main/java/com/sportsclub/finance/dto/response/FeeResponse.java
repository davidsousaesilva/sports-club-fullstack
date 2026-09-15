package com.sportsclub.finance.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.domain.enums.FeeType;
import com.fasterxml.jackson.annotation.JsonFormat;

public record FeeResponse(
        Integer id,
        Long version,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime creationDate,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dueDate,
        FeeType type,
        BigDecimal amount,
        FeeStatus status,
        Integer paymentId,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime nextCycle,
        boolean recurrent,
        Integer athleteId,
        String athleteName,
        Integer competitionTeamOriginId,
        Integer teamId,
        String teamName
) {
}