package com.sportsclub.sportscore.dto.response;

public record ComplexResponse(
        Integer id,
        Long version,
        String name,
        String address,
        String phone
) {
}