package com.sportsclub.finance.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.finance.domain.entities.GatewayPaymentAttempt;

public interface GatewayPaymentAttemptRepository extends JpaRepository<GatewayPaymentAttempt, Integer> {

    List<GatewayPaymentAttempt> findByPaymentIdOrderByCreationDateDesc(Integer paymentId);
}