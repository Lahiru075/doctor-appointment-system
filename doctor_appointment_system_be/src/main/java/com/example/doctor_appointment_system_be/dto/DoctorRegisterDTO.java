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
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private String phoneNumber;

    @NotNull(message = "Experience years is required")
    private Integer experienceYears;

    @NotNull(message = "Specialization ID is required")
    private Long specializationId;

    private String biography;

    @NotNull(message = "Consultation Fee is required")
    @Positive(message = "Consultation Fee must be a positive number")
    private Double consultationFee;
}
