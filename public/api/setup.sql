-- Run this in phpMyAdmin → SQL tab
-- Database: ashnliuf_hinshibinshi

CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(60) PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL DEFAULT '',
  `slug` VARCHAR(500) NOT NULL DEFAULT '',
  `description` TEXT,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `sale_price` DECIMAL(12,2) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT '',
  `condition` VARCHAR(50) DEFAULT 'new',
  `sku` VARCHAR(200) DEFAULT '',
  `stock_quantity` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'active',
  `featured` TINYINT(1) DEFAULT 0,
  `images` TEXT,
  `primary_image` TEXT,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(100) PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL DEFAULT '',
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(60) PRIMARY KEY,
  `order_number` VARCHAR(50) DEFAULT '',
  `customer_name` VARCHAR(300) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `email` VARCHAR(200) DEFAULT '',
  `shipping_address` TEXT,
  `city` VARCHAR(100) DEFAULT '',
  `items` TEXT,
  `subtotal` DECIMAL(12,2) DEFAULT 0,
  `shipping` DECIMAL(12,2) DEFAULT 0,
  `total` DECIMAL(12,2) DEFAULT 0,
  `payment_method` VARCHAR(100) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'pending',
  `notes` TEXT,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(60) PRIMARY KEY,
  `full_name` VARCHAR(300) DEFAULT '',
  `email` VARCHAR(200) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(60) PRIMARY KEY,
  `name` VARCHAR(300) DEFAULT '',
  `email` VARCHAR(200) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `business_type` VARCHAR(200) DEFAULT '',
  `message` TEXT,
  `source` VARCHAR(100) DEFAULT '',
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default categories
INSERT IGNORE INTO `categories` (`id`, `name`) VALUES
('printers',    'Printers'),
('scanners',    'Scanners'),
('terminals',   'POS Terminals'),
('accessories', 'Accessories');
