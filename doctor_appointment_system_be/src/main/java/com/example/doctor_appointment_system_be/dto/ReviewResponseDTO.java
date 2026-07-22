package com.example.doctor_appointment_system_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewResponseDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private String patientName;
    private String createdAt;
}
