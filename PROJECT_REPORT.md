# Stationery Shop Management System
## Complete Project Report

---

## Table of Contents

1. [Introduction](#introduction)
2. [Objectives](#objectives)
3. [System Requirements](#system-requirements)
4. [Existing System vs Proposed System](#existing-system-vs-proposed-system)
5. [System Design](#system-design)
6. [Database Design](#database-design)
7. [Module Description](#module-description)
8. [Testing](#testing)
9. [Conclusion & Future Scope](#conclusion--future-scope)

---

## 1. Introduction

### 1.1 Overview of Stationery Business Problems

Traditional stationery shops face numerous challenges in managing their daily operations:

- **Manual Inventory Tracking**: Keeping track of stock levels manually is error-prone and time-consuming
- **Inefficient Billing Process**: Manual calculation of bills leads to errors and delays
- **Lack of Real-time Data**: No immediate visibility into sales, stock levels, or financial status
- **Poor Customer Experience**: Long waiting times during billing and checkout
- **Inventory Mismanagement**: Difficulty in identifying low-stock items and reordering
- **Limited Reporting**: Inability to generate quick reports for business insights
- **Supplier Management**: Manual tracking of supplier information and purchase orders

### 1.2 Need for Digital Inventory and Billing

The digital transformation of stationery shop operations is essential for:

- **Accuracy**: Automated calculations reduce human errors
- **Efficiency**: Faster billing and inventory updates
- **Real-time Monitoring**: Instant visibility into stock levels and sales
- **Better Decision Making**: Data-driven insights through reports and analytics
- **Customer Satisfaction**: Quick and accurate billing improves customer experience
- **Cost Reduction**: Reduced operational costs through automation

### 1.3 Scope of the Web Application

The Stationery Shop Management System is a comprehensive web-based solution that covers:

- **Inventory Management**: Complete product and stock management
- **Sales Management**: Point-of-sale (POS) system for billing
- **Purchase Management**: Supplier and purchase order management
- **Reporting & Analytics**: Sales reports, top products, and business insights
- **User Management**: Role-based access control (Admin, Manager, Staff)
- **Invoice Generation**: PDF invoice generation for sales

---

## 2. Objectives

The primary objectives of this system are:

1. **Manage Stock**
   - Add, edit, and delete products
   - Track stock quantities in real-time
   - Set minimum stock levels and get alerts
   - Automatic stock updates on sales and purchases

2. **Record Sales & Purchases**
   - Create sales transactions with multiple items
   - Record purchase orders from suppliers
   - Maintain complete transaction history

3. **Auto-update Inventory**
   - Automatic stock deduction on sales
   - Automatic stock addition on purchases
   - Real-time inventory synchronization

4. **Generate Invoices**
   - Generate professional PDF invoices
   - Include all transaction details
   - Print-ready format

5. **View Reports**
   - Sales statistics and trends
   - Top-selling products
   - Date-range filtered reports
   - Business analytics

6. **Manage Users**
   - User authentication and authorization
   - Role-based access control
   - User profile management

---

## 3. System Requirements

### 3.1 Hardware Requirements

**Server Side:**
- Processor: Intel Core i3 or equivalent
- RAM: Minimum 4GB (8GB recommended)
- Storage: 10GB free space
- Network: Stable internet connection

**Client Side:**
- Processor: Any modern processor
- RAM: 2GB minimum
- Browser: Chrome, Firefox, Safari, or Edge (latest versions)
- Display: 1024x768 minimum resolution

### 3.2 Software Requirements

**Server:**
- Operating System: Windows, Linux, or macOS
- Node.js: Version 18.0 or higher
- MySQL: Version 8.0 or higher
- npm: Version 9.0 or higher

**Client:**
- Modern web browser with JavaScript enabled
- Internet connection for API communication

### 3.3 Technology Stack

**Frontend:**
- React.js 18.2.0 - UI framework
- Tailwind CSS 3.3.6 - Styling
- React Router 6.20.0 - Routing
- Axios 1.6.2 - HTTP client
- Recharts 2.10.3 - Data visualization
- jsPDF 2.5.1 - PDF generation
- React Hot Toast 2.4.1 - Notifications
- Vite 5.0.8 - Build tool

**Backend:**
- Node.js - Runtime environment
- Express.js 4.18.2 - Web framework
- MySQL2 3.6.5 - Database driver
- bcryptjs 2.4.3 - Password hashing
- jsonwebtoken 9.0.2 - JWT authentication
- express-validator 7.0.1 - Input validation
- dotenv 16.3.1 - Environment variables
- CORS 2.8.5 - Cross-origin resource sharing

**Database:**
- MySQL 8.0+ - Relational database management system

**Development Tools:**
- Git - Version control
- Postman/Thunder Client - API testing
- VS Code - Code editor

---

## 4. Existing System vs Proposed System

### 4.1 Manual System Drawbacks

**Current Challenges:**
1. **Time-Consuming**: Manual entry of every transaction
2. **Error-Prone**: Human errors in calculations and data entry
3. **No Real-time Data**: Delayed updates and lack of instant insights
4. **Limited Scalability**: Difficult to handle increased transaction volume
5. **Poor Inventory Control**: Manual stock tracking leads to discrepancies
6. **Inefficient Reporting**: Time-consuming report generation
7. **Customer Dissatisfaction**: Slow billing process
8. **Data Loss Risk**: Physical records can be lost or damaged

### 4.2 Benefits of Automated Web System

**Advantages:**
1. **Speed**: Instant calculations and transactions
2. **Accuracy**: Automated calculations eliminate errors
3. **Real-time Updates**: Immediate inventory and sales updates
4. **Scalability**: Can handle large volumes of transactions
5. **Better Inventory Management**: Automatic stock tracking and alerts
6. **Quick Reporting**: Instant generation of various reports
7. **Improved Customer Experience**: Fast and accurate billing
8. **Data Security**: Digital storage with backup capabilities
9. **Accessibility**: Access from any device with internet
10. **Cost-Effective**: Reduces operational costs

---

## 5. System Design

### 5.1 Use Case Diagram

```
                    Stationery Shop Management System
                              |
        +---------------------+---------------------+
        |                     |                     |
    [Admin]                [Manager]              [Staff]
        |                     |                     |
        +---------------------+---------------------+
                              |
        +---------------------+---------------------+
        |                     |                     |
   [Manage Users]      [Manage Products]    [Process Sales]
        |                     |                     |
   [View Reports]      [Manage Inventory]   [Generate Invoice]
        |                     |                     |
   [Manage Suppliers]   [Manage Categories]  [View Dashboard]
        |                     |                     |
   [Manage Purchases]   [Low Stock Alerts]  [View Products]
```

**Actors:**
- **Admin**: Full system access
- **Manager**: Product, sales, purchase, and supplier management
- **Staff**: Sales processing and viewing capabilities

**Use Cases:**
- User Authentication
- Product Management (CRUD)
- Category Management
- Sales Processing (POS)
- Purchase Management
- Supplier Management
- Report Generation
- Invoice Generation
- Dashboard Viewing
- Inventory Management

### 5.2 ER Diagram

```
┌─────────────┐         ┌──────────────┐
│   Users     │         │  Categories  │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ username    │         │ name         │
│ email       │         │ description  │
│ password    │         └──────┬───────┘
│ full_name   │                │
│ role        │                │
│ is_active   │                │
└──────┬──────┘                │
       │                       │
       │                       │
┌──────▼──────┐         ┌──────▼───────┐
│   Sales     │         │   Products   │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ invoice_no  │         │ name         │
│ customer_*  │         │ sku          │
│ total_amt   │         │ category_id  │◄──┐
│ discount    │         │ unit_price   │   │
│ tax         │         │ cost_price   │   │
│ final_amt   │         │ stock_qty    │   │
│ payment_mtd │         │ min_stock    │   │
│ user_id (FK)│         │ unit         │   │
└──────┬──────┘         └──────┬───────┘   │
       │                       │           │
       │                       │           │
┌──────▼──────────┐    ┌───────▼──────────┐
│  Sales_Items    │    │ Purchase_Items   │
├─────────────────┤    ├──────────────────┤
│ id (PK)         │    │ id (PK)          │
│ sale_id (FK)    │    │ purchase_id (FK) │
│ product_id (FK) │    │ product_id (FK)  │
│ quantity        │    │ quantity         │
│ unit_price      │    │ unit_price       │
│ total_price     │    │ total_price      │
└─────────────────┘    └──────────────────┘
                                │
                                │
                       ┌─────────▼─────────┐
                       │    Purchases      │
                       ├───────────────────┤
                       │ id (PK)           │
                       │ invoice_no        │
                       │ supplier_id (FK)  │
                       │ total_amt         │
                       │ discount          │
                       │ tax               │
                       │ final_amt         │
                       │ payment_status    │
                       │ user_id (FK)      │
                       └─────────┬─────────┘
                                 │
                                 │
                       ┌─────────▼─────────┐
                       │    Suppliers      │
                       ├───────────────────┤
                       │ id (PK)           │
                       │ name              │
                       │ contact_person    │
                       │ email             │
                       │ phone             │
                       │ address           │
                       │ is_active         │
                       └───────────────────┘
```

### 5.3 Class Diagram

```
┌─────────────────────┐
│   User              │
├─────────────────────┤
│ + id: int           │
│ + username: string  │
│ + email: string     │
│ + password: string  │
│ + full_name: string │
│ + role: enum        │
│ + is_active: bool   │
└─────────────────────┘

┌─────────────────────┐
│   Product           │
├─────────────────────┤
│ + id: int           │
│ + name: string      │
│ + sku: string       │
│ + category_id: int  │
│ + unit_price: float │
│ + cost_price: float │
│ + stock_quantity: int│
│ + min_stock_level: int│
└─────────────────────┘

┌─────────────────────┐
│   Sale              │
├─────────────────────┤
│ + id: int           │
│ + invoice_number: str│
│ + customer_name: str│
│ + total_amount: float│
│ + discount: float   │
│ + tax: float        │
│ + final_amount: float│
│ + payment_method: enum│
│ + items: SaleItem[] │
└─────────────────────┘

┌─────────────────────┐
│   Purchase          │
├─────────────────────┤
│ + id: int           │
│ + invoice_number: str│
│ + supplier_id: int  │
│ + total_amount: float│
│ + discount: float   │
│ + tax: float        │
│ + final_amount: float│
│ + payment_status: enum│
│ + items: PurchaseItem[]│
└─────────────────────┘

┌─────────────────────┐
│   Supplier          │
├─────────────────────┤
│ + id: int           │
│ + name: string      │
│ + contact_person: str│
│ + email: string     │
│ + phone: string     │
│ + address: string   │
└─────────────────────┘
```

### 5.4 Data Flow Diagram (DFD)

#### Level 0 (Context Diagram)

```
                    ┌─────────────────────┐
                    │                     │
    [User] ────────►│  Stationery Shop    │◄─────── [Database]
                    │  Management System  │
                    │                     │
                    └─────────────────────┘
```

#### Level 1 DFD

```
                    ┌──────────────┐
    [User] ────────►│  Login       │
                    │  Module      │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
│  Product      │  │  Sales        │  │  Purchase     │
│  Management   │  │  Management   │  │  Management   │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │  Database    │
                    └──────────────┘
```

#### Level 2 DFD (Sales Process)

```
    [Staff] ──► [Select Products] ──► [Add to Cart] ──► [Calculate Total]
                                                              │
                                                              ▼
    [Customer Info] ──► [Enter Details] ──► [Process Payment] ──► [Generate Invoice]
                                                              │
                                                              ▼
                                                         [Update Inventory]
                                                              │
                                                              ▼
                                                         [Save to Database]
```

### 5.5 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  React   │  │ Tailwind │  │  Axios   │  │  Router  │    │
│  │  Frontend│  │   CSS    │  │  HTTP    │  │          │    │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └────┬─────┘    │
└───────┼────────────────────────────┼─────────────┼──────────┘
        │                            │             │
        │         HTTP/REST API      │             │
        │                            │             │
┌───────▼────────────────────────────▼─────────────▼──────────┐
│                      APPLICATION LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Express  │  │   JWT    │  │ Validator│  │  Routes   │  │
│  │   API    │  │   Auth   │  │          │  │          │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │             │        │
│  ┌────▼─────────────▼─────────────▼─────────────▼────┐  │
│  │              Controllers                            │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │  │
│  │  │Product │ │ Sales │ │Purchase│ │Supplier│      │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
└───────┬──────────────────────────────────────────────────┘
        │
        │ SQL Queries
        │
┌───────▼──────────────────────────────────────────────────┐
│                      DATA LAYER                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │              MySQL Database                         │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │  │
│  │  │Products│ │ Sales  │ │Purchases│ │Suppliers│     │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘     │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## 6. Database Design

### 6.1 Database Schema

The system uses MySQL database with the following tables:

#### 6.1.1 Users Table

**Purpose**: Store user accounts and authentication information

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key, auto-increment
- `username`: Unique username for login
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `full_name`: User's full name
- `role`: User role (admin, manager, staff)
- `is_active`: Account status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

#### 6.1.2 Categories Table

**Purpose**: Organize products into categories

```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `name`: Unique category name
- `description`: Category description
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

#### 6.1.3 Products Table

**Purpose**: Store product information and inventory

```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category_id INT,
    description TEXT,
    unit_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    unit VARCHAR(20) DEFAULT 'pcs',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Primary key
- `name`: Product name
- `sku`: Unique stock keeping unit
- `category_id`: Foreign key to categories
- `description`: Product description
- `unit_price`: Selling price
- `cost_price`: Purchase cost
- `stock_quantity`: Current stock level
- `min_stock_level`: Minimum stock threshold
- `unit`: Unit of measurement (pcs, kg, etc.)
- `is_active`: Product status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

#### 6.1.4 Suppliers Table

**Purpose**: Store supplier information

```sql
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `name`: Supplier company name
- `contact_person`: Contact person name
- `email`: Supplier email
- `phone`: Contact phone number
- `address`: Supplier address
- `is_active`: Supplier status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

#### 6.1.5 Sales Table

**Purpose**: Store sales transaction headers

```sql
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'upi', 'other') DEFAULT 'cash',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Primary key
- `invoice_number`: Unique invoice identifier
- `customer_name`: Customer name (optional)
- `customer_email`: Customer email (optional)
- `customer_phone`: Customer phone (optional)
- `total_amount`: Subtotal before discount/tax
- `discount`: Discount amount
- `tax`: Tax amount
- `final_amount`: Final amount after discount/tax
- `payment_method`: Payment method used
- `user_id`: Foreign key to users (who processed sale)
- `created_at`: Sale timestamp
- `updated_at`: Update timestamp

#### 6.1.6 Sales_Items Table

**Purpose**: Store individual items in each sale

```sql
CREATE TABLE sales_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
```

**Fields:**
- `id`: Primary key
- `sale_id`: Foreign key to sales
- `product_id`: Foreign key to products
- `quantity`: Quantity sold
- `unit_price`: Price per unit at time of sale
- `total_price`: Total price (quantity × unit_price)
- `created_at`: Item creation timestamp

#### 6.1.7 Purchases Table

**Purpose**: Store purchase order headers

```sql
CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'partial') DEFAULT 'pending',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Primary key
- `invoice_number`: Unique purchase invoice number
- `supplier_id`: Foreign key to suppliers
- `total_amount`: Subtotal before discount/tax
- `discount`: Discount amount
- `tax`: Tax amount
- `final_amount`: Final amount
- `payment_status`: Payment status
- `user_id`: Foreign key to users
- `created_at`: Purchase timestamp
- `updated_at`: Update timestamp

#### 6.1.8 Purchase_Items Table

**Purpose**: Store individual items in each purchase

```sql
CREATE TABLE purchase_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
```

**Fields:**
- `id`: Primary key
- `purchase_id`: Foreign key to purchases
- `product_id`: Foreign key to products
- `quantity`: Quantity purchased
- `unit_price`: Price per unit
- `total_price`: Total price
- `created_at`: Item creation timestamp

### 6.2 Relationships

1. **Users → Sales**: One-to-Many (One user can process many sales)
2. **Users → Purchases**: One-to-Many (One user can create many purchases)
3. **Categories → Products**: One-to-Many (One category has many products)
4. **Products → Sales_Items**: One-to-Many (One product can be in many sales)
5. **Products → Purchase_Items**: One-to-Many (One product can be in many purchases)
6. **Sales → Sales_Items**: One-to-Many (One sale has many items)
7. **Purchases → Purchase_Items**: One-to-Many (One purchase has many items)
8. **Suppliers → Purchases**: One-to-Many (One supplier has many purchases)

### 6.3 Indexes

Indexes are created on:
- `products.sku` - For fast product lookup
- `products.category_id` - For category filtering
- `sales.user_id` - For user-based sales queries
- `sales_items.sale_id` - For joining sales with items
- `purchases.supplier_id` - For supplier-based queries

---

## 7. Module Description

### 7.1 Dashboard Module

**Purpose**: Provide overview of business metrics and recent activities

**Features:**
- Total products count
- Low stock alerts
- Today's sales summary
- Monthly sales summary
- Recent sales list
- Top selling products
- Sales trend chart (last 7 days)

**Access**: All authenticated users

### 7.2 Inventory Management Module

**Purpose**: Manage products and stock levels

**Features:**
- Add/Edit/Delete products
- View product list with search and filter
- Stock quantity tracking
- Low stock level alerts
- Category-based organization
- SKU management
- Price management (unit price, cost price)

**Access**: Admin, Manager (Read: All users)

### 7.3 Sales Management (Billing/POS) Module

**Purpose**: Process sales transactions and generate invoices

**Features:**
- Point-of-sale interface
- Add multiple products to cart
- Quantity management
- Customer information (optional)
- Discount and tax calculation
- Multiple payment methods (Cash, Card, UPI, Other)
- Real-time inventory update
- PDF invoice generation
- Sales history view

**Access**: All authenticated users

### 7.4 Purchase Management Module

**Purpose**: Manage purchase orders from suppliers

**Features:**
- Create purchase orders
- Select supplier
- Add multiple products
- Set purchase prices
- Discount and tax calculation
- Payment status tracking (Pending, Paid, Partial)
- Automatic stock update on purchase
- Purchase history view

**Access**: Admin, Manager

### 7.5 Supplier Management Module

**Purpose**: Manage supplier information

**Features:**
- Add/Edit/Delete suppliers
- Supplier contact information
- Supplier search
- Active/Inactive status
- View supplier details

**Access**: Admin, Manager (Read: All users)

### 7.6 Customer Management

**Purpose**: Track customer information (currently embedded in sales)

**Features:**
- Customer name, email, phone capture during sales
- Customer information in invoices
- Future: Dedicated customer management

**Access**: All authenticated users

### 7.7 Reports Module

**Purpose**: Generate business analytics and reports

**Features:**
- Sales statistics (total, today, average)
- Date range filtering
- Top selling products
- Sales trend visualization
- Revenue analysis
- Product performance metrics

**Access**: Admin, Manager

### 7.8 Authentication & Roles Module

**Purpose**: Secure access control

**Features:**
- User login/logout
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- Session management
- Protected routes

**Roles:**
- **Admin**: Full system access
- **Manager**: Product, sales, purchase, supplier management
- **Staff**: Sales processing and viewing

---

## 8. Testing

### 8.1 Test Cases

#### 8.1.1 Authentication Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| AUTH-001 | Login with valid credentials | Successful login, token received |
| AUTH-002 | Login with invalid credentials | Error message displayed |
| AUTH-003 | Access protected route without token | Redirect to login |
| AUTH-004 | Access with expired token | Token refresh or re-login required |
| AUTH-005 | Logout functionality | Token cleared, redirect to login |

#### 8.1.2 Product Management Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| PROD-001 | Create product with valid data | Product created successfully |
| PROD-002 | Create product with duplicate SKU | Error: SKU already exists |
| PROD-003 | Update product stock | Stock updated correctly |
| PROD-004 | Delete product | Product deleted (if no dependencies) |
| PROD-005 | Search products | Relevant products displayed |
| PROD-006 | Filter by category | Products filtered correctly |

#### 8.1.3 Sales Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| SALE-001 | Create sale with items | Sale created, inventory updated |
| SALE-002 | Create sale with insufficient stock | Error: Insufficient stock |
| SALE-003 | Apply discount | Discount calculated correctly |
| SALE-004 | Apply tax | Tax calculated correctly |
| SALE-005 | Generate invoice PDF | PDF generated successfully |
| SALE-006 | View sales history | All sales displayed |

#### 8.1.4 Purchase Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| PUR-001 | Create purchase order | Purchase created, stock increased |
| PUR-002 | Select supplier | Supplier information loaded |
| PUR-003 | Update payment status | Status updated correctly |
| PUR-004 | View purchase history | All purchases displayed |

#### 8.1.5 Inventory Tests

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| INV-001 | Stock update on sale | Stock decreased correctly |
| INV-002 | Stock update on purchase | Stock increased correctly |
| INV-003 | Low stock alert | Alert displayed when stock ≤ min level |
| INV-004 | Stock validation | Cannot sell more than available stock |

### 8.2 Unit Testing

**Frontend Unit Tests:**
- Component rendering
- Form validation
- State management
- API call mocking
- Route protection

**Backend Unit Tests:**
- Controller functions
- Validation logic
- Database operations
- Authentication middleware
- Error handling

### 8.3 Integration Testing

**API Integration Tests:**
- End-to-end API calls
- Database transactions
- Authentication flow
- Error scenarios
- Data consistency

**System Integration Tests:**
- Frontend-Backend communication
- Database operations
- File generation (PDF)
- Real-time updates

---

## 9. Conclusion & Future Scope

### 9.1 Conclusion

The Stationery Shop Management System successfully addresses the challenges faced by traditional stationery businesses. The system provides:

- **Efficient Operations**: Automated inventory and billing processes
- **Real-time Data**: Instant visibility into sales and stock
- **User-Friendly Interface**: Modern, responsive web application
- **Scalability**: Can handle growing business needs
- **Security**: Role-based access control and secure authentication
- **Reporting**: Comprehensive business analytics

The system is production-ready and can be deployed to improve stationery shop operations significantly.

### 9.2 Future Scope

**Potential Enhancements:**

1. **Advanced Reporting**
   - Profit/Loss statements
   - Inventory valuation reports
   - Supplier performance analysis
   - Customer purchase history

2. **Barcode Integration**
   - Barcode scanning for products
   - Barcode generation
   - Quick product lookup

3. **Multi-location Support**
   - Multiple shop branches
   - Stock transfer between locations
   - Centralized reporting

4. **Customer Management**
   - Customer database
   - Loyalty programs
   - Credit sales
   - Payment tracking

5. **Advanced Inventory**
   - Batch/expiry date tracking
   - Serial number management
   - Warehouse management

6. **E-commerce Integration**
   - Online ordering
   - Customer portal
   - Order management

7. **Mobile Application**
   - Mobile app for staff
   - Mobile POS
   - Offline capability

8. **Notifications**
   - Email alerts for low stock
   - SMS notifications
   - Push notifications

9. **Analytics Dashboard**
   - Advanced charts and graphs
   - Predictive analytics
   - Business intelligence

10. **Integration with Accounting Software**
    - Tally integration
    - QuickBooks integration
    - Financial reporting

11. **Multi-currency Support**
    - Multiple currencies
    - Exchange rate management

12. **Advanced Security**
    - Two-factor authentication
    - Audit logs
    - Data encryption

---

## Appendix

### A. API Endpoints

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

**Products:**
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product
- GET `/api/products/low-stock` - Get low stock products

**Categories:**
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get category by ID
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

**Sales:**
- GET `/api/sales` - Get all sales
- GET `/api/sales/:id` - Get sale by ID
- POST `/api/sales` - Create sale
- GET `/api/sales/stats` - Get sales statistics

**Purchases:**
- GET `/api/purchases` - Get all purchases
- GET `/api/purchases/:id` - Get purchase by ID
- POST `/api/purchases` - Create purchase
- PUT `/api/purchases/:id` - Update purchase

**Suppliers:**
- GET `/api/suppliers` - Get all suppliers
- GET `/api/suppliers/:id` - Get supplier by ID
- POST `/api/suppliers` - Create supplier
- PUT `/api/suppliers/:id` - Update supplier
- DELETE `/api/suppliers/:id` - Delete supplier

**Dashboard:**
- GET `/api/dashboard/stats` - Get dashboard statistics

### B. Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=stationery_shop
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

---

**End of Report**

