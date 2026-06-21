package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.*;
import com.example.doctor_appointment_system_be.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterDTO registerDTO) {
        RegisterResponse response = authService.register(registerDTO);

        ApiResponse<RegisterResponse> apiResponse = ApiResponse.<RegisterResponse>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("User registered successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginDTO loginDTO) {
        LoginResponse response = authService.login(loginDTO);

        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("User logged in successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<Map<String, String>>> refreshToken(@Valid @RequestBody RefreshTokenDTO refreshToken){
        String newAccessToken = authService.refreshToken(refreshToken.getRefreshToken());

        Map<String, String> responseData = Map.of("accessToken", newAccessToken);

        ApiResponse<Map<String, String>> apiResponse = ApiResponse.<Map<String, String>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Access Token refreshed successfully!")
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
