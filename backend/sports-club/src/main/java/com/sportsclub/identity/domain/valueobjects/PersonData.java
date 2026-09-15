package com.sportsclub.identity.domain.valueobjects;

import java.time.LocalDate;

import com.sportsclub.identity.domain.enums.Gender;

public record PersonData(
        String name,
        Gender gender,
        String email,
        String phone,
        String address,
        LocalDate birthDate,
        LocalDate entryDate,
        boolean active) {
}