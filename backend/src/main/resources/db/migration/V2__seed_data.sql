INSERT INTO users (email, password_hash, full_name, phone) VALUES
('demo@olxspa.local', '{noop}change-me', 'Demo Seller', '+10000000000');

INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Phones, laptops, and accessories'),
('Vehicles', 'vehicles', 'Cars, bikes, and spare parts'),
('Furniture', 'furniture', 'Home and office furniture'),
('Fashion', 'fashion', 'Clothing and accessories'),
('Sports', 'sports', 'Equipment and outdoor gear');

INSERT INTO listings (title, description, price, item_condition, listing_status, city, image_url, category_id, seller_id) VALUES
('Used smartphone — excellent battery', 'Unlocked, 128GB, minor scratches on frame.', 249.99, 'GOOD', 'ACTIVE', 'New York', 'https://placehold.co/600x400?text=Phone', 1, 1),
('City bike', 'Lightweight frame, recently serviced.', 180.00, 'LIKE_NEW', 'ACTIVE', 'Chicago', 'https://placehold.co/600x400?text=Bike', 2, 1),
('Office desk', 'Solid wood, drawers in good condition.', 120.50, 'FAIR', 'ACTIVE', 'Austin', 'https://placehold.co/600x400?text=Desk', 3, 1);
