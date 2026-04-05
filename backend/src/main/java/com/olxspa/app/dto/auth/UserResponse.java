package com.olxspa.app.dto.auth;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {
    Long id;
    String email;
    String fullName;
    String phone;
    Instant createdAt;
}
