package com.sportsclub.security.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sportsclub.security.dto.request.LoginRequest;
import com.sportsclub.security.dto.response.LoginResponse;
import com.sportsclub.security.jwt.JwtService;
import com.sportsclub.security.jwt.TokenBlacklistService;
import com.sportsclub.security.user.AuthenticatedUser;
import com.sportsclub.security.user.PersonUserDetailsService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PersonUserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthenticationController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            PersonUserDetailsService userDetailsService,
            TokenBlacklistService tokenBlacklistService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()));

            AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            addRefreshTokenCookie(response, refreshToken);

            return ResponseEntity.ok(new LoginResponse(accessToken));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshToken = getRefreshTokenFromCookie(request);
        if (refreshToken == null || !jwtService.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).build();
        }

        String oldJti = jwtService.extractJti(refreshToken);
        if (tokenBlacklistService.isBlacklisted(oldJti)) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtService.extractEmail(refreshToken);
        AuthenticatedUser user = (AuthenticatedUser) userDetailsService.loadUserByUsername(email);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        tokenBlacklistService.blacklistToken(oldJti, jwtService.getRefreshTokenExpiration());
        addRefreshTokenCookie(response, newRefreshToken);

        return ResponseEntity.ok(new LoginResponse(newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshToken = getRefreshTokenFromCookie(request);

        if (refreshToken != null) {
            try {
                String jti = jwtService.extractJti(refreshToken);
                tokenBlacklistService.blacklistToken(jti, jwtService.getRefreshTokenExpiration());
            } catch (Exception ignored) {
            }
        }

        clearRefreshTokenCookie(response);
        return ResponseEntity.noContent().build();
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalStateException("Refresh token cannot be null/empty");
        }
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .maxAge(jwtService.getRefreshTokenExpiration() / 1000)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .maxAge(0)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (REFRESH_TOKEN_COOKIE.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}