package com.olxspa.app.dto.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ApiErrorResponse {

    Instant timestamp;
    int status;
    String code;
    String message;
    String path;
    Map<String, List<String>> fieldErrors;
}
