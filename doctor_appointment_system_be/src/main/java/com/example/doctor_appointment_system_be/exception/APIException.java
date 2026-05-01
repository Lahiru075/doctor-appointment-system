package com.example.doctor_appointment_system_be.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class APIException extends RuntimeException {
    private HttpStatus status;

    public APIException(HttpStatus status, String message){
        super(message);
        this.status = status;
    }
}
