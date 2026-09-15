package com.sportsclub.shared.validation;

public final class ValidationPatterns {

    private ValidationPatterns() {
    }

    public static final String PERSON_NAME =
            "^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,100}$";

    public static final String PHONE =
            "^\\+?[0-9 ]{9,20}$";

    public static final String PASSWORD =
            "^(?=.*\\d).{4,}$";

    public static final String TEAM_NAME =
            "^[A-Za-zÀ-ÖØ-öø-ÿ0-9' ._-]{2,100}$";

    public static final String MODALITY_NAME =
            "^[A-Za-zÀ-ÖØ-öø-ÿ0-9' ._-]{2,100}$";

    public static final String COMPLEX_NAME =
            "^[A-Za-zÀ-ÖØ-öø-ÿ0-9' ._-]{2,100}$";

    public static final String SEASON_YEAR =
            "^\\d{4}(\\/\\d{4})?$";

    public static final String ADDRESS =
            "^[A-Za-zÀ-ÖØ-öø-ÿ0-9' .,ºª/_-]{2,255}$";
}