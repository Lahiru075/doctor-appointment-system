package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
import com.example.doctor_appointment_system_be.entity.Specialization;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.enums.Role;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.SpecializationRepository;
import com.example.doctor_appointment_system_be.repository.UserRepository;
import com.example.doctor_appointment_system_be.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public DoctorResponseDTO registerDoctor(DoctorRegisterDTO doctorRegisterDTO) {

        if (userRepository.existsByEmail(doctorRegisterDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        Specialization specialization = specializationRepository.findById(doctorRegisterDTO.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found with ID " + doctorRegisterDTO.getSpecializationId()));

        User user = User.builder()
                .fullName(doctorRegisterDTO.getFullName())
                .email(doctorRegisterDTO.getEmail())
                .password(passwordEncoder.encode(doctorRegisterDTO.getPassword()))
                .phoneNumber(doctorRegisterDTO.getPhoneNumber())
                .role(Role.DOCTOR)
                .build();

        User saveUser = userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(saveUser)
                .specialization(specialization)
                .biography(doctorRegisterDTO.getBiography())
                .consultationFee(doctorRegisterDTO.getConsultationFee())
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);

        return DoctorResponseDTO.builder()
                .doctorId(savedDoctor.getId())
                .userId(savedDoctor.getUser().getId())
                .fullName(savedDoctor.getUser().getFullName())
                .email(savedDoctor.getUser().getEmail())
                .specializationName(savedDoctor.getSpecialization().getName())
                .biography(savedDoctor.getBiography())
                .consultationFee(savedDoctor.getConsultationFee())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDTO> getAll() {
        return doctorRepository.findAllDoctors().stream()
                .map(s -> new DoctorResponseDTO(
                        s.getId(),
                        s.getUser().getId(),
                        s.getUser().getFullName(),
                        s.getUser().getEmail(),
                        s.getExperienceYears(),
                        s.getSpecialization() != null ? s.getSpecialization().getName() : "N/A",
                        s.getConsultationFee(),
                        s.getBiography()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional // if we use this.. we do not want (doctorRepository.save(doctor)) this update when transaction commit
    public void updateDoctorStatus(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctor.getUser().setActive(!doctor.getUser().isActive());
    }

}
