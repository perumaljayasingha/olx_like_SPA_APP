package com.olxspa.app.dto.listing;

import com.olxspa.app.domain.ItemCondition;
import com.olxspa.app.domain.ListingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class CreateListingRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    @Size(max = 8000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull
    private ItemCondition itemCondition;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long sellerId;

    @Size(max = 128)
    private String city;

    @Size(max = 1024)
    private String imageUrl;

    /** When omitted, defaults to ACTIVE in service layer. */
    private ListingStatus listingStatus;
}
