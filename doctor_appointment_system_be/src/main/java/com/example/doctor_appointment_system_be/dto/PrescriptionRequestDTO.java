package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionRequestDTO {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotBlank(message = "Diagnosis/Condition is required")
    @Size(max = 255, message = "Diagnosis details cannot exceed 255 characters")
    private String diagnosis;

    @NotBlank(message = "Medications notes are required")
    @Size(max = 2000, message = "Medication notes cannot exceed 2000 characters")
    private String medications;
}