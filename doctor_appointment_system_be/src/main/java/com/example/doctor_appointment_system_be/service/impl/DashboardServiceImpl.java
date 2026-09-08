package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.AdminDashboardDTO;
import com.example.doctor_appointment_system_be.dto.ChartDataDTO;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.SpecializationRepository;
import com.example.doctor_appointment_system_be.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final SpecializationRepository specializationRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public AdminDashboardDTO getAdminDashboardStats() {

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);

        // database eke data tik Map ekakat dgnnwa
        List<ChartDataDTO> rawTrends = appointmentRepository.getAppointmentCountsByDate(sevenDaysAgo, today);
        Map<LocalDate, Long> countMap = rawTrends.stream()
                .collect(Collectors.toMap(ChartDataDTO::getDate, ChartDataDTO::getCount));

        List<ChartDataDTO> fullTrends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            fullTrends.add(new ChartDataDTO(date, countMap.getOrDefault(date, 0L)));
            // getOrDefault(date, 0L) -> if date is not present in the map, return 0L (map eke e dwst adala data nettan 0 wetenawa. thiynwa nm thiyn gana wetenwa..)
        }

        return AdminDashboardDTO.builder()
                .totalDoctors(doctorRepository.count())
                .totalPatients(patientRepository.count())
                .totalSpecializations(specializationRepository.count())
                .totalAppointments(appointmentRepository.count())
                .appointmentTrends(fullTrends)
                .build();
    }
}
