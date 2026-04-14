package com.olxspa.app.service;

import com.olxspa.app.dto.auth.RegisterRequest;
import com.olxspa.app.dto.auth.UserResponse;
import com.olxspa.app.entity.User;
import com.olxspa.app.exception.BusinessException;
import com.olxspa.app.exception.ResourceNotFoundException;
import com.olxspa.app.mapper.UserMapper;
import com.olxspa.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        User user = createUser(request);
        return UserMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public User getByIdOrThrow(Long id) {
        return userRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.user(id));
    }

    @Transactional(readOnly = true)
    public User getByPhoneOrThrow(String phone) {
        return userRepository.findByPhone(phone).orElseThrow(() -> BusinessException.authRequired());
    }

    @Transactional
    public User createUser(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String phone = request.getPhone().trim();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw BusinessException.duplicateEmail();
        }
        if (userRepository.existsByPhone(phone)) {
            throw BusinessException.duplicatePhone();
        }
        User user =
                User.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode(request.getPassword()))
                        .fullName(request.getFullName().trim())
                        .phone(phone)
                        .build();
        return userRepository.save(user);
    }
}
