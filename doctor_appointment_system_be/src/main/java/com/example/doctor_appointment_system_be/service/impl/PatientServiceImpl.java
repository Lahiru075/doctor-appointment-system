package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.PatientRequestDTO;
import com.example.doctor_appointment_system_be.dto.PatientResponseDTO;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDTO> getAllPatients() {

        return patientRepository.findAllActivePatients().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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

        return mapToResponse(updatedPatient);

    }

    @Override
    @Transactional
    public void deletePatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        patient.getUser().setDeleted(true);
    }

    @Override
    @Transactional
    public void togglePatientStatus(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        patient.getUser().setActive(!patient.getUser().isActive());

    }

    private PatientResponseDTO mapToResponse(Patient patient) {
        return PatientResponseDTO.builder()
                .id(patient.getId())
                .userId(patient.getUser().getId())
                .fullName(patient.getUser().getFullName())
                .email(patient.getUser().getEmail())
                .phoneNumber(patient.getUser().getPhoneNumber())
                .bloodGroup(patient.getBloodGroup())
                .medicalHistory(patient.getMedicalHistory())
                .isActive(patient.getUser().isActive())
                .build();
    }
}
