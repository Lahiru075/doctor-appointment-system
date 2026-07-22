package com.example.doctor_appointment_system_be.dto;

import com.example.doctor_appointment_system_be.entity.Appointment;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorResponseDTO {
    private Long doctorId;
    private Long userId;
    private String fullName;
    private String email;
    private Integer experienceYears;
    private String specializationName;
    private Double consultationFee;
    private String biography;
    private Double averageRating;

}
