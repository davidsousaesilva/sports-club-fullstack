package com.sportsclub.sportscore.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.valueobjects.ModalityData;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "modality")
public class Modality extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "trained", nullable = false)
    private boolean trained;

    @Column(name = "max_presences_per_week")
    private Integer maxPresencesPerWeek;

    @OneToMany(mappedBy = "modality", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModalityStatisticType> statisticTypes = new ArrayList<>();

    @OneToMany(mappedBy = "modality", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModalityPrice> prices = new ArrayList<>();

    protected Modality() {
    }

    public Modality(
            String name,
            String eventType,
            String description,
            boolean trained,
            Integer maxPresencesPerWeek) {
        validateMaxPresencesPerWeek(maxPresencesPerWeek);
        this.name = name;
        this.eventType = eventType;
        this.description = description;
        this.trained = trained;
        this.maxPresencesPerWeek = maxPresencesPerWeek;
    }

    public void update(ModalityData data, Person by) {
        validateMaxPresencesPerWeek(data.maxPresencesPerWeek());

        this.name = data.name();
        this.eventType = data.eventType();
        this.description = data.description();
        this.trained = data.trained();
        this.maxPresencesPerWeek = data.maxPresencesPerWeek();
        touch(by);
    }

    public void replaceStatisticTypes(List<StatisticType> statisticTypes, Person by) {
        this.statisticTypes.clear();

        if (statisticTypes == null || statisticTypes.isEmpty()) {
            touch(by);
            return;
        }

        for (StatisticType statisticType : statisticTypes) {
            if (statisticType == null) {
                throw new IllegalArgumentException("Statistic type cannot be null.");
            }

            ModalityStatisticType association = new ModalityStatisticType(this, statisticType, by);
            this.statisticTypes.add(association);
        }

        touch(by);
    }

    public void replacePrices(List<ModalityPrice> prices, Person by) {
        validatePriceOverlaps(prices);

        this.prices.clear();

        if (prices != null) {
            for (ModalityPrice price : prices) {
                if (price == null) {
                    throw new IllegalArgumentException("Price cannot be null.");
                }

                price.setModality(this);
                price.touch(by);
                this.prices.add(price);
            }
        }

        touch(by);
    }

    public BigDecimal getRegistrationPriceFor(LocalDate birthDate) {
        ModalityPrice price = getApplicablePrice(birthDate);
        if (price.getRegistrationFee() == null) {
            throw new IllegalStateException("Registration fee is not defined for the applicable age range.");
        }

        return price.getRegistrationFee();
    }

    public BigDecimal getMonthlyFeeFor(LocalDate birthDate) {
        ModalityPrice price = getApplicablePrice(birthDate);
        if (price.getMonthlyFee() == null) {
            throw new IllegalStateException("Monthly fee is not defined for the applicable age range.");
        }

        return price.getMonthlyFee();
    }

    public ModalityPrice getApplicablePrice(LocalDate birthDate) {
        if (birthDate == null) {
            throw new IllegalArgumentException("Birth date is required.");
        }

        int age = Period.between(birthDate, LocalDate.now()).getYears();

        List<ModalityPrice> matches = prices.stream()
                .filter(price -> price.matchesAge(age))
                .toList();

        if (matches.isEmpty()) {
            throw new IllegalStateException("No price rule matches the provided birth date.");
        }

        if (matches.size() > 1) {
            throw new IllegalStateException("Multiple price rules match the provided birth date.");
        }

        return matches.get(0);
    }

    public List<StatisticType> getStatisticTypeEntities() {
        return statisticTypes.stream()
                .map(ModalityStatisticType::getStatisticType)
                .toList();
    }

    private void validateMaxPresencesPerWeek(Integer maxPresencesPerWeek) {
        if (maxPresencesPerWeek != null && maxPresencesPerWeek < 0) {
            throw new IllegalArgumentException("Max presences per week must be greater than or equal to zero.");
        }
    }

    private void validatePriceOverlaps(List<ModalityPrice> prices) {
        if (prices == null || prices.size() <= 1) {
            return;
        }

        List<ModalityPrice> orderedPrices = new ArrayList<>(prices);
        orderedPrices.sort(Comparator.comparing(
                price -> Optional.ofNullable(price.getMinAge()).orElse(Integer.MIN_VALUE)));

        for (int i = 0; i < orderedPrices.size(); i++) {
            ModalityPrice current = orderedPrices.get(i);

            for (int j = i + 1; j < orderedPrices.size(); j++) {
                ModalityPrice next = orderedPrices.get(j);

                if (rangesOverlap(current, next)) {
                    throw new IllegalStateException("Price age ranges cannot overlap.");
                }
            }
        }
    }

    private boolean rangesOverlap(ModalityPrice first, ModalityPrice second) {
        int firstMin = first.getMinAge() != null ? first.getMinAge() : Integer.MIN_VALUE;
        int firstMax = first.getMaxAge() != null ? first.getMaxAge() : Integer.MAX_VALUE;
        int secondMin = second.getMinAge() != null ? second.getMinAge() : Integer.MIN_VALUE;
        int secondMax = second.getMaxAge() != null ? second.getMaxAge() : Integer.MAX_VALUE;

        return firstMin <= secondMax && secondMin <= firstMax;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEventType() {
        return eventType;
    }

    public String getDescription() {
        return description;
    }

    public boolean isTrained() {
        return trained;
    }

    public Integer getMaxPresencesPerWeek() {
        return maxPresencesPerWeek;
    }

    public List<ModalityStatisticType> getStatisticTypes() {
        return List.copyOf(statisticTypes);
    }

    public List<ModalityPrice> getPrices() {
        return List.copyOf(prices);
    }
}