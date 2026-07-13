package com.example.doctor_appointment_system_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorSuggestionDTO {
    private Long id;
    private String fullName;
}
