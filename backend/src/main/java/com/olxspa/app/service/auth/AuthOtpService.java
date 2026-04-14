package com.olxspa.app.service.auth;

import com.olxspa.app.config.SmsTemplateProperties;
import com.olxspa.app.dto.auth.AuthSessionResponse;
import com.olxspa.app.dto.auth.OtpDispatchResponse;
import com.olxspa.app.dto.auth.OtpRequest;
import com.olxspa.app.dto.auth.OtpVerifyRequest;
import com.olxspa.app.dto.auth.RegisterRequest;
import com.olxspa.app.dto.auth.UserResponse;
import com.olxspa.app.entity.User;
import com.olxspa.app.exception.BusinessException;
import com.olxspa.app.mapper.UserMapper;
import com.olxspa.app.repository.UserRepository;
import com.olxspa.app.service.UserService;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthOtpService {

    private static final long OTP_TTL_SECONDS = 180;

    private final UserService userService;
    private final UserRepository userRepository;
    private final SmsGateway smsGateway;
    private final SmsTemplateProperties smsTemplateProperties;

    private final Map<String, PendingRegister> registerOtps = new ConcurrentHashMap<>();
    private final Map<String, PendingOtp> loginOtps = new ConcurrentHashMap<>();
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public OtpDispatchResponse requestRegisterOtp(RegisterRequest request) {
        String phone = normalizedPhone(request.getPhone());
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw BusinessException.duplicateEmail();
        }
        if (userRepository.existsByPhone(phone)) {
            throw BusinessException.duplicatePhone();
        }
        String otp = generateOtp();
        registerOtps.put(phone, new PendingRegister(otp, Instant.now().plusSeconds(OTP_TTL_SECONDS), request));

        sendRegisterOtp(phone, otp);
        log.debug("Register OTP generated phone={} ttlSec={}", phone, OTP_TTL_SECONDS);
        return OtpDispatchResponse.builder()
                .message("OTP sent for registration")
                .channel("SMS_MOCK")
                .phone(phone)
                .build();
    }

    public AuthSessionResponse verifyRegisterOtp(OtpVerifyRequest request) {
        String phone = normalizedPhone(request.getPhone());
        PendingRegister pending = registerOtps.get(phone);
        validateOtp(pending != null ? pending.otp() : null, pending != null ? pending.expiresAt() : null, request.getOtp());
        User user = userService.createUser(pending.registerRequest());
        registerOtps.remove(phone);
        return createSession(user);
    }

    public OtpDispatchResponse requestLoginOtp(OtpRequest request) {
        String phone = normalizedPhone(request.getPhone());
        if (userRepository.findByPhone(phone).isEmpty()) {
            throw BusinessException.phoneNotRegistered();
        }
        String otp = generateOtp();
        loginOtps.put(phone, new PendingOtp(otp, Instant.now().plusSeconds(OTP_TTL_SECONDS)));
        sendLoginOtp(phone, otp);
        log.debug("Login OTP generated phone={} ttlSec={}", phone, OTP_TTL_SECONDS);
        return OtpDispatchResponse.builder()
                .message("OTP sent for login")
                .channel("SMS_MOCK")
                .phone(phone)
                .build();
    }

    public AuthSessionResponse verifyLoginOtp(OtpVerifyRequest request) {
        String phone = normalizedPhone(request.getPhone());
        PendingOtp pending = loginOtps.get(phone);
        validateOtp(pending != null ? pending.otp() : null, pending != null ? pending.expiresAt() : null, request.getOtp());
        User user = userService.getByPhoneOrThrow(phone);
        loginOtps.remove(phone);
        return createSession(user);
    }

    public void logout(String token) {
        if (token == null || token.isBlank()) {
            throw BusinessException.missingSessionToken();
        }
        Long removed = sessions.remove(token.trim());
        if (removed == null) {
            throw BusinessException.invalidSessionToken();
        }
    }

    private void validateOtp(String expectedOtp, Instant expiresAt, String otpInput) {
        if (expectedOtp == null || expiresAt == null || expiresAt.isBefore(Instant.now()) || !expectedOtp.equals(otpInput)) {
            throw BusinessException.invalidOtp();
        }
    }

    private AuthSessionResponse createSession(User user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());
        UserResponse userResponse = UserMapper.toResponse(user);
        log.debug("Auth session created userId={} tokenPrefix={}", user.getId(), token.substring(0, 8));
        return AuthSessionResponse.builder().token(token).user(userResponse).build();
    }

    private String normalizedPhone(String phone) {
        return phone == null ? "" : phone.trim();
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int value = 100000 + random.nextInt(900000);
        return Integer.toString(value);
    }

    private void sendRegisterOtp(String phone, String otp) {
        String template = smsTemplateProperties.templates().registerOtp();
        String message = template.replace("{otp}", otp).replace("{minutes}", "3");
        smsGateway.sendOtp(phone, message);
    }

    private void sendLoginOtp(String phone, String otp) {
        String template = smsTemplateProperties.templates().loginOtp();
        String message = template.replace("{otp}", otp).replace("{minutes}", "3");
        smsGateway.sendOtp(phone, message);
    }

    private record PendingOtp(String otp, Instant expiresAt) {}

    private record PendingRegister(String otp, Instant expiresAt, RegisterRequest registerRequest) {}
}
