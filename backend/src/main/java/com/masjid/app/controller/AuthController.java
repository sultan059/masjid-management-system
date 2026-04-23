package com.masjid.app.controller;

import com.masjid.app.dto.LoginRequest;
import com.masjid.app.dto.LoginResponse;
import com.masjid.app.dto.PasswordResetConfirmRequest;
import com.masjid.app.dto.PasswordResetRequest;
import com.masjid.app.dto.PasswordResetResponse;
import com.masjid.app.dto.RegisterRequest;
import com.masjid.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
}
