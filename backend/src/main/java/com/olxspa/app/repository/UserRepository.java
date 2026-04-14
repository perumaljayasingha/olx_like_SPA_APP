package com.olxspa.app.repository;

import com.olxspa.app.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);

    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByPhone(String phone);
}
