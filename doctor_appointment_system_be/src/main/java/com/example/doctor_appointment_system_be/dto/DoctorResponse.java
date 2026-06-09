package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorResponse {
    private Long doctorId;
    private Long userId;
    private String fullName;
    private String email;
    private String specializationName;
    private Double consultationFee;
    private String biography;
}
