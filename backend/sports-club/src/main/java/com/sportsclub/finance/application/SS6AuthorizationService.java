package com.sportsclub.finance.application;

import com.sportsclub.finance.repository.FeeRepository;
import com.sportsclub.finance.repository.PaymentRepository;
import com.sportsclub.security.util.SecurityUtils;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("ss6AuthorizationService")
public class SS6AuthorizationService {

    private final PaymentRepository paymentRepository;
    private final FeeRepository feeRepository;

    public SS6AuthorizationService(PaymentRepository paymentRepository, FeeRepository feeRepository) {
        this.paymentRepository = paymentRepository;
        this.feeRepository = feeRepository;
    }

    @Transactional(readOnly = true)
    public boolean canAccessPayment(Integer paymentId) {
        Integer personId = SecurityUtils.getAuthenticatedPersonId();
        return paymentRepository.findById(paymentId)
                .map(payment -> payment.getFee() != null
                        && payment.getFee().getAthlete() != null
                        && personId.equals(payment.getFee().getAthlete().getId()))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean canAccessFee(Integer feeId) {
        Integer personId = SecurityUtils.getAuthenticatedPersonId();
        return feeRepository.findById(feeId)
                .map(fee -> fee.getAthlete() != null
                        && personId.equals(fee.getAthlete().getId()))
                .orElse(false);
    }
}