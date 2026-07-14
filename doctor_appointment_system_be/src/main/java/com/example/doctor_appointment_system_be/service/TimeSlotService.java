package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.AvailableTimeSlotDTO;
import com.example.doctor_appointment_system_be.dto.TimeSlotDTO;
import com.example.doctor_appointment_system_be.dto.WeeklyScheduleDTO;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {
    void generateWeeklySlots(Long userId, WeeklyScheduleDTO weeklyScheduleDTO);

    WeeklyScheduleDTO getAvailability(Long userId);

    List<AvailableTimeSlotDTO> getAvailableSlots(Long doctorId);
}
