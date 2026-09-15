package com.sportsclub.sportscore.dto.response;

public record StatisticTypeResponse(
        Integer id,
        Long version,
        String name,
        String unit,
        Boolean mandatory
) {
}