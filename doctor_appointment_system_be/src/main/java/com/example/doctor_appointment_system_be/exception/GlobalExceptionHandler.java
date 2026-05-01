package com.example.doctor_appointment_system_be.exception;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(APIException.class)
    public ResponseEntity<ApiResponse<Object>> handleApiException(APIException e){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(e.getStatus().value())
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, e.getStatus());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourcesNotFoundException(ResourceNotFoundException e){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.NOT_FOUND.value())
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // @valid use kraddi werden hema field ekakm methanin alla gannawa
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException e){
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(false)
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation Failed")
                .data(errors)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // anapekshitha welawat eka onima error ekak handle kirimata
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception e){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Internal Server Error: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
