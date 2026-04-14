package com.olxspa.app.config;

import com.olxspa.app.service.auth.SmsGateway;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@EnableConfigurationProperties(SmsTemplateProperties.class)
public class SmsConfig {

    @Bean
    public SmsGateway smsGateway(SmsTemplateProperties props) {
        return (phone, message) -> {
            // Mock provider now; replace this bean with real Twilio/msg91 implementation later.
            log.info("MOCK_SMS provider={} phone={} message={}", props.provider(), phone, message);
        };
    }
}
