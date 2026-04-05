package com.olxspa.app.mapper;

import com.olxspa.app.dto.category.CategoryResponse;
import com.olxspa.app.entity.Category;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .build();
    }
}
