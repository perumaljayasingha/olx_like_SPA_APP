package com.olxspa.app.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException listing(Long id) {
        return new ResourceNotFoundException("Listing not found: " + id);
    }

    public static ResourceNotFoundException category(Long id) {
        return new ResourceNotFoundException("Category not found: " + id);
    }

    public static ResourceNotFoundException user(Long id) {
        return new ResourceNotFoundException("User not found: " + id);
    }
}
