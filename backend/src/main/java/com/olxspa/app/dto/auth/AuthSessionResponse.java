package com.olxspa.app.dto.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthSessionResponse {
    String token;
    UserResponse user;
}
