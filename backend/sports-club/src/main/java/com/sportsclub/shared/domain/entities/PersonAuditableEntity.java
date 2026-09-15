package com.sportsclub.shared.domain.entities;

import com.sportsclub.identity.domain.entities.Person;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class PersonAuditableEntity extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private Person updatedBy;

    public void touch(Person by) {
        this.updatedBy = by;
    }

    public Person getUpdatedBy() {
        return updatedBy;
    }
}