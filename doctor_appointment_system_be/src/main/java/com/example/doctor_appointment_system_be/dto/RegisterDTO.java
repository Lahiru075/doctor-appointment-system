package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "phone number is required")
    @Pattern(
            regexp = "^(?:\\+94|0)[0-9]{9}$",
            message = "phone number must be a valid 10-digit number (e.g. 0771234567 or +94771234567)"
    )
    private String phoneNumber;

    @Pattern(
            regexp = "^(A|B|AB|O)[+-]$",
            message = "Blood group must be valid (e.g. A+, A-, B+, B-, AB+, AB-, O+, O-)"
    )
    private String bloodGroup;

    @Size(max = 1000, message = "Medical history must not exceed 1000 characters")
    private String medicalHistory;
}
