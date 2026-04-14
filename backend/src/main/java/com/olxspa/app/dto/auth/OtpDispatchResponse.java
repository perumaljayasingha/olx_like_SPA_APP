package com.olxspa.app.dto.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class OtpDispatchResponse {
    String message;
    String channel;
    String phone;
}
