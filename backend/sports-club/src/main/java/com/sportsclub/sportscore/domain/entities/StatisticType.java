package com.sportsclub.sportscore.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.valueobjects.StatisticTypeData;

@Entity
@Table(name = "statistic_type")
public class StatisticType extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "unit", nullable = false, length = 100)
    private String unit;

    @Column(name = "mandatory", nullable = false)
    private boolean mandatory;

    protected StatisticType() {
    }

    public StatisticType(String name, String unit, boolean mandatory) {
        this.name = name;
        this.unit = unit;
        this.mandatory = mandatory;
    }

    public void update(StatisticTypeData data, Person by) {
        this.name = data.name();
        this.unit = data.unit();
        this.mandatory = data.mandatory();
        touch(by);
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUnit() {
        return unit;
    }

    public boolean isMandatory() {
        return mandatory;
    }
}