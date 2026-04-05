package com.olxspa.app.repository;

import com.olxspa.app.entity.Listing;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    @EntityGraph(attributePaths = {"category", "seller"})
    @Override
    Optional<Listing> findById(Long id);
}
