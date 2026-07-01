package com.example.doctor_appointment_system_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeSlotDTO {
    private String startTime;
    private String endTime;
    private boolean isBooked;
}
