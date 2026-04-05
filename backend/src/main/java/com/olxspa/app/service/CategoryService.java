package com.olxspa.app.service;

import com.olxspa.app.dto.category.CategoryResponse;
import com.olxspa.app.entity.Category;
import com.olxspa.app.exception.ResourceNotFoundException;
import com.olxspa.app.mapper.CategoryMapper;
import com.olxspa.app.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream().map(CategoryMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Category getByIdOrThrow(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.category(id));
    }
}
