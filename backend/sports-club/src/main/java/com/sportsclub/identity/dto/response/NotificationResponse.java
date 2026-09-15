package com.sportsclub.identity.dto.response;

import com.sportsclub.identity.domain.enums.NotificationType;

public record NotificationResponse(
        Integer id,
        NotificationType type,
        String content,
        Boolean read,
        Integer personId) {
}