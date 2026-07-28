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
import java.util.List;

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

        List<ChartDataDTO> trends = appointmentRepository.getAppointmentCountsByDate(sevenDaysAgo, today);

        return AdminDashboardDTO.builder()
                .totalDoctors(doctorRepository.count())
                .totalPatients(patientRepository.count())
                .totalSpecializations(specializationRepository.count())
                .totalAppointments(appointmentRepository.count())
                .appointmentTrends(trends)
                .build();
    }
}
