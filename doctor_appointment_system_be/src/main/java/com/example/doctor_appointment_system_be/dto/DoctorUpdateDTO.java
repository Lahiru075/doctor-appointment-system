package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorUpdateDTO {
    @NotNull(message = "Specialization ID is required")
    private Long specializationId;

    private String biography;

    @NotNull(message = "Consultation Fee is required")
    @Positive(message = "Consultation Fee must be positive")
    private Double consultationFee;

    @NotNull(message = "Experience years is required")
    private Integer experienceYears;
}