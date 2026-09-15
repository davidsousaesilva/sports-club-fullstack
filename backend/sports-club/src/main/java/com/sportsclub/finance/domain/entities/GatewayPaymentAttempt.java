package com.sportsclub.finance.domain.entities;

import java.time.LocalDateTime;
import java.util.Objects;

import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

import jakarta.persistence.*;

@Entity
@Table(name = "gateway_payment_attempt")
public class GatewayPaymentAttempt extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "gateway", nullable = false, length = 20)
    private String gateway;

    @Column(name = "external_payment_id", nullable = false, length = 100)
    private String externalPaymentId;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate;

    @Column(name = "success", nullable = false)
    private boolean success;

    @Column(name = "error_detail", length = 500)
    private String errorDetail;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    protected GatewayPaymentAttempt() {
    }

    public GatewayPaymentAttempt(String gateway, LocalDateTime creationDate, Payment payment) {
        this.gateway = Objects.requireNonNull(gateway, "gateway cannot be null");
        this.creationDate = Objects.requireNonNull(creationDate);
        this.payment = Objects.requireNonNull(payment);
        this.success = false;
    }

    public void markAsSuccess(String externalPaymentId) {
        this.success = true;
        this.externalPaymentId = Objects.requireNonNull(externalPaymentId);
    }

    public void markAsFailure(String errorDetail) {
        this.success = false;
        this.errorDetail = errorDetail != null ? errorDetail : "Unknown error";
    }

    public Integer getId() {
        return id;
    }

    public String getGateway() {
        return gateway;
    }

    public String getExternalPaymentId() {
        return externalPaymentId;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getErrorDetail() {
        return errorDetail;
    }

    public Payment getPayment() {
        return payment;
    }
}