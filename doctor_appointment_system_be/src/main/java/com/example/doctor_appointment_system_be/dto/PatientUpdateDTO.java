package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PatientUpdateDTO {
    @Pattern(
            regexp = "^(A|B|AB|O)[+-]$",
            message = "Blood group must be valid (e.g. A+, A-, B+, B-, AB+, AB-, O+, O-)"
    )
    private String bloodGroup;

    @Size(max = 2000, message = "Medical history must not exceed 2000 characters")
    private String medicalHistory;
}
