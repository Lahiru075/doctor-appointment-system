package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorProfileUpdateDTO {

    @Size(max = 1000, message = "Biography cannot exceed 1000 characters")
    private String biography;

    @NotNull(message = "Consultation fee is required")
    @Positive(message = "Fee must be a positive number")
    private Double consultationFee;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience years cannot be negative")
    @Max(value = 60, message = "Experience years cannot exceed 60")
    private Integer experienceYears;
}
