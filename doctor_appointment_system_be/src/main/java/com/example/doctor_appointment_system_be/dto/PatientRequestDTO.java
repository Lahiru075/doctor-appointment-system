package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientRequestDTO {
    private String fullName;
    private String phoneNumber;
    private String bloodGroup;
    private String medicalHistory;
}
