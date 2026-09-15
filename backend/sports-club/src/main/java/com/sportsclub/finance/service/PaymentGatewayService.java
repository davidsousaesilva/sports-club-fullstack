package com.sportsclub.finance.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.sportsclub.finance.service.PaymentGatewayService.GatewayPaymentInfo;

@Service
public class PaymentGatewayService {

        private final RestTemplate restTemplate;
        private final String sandboxUrl;
        private final String entityId;
        private final String apiKey;
        private final boolean mockEnabled;

        public PaymentGatewayService(
                RestTemplate restTemplate,
                @Value("${payment-gateway.sandbox-url:}") String sandboxUrl,
                @Value("${payment-gateway.entity:}") String entityId,
                @Value("${payment-gateway.api-key:}") String apiKey,
                @Value("${payment-gateway.mock-enabled:true}") boolean mockEnabled) {
        this.restTemplate = restTemplate;
        this.sandboxUrl = sandboxUrl;
        this.entityId = entityId;
        this.apiKey = apiKey;
        this.mockEnabled = mockEnabled;
        }

        public GatewayPaymentInfo createPayment(int amountCents, String orderId, String description) {
                if (mockEnabled || apiKey == null || apiKey.isBlank() || entityId == null || entityId.isBlank()) {
                        return createMockPayment(orderId);
                }

                GatewayCreateRequest request = new GatewayCreateRequest(
                        entityId,
                        amountCents,
                        orderId,
                        description);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(apiKey);

                HttpEntity<GatewayCreateRequest> entity = new HttpEntity<>(request, headers);

                try {
                        GatewayCreateResponse response = restTemplate.postForObject(
                                sandboxUrl + "/multibanco/api/createPayment",
                                entity,
                                GatewayCreateResponse.class);

                        if (response == null) {
                        throw new IllegalStateException("Empty response from payment gateway");
                        }

                        return new GatewayPaymentInfo(
                                response.paymentId(),
                                response.referenciaEntidade(),
                                response.referencia(),
                                parseDateTime(response.validade()));

                } catch (RestClientException ex) {
                        throw new IllegalStateException("Error creating payment in payment gateway", ex);
                }
        }

        private GatewayPaymentInfo createMockPayment(String orderId) {
        String reference = String.valueOf(
                100000000 + Math.abs(orderId.hashCode() % 900000000));

        return new GatewayPaymentInfo(
                "MOCK_" + orderId,
                "99999",
                reference,
                LocalDateTime.now().plusDays(3));
        }

        private LocalDateTime parseDateTime(String value) {
                if (value == null || value.isBlank()) {
                        return LocalDateTime.now().plusDays(3);
                }
                try {
                        return OffsetDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME).toLocalDateTime();
                } catch (Exception ex) {
                        return LocalDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME);
                }
        }

        public record GatewayCreateRequest(String entidade, int valor, String idPedido, String detalhes) {
        }

        public record GatewayCreateResponse(String paymentId, String referenciaEntidade, String referencia,
                        String validade) {
        }

        public record GatewayPaymentInfo(String idExterno, String entity, String reference,
                        LocalDateTime validUntil) {
        }
}