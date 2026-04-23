package com.masjid.app.controller;

import com.masjid.app.dto.ChangePasswordRequest;
import com.masjid.app.dto.LoginRequest;
import com.masjid.app.dto.LoginResponse;
import com.masjid.app.dto.PasswordResetConfirmRequest;
import com.masjid.app.dto.PasswordResetRequest;
import com.masjid.app.dto.PasswordResetResponse;
import com.masjid.app.dto.RegisterRequest;
import com.masjid.app.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/password-reset")
    public ResponseEntity<PasswordResetResponse> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.requestPasswordReset(request));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<PasswordResetResponse> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        return ResponseEntity.ok(authService.confirmPasswordReset(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        log.info("change-password request received: oldPassword present={}, newPassword present={}",
                request.getOldPassword() != null, request.getNewPassword() != null);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        log.info("change-password endpoint called for user: {}", userEmail);
        authService.changePassword(request, userEmail);
        return ResponseEntity.ok().build();
    }
}
