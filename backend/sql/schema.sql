CREATE DATABASE IF NOT EXISTS storepilot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE storepilot;

DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS purchase_items;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS tenants;

CREATE TABLE tenants (
  tenant_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  subdomain VARCHAR(80) NOT NULL UNIQUE,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  store_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  business_type VARCHAR(80) NOT NULL DEFAULT 'general',
  target_margin_percent DECIMAL(5,2) NOT NULL DEFAULT 30.00,
  currency_code VARCHAR(10) NOT NULL DEFAULT 'MXN',
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_stores_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id)
);

CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  store_id INT NOT NULL,
  role_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(140) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  last_login_date DATETIME NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id),
  CONSTRAINT fk_users_store_id FOREIGN KEY (store_id) REFERENCES stores (store_id),
  CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id)
);

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  category_id INT NULL,
  sku VARCHAR(80) NOT NULL,
  barcode VARCHAR(80) NULL,
  name VARCHAR(160) NOT NULL,
  description VARCHAR(255) NULL,
  sale_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  average_cost DECIMAL(10,2) NULL,
  last_cost DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  minimum_stock INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id),
  CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories (category_id),
  UNIQUE KEY uq_products_tenant_sku (tenant_id, sku),
  KEY idx_products_name (name),
  KEY idx_products_active (active)
);

CREATE TABLE purchases (
  purchase_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  store_id INT NOT NULL,
  supplier_name VARCHAR(140) NOT NULL,
  purchase_date DATETIME NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  notes VARCHAR(255) NULL,
  created_by_user_id INT NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchases_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id),
  CONSTRAINT fk_purchases_store_id FOREIGN KEY (store_id) REFERENCES stores (store_id),
  CONSTRAINT fk_purchases_created_by_user_id FOREIGN KEY (created_by_user_id) REFERENCES users (user_id),
  KEY idx_purchases_date (purchase_date)
);

CREATE TABLE purchase_items (
  purchase_item_id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchase_items_purchase_id FOREIGN KEY (purchase_id) REFERENCES purchases (purchase_id),
  CONSTRAINT fk_purchase_items_product_id FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE sales (
  sale_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  store_id INT NOT NULL,
  sale_number VARCHAR(40) NOT NULL,
  sale_date DATETIME NOT NULL,
  payment_method VARCHAR(40) NOT NULL DEFAULT 'external',
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  notes VARCHAR(255) NULL,
  created_by_user_id INT NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id),
  CONSTRAINT fk_sales_store_id FOREIGN KEY (store_id) REFERENCES stores (store_id),
  CONSTRAINT fk_sales_created_by_user_id FOREIGN KEY (created_by_user_id) REFERENCES users (user_id),
  UNIQUE KEY uq_sales_sale_number (sale_number),
  KEY idx_sales_date (sale_date)
);

CREATE TABLE sale_items (
  sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  unit_cost_snapshot DECIMAL(10,2) NULL,
  line_total DECIMAL(12,2) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_items_sale_id FOREIGN KEY (sale_id) REFERENCES sales (sale_id),
  CONSTRAINT fk_sale_items_product_id FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE inventory_movements (
  inventory_movement_id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  product_id INT NOT NULL,
  reference_type VARCHAR(40) NOT NULL,
  reference_id INT NOT NULL,
  movement_type VARCHAR(40) NOT NULL,
  quantity_change INT NOT NULL,
  balance_after INT NOT NULL,
  unit_cost_snapshot DECIMAL(10,2) NULL,
  notes VARCHAR(255) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_movements_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id),
  CONSTRAINT fk_inventory_movements_product_id FOREIGN KEY (product_id) REFERENCES products (product_id),
  KEY idx_inventory_movement_type (movement_type),
  KEY idx_inventory_creation_date (creation_date)
);

INSERT INTO tenants (tenant_id, name, subdomain) VALUES
  (1, 'Tienda Demo Norte', 'tienda-demo');

INSERT INTO stores (store_id, tenant_id, name, business_type, target_margin_percent, currency_code) VALUES
  (1, 1, 'Sucursal Centro', 'retail', 30.00, 'MXN');

INSERT INTO roles (role_id, code, name) VALUES
  (1, 'admin', 'Administrador'),
  (2, 'cashier', 'Cajero');

INSERT INTO users (user_id, tenant_id, store_id, role_id, full_name, email, password_hash, last_login_date) VALUES
  (1, 1, 1, 1, 'Ana Administradora', 'admin@storepilot.local', 'scrypt$069b76e4569f0913a6047d7efe7b9610$c494b361322d254898cb632c9c78f6f2dce02b9bc250614c714e941c59fcc4459cd6d63fac341f2c4c07cb88b4d4fe12424d37b909f439ec95de884d5fec9df9', NOW()),
  (2, 1, 1, 2, 'Carlos Cajero', 'cajero@storepilot.local', 'scrypt$ea6a77e2447aa34a5459fef3ffea16b5$c8007859948623f661e50d5ab28527f32402f66c067004c245f0845c863ad804a6655f3044e8f4b1cd2a7348c39f618b48ce5064f4fcb4c74072a9faf8471691', NOW());

INSERT INTO categories (category_id, tenant_id, name, description) VALUES
  (1, 1, 'Electrónica', 'Accesorios y dispositivos'),
  (2, 1, 'Moda', 'Ropa y accesorios'),
  (3, 1, 'Hogar', 'Productos para el hogar');

INSERT INTO products (product_id, tenant_id, category_id, sku, barcode, name, description, sale_price, average_cost, last_cost, stock_quantity, minimum_stock) VALUES
  (1, 1, 1, 'SP-ELE-001', '750100001001', 'Pro Watch Series 8', 'Reloj inteligente para uso diario', 299.00, 210.00, 210.00, 12, 3),
  (2, 1, 1, 'SP-AUD-001', '750100001002', 'Studio Headphones', 'Audífonos de monitoreo cerrados', 159.00, 118.00, 118.00, 8, 2),
  (3, 1, 1, 'SP-CAM-001', '750100001003', 'Instant Film Camera', 'Cámara instantánea compacta', 89.99, 58.50, 58.50, 6, 2),
  (4, 1, 2, 'SP-SHO-001', '750100001004', 'Air Zoom Runner', 'Tenis ligeros para carrera urbana', 120.00, 85.00, 85.00, 18, 4),
  (5, 1, 3, 'SP-HOM-001', '750100001005', 'Chef Knife Set', 'Juego de cuchillos con base de bambú', 45.00, 28.00, 28.00, 14, 3),
  (6, 1, 2, 'SP-APP-001', '750100001006', 'Essential White Tee', 'Playera básica algodón peinado', 25.00, 14.50, 14.50, 32, 8),
  (7, 1, 2, 'SP-WAT-001', '750100001007', 'Minimalist Watch', 'Reloj analógico con correa de malla', 42.00, 26.00, 26.00, 9, 2),
  (8, 1, 1, 'SP-AUD-002', '750100001008', 'Audio Pro X', 'Audífonos inalámbricos premium', 185.00, 120.00, 120.00, 2, 3);

INSERT INTO purchases (purchase_id, tenant_id, store_id, supplier_name, purchase_date, total_amount, notes, created_by_user_id) VALUES
  (1, 1, 1, 'Distribuidora Centro', DATE_SUB(NOW(), INTERVAL 10 DAY), 3150.00, 'Compra de reposición semanal', 1),
  (2, 1, 1, 'Moda Uno', DATE_SUB(NOW(), INTERVAL 6 DAY), 980.00, 'Nuevas prendas y accesorios', 1);

INSERT INTO purchase_items (purchase_item_id, purchase_id, product_id, quantity, unit_cost, line_total) VALUES
  (1, 1, 1, 5, 210.00, 1050.00),
  (2, 1, 2, 4, 118.00, 472.00),
  (3, 1, 8, 6, 120.00, 720.00),
  (4, 2, 4, 6, 85.00, 510.00),
  (5, 2, 6, 12, 14.50, 174.00),
  (6, 2, 7, 4, 26.00, 104.00);

INSERT INTO sales (sale_id, tenant_id, store_id, sale_number, sale_date, payment_method, total_amount, notes, created_by_user_id) VALUES
  (1, 1, 1, 'SALE-1001', DATE_SUB(NOW(), INTERVAL 3 DAY), 'efectivo', 617.00, 'Venta mostrador', 2),
  (2, 1, 1, 'SALE-1002', DATE_SUB(NOW(), INTERVAL 1 DAY), 'terminal_externa', 318.00, 'Venta con terminal externa', 2);

INSERT INTO sale_items (sale_item_id, sale_id, product_id, quantity, unit_price, unit_cost_snapshot, line_total) VALUES
  (1, 1, 1, 1, 299.00, 210.00, 299.00),
  (2, 1, 2, 2, 159.00, 118.00, 318.00),
  (3, 2, 2, 2, 159.00, 118.00, 318.00);

INSERT INTO inventory_movements (inventory_movement_id, tenant_id, product_id, reference_type, reference_id, movement_type, quantity_change, balance_after, unit_cost_snapshot, notes) VALUES
  (1, 1, 1, 'purchase', 1, 'PURCHASE', 5, 13, 210.00, 'Entrada por compra'),
  (2, 1, 2, 'purchase', 1, 'PURCHASE', 4, 10, 118.00, 'Entrada por compra'),
  (3, 1, 8, 'purchase', 1, 'PURCHASE', 6, 6, 120.00, 'Entrada por compra'),
  (4, 1, 4, 'purchase', 2, 'PURCHASE', 6, 24, 85.00, 'Entrada por compra'),
  (5, 1, 6, 'purchase', 2, 'PURCHASE', 12, 44, 14.50, 'Entrada por compra'),
  (6, 1, 7, 'purchase', 2, 'PURCHASE', 4, 11, 26.00, 'Entrada por compra'),
  (7, 1, 1, 'sale', 1, 'SALE', -1, 12, 210.00, 'Salida por venta'),
  (8, 1, 2, 'sale', 1, 'SALE', -2, 8, 118.00, 'Salida por venta'),
  (9, 1, 2, 'sale', 2, 'SALE', -2, 8, 118.00, 'Salida por venta');

CREATE USER IF NOT EXISTS 'storepilot_app'@'%' IDENTIFIED BY 'change_this_db_password';
GRANT SELECT, INSERT, UPDATE, DELETE, INDEX ON storepilot.* TO 'storepilot_app'@'%';
FLUSH PRIVILEGES;
