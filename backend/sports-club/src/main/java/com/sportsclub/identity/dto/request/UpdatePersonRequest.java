package com.sportsclub.identity.dto.request;

import java.time.LocalDate;

import com.sportsclub.identity.domain.enums.Gender;
import com.sportsclub.shared.validation.ValidationPatterns;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

public record UpdatePersonRequest(
        @NotNull(message = "Version is required.")
        Long version,

        @NotBlank(message = "Name is required.")
        @Pattern(
                regexp = ValidationPatterns.PERSON_NAME,
                message = "Name must contain only letters, spaces, apostrophes or hyphens and have between 2 and 100 characters."
        )
        String name,

        @NotNull(message = "Gender is required.")
        Gender gender,

        @NotBlank(message = "Email is required.")
        @Email(message = "Email must be valid.")
        String email,

        @Pattern(
                regexp = ValidationPatterns.PHONE,
                message = "Phone must contain 9 to 20 digits and may start with +."
        )
        String phone,

        @Pattern(
                regexp = ValidationPatterns.ADDRESS,
                message = "Address contains invalid characters."
        )
        String address,

        @NotNull(message = "Birth date is required.")
        @Past(message = "Birth date must be in the past.")
        LocalDate birthDate,

        @NotNull(message = "Entry date is required.")
        LocalDate entryDate,

        @NotNull(message = "Active flag is required.")
        Boolean active
) {
}