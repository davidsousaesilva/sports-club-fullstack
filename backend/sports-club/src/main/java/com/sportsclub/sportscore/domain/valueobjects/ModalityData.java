package com.sportsclub.sportscore.domain.valueobjects;

public record ModalityData(
        String name,
        String eventType,
        String description,
        boolean trained,
        Integer maxPresencesPerWeek) {
}