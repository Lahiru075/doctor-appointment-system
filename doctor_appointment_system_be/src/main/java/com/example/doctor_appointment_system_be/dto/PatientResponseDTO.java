package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientResponseDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String bloodGroup;
    private String medicalHistory;
    private boolean isActive;
}
