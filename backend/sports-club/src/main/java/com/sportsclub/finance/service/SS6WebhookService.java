package com.sportsclub.finance.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.finance.domain.entities.GatewayNotification;
import com.sportsclub.finance.domain.entities.Payment;
import com.sportsclub.finance.domain.enums.ExternalPaymentStatus;
import com.sportsclub.finance.dto.request.GatewayNotificationRequest;
import com.sportsclub.finance.repository.GatewayNotificationRepository;
import com.sportsclub.finance.repository.PaymentRepository;
import com.sportsclub.finance.domain.entities.Fee;
import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.identity.service.NotificationService;

@Service
public class SS6WebhookService {

    private final GatewayNotificationRepository gatewayNotificationRepository;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public SS6WebhookService(
            GatewayNotificationRepository gatewayNotificationRepository,
            PaymentRepository paymentRepository,
            ObjectMapper objectMapper,
            NotificationService notificationService) {
        this.gatewayNotificationRepository = gatewayNotificationRepository;
        this.paymentRepository = paymentRepository;
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public void process(GatewayNotificationRequest request) {
        String payload = request.payload();

        if (gatewayNotificationRepository.existsByGatewayAndNotificationId(request.gateway(),
                request.notificationId())) {
            return;
        }

        Payment payment = paymentRepository.findByExternalId(request.externalPaymentId())
                .orElseThrow(() -> new EntityNotFoundException("Payment not found"));

        ExternalPaymentStatus status = parseExternalStatus(payload);

        GatewayNotification notification = new GatewayNotification(
                request.gateway(),
                request.notificationId(),
                request.externalPaymentId(),
                payload,
                request.receivedAt());

        boolean wasConfirmed = payment.isConfirmed();

        payment.applyExternalStatus(status, payload, request.receivedAt());
        notification.markAsProcessed(payment);

        try {
            gatewayNotificationRepository.save(notification);
            Payment savedPayment = paymentRepository.save(payment);

            if (!wasConfirmed && savedPayment.isConfirmed()) {
                notifyFeePaid(savedPayment);
            }
        } catch (DataIntegrityViolationException ex) {
            return;
        }
    }

    private ExternalPaymentStatus parseExternalStatus(String payload) {
        if (payload == null || payload.isBlank()) {
            return ExternalPaymentStatus.PENDING;
        }

        try {
            JsonNode node = objectMapper.readTree(payload);
            JsonNode statusNode = node.get("status");

            if (statusNode == null || statusNode.asText().isBlank()) {
                return ExternalPaymentStatus.PENDING;
            }

            String rawStatus = statusNode.asText().trim().toUpperCase();

            return switch (rawStatus) {
                case "PAID", "PAYED", "SUCCESS", "SUCCEEDED", "CONFIRMED" -> ExternalPaymentStatus.SUCCESS;
                case "PENDING", "WAITING", "CREATED" -> ExternalPaymentStatus.PENDING;
                case "CANCELLED", "CANCELED" -> ExternalPaymentStatus.CANCELLED;
                case "FAILED", "ERROR", "REJECTED" -> ExternalPaymentStatus.FAILED;
                default -> ExternalPaymentStatus.PENDING;
            };

        } catch (Exception ex) {
            return ExternalPaymentStatus.PENDING;
        }
    }

    private void notifyFeePaid(Payment payment) {
        Fee fee = payment.getFee();

        if (fee == null || fee.getAthlete() == null) {
            return;
        }

        notificationService.send(
                fee.getAthlete(),
                NotificationType.FEE_PAID,
                "O teu pagamento da quota "
                        + fee.getType()
                        + " no valor de "
                        + payment.getConfirmedAmount()
                        + "€ foi confirmado.");
    }
}