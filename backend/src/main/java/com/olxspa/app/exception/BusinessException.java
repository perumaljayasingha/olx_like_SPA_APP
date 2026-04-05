package com.olxspa.app.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public BusinessException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public static BusinessException duplicateEmail() {
        return new BusinessException(HttpStatus.CONFLICT, "EMAIL_IN_USE", "Email is already registered");
    }
}
