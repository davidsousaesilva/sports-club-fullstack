package com.sportsclub.identity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.identity.domain.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Integer personId);

    List<Notification> findByRecipientIdAndReadOrderByCreatedAtDesc(Integer personId, Boolean read);
}