package com.olxspa.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.sms")
public record SmsTemplateProperties(String provider, Templates templates) {
    public record Templates(String registerOtp, String loginOtp) {}
}
