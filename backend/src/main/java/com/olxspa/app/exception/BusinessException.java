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

    public static BusinessException duplicatePhone() {
        return new BusinessException(HttpStatus.CONFLICT, "PHONE_IN_USE", "Phone is already registered");
    }

    public static BusinessException invalidOtp() {
        return new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_OTP", "Invalid or expired OTP");
    }

    public static BusinessException authRequired() {
        return new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_REQUIRED", "Authentication is required");
    }

    public static BusinessException phoneNotRegistered() {
        return new BusinessException(
                HttpStatus.NOT_FOUND,
                "PHONE_NOT_REGISTERED",
                "Your mobile number is not registered. Please register first.");
    }

    public static BusinessException missingSessionToken() {
        return new BusinessException(
                HttpStatus.BAD_REQUEST,
                "TOKEN_MISSING",
                "Session token is required. Please login first.");
    }

    public static BusinessException invalidSessionToken() {
        return new BusinessException(
                HttpStatus.UNAUTHORIZED,
                "TOKEN_INVALID",
                "Invalid or expired session. Please login again.");
    }
}
