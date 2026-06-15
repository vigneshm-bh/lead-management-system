package com.leadmanagement.service;

import com.leadmanagement.dto.AuthRequest;
import com.leadmanagement.dto.AuthResponse;
import com.leadmanagement.entity.RefreshToken;
import com.leadmanagement.entity.User;
import com.leadmanagement.enums.Role;
import com.leadmanagement.repository.RefreshTokenRepository;
import com.leadmanagement.repository.UserRepository;
import com.leadmanagement.security.CookieUtil;
import com.leadmanagement.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.jwt.refresh-token-expiration-ms}")
    private long refreshTokenExpirationMs;

    @Transactional
    public AuthResponse register(AuthRequest request, HttpServletResponse response) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return generateTokensAndSetCookies(user.getUsername(), response);
    }

    @Transactional
    public AuthResponse login(AuthRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        return generateTokensAndSetCookies(request.getUsername(), response);
    }

    @Transactional
    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenValue = extractRefreshTokenFromCookie(request);
        if (refreshTokenValue == null) {
            throw new RuntimeException("Refresh token not found");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }

        // Delete old refresh token and issue new one (token rotation)
        refreshTokenRepository.delete(refreshToken);

        return generateTokensAndSetCookies(refreshToken.getUsername(), response);
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenValue = extractRefreshTokenFromCookie(request);
        if (refreshTokenValue != null) {
            refreshTokenRepository.findByToken(refreshTokenValue)
                    .ifPresent(refreshTokenRepository::delete);
        }
        cookieUtil.clearAuthCookies(response);
    }

    private AuthResponse generateTokensAndSetCookies(String username, HttpServletResponse response) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String accessToken = jwtUtil.generateAccessToken(userDetails);

        // Create refresh token
        String refreshTokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .username(username)
                .expiryDate(Instant.now().plusMillis(refreshTokenExpirationMs))
                .build();
        refreshTokenRepository.save(refreshToken);

        // Set cookies
        cookieUtil.addAccessTokenCookie(response, accessToken);
        cookieUtil.addRefreshTokenCookie(response, refreshTokenValue);

        return new AuthResponse(username);
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (CookieUtil.REFRESH_TOKEN_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
