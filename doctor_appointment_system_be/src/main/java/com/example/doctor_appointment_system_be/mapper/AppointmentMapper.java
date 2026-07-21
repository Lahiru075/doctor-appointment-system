package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.AppointmentResponseDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(target = "doctorName", source = "doctor.user.fullName")
    @Mapping(target = "specializationName", source = "doctor.specialization.name")
    @Mapping(target = "date", expression = "java(appointment.getTimeSlot() != null ? appointment.getTimeSlot().getDate().toString() : \"Cancelled\")")
    @Mapping(target = "time", expression = "java(appointment.getTimeSlot() != null ? appointment.getTimeSlot().getStartTime().toString() + \" - \" + appointment.getTimeSlot().getEndTime().toString() : \"N/A\")")
    @Mapping(target = "consultationFee", source = "doctor.consultationFee")
    @Mapping(target = "status", expression = "java(appointment.getStatus().name())")

    AppointmentResponseDTO toDTO(Appointment appointment);

    List<AppointmentResponseDTO> toDTOList(List<Appointment> appointments);
}
