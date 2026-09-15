package com.sportsclub.identity.service;

import org.springframework.stereotype.Service;

import com.sportsclub.identity.domain.entities.Notification;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.identity.dto.response.NotificationResponse;
import com.sportsclub.identity.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SS1Mapper ss1Mapper;

    public NotificationService(
            NotificationRepository notificationRepository,
            SS1Mapper ss1Mapper) {
        this.notificationRepository = notificationRepository;
        this.ss1Mapper = ss1Mapper;
    }

    public NotificationResponse send(Person recipient, NotificationType type, String content) {
        Notification notification = new Notification(type, content, recipient);
        Notification saved = notificationRepository.save(notification);
        return ss1Mapper.toNotificationResponse(saved);
    }

    public void markAsRead(Notification notification, Person actor) {
        notification.markAsReadBy(actor);
    }

    public void remove(Notification notification, Person actor) {
        notification.ensureCanBeRemovedBy(actor);
        notificationRepository.delete(notification);
    }
}