-- Product Groups Schema
-- Run this to add product groups feature to existing database

USE stationery_shop;

-- Product Groups Table
CREATE TABLE IF NOT EXISTS product_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Group Items (Junction Table)
CREATE TABLE IF NOT EXISTS product_group_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES product_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_product (group_id, product_id)
);

-- Indexes
CREATE INDEX idx_group_items_group ON product_group_items(group_id);
CREATE INDEX idx_group_items_product ON product_group_items(product_id);

