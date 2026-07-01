package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.WeeklyScheduleDTO;

public interface TimeSlotService {
    void generateWeeklySlots(Long userId, WeeklyScheduleDTO weeklyScheduleDTO);

    WeeklyScheduleDTO getAvailability(Long userId);
}
