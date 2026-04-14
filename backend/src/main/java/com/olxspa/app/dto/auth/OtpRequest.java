package com.olxspa.app.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OtpRequest {

    @NotBlank
    @Size(max = 50)
    private String phone;
}
