-- Sample Data for Stationery Shop Management System

USE stationery_shop;

-- Insert default admin user (password: admin123)
-- Note: These passwords are hashed with bcrypt. In production, use a script to generate proper hashes.
-- For testing, you can register a new user through the API or use: 
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@stationery.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'admin'),
('manager', 'manager@stationery.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Manager User', 'manager'),
('staff1', 'staff1@stationery.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Staff User', 'staff');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Pens & Pencils', 'Various types of pens and pencils'),
('Notebooks', 'Different sizes and types of notebooks'),
('Office Supplies', 'Office stationery items'),
('Art Supplies', 'Art and craft materials'),
('School Supplies', 'Items for school use'),
('Paper Products', 'Various paper products');

-- Insert suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('ABC Stationery Suppliers', 'John Doe', 'john@abcstationery.com', '1234567890', '123 Supplier Street, City'),
('XYZ Office Supplies', 'Jane Smith', 'jane@xyzoffice.com', '0987654321', '456 Office Road, City'),
('Premium Paper Co.', 'Bob Johnson', 'bob@premiumpaper.com', '1122334455', '789 Paper Avenue, City');

-- Insert products
INSERT INTO products (name, sku, category_id, description, unit_price, cost_price, stock_quantity, min_stock_level, unit) VALUES
('Blue Ballpoint Pen', 'PEN-001', 1, 'Standard blue ballpoint pen', 10.00, 5.00, 500, 50, 'pcs'),
('Red Ballpoint Pen', 'PEN-002', 1, 'Standard red ballpoint pen', 10.00, 5.00, 450, 50, 'pcs'),
('Black Ballpoint Pen', 'PEN-003', 1, 'Standard black ballpoint pen', 10.00, 5.00, 600, 50, 'pcs'),
('HB Pencil', 'PENCIL-001', 1, 'Standard HB pencil', 5.00, 2.50, 800, 100, 'pcs'),
('A4 Notebook 100 pages', 'NB-001', 2, 'A4 size notebook with 100 pages', 50.00, 25.00, 200, 20, 'pcs'),
('A5 Notebook 80 pages', 'NB-002', 2, 'A5 size notebook with 80 pages', 35.00, 18.00, 250, 20, 'pcs'),
('Stapler', 'OFF-001', 3, 'Standard office stapler', 150.00, 75.00, 50, 5, 'pcs'),
('Paper Clips Box', 'OFF-002', 3, 'Box of 100 paper clips', 25.00, 12.00, 100, 10, 'box'),
('Eraser', 'SCH-001', 5, 'Standard eraser', 5.00, 2.00, 300, 30, 'pcs'),
('Ruler 30cm', 'SCH-002', 5, '30cm plastic ruler', 15.00, 7.50, 150, 15, 'pcs'),
('Drawing Paper A4', 'ART-001', 4, 'A4 size drawing paper pack of 50', 100.00, 50.00, 80, 10, 'pack'),
('Water Colors Set', 'ART-002', 4, '12 color water color set', 200.00, 100.00, 40, 5, 'set'),
('A4 Copy Paper Ream', 'PAP-001', 6, 'Ream of 500 A4 copy papers', 250.00, 125.00, 60, 10, 'ream');

