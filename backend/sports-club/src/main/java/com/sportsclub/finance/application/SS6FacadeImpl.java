package com.sportsclub.finance.application;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.finance.domain.entities.Fee;
import com.sportsclub.finance.domain.entities.Payment;
import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.domain.enums.PaymentChannel;
import com.sportsclub.finance.domain.enums.PaymentMethod;
import com.sportsclub.finance.dto.filter.FeeFilterQuery;
import com.sportsclub.finance.dto.request.*;
import com.sportsclub.finance.dto.response.*;
import com.sportsclub.finance.repository.FeeRepository;
import com.sportsclub.finance.repository.FeeSpecifications;
import com.sportsclub.finance.repository.PaymentRepository;
import com.sportsclub.finance.service.PaymentGatewayService;
import com.sportsclub.finance.service.PaymentGatewayService.GatewayPaymentInfo;
import com.sportsclub.finance.service.SS6Mapper;
import com.sportsclub.finance.service.SS6WebhookService;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.identity.service.NotificationService;
import com.sportsclub.shared.application.VersionValidator;

@Service
@Transactional
public class SS6FacadeImpl implements SS6Facade {

    private final FeeRepository feeRepository;
    private final PaymentRepository paymentRepository;
    private final PersonRepository personRepository;
    private final SS6Mapper mapper;
    private final PaymentGatewayService paymentGatewayService;
    private final SS6WebhookService ss6WebhookService;
    private final NotificationService notificationService;
    private final VersionValidator versionValidator;

    public SS6FacadeImpl(
            FeeRepository feeRepository,
            PaymentRepository paymentRepository,
            PersonRepository personRepository,
            SS6Mapper mapper,
            PaymentGatewayService paymentGatewayService,
            SS6WebhookService ss6WebhookService,
            NotificationService notificationService,
            VersionValidator versionValidator) {
        this.feeRepository = feeRepository;
        this.paymentRepository = paymentRepository;
        this.personRepository = personRepository;
        this.mapper = mapper;
        this.paymentGatewayService = paymentGatewayService;
        this.ss6WebhookService = ss6WebhookService;
        this.notificationService = notificationService;
        this.versionValidator = versionValidator;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeResponse> listFees(FeeFilterQuery filter) {
        return feeRepository.findAll(FeeSpecifications.withFilter(filter))
                .stream()
                .map(mapper::toFeeResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeResponse> listAthleteFees(Integer athleteId, FeeFilterQuery filter) {
        getExistingPerson(athleteId);
        return feeRepository
                .findAll(FeeSpecifications.athleteActiveFees(athleteId).and(FeeSpecifications.withFilter(filter)))
                .stream()
                .map(mapper::toFeeResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeResponse> listAthleteDebts(Integer athleteId) {
        getExistingPerson(athleteId);
        return feeRepository.findByAthleteIdAndStatusOrderByDueDateDesc(athleteId, FeeStatus.DEBT)
                .stream()
                .map(mapper::toFeeResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> listPayments() {
        return paymentRepository.findAllByOrderByCreationDateDesc()
                .stream()
                .map(mapper::toPaymentResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> listAthletePayments(Integer athleteId) {
        getExistingPerson(athleteId);
        return paymentRepository.findByFeeAthleteIdOrderByCreationDateDesc(athleteId)
                .stream()
                .map(mapper::toPaymentResponse)
                .toList();
    }

    @Override
    public PaymentResponse registerCashPayment(RegisterCashPaymentRequest request, Integer by) {
        Fee fee = getExistingFee(request.feeId());
        Person collaborator = getExistingPerson(by);

        validateFeeUnpaid(fee);
        validatePaymentAmountMatchesFee(fee, request.confirmedAmount());
        validateNoConfirmedPaymentExists(fee);

        Payment payment = new Payment(
                LocalDateTime.now(),
                fee.getDueDate(),
                PaymentMethod.CASH,
                PaymentChannel.IN_PERSON,
                request.confirmedAmount(),
                fee);

        payment.confirm(request.confirmedAmount(), LocalDateTime.now(), collaborator);

        Payment saved = paymentRepository.save(payment);

        notifyFeePaid(saved);

        return mapper.toPaymentResponse(saved);
    }

    @Override
    public PaymentResponse registerMultibancoInPersonPayment(RegisterMultibancoPresencialRequest request, Integer by) {
        Fee fee = getExistingFee(request.feeId());
        Person collaborator = getExistingPerson(by);

        validateFeeUnpaid(fee);
        validateNoConfirmedPaymentExists(fee);
        validatePaymentAmountMatchesFee(fee, request.confirmedAmount());

        Payment payment = new Payment(
                LocalDateTime.now(),
                request.limitDate() != null ? request.limitDate() : fee.getDueDate(),
                PaymentMethod.MULTIBANCO,
                PaymentChannel.IN_PERSON,
                request.confirmedAmount(),
                fee);

        payment.setMultibancoReference(
                request.mbEntity(),
                request.mbReference(),
                request.limitDate() != null ? request.limitDate() : fee.getDueDate());

        payment.confirm(request.confirmedAmount(), LocalDateTime.now(), collaborator);
        payment.setTerminalId(request.terminalId());

        Payment saved = paymentRepository.save(payment);

        notifyFeePaid(saved);

        return mapper.toPaymentResponse(saved);
    }

    @Override
    public StartMultibancoOnlineResponse startMultibancoOnlinePayment(
            StartMultibancoOnlineRequest request,
            Integer by) {

        Fee fee = getExistingFee(request.feeId());
        Person collaborator = getExistingPerson(by);

        validateFeeUnpaid(fee);
        validateNoConfirmedPaymentExists(fee);

        BigDecimal amount = fee.getAmount();

        Payment payment = new Payment(
                LocalDateTime.now(),
                fee.getDueDate(),
                PaymentMethod.MULTIBANCO,
                PaymentChannel.ONLINE,
                amount,
                fee);

        payment = paymentRepository.save(payment);

        GatewayPaymentInfo gatewayInfo = paymentGatewayService.createPayment(
                amount.multiply(BigDecimal.valueOf(100)).intValue(),
                "CLUBE_" + payment.getId(),
                "Quota " + fee.getType() + " - " + fee.getAthlete().getName());

        payment.setMultibancoReference(
                gatewayInfo.entity(),
                gatewayInfo.reference(),
                gatewayInfo.validUntil());

        payment.setExternalId(gatewayInfo.idExterno());
        payment.setGateway("MOCK_GATEWAY");
        payment.touch(collaborator);

        payment = paymentRepository.save(payment);

        return new StartMultibancoOnlineResponse(
                payment.getId(),
                gatewayInfo.entity(),
                gatewayInfo.reference(),
                gatewayInfo.idExterno(),
                amount,
                gatewayInfo.validUntil(),
                payment.getStatus());
    }

    @Override
    @Transactional(readOnly = true)
    public MultibancoPaymentDataResponse getMultibancoPaymentData(Integer paymentId) {
        Payment payment = getExistingPayment(paymentId);
        validateMultibanco(payment);
        return mapper.toMultibancoPaymentData(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentStatusResponse getPaymentStatus(Integer paymentId) {
        return mapper.toPaymentStatus(getExistingPayment(paymentId));
    }

    @Override
    public void cancelPendingPayment(Integer paymentId, Long version, Integer by) {
        Payment payment = getExistingPayment(paymentId);
        Person actor = getExistingPerson(by);

        versionValidator.validate(version, payment.getVersion());

        if (!payment.canBeCancelled()) {
            throw new IllegalStateException("Payment cannot be cancelled");
        }

        payment.cancel(actor);
    }

    @Override
    @Transactional(readOnly = true)
    public FeeResponse getFeeByPayment(Integer paymentId) {
        return mapper.toFeeResponse(getExistingPayment(paymentId).getFee());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByFee(Integer feeId) {
        Fee fee = getExistingFee(feeId);
        return fee.getPayments().stream()
                .filter(Payment::isConfirmed)
                .findFirst()
                .map(mapper::toPaymentResponse)
                .orElseThrow(() -> new EntityNotFoundException("No confirmed payment for fee"));
    }

    @Override
    public void processGatewayNotification(GatewayNotificationRequest request) {
        ss6WebhookService.process(request);
    }

    @Override
    public PaymentResponse updateInPersonPayment(
            Integer paymentId,
            UpdateInPersonPaymentRequest request,
            Integer by) {

        Payment payment = getExistingPayment(paymentId);
        Person actor = getExistingPerson(by);
        Fee fee = payment.getFee();

        versionValidator.validate(request.version(), payment.getVersion());

        validateInPersonPayment(payment);
        validatePaymentMethodAllowedForInPerson(request.method());
        validatePaymentAmountMatchesFee(fee, request.confirmedAmount());

        payment.updateInPersonPayment(
                request.method(),
                request.confirmedAmount(),
                request.limitDate(),
                request.mbEntity(),
                request.mbReference(),
                request.terminalId(),
                actor);

        Payment saved = paymentRepository.save(payment);

        return mapper.toPaymentResponse(saved);
    }

    @Override
    public void deleteInPersonPayment(Integer paymentId, Long version, Integer by) {
        Payment payment = getExistingPayment(paymentId);
        Person actor = getExistingPerson(by);
        Fee fee = payment.getFee();

        versionValidator.validate(version, payment.getVersion());

        validateInPersonPayment(payment);

        if (payment.isConfirmed()) {
            fee.markAsUnpaid();
            fee.touch(actor);
        }

        paymentRepository.delete(payment);
    }

    private Person getExistingPerson(Integer id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Person not found: " + id));
    }

    private Fee getExistingFee(Integer id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fee not found: " + id));
    }

    private Payment getExistingPayment(Integer id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found: " + id));
    }

    private void validateFeeUnpaid(Fee fee) {
        if (!FeeStatus.UNPAID.equals(fee.getStatus())) {
            throw new IllegalStateException("Fee must be UNPAID");
        }
    }

    private void validateNoConfirmedPaymentExists(Fee fee) {
        if (fee.getPayments().stream().anyMatch(Payment::isConfirmed)) {
            throw new IllegalStateException("Fee already has confirmed payment");
        }
    }

    private void validateMultibanco(Payment payment) {
        if (!PaymentMethod.MULTIBANCO.equals(payment.getMethod())) {
            throw new IllegalStateException("Not a multibanco payment");
        }
    }

    private void validatePaymentAmountMatchesFee(Fee fee, BigDecimal confirmedAmount) {
        if (fee == null) {
            throw new IllegalArgumentException("Fee cannot be null.");
        }

        if (confirmedAmount == null) {
            throw new IllegalArgumentException("Confirmed amount cannot be null.");
        }

        if (fee.getAmount().compareTo(confirmedAmount) != 0) {
            throw new IllegalArgumentException("Confirmed amount must match fee amount.");
        }
    }

    private void notifyFeePaid(Payment payment) {
        Fee fee = payment.getFee();

        if (fee.getAthlete() == null) {
            return;
        }

        notificationService.send(
                fee.getAthlete(),
                NotificationType.FEE_PAID,
                "O teu pagamento da quota "
                        + fee.getType()
                        + " no valor de "
                        + payment.getConfirmedAmount()
                        + "€ foi confirmado.");
    }

    private void validateInPersonPayment(Payment payment) {
        if (!PaymentChannel.IN_PERSON.equals(payment.getChannel())) {
            throw new IllegalStateException("Only in-person payments can be edited or deleted.");
        }

        if (payment.wasInitiatedViaGateway()) {
            throw new IllegalStateException("Gateway payments cannot be edited or deleted manually.");
        }
    }

    private void validatePaymentMethodAllowedForInPerson(PaymentMethod method) {
        if (method == null) {
            throw new IllegalArgumentException("Payment method is required.");
        }

        if (!PaymentMethod.CASH.equals(method) && !PaymentMethod.MULTIBANCO.equals(method)) {
            throw new IllegalArgumentException("Only CASH and MULTIBANCO are allowed for in-person payments.");
        }
    }
}