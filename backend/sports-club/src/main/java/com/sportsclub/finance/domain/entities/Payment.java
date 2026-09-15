package com.sportsclub.finance.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import jakarta.persistence.*;
import com.sportsclub.finance.domain.enums.ExternalPaymentStatus;
import com.sportsclub.finance.domain.enums.PaymentChannel;
import com.sportsclub.finance.domain.enums.PaymentMethod;
import com.sportsclub.finance.domain.enums.PaymentStatus;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

@Entity
@Table(name = "payment")
public class Payment extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate;

    @Column(name = "confirmation_date")
    private LocalDateTime confirmationDate;

    @Column(name = "limit_date", nullable = false)
    private LocalDateTime limitDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 20)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false, length = 20)
    private PaymentChannel channel;

    @Column(name = "original_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalAmount;

    @Column(name = "confirmed_amount", precision = 10, scale = 2)
    private BigDecimal confirmedAmount;

    @Column(name = "mb_entity", length = 10)
    private String mbEntity;

    @Column(name = "mb_reference", length = 20)
    private String mbReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "gateway", length = 20)
    private String gateway;

    @Column(name = "external_id", length = 100, unique = true)
    private String externalId;

    @Enumerated(EnumType.STRING)
    @Column(name = "external_status", length = 20)
    private ExternalPaymentStatus externalStatus;

    @Column(name = "webhook_payload", columnDefinition = "TEXT")
    private String webhookPayload;

    @Column(name = "terminal_id", length = 20)
    private String terminalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_id")
    private Person collaborator;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fee_id", nullable = false)
    private Fee fee;

    @OneToMany(mappedBy = "payment")
    private List<GatewayPaymentAttempt> gatewayAttempts = new ArrayList<>();

    @OneToMany(mappedBy = "payment")
    private List<GatewayNotification> gatewayNotifications = new ArrayList<>();

    protected Payment() {
    }

    public Payment(LocalDateTime creationDate, LocalDateTime limitDate, PaymentMethod method,
            PaymentChannel channel, BigDecimal originalAmount, Fee fee) {
        this.creationDate = Objects.requireNonNull(creationDate);
        this.limitDate = Objects.requireNonNull(limitDate);
        this.method = Objects.requireNonNull(method);
        this.channel = Objects.requireNonNull(channel);
        validateAmount(originalAmount);
        this.originalAmount = originalAmount;
        this.fee = Objects.requireNonNull(fee);
    }

    public void confirm(BigDecimal confirmedAmount, LocalDateTime confirmationDate, Person by) {
        if (!PaymentStatus.PENDING.equals(status)) {
            throw new IllegalStateException("Cannot confirm non-pending payment");
        }
        validateAmount(confirmedAmount);
        this.confirmedAmount = confirmedAmount;
        this.confirmationDate = confirmationDate != null ? confirmationDate : LocalDateTime.now();
        this.status = PaymentStatus.CONFIRMED;
        fee.markAsPaid();
        if (by != null) {
            touch(by);
        }
    }

    public void cancel(Person by) {
        if (!canBeCancelled()) {
            throw new IllegalStateException("Payment cannot be cancelled");
        }
        this.status = PaymentStatus.CANCELLED;
        if (by != null) {
            touch(by);
        }
    }

    public void expire() {
        if (PaymentStatus.PENDING.equals(status)) {
            this.status = PaymentStatus.EXPIRED;
            fee.markAsDebt();
        }
    }

    public void setMultibancoReference(String entity, String reference, LocalDateTime limitDate) {
        validateMbReference(entity, reference);
        this.mbEntity = entity;
        this.mbReference = reference;
        if (limitDate != null) {
            this.limitDate = limitDate;
        }
    }

    public void applyExternalStatus(ExternalPaymentStatus status, String payload, LocalDateTime processedAt) {
        this.externalStatus = status;
        this.webhookPayload = payload;

        if (status == null) {
            throw new IllegalArgumentException("external status cannot be null");
        }

        if (ExternalPaymentStatus.SUCCESS.equals(status)) {
            if (!PaymentStatus.CONFIRMED.equals(this.status)) {
                this.status = PaymentStatus.CONFIRMED;
                this.confirmationDate = processedAt != null ? processedAt : LocalDateTime.now();
                this.confirmedAmount = this.originalAmount;
                fee.markAsPaid();
            }
        } else if (ExternalPaymentStatus.FAILED.equals(status) || ExternalPaymentStatus.CANCELLED.equals(status)) {
            if (PaymentStatus.PENDING.equals(this.status)) {
                this.status = PaymentStatus.CANCELLED;
            }
        }
    }

    public boolean isConfirmed() {
        return PaymentStatus.CONFIRMED.equals(status);
    }

    public boolean isPending() {
        return PaymentStatus.PENDING.equals(status);
    }

    public boolean isTerminalState() {
        return PaymentStatus.CONFIRMED.equals(status)
                || PaymentStatus.CANCELLED.equals(status)
                || PaymentStatus.EXPIRED.equals(status);
    }

    public boolean wasInitiatedViaGateway() {
        return gateway != null && !gateway.isBlank();
    }

    public boolean canBeCancelled() {
        return PaymentStatus.PENDING.equals(status) &&
                !ExternalPaymentStatus.SUCCESS.equals(externalStatus);
    }

    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }

    private void validateAmount(BigDecimal value) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
    }

    private void validateMbReference(String entity, String reference) {
        if ((entity == null || entity.isBlank()) || (reference == null || reference.isBlank())) {
            throw new IllegalArgumentException("MB entity and reference cannot be blank");
        }
    }

    public Integer getId() {
        return id;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public LocalDateTime getConfirmationDate() {
        return confirmationDate;
    }

    public LocalDateTime getLimitDate() {
        return limitDate;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public PaymentChannel getChannel() {
        return channel;
    }

    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public BigDecimal getConfirmedAmount() {
        return confirmedAmount;
    }

    public String getMbEntity() {
        return mbEntity;
    }

    public String getMbReference() {
        return mbReference;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public String getGateway() {
        return gateway;
    }

    public String getExternalId() {
        return externalId;
    }

    public ExternalPaymentStatus getExternalStatus() {
        return externalStatus;
    }

    public String getWebhookPayload() {
        return webhookPayload;
    }

    public String getTerminalId() {
        return terminalId;
    }

    public Person getCollaborator() {
        return collaborator;
    }

    public Fee getFee() {
        return fee;
    }

    public List<GatewayPaymentAttempt> getGatewayAttempts() {
        return List.copyOf(gatewayAttempts);
    }

    public List<GatewayNotification> getGatewayNotifications() {
        return List.copyOf(gatewayNotifications);
    }

    public boolean isInPerson() {
        return PaymentChannel.IN_PERSON.equals(this.channel);
    }

    public void updateInPersonPayment(
            PaymentMethod method,
            BigDecimal confirmedAmount,
            LocalDateTime limitDate,
            String mbEntity,
            String mbReference,
            String terminalId,
            Person actor) {

        if (!PaymentChannel.IN_PERSON.equals(this.channel)) {
            throw new IllegalStateException("Only in-person payments can be edited.");
        }

        if (!PaymentStatus.CONFIRMED.equals(this.status)) {
            throw new IllegalStateException("Only confirmed in-person payments can be edited.");
        }

        this.method = Objects.requireNonNull(method, "method cannot be null.");
        validateAmount(confirmedAmount);

        this.confirmedAmount = confirmedAmount;
        this.originalAmount = confirmedAmount;

        if (limitDate != null) {
            this.limitDate = limitDate;
        }

        if (PaymentMethod.MULTIBANCO.equals(method)) {
            setMultibancoReference(
                    mbEntity,
                    mbReference,
                    limitDate != null ? limitDate : this.limitDate);
            this.terminalId = terminalId;
        } else if (PaymentMethod.CASH.equals(method)) {
            this.mbEntity = null;
            this.mbReference = null;
            this.terminalId = null;
        } else {
            throw new IllegalArgumentException("Only CASH and MULTIBANCO are allowed for in-person payments.");
        }

        if (actor != null) {
            touch(actor);
        }
    }
}