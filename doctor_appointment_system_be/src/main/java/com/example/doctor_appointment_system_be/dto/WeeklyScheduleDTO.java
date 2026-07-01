package com.example.doctor_appointment_system_be.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyScheduleDTO {
    private int defaultSlotDuration;
    private List<DailyScheduleDTO> days;
}
