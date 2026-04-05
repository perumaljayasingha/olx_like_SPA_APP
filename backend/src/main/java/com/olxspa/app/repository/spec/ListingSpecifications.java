package com.olxspa.app.repository.spec;

import com.olxspa.app.domain.ListingStatus;
import com.olxspa.app.entity.Listing;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ListingSpecifications {

    private ListingSpecifications() {}

    public static Specification<Listing> activePublicView(Long categoryId, String searchQuery) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("listingStatus"), ListingStatus.ACTIVE));

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (StringUtils.hasText(searchQuery)) {
                String pattern = "%" + searchQuery.trim().toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("title")), pattern),
                                cb.like(cb.lower(root.get("description")), pattern)));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
