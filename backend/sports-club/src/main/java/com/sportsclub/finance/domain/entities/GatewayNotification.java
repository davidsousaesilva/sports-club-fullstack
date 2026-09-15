package com.sportsclub.finance.domain.entities;

import java.time.LocalDateTime;
import java.util.Objects;
import jakarta.persistence.*;

import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

@Entity
@Table(name = "gateway_notification", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "gateway", "notification_id" })
})
public class GatewayNotification extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "gateway", nullable = false, length = 20)
    private String gateway;

    @Column(name = "notification_id", nullable = false, length = 100)
    private String notificationId;

    @Column(name = "external_payment_id", length = 100)
    private String externalPaymentId;

    @Column(name = "payload", columnDefinition = "TEXT") // ou JSON se suportado
    private String payload;

    @Column(name = "received_at", nullable = false)
    private LocalDateTime receivedAt;

    @Column(name = "processed", nullable = false)
    private boolean processed = false;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    protected GatewayNotification() {
    }

    public GatewayNotification(String gateway,
            String notificationId,
            String externalPaymentId,
            String payload,
            LocalDateTime receivedAt) {
        this.gateway = Objects.requireNonNull(gateway);
        this.notificationId = Objects.requireNonNull(notificationId);
        this.externalPaymentId = externalPaymentId;
        this.payload = payload;
        this.receivedAt = Objects.requireNonNull(receivedAt);
    }

    public void markAsProcessed(Payment payment) {
        this.processed = true;
        this.processedAt = LocalDateTime.now();
        this.payment = payment;
    }

    public boolean belongsToPayment(String externalId) {
        return externalPaymentId != null && externalPaymentId.equals(externalId);
    }

    public Integer getId() {
        return id;
    }

    public String getGateway() {
        return gateway;
    }

    public String getNotificationId() {
        return notificationId;
    }

    public String getExternalPaymentId() {
        return externalPaymentId;
    }

    public String getPayload() {
        return payload;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public boolean isProcessed() {
        return processed;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public Payment getPayment() {
        return payment;
    }
}