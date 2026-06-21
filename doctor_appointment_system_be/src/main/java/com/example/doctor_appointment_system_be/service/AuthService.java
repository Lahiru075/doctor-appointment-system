package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.LoginResponse;
import com.example.doctor_appointment_system_be.dto.LoginDTO;
import com.example.doctor_appointment_system_be.dto.RegisterDTO;
import com.example.doctor_appointment_system_be.dto.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterDTO registerDTO);

    LoginResponse login(LoginDTO loginDTO);

    String refreshToken(String refreshToken);
}
