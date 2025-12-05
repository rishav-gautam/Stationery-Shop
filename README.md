# Stationery Shop Management System

A complete, production-ready web application for managing stationery shop operations including inventory, sales, purchases, and reporting.

## 🚀 Features

- **Inventory Management**: Complete product and stock management with low stock alerts
- **Point of Sale (POS)**: Fast and efficient billing system
- **Sales Management**: Track all sales with customer information
- **Purchase Management**: Manage supplier purchases and stock replenishment
- **Supplier Management**: Maintain supplier database
- **Reports & Analytics**: Sales statistics, top products, and business insights
- **Invoice Generation**: PDF invoice generation for sales
- **User Management**: Role-based access control (Admin, Manager, Staff)
- **Dashboard**: Real-time business metrics and overview

## 🛠️ Technology Stack

### Frontend
- React.js 18.2.0
- Tailwind CSS 3.3.6
- React Router 6.20.0
- Axios 1.6.2
- Recharts 2.10.3 (for charts)
- jsPDF 2.5.1 (for PDF generation)
- Vite 5.0.8 (build tool)

### Backend
- Node.js
- Express.js 4.18.2
- MySQL2 3.6.5
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 2.4.3
- express-validator 7.0.1

### Database
- MySQL 8.0+

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher) or **yarn**
- **MySQL** (v8.0 or higher)
- **Git** (for version control)

## 🔧 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Stationery
```

### Step 2: Database Setup

1. **Create MySQL Database**

```bash
mysql -u root -p
```

2. **Import Database Schema**

```bash
mysql -u root -p < database/schema.sql
```

3. **Import Sample Data (Optional)**

```bash
mysql -u root -p stationery_shop < database/sample_data.sql
```

**Note**: The sample data includes default users. However, you'll need to set proper password hashes. See the note in `database/sample_data.sql` for instructions.

### Step 3: Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stationery_shop
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important**: 
- Replace `your_mysql_password` with your actual MySQL root password
- Replace `your_super_secret_jwt_key_change_this_in_production` with a strong secret key

4. **Start the backend server**

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Step 4: Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

After importing sample data, you can use these credentials:

**Note**: You may need to update the password hashes in the database. To generate a proper bcrypt hash:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"
```

Then update the `users` table:

```sql
UPDATE users SET password = '<generated_hash>' WHERE username = 'admin';
```

**Default Users:**
- Username: `admin` | Password: `admin123` | Role: Admin
- Username: `manager` | Password: `admin123` | Role: Manager
- Username: `staff1` | Password: `admin123` | Role: Staff

## 📁 Project Structure

```
Stationery/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── saleController.js
│   │   ├── purchaseController.js
│   │   ├── supplierController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── validation.js        # Input validation
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── sales.js
│   │   ├── purchases.js
│   │   ├── suppliers.js
│   │   └── dashboard.js
│   ├── .env                     # Environment variables (create this)
│   ├── .env.example            # Example env file
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/            # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── Purchases.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   └── Reports.jsx
│   │   ├── utils/              # Utility functions
│   │   │   └── api.js          # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── database/
│   ├── schema.sql              # Database schema
│   └── sample_data.sql         # Sample data
│
├── PROJECT_REPORT.md           # Complete project report
└── README.md                   # This file
```

## 🚀 Usage Guide

### Starting the Application

1. **Start MySQL service**

```bash
# On macOS/Linux
sudo service mysql start
# or
brew services start mysql

# On Windows
# Start MySQL from Services or MySQL Workbench
```

2. **Start Backend** (Terminal 1)

```bash
cd backend
npm run dev
```

3. **Start Frontend** (Terminal 2)

```bash
cd frontend
npm run dev
```

4. **Access the Application**

Open your browser and navigate to: `http://localhost:3000`

### Key Features Usage

#### 1. Login
- Use the default credentials or create a new account
- Different roles have different access levels

#### 2. Dashboard
- View business overview
- Check low stock alerts
- See recent sales and top products

#### 3. Products Management
- Add new products with SKU, price, and stock
- Edit existing products
- Search and filter products
- View low stock items

#### 4. Sales (POS)
- Click "New Sale" to open POS interface
- Add products to cart
- Enter customer information (optional)
- Apply discount/tax
- Complete sale and generate invoice

#### 5. Purchases
- Create purchase orders from suppliers
- Add products and quantities
- Update payment status
- Stock automatically increases on purchase

#### 6. Reports
- View sales statistics
- Filter by date range
- See top selling products
- Analyze business performance

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Role-Based Access Control**: Different permissions for different roles
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured CORS for API security

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Product Endpoints

- `GET /api/products` - Get all products (with pagination, search, filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin/Manager only)
- `PUT /api/products/:id` - Update product (Admin/Manager only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/low-stock` - Get low stock products

### Sales Endpoints

- `GET /api/sales` - Get all sales (with pagination, date filter)
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create sale
- `GET /api/sales/stats` - Get sales statistics

### Purchase Endpoints

- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Create purchase (Admin/Manager only)
- `PUT /api/purchases/:id` - Update purchase (Admin/Manager only)

### Other Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/suppliers` - Get all suppliers
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🧪 Testing

### Manual Testing

1. Test all CRUD operations
2. Test authentication and authorization
3. Test sales and purchase flows
4. Test inventory updates
5. Test report generation

### API Testing

Use Postman or Thunder Client to test API endpoints:

1. Import the API collection (if available)
2. Set up environment variables
3. Test each endpoint

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` (backend)
   - Change port in `vite.config.js` (frontend)

3. **Module Not Found**
   - Run `npm install` in both frontend and backend
   - Clear `node_modules` and reinstall

4. **CORS Error**
   - Check backend CORS configuration
   - Verify frontend proxy settings

5. **JWT Token Error**
   - Check JWT_SECRET in `.env`
   - Clear browser localStorage and login again

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stationery_shop
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## 🚢 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name stationery-backend
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to:
   - Netlify
   - Vercel
   - AWS S3
   - Any static hosting service

### Database Deployment

- Use managed MySQL service (AWS RDS, Google Cloud SQL, etc.)
- Update `DB_HOST` in production `.env`

## 📄 License

This project is open source and available for educational purposes.

## 👥 Contributors

- Project Developer

## 📞 Support

For issues and questions:
- Check the PROJECT_REPORT.md for detailed documentation
- Review the code comments
- Check GitHub issues (if applicable)

## 🎯 Future Enhancements

- Barcode scanning
- Multi-location support
- Customer loyalty program
- Advanced analytics
- Mobile application
- Email notifications
- Integration with accounting software

---

**Happy Coding! 🎉**

