package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SpecializationDTO {

    @NotBlank(message = "Specialization name is required")
    private String name;

    private String description;
}
