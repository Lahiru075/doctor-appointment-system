package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.*;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.enums.ActivityType;
import com.example.doctor_appointment_system_be.exception.InvalidPasswordException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.mapper.PatientMapper;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.service.AuditLogService;
import com.example.doctor_appointment_system_be.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientMapper patientMapper;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDTO> getAllPatients() {

        return patientMapper.toDTOList(patientRepository.findAllActivePatients());

    }

    @Override
    @Transactional
    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO patientRequestDTO) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found this ID: " + id));

        patient.setBloodGroup(patientRequestDTO.getBloodGroup());
        patient.setMedicalHistory(patientRequestDTO.getMedicalHistory());

        if (patientRequestDTO.getFullName() != null){
            patient.getUser().setFullName(patientRequestDTO.getFullName());
        }

        if (patientRequestDTO.getPhoneNumber() != null) {
            patient.getUser().setPhoneNumber(patientRequestDTO.getPhoneNumber());
        }

        Patient updatedPatient = patientRepository.save(patient);

        return patientMapper.toDTO(updatedPatient);

    }

    @Override
    @Transactional
    public void deletePatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        patient.getUser().setDeleted(true);

        // save audit log
        auditLogService.logActivity(AuditLogRequestDTO.builder()
                .userId(patient.getUser().getId())
                .userEmail(patient.getUser().getEmail())
                .actorName("ADMIN")
                .activityType(ActivityType.SECURITY)
                .action("Soft deleted patient " + patient.getUser().getFullName())
                .build());
    }

    @Override
    @Transactional
    public void togglePatientStatus(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        boolean newStatus = !patient.getUser().isActive();
        patient.getUser().setActive(newStatus);

        // save audit log
        auditLogService.logActivity(AuditLogRequestDTO.builder()
                .userId(patient.getUser().getId())
                .userEmail(patient.getUser().getEmail())
                .actorName("ADMIN")
                .activityType(ActivityType.SECURITY)
                .action("Toggled status to " + (newStatus ? "ACTIVE" : "INACTIVE") + " for patient " + patient.getUser().getFullName())
                .build());

    }

    @Override
    @Transactional
    public void changePassword(Long userId, PasswordChangeDTO dto) {

        Patient patient = patientRepository.findWithUserByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), patient.getUser().getPassword())) {
            throw new InvalidPasswordException("Old password does not match");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new InvalidPasswordException("Passwords do not match");
        }

        patient.getUser().setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }

    @Override
    @Transactional
    public void updatePatientProfile(Long userId, PatientUpdateDTO dto) {

        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        patient.setBloodGroup(dto.getBloodGroup());
        patient.setMedicalHistory(dto.getMedicalHistory());

    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDTO getPatientProfile(Long userId) {
        Patient patient = patientRepository.findWithUserByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return patientMapper.toDTO(patient);
    }
}
