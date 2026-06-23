package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.DailyScheduleDTO;
import com.example.doctor_appointment_system_be.dto.WeeklyScheduleDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
import com.example.doctor_appointment_system_be.entity.TimeSlot;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.TimeSlotRepository;
import com.example.doctor_appointment_system_be.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public void generateWeeklySlots(Long userId, WeeklyScheduleDTO weeklyScheduleDTO) {

        Doctor doctor = doctorRepository.findByUserId(userId);

        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor not found for this User ID");
        }

        // delete previous data
        timeSlotRepository.deleteByDoctorId(doctor.getId());

        List<TimeSlot> slotToSave = new ArrayList<>();
        LocalDate nextWeekStart = LocalDate.now().plusWeeks(1).with(DayOfWeek.MONDAY);

        for (DailyScheduleDTO schedule : weeklyScheduleDTO.getDailySchedules()) {
            if (!schedule.isAvailable()) continue;

            LocalDate date = nextWeekStart.with(DayOfWeek.valueOf(schedule.getDayOfWeek().toUpperCase()));

            LocalTime current = schedule.getStartTime();

            while (current.plusMinutes(schedule.getSlotDuration()).isBefore(schedule.getEndTime().plusMinutes(1))) {

                TimeSlot slot = TimeSlot.builder()
                        .doctor(doctor)
                        .date(date)
                        .startTime(current)
                        .endTime(current.plusMinutes(schedule.getSlotDuration()))
                        .isBooked(false)
                        .build();

                slotToSave.add(slot);
                current = current.plusMinutes(schedule.getSlotDuration() + +weeklyScheduleDTO.getBuffer());
            }

        }

        timeSlotRepository.saveAll(slotToSave);

    }
}
