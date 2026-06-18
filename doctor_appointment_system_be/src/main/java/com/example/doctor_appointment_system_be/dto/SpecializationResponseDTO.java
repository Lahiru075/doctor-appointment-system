package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpecializationResponseDTO {
    private Long id;
    private String name;
    private String description;
}
