package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionResponseDTO {
    private Long id;
    private Long appointmentId;
    private String doctorName;
    private String specializationName;
    private String patientName;
    private String diagnosis;
    private String medications;
    private String createdAt;
}
