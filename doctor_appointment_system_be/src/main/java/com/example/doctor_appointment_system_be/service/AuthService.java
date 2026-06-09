package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.AuthResponse;
import com.example.doctor_appointment_system_be.dto.LoginDTO;
import com.example.doctor_appointment_system_be.dto.RegisterDTO;

public interface AuthService {
    AuthResponse register(RegisterDTO registerDTO);

    AuthResponse login(LoginDTO loginDTO);
}
