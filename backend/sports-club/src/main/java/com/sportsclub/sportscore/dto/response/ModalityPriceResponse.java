package com.sportsclub.sportscore.dto.response;

import java.math.BigDecimal;

public record ModalityPriceResponse(
        Integer id,
        BigDecimal registrationFee,
        BigDecimal monthlyFee,
        Integer ageRangeMin,
        Integer ageRangeMax,
        Integer modalityId) {
}