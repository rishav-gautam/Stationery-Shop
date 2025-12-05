# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
- ✅ Node.js (v18+) installed
- ✅ MySQL (v8.0+) installed and running
- ✅ npm or yarn installed

### Step-by-Step Setup

#### 1. Database Setup (2 minutes)

```bash
# Create and import database
mysql -u root -p < database/schema.sql

# Import sample data
mysql -u root -p stationery_shop < database/sample_data.sql
```

#### 2. Backend Setup (1 minute)

```bash
cd backend
npm install

# .env file has been created automatically
# Now edit .env with your MySQL credentials:
# - Set DB_PASSWORD to your MySQL root password (if you have one)
# - Change JWT_SECRET to a strong random string for production

# Set up passwords (optional but recommended)
node scripts/setup-passwords.js

# Start backend
npm run dev
```

#### 3. Frontend Setup (1 minute)

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

#### 4. Access Application (1 minute)

1. Open browser: `http://localhost:3000`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

### 🎯 You're Ready!

The application is now running. Start exploring:
- Dashboard for overview
- Products to manage inventory
- Sales for POS billing
- Reports for analytics

### ⚠️ Troubleshooting

**Can't connect to database?**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `backend/.env`

**Port already in use?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

**Module not found?**
- Delete `node_modules` and run `npm install` again

### 📚 Next Steps

- Read `README.md` for detailed documentation
- Check `PROJECT_REPORT.md` for complete project details
- Explore the codebase and customize as needed

---

**Need Help?** Check the main README.md for comprehensive documentation.

