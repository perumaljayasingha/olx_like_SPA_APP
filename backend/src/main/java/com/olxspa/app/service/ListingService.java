package com.olxspa.app.service;

import com.olxspa.app.domain.ListingStatus;
import com.olxspa.app.dto.common.PageResponse;
import com.olxspa.app.dto.listing.CreateListingRequest;
import com.olxspa.app.dto.listing.ListingResponse;
import com.olxspa.app.dto.listing.UpdateListingRequest;
import com.olxspa.app.entity.Category;
import com.olxspa.app.entity.Listing;
import com.olxspa.app.entity.User;
import com.olxspa.app.exception.BusinessException;
import com.olxspa.app.exception.ResourceNotFoundException;
import com.olxspa.app.mapper.ListingMapper;
import com.olxspa.app.repository.ListingRepository;
import com.olxspa.app.repository.spec.ListingSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final CategoryService categoryService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public PageResponse<ListingResponse> searchActive(Long categoryId, String query, Pageable pageable) {
        Page<Listing> page =
                listingRepository.findAll(ListingSpecifications.activePublicView(categoryId, query), pageable);
        return PageResponse.of(page.map(ListingMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public ListingResponse getById(Long id) {
        Listing listing =
                listingRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.listing(id));
        return ListingMapper.toResponse(listing);
    }

    @Transactional
    public ListingResponse create(CreateListingRequest request) {
        Category category = categoryService.getByIdOrThrow(request.getCategoryId());
        User seller = userService.getByIdOrThrow(request.getSellerId());

        ListingStatus status =
                request.getListingStatus() != null ? request.getListingStatus() : ListingStatus.ACTIVE;

        Listing listing =
                Listing.builder()
                        .title(request.getTitle().trim())
                        .description(request.getDescription() != null ? request.getDescription().trim() : null)
                        .price(request.getPrice())
                        .itemCondition(request.getItemCondition())
                        .listingStatus(status)
                        .city(request.getCity() != null ? request.getCity().trim() : null)
                        .imageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null)
                        .category(category)
                        .seller(seller)
                        .build();

        listing = listingRepository.save(listing);
        return ListingMapper.toResponse(listing);
    }

    @Transactional
    public ListingResponse update(Long id, UpdateListingRequest request) {
        Listing listing =
                listingRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.listing(id));

        if (!listing.getSeller().getId().equals(request.getSellerId())) {
            throw new BusinessException(
                    HttpStatus.FORBIDDEN, "FORBIDDEN", "Only the seller can update this listing");
        }

        if (request.getTitle() != null) {
            listing.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            listing.setDescription(request.getDescription().trim());
        }
        if (request.getPrice() != null) {
            listing.setPrice(request.getPrice());
        }
        if (request.getItemCondition() != null) {
            listing.setItemCondition(request.getItemCondition());
        }
        if (request.getListingStatus() != null) {
            listing.setListingStatus(request.getListingStatus());
        }
        if (request.getCity() != null) {
            listing.setCity(request.getCity().trim());
        }
        if (request.getImageUrl() != null) {
            listing.setImageUrl(request.getImageUrl().trim());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryService.getByIdOrThrow(request.getCategoryId());
            listing.setCategory(category);
        }

        listing = listingRepository.save(listing);
        return ListingMapper.toResponse(listing);
    }

    @Transactional
    public void archive(Long id, Long sellerId) {
        Listing listing =
                listingRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.listing(id));
        if (!listing.getSeller().getId().equals(sellerId)) {
            throw new BusinessException(
                    HttpStatus.FORBIDDEN, "FORBIDDEN", "Only the seller can archive this listing");
        }
        listing.setListingStatus(ListingStatus.ARCHIVED);
        listingRepository.save(listing);
    }
}
