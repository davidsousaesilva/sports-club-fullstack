package com.sportsclub.identity.dto.request;

import com.sportsclub.shared.validation.ValidationPatterns;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AlterPasswordRequest(
        @NotBlank(message = "Current password is required.")
        String currentPassword,

        @NotBlank(message = "New password is required.")
        @Pattern(
                regexp = ValidationPatterns.PASSWORD,
                message = "Password must have at least 4 characters and one digit."
        )
        String newPassword1,

        @NotBlank(message = "New password confirmation is required.")
        @Pattern(
                regexp = ValidationPatterns.PASSWORD,
                message = "Password must have at least 4 characters and one digit."
        )
        String newPassword2
) {
}