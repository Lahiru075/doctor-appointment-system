package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeSlotDTO {
    private String id;

    @NotBlank(message = "Start time is required")
    @Pattern(
            regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$",
            message = "Start time must be in HH:mm or HH:mm:ss format"
    )
    private String startTime;

    @NotBlank(message = "End time is required")
    @Pattern(
            regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$",
            message = "End time must be in HH:mm or HH:mm:ss format"
    )
    private String endTime;

    private boolean isBooked;
}
