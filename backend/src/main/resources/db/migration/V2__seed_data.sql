INSERT INTO users (email, password_hash, full_name, phone) VALUES
('demo@olxspa.local', '{noop}change-me', 'Demo Seller India', '+919900000000');

INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Phones, laptops, and accessories'),
('Vehicles', 'vehicles', 'Cars, bikes, and spare parts'),
('Furniture', 'furniture', 'Home and office furniture'),
('Fashion', 'fashion', 'Clothing and accessories'),
('Sports', 'sports', 'Equipment and outdoor gear');

INSERT INTO listings (title, description, price, item_condition, listing_status, city, image_url, category_id, seller_id) VALUES
('Used smartphone - excellent battery', 'Unlocked, 128GB, minor scratches on frame.', 18500.00, 'GOOD', 'ACTIVE', 'Bengaluru', 'https://placehold.co/600x400?text=Phone', 1, 1),
('City bike', 'Lightweight frame, recently serviced.', 8200.00, 'LIKE_NEW', 'ACTIVE', 'Pune', 'https://placehold.co/600x400?text=Bike', 2, 1),
('Office desk', 'Solid wood, drawers in good condition.', 5600.00, 'FAIR', 'ACTIVE', 'Hyderabad', 'https://placehold.co/600x400?text=Desk', 3, 1);
