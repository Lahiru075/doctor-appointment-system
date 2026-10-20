package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorRegisterDTO {

    @NotBlank(message = "First name is required")
    @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^(?:\\+94|0)[0-9]{9}$",
            message = "Phone number must be a valid 10-digit number (e.g. 0771234567 or +94771234567)"
    )
    private String phoneNumber;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 60, message = "Experience years cannot exceed 60")
    private Integer experienceYears;

    @NotNull(message = "Specialization ID is required")
    @Positive(message = "Specialization ID must be a positive number")
    private Long specializationId;

    @Size(max = 1000, message = "Biography cannot exceed 1000 characters")
    private String biography;

    @NotNull(message = "Consultation Fee is required")
    @Positive(message = "Consultation Fee must be a positive number")
    private Double consultationFee;
}
