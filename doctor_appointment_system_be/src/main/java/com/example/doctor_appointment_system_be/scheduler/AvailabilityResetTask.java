package com.example.doctor_appointment_system_be.scheduler;

import com.example.doctor_appointment_system_be.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class AvailabilityResetTask {

    private final TimeSlotRepository timeSlotRepository;

    @Scheduled(cron = "0 0 0 * * SUN")
    @Transactional
    public void resetWeeklySlots() {
        try {

            timeSlotRepository.deleteByIsBookedFalseAndDateLessThan(LocalDate.now());

            System.out.println("System: Weekly unbooked slots cleared successfully. Booked slots preserved!");
        } catch (Exception e) {
            System.err.println("System Error: " + e.getMessage());
        }
    }
}
