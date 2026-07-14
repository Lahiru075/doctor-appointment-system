package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.AvailableTimeSlotDTO;
import com.example.doctor_appointment_system_be.dto.DailyScheduleDTO;
import com.example.doctor_appointment_system_be.dto.TimeSlotDTO;
import com.example.doctor_appointment_system_be.dto.WeeklyScheduleDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
import com.example.doctor_appointment_system_be.entity.TimeSlot;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.TimeSlotRepository;
import com.example.doctor_appointment_system_be.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;

    @Override
    @Transactional
    public void generateWeeklySlots(Long userId, WeeklyScheduleDTO dto) {
        Doctor doctor = doctorRepository.findByUserId(userId);

        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor not found for this User ID");
        }

        timeSlotRepository.deleteByDoctorIdAndIsBookedFalse(doctor.getId());

        List<TimeSlot> slotsToSave = new ArrayList<>();
        LocalDate nextWeekStart = LocalDate.now().plusWeeks(1).with(DayOfWeek.MONDAY);

        for (DailyScheduleDTO schedule : dto.getDays()) {
            if (schedule.getSlots() == null || schedule.getSlots().isEmpty()) continue;

            LocalDate date = nextWeekStart.with(DayOfWeek.valueOf(schedule.getDayOfWeek().toUpperCase()));

            for (TimeSlotDTO slotDTO : schedule.getSlots()) {
                LocalTime start = LocalTime.parse(slotDTO.getStartTime());
                LocalTime end = LocalTime.parse(slotDTO.getEndTime());

                LocalTime current = start;

                while (current.plusMinutes(dto.getDefaultSlotDuration()).isBefore(end.plusMinutes(1))) {

                    boolean exists = timeSlotRepository.existsByDoctorIdAndDateAndStartTime(
                            doctor.getId(), date, current);

                    if (!exists) {
                        TimeSlot slot = TimeSlot.builder()
                                .doctor(doctor)
                                .date(date)
                                .startTime(current)
                                .endTime(current.plusMinutes(dto.getDefaultSlotDuration()))
                                .isBooked(false)
                                .build();
                        slotsToSave.add(slot);
                    }

                    current = current.plusMinutes(dto.getDefaultSlotDuration());
                }
            }
        }
        timeSlotRepository.saveAll(slotsToSave);
    }

    @Override
    @Transactional(readOnly = true)
    public WeeklyScheduleDTO getAvailability(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId);

        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor not found for this User ID");
        }

        List<TimeSlot> slots = timeSlotRepository.findByDoctorIdAndDateGreaterThanEqual(doctor.getId(), LocalDate.now());

        // Default values
        int duration = 30;
        int buffer = 10;

        // Eka dawase thiyena slot dekak hoyagena duration/buffer calculation eka hariyatama karanna
        if (slots.size() >= 2) {
            TimeSlot first = slots.get(0);

            // Duration eka = first slot eke duration eka
            duration = (int) java.time.Duration.between(first.getStartTime(), first.getEndTime()).toMinutes();

        }

        List<DailyScheduleDTO> days = new ArrayList<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            days.add(new DailyScheduleDTO(day.name(), new ArrayList<>()));
        }

        for (DailyScheduleDTO dayDTO : days) {
            List<TimeSlot> daySlots = slots.stream()
                    .filter(s -> s.getDate().getDayOfWeek().name().equals(dayDTO.getDayOfWeek()))
                    .sorted(Comparator.comparing(TimeSlot::getStartTime))
                    .toList();

            if (!daySlots.isEmpty()) {
                dayDTO.setSlots(daySlots.stream().map(s ->
                        new TimeSlotDTO(
                                s.getId().toString(),
                                s.getStartTime().toString(),
                                s.getEndTime().toString(),
                                s.isBooked()
                        )
                ).collect(Collectors.toList()));
            }
        }

        return new WeeklyScheduleDTO(duration, days);
    }

    @Override
    public List<AvailableTimeSlotDTO> getAvailableSlots(Long doctorId) {

        List<TimeSlot> slots = timeSlotRepository.findAvailableSlots(doctorId, LocalDate.now());

        System.out.println(slots.size());

        return slots.stream().map(s -> new AvailableTimeSlotDTO(
                s.getId().toString(),
                s.getDate().toString(),
                s.getStartTime().toString(),
                s.getEndTime().toString(),
                s.isBooked()
        )).collect(Collectors.toList());
    }
}
