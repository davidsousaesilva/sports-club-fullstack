package com.sportsclub.finance.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sportsclub.finance.domain.entities.Payment;
import com.sportsclub.finance.domain.enums.PaymentMethod;
import com.sportsclub.finance.domain.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByFeeAthleteIdOrderByCreationDateDesc(Integer athleteId);

    List<Payment> findAllByOrderByCreationDateDesc();

    Optional<Payment> findFirstByFeeIdAndMbEntityIsNotNullAndMbReferenceIsNotNullOrderByCreationDateDesc(Integer feeId);

    Optional<Payment> findByExternalId(String externalId);

    long countByStatus(PaymentStatus status);

    long countByMethod(PaymentMethod method);

    @Query("""
        select coalesce(sum(p.confirmedAmount), 0)
        from Payment p
        where p.status = com.sportsclub.finance.domain.enums.PaymentStatus.CONFIRMED
          and p.confirmationDate >= :start
          and p.confirmationDate < :end
    """)
    BigDecimal sumConfirmedAmountBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
        select coalesce(sum(p.confirmedAmount), 0)
        from Payment p
        where p.status = com.sportsclub.finance.domain.enums.PaymentStatus.CONFIRMED
    """)
    BigDecimal sumConfirmedAmount();

    @Query("""
        select count(p)
        from Payment p
        where p.status = com.sportsclub.finance.domain.enums.PaymentStatus.CONFIRMED
        and p.method = :method
    """)
    long countConfirmedByMethod(@Param("method") PaymentMethod method);

    @Query("""
        select coalesce(sum(p.confirmedAmount), 0)
        from Payment p
        where p.status = com.sportsclub.finance.domain.enums.PaymentStatus.CONFIRMED
        and p.method = :method
    """)
    BigDecimal sumConfirmedAmountByMethod(@Param("method") PaymentMethod method);

    @Query("""
        select coalesce(avg(p.confirmedAmount), 0)
        from Payment p
        where p.status = com.sportsclub.finance.domain.enums.PaymentStatus.CONFIRMED
        and p.method = :method
    """)
    BigDecimal averageConfirmedAmountByMethod(@Param("method") PaymentMethod method);
}