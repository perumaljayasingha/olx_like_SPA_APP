package com.olxspa.app.dto.listing;

import com.olxspa.app.domain.ItemCondition;
import com.olxspa.app.domain.ListingStatus;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ListingResponse {
    Long id;
    String title;
    String description;
    BigDecimal price;
    ItemCondition itemCondition;
    ListingStatus listingStatus;
    String city;
    String imageUrl;
    CategorySummary category;
    SellerSummary seller;
    Instant createdAt;
    Instant updatedAt;

    @Value
    @Builder
    public static class CategorySummary {
        Long id;
        String name;
        String slug;
    }

    @Value
    @Builder
    public static class SellerSummary {
        Long id;
        String fullName;
        String email;
    }
}
