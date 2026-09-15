package com.sportsclub.finance.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import jakarta.persistence.*;

import com.sportsclub.activities.domain.entities.CompetitionTeam;
import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.domain.enums.FeeType;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.teams.domain.entities.Team;

@Entity
@Table(name = "fee")
public class Fee extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private FeeType type;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FeeStatus status = FeeStatus.UNPAID;

    @Column(name = "next_cycle")
    private LocalDateTime nextCycle;

    @Column(name = "recurrent", nullable = false)
    private boolean recurrent = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id")
    private Person athlete;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_team_id")
    private CompetitionTeam competitionTeamOrigin;

    @OneToMany(mappedBy = "fee")
    private List<Payment> payments = new ArrayList<>();

    protected Fee() {
    }

    public Fee(LocalDateTime creationDate, LocalDateTime dueDate, FeeType type,
            BigDecimal amount, LocalDateTime nextCycle, boolean recurrent, Person athlete,
            Team team, CompetitionTeam competitionTeamOrigin) {
        this.creationDate = Objects.requireNonNull(creationDate);
        this.dueDate = Objects.requireNonNull(dueDate);
        this.type = Objects.requireNonNull(type);
        validateAmount(amount);
        this.amount = amount;
        this.nextCycle = nextCycle;
        this.recurrent = recurrent;
        this.athlete = athlete;
        this.team = team;
        this.competitionTeamOrigin = competitionTeamOrigin;
    }

    public void markAsPaid() {
        this.status = FeeStatus.PAID;
    }

    public void markAsDebt() {
        this.status = FeeStatus.DEBT;
    }

    public void markAsUnpaid() {
        this.status = FeeStatus.UNPAID;
    }

    @Deprecated
    public void markAsPending() {
        markAsUnpaid();
    }

    @Deprecated
    public void markAsExpired() {
        markAsDebt();
    }

    public boolean isOverdue(LocalDateTime at) {
        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();
        return FeeStatus.UNPAID.equals(status) && dueDate.isBefore(effectiveAt);
    }

    private void validateAmount(BigDecimal value) {
        if (value == null || value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("amount cannot be null or negative");
        }
    }

    public Integer getId() {
        return id;
    }


    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public FeeType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public FeeStatus getStatus() {
        return status;
    }

    public LocalDateTime getNextCycle() {
        return nextCycle;
    }

    public boolean isRecurrent() {
        return recurrent;
    }

    public Person getAthlete() {
        return athlete;
    }

    public Team getTeam() {
        return team;
    }

    public CompetitionTeam getCompetitionTeamOrigin() {
        return competitionTeamOrigin;
    }

    public List<Payment> getPayments() {
        return List.copyOf(payments);
    }

    public void scheduleNextCycle(LocalDateTime nextCycle) {
        this.nextCycle = nextCycle;
    }

    public boolean shouldGenerateNextCycle(LocalDateTime at) {
        return recurrent
                && FeeType.MONTHLY_FEE.equals(type)
                && nextCycle != null
                && !nextCycle.isAfter(at);
    }
}