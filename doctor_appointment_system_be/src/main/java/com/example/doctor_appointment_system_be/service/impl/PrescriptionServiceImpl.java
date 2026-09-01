package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.AuditLogRequestDTO;
import com.example.doctor_appointment_system_be.dto.PrescriptionRequestDTO;
import com.example.doctor_appointment_system_be.dto.PrescriptionResponseDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import com.example.doctor_appointment_system_be.entity.Prescription;
import com.example.doctor_appointment_system_be.enums.ActivityType;
import com.example.doctor_appointment_system_be.enums.AppointmentStatus;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.mapper.PrescriptionMapper;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.PrescriptionRepository;
import com.example.doctor_appointment_system_be.service.AppointmentService;
import com.example.doctor_appointment_system_be.service.AuditLogService;
import com.example.doctor_appointment_system_be.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionMapper prescriptionMapper;
    private final AppointmentService appointmentService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public void createPrescription(PrescriptionRequestDTO dto) {

        Appointment appointment = appointmentRepository.findByIdWithPatientAndDoctor(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (prescriptionRepository.existsByAppointmentId(appointment.getId())) {
            throw new APIException(HttpStatus.CONFLICT, "Prescription already exists for this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED || appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new APIException(HttpStatus.CONFLICT, "Appointment is not in a valid state for prescription");
        }

        appointmentService.completeAppointment(appointment);

        Prescription prescription = Prescription.builder()
                .diagnosis(dto.getDiagnosis())
                .medications(dto.getMedications())
                .appointment(appointment)
                .doctor(appointment.getDoctor())
                .patient(appointment.getPatient())
                .build();

        prescriptionRepository.save(prescription);

        // save audit log
        auditLogService.logActivity(AuditLogRequestDTO.builder()
                .userId(appointment.getDoctor().getUser().getId())
                .userEmail(appointment.getDoctor().getUser().getEmail())
                .actorName(appointment.getDoctor().getUser().getFullName())
                .action("Prescription issued for appointment ID: " + appointment.getId())
                .activityType(ActivityType.PRESCRIPTION)
                .build());

    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getPatientPrescriptions(Long userId) {
        return prescriptionMapper.toDTOList(prescriptionRepository.findByPatientUserId(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionResponseDTO getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentIdWithDetails(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found for this appointment"));

        return prescriptionMapper.toDTO(prescription);
    }
}
