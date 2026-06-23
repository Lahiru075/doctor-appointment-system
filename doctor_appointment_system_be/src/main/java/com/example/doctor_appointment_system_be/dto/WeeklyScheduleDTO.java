package com.example.doctor_appointment_system_be.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyScheduleDTO {
    private List<DailyScheduleDTO> dailySchedules;
    private int buffer;
}
