package com.example.doctor_appointment_system_be.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AvailableTimeSlotDTO {
    private String id;
    private String date;
    private String startTime;
    private String endTime;
    private boolean isBooked;
}