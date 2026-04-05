package com.olxspa.app.mapper;

import com.olxspa.app.dto.listing.ListingResponse;
import com.olxspa.app.entity.Listing;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ListingMapper {

    public ListingResponse toResponse(Listing listing) {
        if (listing == null) {
            return null;
        }
        return ListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .itemCondition(listing.getItemCondition())
                .listingStatus(listing.getListingStatus())
                .city(listing.getCity())
                .imageUrl(listing.getImageUrl())
                .category(
                        ListingResponse.CategorySummary.builder()
                                .id(listing.getCategory().getId())
                                .name(listing.getCategory().getName())
                                .slug(listing.getCategory().getSlug())
                                .build())
                .seller(
                        ListingResponse.SellerSummary.builder()
                                .id(listing.getSeller().getId())
                                .fullName(listing.getSeller().getFullName())
                                .email(listing.getSeller().getEmail())
                                .build())
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }
}
