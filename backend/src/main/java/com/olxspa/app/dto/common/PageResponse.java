package com.olxspa.app.dto.common;

import java.util.List;
import lombok.Builder;
import lombok.Value;
import org.springframework.data.domain.Page;

@Value
@Builder
public class PageResponse<T> {

    List<T> content;
    PageMetadata page;

    @Value
    @Builder
    public static class PageMetadata {
        int number;
        int size;
        long totalElements;
        int totalPages;
    }

    public static <T> PageResponse<T> of(Page<T> springPage) {
        return PageResponse.<T>builder()
                .content(springPage.getContent())
                .page(
                        PageMetadata.builder()
                                .number(springPage.getNumber())
                                .size(springPage.getSize())
                                .totalElements(springPage.getTotalElements())
                                .totalPages(springPage.getTotalPages())
                                .build())
                .build();
    }
}
