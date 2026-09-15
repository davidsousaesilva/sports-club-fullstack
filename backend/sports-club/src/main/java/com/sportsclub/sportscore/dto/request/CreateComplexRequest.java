package com.sportsclub.sportscore.dto.request;

import com.sportsclub.shared.validation.ValidationPatterns;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateComplexRequest(
        @NotBlank(message = "Name is required.")
        @Pattern(
                regexp = ValidationPatterns.COMPLEX_NAME,
                message = "Complex name contains invalid characters."
        )
        String name,

        @NotBlank(message = "Address is required.")
        @Pattern(
                regexp = ValidationPatterns.ADDRESS,
                message = "Address contains invalid characters."
        )
        String address,

        @NotBlank(message = "Phone is required.")
        @Pattern(
                regexp = ValidationPatterns.PHONE,
                message = "Phone must contain 9 to 20 digits and may start with +."
        )
        String phone
) {
}