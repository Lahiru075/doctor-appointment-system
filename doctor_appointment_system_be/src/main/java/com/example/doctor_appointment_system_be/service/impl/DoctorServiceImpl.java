package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.dto.DoctorSuggestionDTO;
import com.example.doctor_appointment_system_be.dto.PatientResponseDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.entity.Specialization;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.enums.Role;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.mapper.DoctorMapper;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.SpecializationRepository;
import com.example.doctor_appointment_system_be.repository.UserRepository;
import com.example.doctor_appointment_system_be.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.print.Doc;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    private final DoctorMapper doctorMapper;

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

        return doctorMapper.toDTO(savedDoctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDTO> getAll() {
        return doctorMapper.toDTOList(doctorRepository.findAllDoctors());
    }

    @Override
    @Transactional
    public void updateDoctorStatus(Long id) {

        if (!doctorRepository.existsById(id)){
            throw new ResourceNotFoundException("Doctor not found with ID: " + id);
        }
        userRepository.toggleActiveStatusByDoctorId(id);

    }

    @Override
    @Transactional
    public DoctorResponseDTO updateDoctor(Long id, DoctorRegisterDTO doctorRegisterDTO) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        if (doctorRegisterDTO.getSpecializationId() != null){
            Specialization specialization = specializationRepository.findById(doctorRegisterDTO.getSpecializationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specialization not found with ID: " + doctorRegisterDTO.getSpecializationId()));

            doctor.setSpecialization(specialization);
        }

        doctor.setBiography(doctorRegisterDTO.getBiography());
        doctor.setConsultationFee(doctorRegisterDTO.getConsultationFee());
        doctor.setExperienceYears(doctorRegisterDTO.getExperienceYears());

        return doctorMapper.toDTO(doctor);

    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {

        if (!doctorRepository.existsById(id)){
            throw new ResourceNotFoundException("Doctor not found with ID: " + id);
        }
        userRepository.softDeleteByDoctorId(id);

    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDTO> searchDoctors(String name, Long specializationId) {
        return doctorMapper.toDTOList(doctorRepository.searchDoctors(name, specializationId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorSuggestionDTO> getSuggestions(String query) {
        return doctorRepository.findSuggestions(query);
    }
}
