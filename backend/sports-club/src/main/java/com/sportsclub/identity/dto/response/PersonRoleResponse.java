package com.sportsclub.identity.dto.response;

import java.time.LocalDate;

import com.sportsclub.identity.domain.enums.Role;

public record PersonRoleResponse(
        Integer id,
        Long version,
        Role role,
        LocalDate startDate,
        LocalDate endDate,
        Boolean primaryRole,
        String endJustification,
        Integer personId) {
}