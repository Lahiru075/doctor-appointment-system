package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorProfileUpdateDTO {
    private String biography;

    @NotNull(message = "Consultation fee is required")
    @Positive(message = "Fee must be a positive number")
    private Double consultationFee;

    @NotNull(message = "Experience years is required")
    private Integer experienceYears;
}
