package com.sportsclub.finance.dto.request;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GatewayNotificationRequest(
        @NotBlank(message = "Gateway is required") String gateway,
        @NotBlank(message = "Notification ID is required") String notificationId,
        @NotBlank(message = "External payment ID is required") String externalPaymentId,
        @NotBlank(message = "Payload is required") String payload,
        @NotNull(message = "Received date is required") LocalDateTime receivedAt) {
}