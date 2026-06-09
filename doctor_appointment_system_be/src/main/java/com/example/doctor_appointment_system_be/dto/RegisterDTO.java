package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterDTO {

    @NotBlank(message = "full name is required")
    private String fullName;

    @NotBlank(message = "email is required")
    @Email(message = "email should be valid")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password should be at least 6 characters")
    private String password;

    private String phoneNumber;

    private String bloodGroup;
    private String medicalHistory;
}
