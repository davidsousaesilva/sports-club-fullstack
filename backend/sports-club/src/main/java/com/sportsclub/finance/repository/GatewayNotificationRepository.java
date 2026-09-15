package com.sportsclub.finance.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.finance.domain.entities.GatewayNotification;

public interface GatewayNotificationRepository extends JpaRepository<GatewayNotification, Integer> {

    Optional<GatewayNotification> findByGatewayAndNotificationId(String gateway, String notificationId);

    boolean existsByGatewayAndNotificationId(String gateway, String notificationId);

    List<GatewayNotification> findByExternalPaymentId(String externalPaymentId);
}