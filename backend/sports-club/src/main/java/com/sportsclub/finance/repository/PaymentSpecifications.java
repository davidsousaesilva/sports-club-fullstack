package com.sportsclub.finance.repository;

import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.finance.domain.entities.Payment;
import com.sportsclub.finance.domain.enums.PaymentMethod;
import com.sportsclub.finance.domain.enums.PaymentStatus;

public class PaymentSpecifications {

    public static Specification<Payment> pendingPayments() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), PaymentStatus.PENDING);
    }

    public static Specification<Payment> multibancoPayments() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("method"), PaymentMethod.MULTIBANCO);
    }
}