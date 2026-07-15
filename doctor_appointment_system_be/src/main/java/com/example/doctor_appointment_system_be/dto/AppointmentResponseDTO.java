package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponseDTO {
    private Long id;
    private String doctorName;
    private String specializationName;
    private String date;
    private String time;
    private Double consultationFee;
    private String status;
}
