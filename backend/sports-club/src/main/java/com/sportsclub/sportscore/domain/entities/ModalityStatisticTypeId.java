package com.sportsclub.sportscore.domain.entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ModalityStatisticTypeId implements Serializable {

    @Column(name = "modality_id")
    private Integer modalityId;

    @Column(name = "statistic_type_id")
    private Integer statisticTypeId;

    protected ModalityStatisticTypeId() {
    }

    public ModalityStatisticTypeId(Integer modalityId, Integer statisticTypeId) {
        this.modalityId = modalityId;
        this.statisticTypeId = statisticTypeId;
    }

    public Integer getModalityId() {
        return modalityId;
    }

    public Integer getStatisticTypeId() {
        return statisticTypeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ModalityStatisticTypeId that)) {
            return false;
        }
        return Objects.equals(modalityId, that.modalityId)
                && Objects.equals(statisticTypeId, that.statisticTypeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modalityId, statisticTypeId);
    }
}