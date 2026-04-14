package com.olxspa.app.service.auth;

public interface SmsGateway {
    void sendOtp(String phone, String message);
}
