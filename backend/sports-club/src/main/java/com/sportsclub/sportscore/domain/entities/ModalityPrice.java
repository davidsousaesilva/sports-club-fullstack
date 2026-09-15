package com.sportsclub.sportscore.domain.entities;

import java.math.BigDecimal;

import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "modality_price")
public class ModalityPrice extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "registration_fee", precision = 10, scale = 2)
    private BigDecimal registrationFee;

    @Column(name = "monthly_fee", precision = 10, scale = 2)
    private BigDecimal monthlyFee;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modality_id", nullable = false)
    private Modality modality;

    protected ModalityPrice() {
    }

    public ModalityPrice(
            BigDecimal registrationFee,
            BigDecimal monthlyFee,
            Integer minAge,
            Integer maxAge) {
        validateFees(registrationFee, monthlyFee);
        validateAgeRange(minAge, maxAge);

        this.registrationFee = registrationFee;
        this.monthlyFee = monthlyFee;
        this.minAge = minAge;
        this.maxAge = maxAge;
    }

    public boolean matchesAge(int age) {
        boolean matchesMin = minAge == null || age >= minAge;
        boolean matchesMax = maxAge == null || age <= maxAge;
        return matchesMin && matchesMax;
    }

    private void validateFees(BigDecimal registrationFee, BigDecimal monthlyFee) {
        if (registrationFee != null && registrationFee.signum() < 0) {
            throw new IllegalArgumentException("Registration fee must be greater than or equal to zero.");
        }

        if (monthlyFee != null && monthlyFee.signum() < 0) {
            throw new IllegalArgumentException("Monthly fee must be greater than or equal to zero.");
        }
    }

    private void validateAgeRange(Integer minAge, Integer maxAge) {
        if (minAge != null && minAge < 0) {
            throw new IllegalArgumentException("Min age must be greater than or equal to zero.");
        }

        if (maxAge != null && maxAge < 0) {
            throw new IllegalArgumentException("Max age must be greater than or equal to zero.");
        }

        if (minAge != null && maxAge != null && minAge > maxAge) {
            throw new IllegalArgumentException("Min age cannot be greater than max age.");
        }
    }

    public Integer getId() {
        return id;
    }

    public BigDecimal getRegistrationFee() {
        return registrationFee;
    }

    public BigDecimal getMonthlyFee() {
        return monthlyFee;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public Modality getModality() {
        return modality;
    }

    public void setModality(Modality modality) {
        this.modality = modality;
    }
}