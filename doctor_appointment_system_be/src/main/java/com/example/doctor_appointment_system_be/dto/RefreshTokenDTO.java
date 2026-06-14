package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenDTO {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
