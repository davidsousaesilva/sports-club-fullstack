package com.sportsclub.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sportsclub.security.user.AuthenticatedUser;

@Service
public class JwtService {

    private static final String ISSUER = "club-api";
    private static final String AUDIENCE = "club-webapp";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access.expiration:900000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh.expiration:604800000}")
    private long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(AuthenticatedUser user) {
        return createToken(user, accessTokenExpiration, "access");
    }

    public String generateRefreshToken(AuthenticatedUser user) {
        return createToken(user, refreshTokenExpiration, "refresh");
    }

    private String createToken(AuthenticatedUser user, long expiration, String tokenType) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        String token = Jwts.builder()
                .issuer(ISSUER)
                .subject(String.valueOf(user.getPersonId()))
                .audience().add(AUDIENCE).and()
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .notBefore(now)
                .expiration(expiryDate)
                .claim("email", user.getUsername())
                .claim("name", user.getName())
                .claim("active", user.isActiveUser())
                .claim("roles", user.getRoles())
                .claim("main_role", user.getMainRole())
                .claim("token_type", tokenType)
                .signWith(getSigningKey())
                .compact();

        return java.util.Objects.requireNonNull(token, "JWT token generation failed");
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Integer extractPersonId(String token) {
        return Integer.valueOf(extractAllClaims(token).getSubject());
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    public String extractTokenType(String token) {
        return extractAllClaims(token).get("token_type", String.class);
    }

    public String extractJti(String token) {
        return extractAllClaims(token).getId();
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public boolean validateAccessToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return "access".equals(claims.get("token_type", String.class))
                    && ISSUER.equals(claims.getIssuer())
                    && claims.getAudience() != null
                    && claims.getAudience().contains(AUDIENCE)
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return "refresh".equals(claims.get("token_type", String.class))
                    && ISSUER.equals(claims.getIssuer())
                    && claims.getAudience() != null
                    && claims.getAudience().contains(AUDIENCE)
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }

    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    public String extractName(String token) {
        return extractAllClaims(token).get("name", String.class);
    }

    @SuppressWarnings("unchecked")
    public java.util.List<String> extractRoles(String token) {
        Object roles = extractAllClaims(token).get("roles");

        if (roles instanceof java.util.List<?> list) {
            return list.stream()
                    .map(String::valueOf)
                    .toList();
        }

        return java.util.List.of();
    }

    public String extractMainRole(String token) {
        return extractAllClaims(token).get("main_role", String.class);
    }

}