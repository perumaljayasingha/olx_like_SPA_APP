package com.olxspa.app.controller;

import com.olxspa.app.dto.auth.AuthSessionResponse;
import com.olxspa.app.dto.auth.LogoutRequest;
import com.olxspa.app.dto.auth.OtpDispatchResponse;
import com.olxspa.app.dto.auth.OtpRequest;
import com.olxspa.app.dto.auth.OtpVerifyRequest;
import com.olxspa.app.dto.auth.RegisterRequest;
import com.olxspa.app.service.auth.AuthOtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthOtpService authOtpService;

    @PostMapping("/register/request-otp")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public OtpDispatchResponse requestRegisterOtp(@Valid @RequestBody RegisterRequest request) {
        return authOtpService.requestRegisterOtp(request);
    }

    @PostMapping("/register/verify-otp")
    public AuthSessionResponse verifyRegisterOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return authOtpService.verifyRegisterOtp(request);
    }

    @PostMapping("/login/request-otp")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public OtpDispatchResponse requestLoginOtp(@Valid @RequestBody OtpRequest request) {
        return authOtpService.requestLoginOtp(request);
    }

    @PostMapping("/login/verify-otp")
    public AuthSessionResponse verifyLoginOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return authOtpService.verifyLoginOtp(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody LogoutRequest request) {
        authOtpService.logout(request.getToken());
    }
}
