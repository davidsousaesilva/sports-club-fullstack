package com.sportsclub.identity.dto.filter;

import com.sportsclub.identity.domain.enums.Role;

public record PersonFilter(
                Role role,
                Boolean active,
                String personNameOrEmail) {
}