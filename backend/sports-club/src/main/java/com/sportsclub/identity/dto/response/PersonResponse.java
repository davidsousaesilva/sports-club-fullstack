package com.sportsclub.identity.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.sportsclub.identity.domain.enums.Gender;

public record PersonResponse(
        Integer id,
        Long version,
        String name,
        Gender gender,
        String email,
        String phone,
        String address,
        LocalDate birthDate,
        LocalDate entryDate,
        Boolean active,
        List<PersonRoleResponse> activeRoles,
        List<PersonRoleResponse> roleHistory) {
}