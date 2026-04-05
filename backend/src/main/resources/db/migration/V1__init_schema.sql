CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    slug VARCHAR(128) NOT NULL UNIQUE,
    description VARCHAR(512),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(14, 2) NOT NULL,
    item_condition VARCHAR(32) NOT NULL,
    listing_status VARCHAR(32) NOT NULL,
    city VARCHAR(128),
    image_url VARCHAR(1024),
    category_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_listings_category FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users (id)
);

CREATE INDEX idx_listings_category ON listings (category_id);
CREATE INDEX idx_listings_status ON listings (listing_status);
CREATE INDEX idx_listings_created ON listings (created_at DESC);
