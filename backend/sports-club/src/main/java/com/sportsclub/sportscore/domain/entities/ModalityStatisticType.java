package com.sportsclub.sportscore.domain.entities;

import java.time.LocalDateTime;

import com.sportsclub.identity.domain.entities.Person;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "modality_statistic_type")
public class ModalityStatisticType {

    @EmbeddedId
    private ModalityStatisticTypeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("modalityId")
    @JoinColumn(name = "modality_id", nullable = false)
    private Modality modality;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("statisticTypeId")
    @JoinColumn(name = "statistic_type_id", nullable = false)
    private StatisticType statisticType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private Person updatedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected ModalityStatisticType() {
    }

    public ModalityStatisticType(Modality modality, StatisticType statisticType, Person by) {
        if (modality == null) {
            throw new IllegalArgumentException("Modality cannot be null.");
        }
        if (statisticType == null) {
            throw new IllegalArgumentException("Statistic type cannot be null.");
        }

        this.modality = modality;
        this.statisticType = statisticType;
        this.updatedBy = by;
        this.id = new ModalityStatisticTypeId(modality.getId(), statisticType.getId());
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (this.id == null && modality != null && statisticType != null) {
            this.id = new ModalityStatisticTypeId(modality.getId(), statisticType.getId());
        }
    }

    public ModalityStatisticTypeId getId() {
        return id;
    }

    public Modality getModality() {
        return modality;
    }

    public StatisticType getStatisticType() {
        return statisticType;
    }

    public Person getUpdatedBy() {
        return updatedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}