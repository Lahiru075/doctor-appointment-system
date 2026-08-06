package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponseDTO {
    private Long id;
    private String doctorName;
    private String patientName;
    private String specializationName;
    private String patientEmail;
    private String date;
    private String time;
    private Double consultationFee;
    private String status;
}
