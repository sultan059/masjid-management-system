package com.masjid.app.service;

import com.masjid.app.dto.ChangePasswordRequest;
import com.masjid.app.dto.LoginRequest;
import com.masjid.app.dto.LoginResponse;
import com.masjid.app.dto.PasswordResetConfirmRequest;
import com.masjid.app.dto.PasswordResetRequest;
import com.masjid.app.dto.PasswordResetResponse;
import com.masjid.app.dto.RegisterRequest;
import com.masjid.app.entity.User;
import com.masjid.app.exception.BadRequestException;
import com.masjid.app.repository.UserRepository;
import com.masjid.app.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User.Role role = User.Role.MEMBER;
        if (request.getRole() != null) {
            try {
                role = User.Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                role = User.Role.MEMBER;
            }
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(role);

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Always return success for security (don't reveal if email exists)
        if (user == null) {
            return PasswordResetResponse.builder()
                    .success(true)
                    .message("If an account exists with this email, a password reset link will be displayed")
                    .build();
        }

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        return PasswordResetResponse.builder()
                .success(true)
                .message("Password reset link generated")
                .resetToken(resetToken)
                .build();
    }

    @Transactional
    public PasswordResetResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        User user = userRepository.findByResetToken(request.getToken()).orElse(null);

        if (user == null) {
            throw new BadRequestException("Invalid reset token");
        }

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return PasswordResetResponse.builder()
                .success(true)
                .message("Password has been reset successfully")
                .build();
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, String userEmail) {
        log.info("changePassword called for user: {}", userEmail);
        if (userEmail == null || userEmail.trim().isEmpty()) {
            log.error("userEmail is null or empty!");
            throw new BadCredentialsException("User not authenticated");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> {
                    log.error("User not found: {}", userEmail);
                    return new BadCredentialsException("User not found");
                });

        log.info("User found: {}, checking old password", user.getEmail());
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            log.error("Password mismatch for user: {}", userEmail);
            throw new BadCredentialsException("Current password is incorrect");
        }

        log.info("Updating password for user: {}", userEmail);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password updated successfully for user: {}", userEmail);
    }
}
