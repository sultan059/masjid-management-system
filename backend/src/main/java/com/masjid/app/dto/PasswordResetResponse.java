package com.masjid.app.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PasswordResetResponse {
    private String message;
    private String resetToken;
    private boolean success;
}
