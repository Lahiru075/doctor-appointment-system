package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.SpecializationDTO;
import com.example.doctor_appointment_system_be.dto.SpecializationResponseDTO;
import com.example.doctor_appointment_system_be.entity.Specialization;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.SpecializationRepository;
import com.example.doctor_appointment_system_be.service.SpecializationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecializationServiceImpl implements SpecializationService {

    private final SpecializationRepository specializationRepository;

    @Override
    public SpecializationResponseDTO createSpecialization(SpecializationDTO specializationDTO) {

        if (specializationRepository.existsByName(specializationDTO.getName())) {
            throw new APIException(HttpStatus.CREATED, "Specialization with the same name already exists.");
        }

        Specialization specialization = Specialization.builder()
                .name(specializationDTO.getName())
                .description(specializationDTO.getDescription())
                .build();

        Specialization savedSpecialization = specializationRepository.save(specialization);

        return SpecializationResponseDTO.builder()
                .id(savedSpecialization.getId())
                .name(savedSpecialization.getName())
                .description(savedSpecialization.getDescription())
                .build();
    }

    @Override
    public List<SpecializationResponseDTO> getAllSpecializations() {
        // specialization convert to SpecializationResponseDTO
        return specializationRepository.findAll().stream()
                .map(s -> new SpecializationResponseDTO(s.getId(), s.getName(), s.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    public SpecializationResponseDTO updateSpecialization(Long id, SpecializationDTO dto) {

        Specialization existing = specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found!"));

        if (!existing.getName().equals(dto.getName()) && specializationRepository.existsByName(dto.getName())) {
            throw new APIException(HttpStatus.CONFLICT, "Specialization with this name Already exist!");
        }

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());

        Specialization updatedDataSpecialization = specializationRepository.save(existing);

        return SpecializationResponseDTO.builder()
                .id(updatedDataSpecialization.getId())
                .name(updatedDataSpecialization.getName())
                .description(updatedDataSpecialization.getDescription())
                .build();
    }

    @Override
    @Transactional
    public void deleteSpecialization(Long id) {

        Specialization specialization = specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found!"));

        if (!specialization.getDoctors().isEmpty()) {
            throw new APIException(HttpStatus.CONFLICT, "Cannot delete: Doctors are assigned to this specialization!");
        }

        specializationRepository.delete(specialization);
    }
}
