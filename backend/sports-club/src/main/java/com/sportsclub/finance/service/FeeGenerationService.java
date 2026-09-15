package com.sportsclub.finance.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.activities.domain.entities.CompetitionTeam;
import com.sportsclub.finance.domain.entities.Fee;
import com.sportsclub.finance.domain.enums.FeeType;
import com.sportsclub.finance.repository.FeeRepository;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.teams.domain.entities.Team;

@Service
@Transactional
public class FeeGenerationService {

    private final FeeRepository feeRepository;

    public FeeGenerationService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    public Fee generateTeamRegistrationFeeIfNeeded(
        Person athlete,
        Team team,
        BigDecimal amount,
        LocalDateTime dueDate,
        Person actor) {

        validateAthleteAndTeam(athlete, team);

        if (shouldNotCreateFee(amount)) {
            return null;
        }

        boolean alreadyExists = feeRepository.existsByAthleteIdAndTeamIdAndType(
                athlete.getId(),
                team.getId(),
                FeeType.REGISTRATION);

        if (alreadyExists) {
            return null;
        }

        Fee fee = new Fee(
        LocalDateTime.now(),
        dueDate,
        FeeType.REGISTRATION,
        amount,
        null,
        false,
        athlete,
        team,
        null);

        fee.touch(actor);

        return feeRepository.save(fee);
    }

    public Fee generateMonthlyFeeIfNeeded(
            Person athlete,
            Team team,
            BigDecimal amount,
            LocalDateTime dueDate,
            LocalDateTime nextCycle,
            Person actor) {

        validateAthleteAndTeam(athlete, team);

        if (shouldNotCreateFee(amount)) {
            return null;
        }

        boolean alreadyExists = feeRepository.existsByAthleteIdAndTeamIdAndType(
                athlete.getId(),
                team.getId(),
                FeeType.MONTHLY_FEE);

        if (alreadyExists) {
            return null;
        }

        Fee fee = new Fee(
                LocalDateTime.now(),
                dueDate,
                FeeType.MONTHLY_FEE,
                amount,
                nextCycle,
                true,
                athlete,
                team,
                null);

        fee.touch(actor);

        return feeRepository.save(fee);
    }

    public Fee generateCompetitionFeeIfNeeded(
            Person athlete,
            CompetitionTeam competitionTeam,
            BigDecimal amount,
            LocalDateTime dueDate,
            Person actor) {

        if (athlete == null || athlete.getId() == null) {
            throw new IllegalArgumentException("Athlete must exist.");
        }

        if (competitionTeam == null || competitionTeam.getId() == null) {
            throw new IllegalArgumentException("Competition team must exist.");
        }

        if (shouldNotCreateFee(amount)) {
            return null;
        }

        boolean alreadyExists = feeRepository.existsByAthleteIdAndCompetitionTeamOriginIdAndType(
                athlete.getId(),
                competitionTeam.getId(),
                FeeType.COMPETITION_FEE);

        if (alreadyExists) {
            return null;
        }

        Fee fee = new Fee(
                LocalDateTime.now(),
                dueDate,
                FeeType.COMPETITION_FEE,
                amount,
                null,
                false,
                athlete,
                competitionTeam.getTeam(),
                competitionTeam);

        fee.touch(actor);

        return feeRepository.save(fee);
    }

    private void validateAthleteAndTeam(Person athlete, Team team) {
        if (athlete == null || athlete.getId() == null) {
            throw new IllegalArgumentException("Athlete must exist.");
        }

        if (team == null || team.getId() == null) {
            throw new IllegalArgumentException("Team must exist.");
        }
    }

    private boolean shouldNotCreateFee(BigDecimal amount) {
        return amount == null || amount.compareTo(BigDecimal.ZERO) <= 0;
    }

    public void generateFeesForTeamAthleteRegistration(
            Person athlete,
            Team team,
            LocalDateTime registrationDate,
            Person actor) {

        if (athlete == null || athlete.getId() == null) {
            throw new IllegalArgumentException("Athlete must exist.");
        }

        if (team == null || team.getId() == null) {
            throw new IllegalArgumentException("Team must exist.");
        }

        if (team.getModality() == null) {
            throw new IllegalArgumentException("Team modality must exist.");
        }

        LocalDateTime effectiveDate = registrationDate != null
                ? registrationDate
                : LocalDateTime.now();

        LocalDateTime nextMonthlyCycle = effectiveDate
            .toLocalDate()
            .withDayOfMonth(1)
            .plusMonths(1)
            .atStartOfDay();

        BigDecimal registrationAmount = resolveRegistrationFee(team, athlete);
        BigDecimal monthlyAmount = resolveMonthlyFee(team, athlete);

        generateTeamRegistrationFeeIfNeeded(
                athlete,
                team,
                registrationAmount,
                effectiveDate.plusDays(30),
                actor);

        generateMonthlyFeeIfNeeded(
            athlete,
            team,
            monthlyAmount,
            effectiveDate.plusDays(30),
            nextMonthlyCycle,
            actor);
    }

    private BigDecimal resolveRegistrationFee(Team team, Person athlete) {
        return team.getModality()
                .getRegistrationPriceFor(athlete.getBirthDate());
    }

    private BigDecimal resolveMonthlyFee(Team team, Person athlete) {
        return team.getModality()
                .getMonthlyFeeFor(athlete.getBirthDate());
    }

    public int generateDueMonthlyFees(LocalDateTime at, Person actor) {
        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();

        List<Fee> recurrentFees = feeRepository.findByRecurrentTrueAndTypeAndNextCycleLessThanEqual(
                FeeType.MONTHLY_FEE,
                effectiveAt);

        int generated = 0;

        for (Fee recurrentFee : recurrentFees) {
            Person athlete = recurrentFee.getAthlete();
            Team team = recurrentFee.getTeam();

            if (athlete == null || athlete.getId() == null || team == null || team.getId() == null) {
                continue;
            }

            LocalDateTime cycleDate = recurrentFee.getNextCycle();

            LocalDateTime monthStart = cycleDate
                    .toLocalDate()
                    .withDayOfMonth(1)
                    .atStartOfDay();

            LocalDateTime monthEnd = monthStart.plusMonths(1);

            boolean alreadyExistsForMonth = feeRepository.existsByAthleteIdAndTeamIdAndTypeAndDueDateBetween(
                    athlete.getId(),
                    team.getId(),
                    FeeType.MONTHLY_FEE,
                    monthStart,
                    monthEnd);

            if (!alreadyExistsForMonth) {
                LocalDateTime dueDate = cycleDate.plusDays(7);

                Fee newFee = new Fee(
                        LocalDateTime.now(),
                        dueDate,
                        FeeType.MONTHLY_FEE,
                        recurrentFee.getAmount(),
                        null,
                        false,
                        athlete,
                        team,
                        null);

                if (actor != null) {
                    newFee.touch(actor);
                }

                feeRepository.save(newFee);
                generated++;
            }

            recurrentFee.scheduleNextCycle(cycleDate.plusMonths(1));

            if (actor != null) {
                recurrentFee.touch(actor);
            }
        }

        return generated;
    }
}