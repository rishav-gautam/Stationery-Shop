# Deployment Guide - Free Hosting Options

This guide will help you deploy your Stationery Shop Management System to free hosting services.

## 🎯 Recommended Free Stack

- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel or Netlify (Free tier)
- **Database**: PlanetScale (Free tier) or Railway MySQL

---

## Option 1: Render + Vercel + PlanetScale (Recommended)

### Step 1: Deploy Database (PlanetScale)

1. **Sign up at PlanetScale**: https://planetscale.com
2. **Create a new database**:
   - Click "Create database"
   - Name: `stationery_shop`
   - Region: Choose closest to you
   - Plan: Free (Hobby)
3. **Get connection string**:
   - Go to your database dashboard
   - Click "Connect"
   - Copy the connection string (looks like: `mysql://user:password@host:port/database`)
4. **Import schema**:
   - Use PlanetScale CLI or MySQL Workbench
   - Or use the web console to run SQL commands
   - Copy contents of `database/schema.sql` and run it

### Step 2: Deploy Backend (Render)

1. **Prepare backend for deployment**:
   - Create `render.yaml` in backend folder (see below)
   - Update `.env` variables for production

2. **Sign up at Render**: https://render.com
3. **Create new Web Service**:
   - Connect your GitHub repository
   - Select the `backend` folder
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables (add these):
     ```
     NODE_ENV=production
     PORT=10000
     DB_HOST=your_planetscale_host
     DB_USER=your_planetscale_user
     DB_PASSWORD=your_planetscale_password
     DB_NAME=stationery_shop
     DB_PORT=3306
     JWT_SECRET=your_very_secure_random_string_here
     JWT_EXPIRE=7d
     ```
4. **Deploy**: Click "Create Web Service"

### Step 3: Deploy Frontend (Vercel)

1. **Update frontend config**:
   - Update `vite.config.js` to point to your Render backend URL

2. **Sign up at Vercel**: https://vercel.com
3. **Import Project**:
   - Connect your GitHub repository
   - Select the `frontend` folder
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
4. **Deploy**: Click "Deploy"

---

## Option 2: Railway (All-in-One)

Railway can host backend, frontend, and database together.

### Step 1: Sign up at Railway
- Go to https://railway.app
- Sign up with GitHub

### Step 2: Create MySQL Database
1. Click "New Project"
2. Click "New" → "Database" → "MySQL"
3. Wait for database to be created
4. Go to "Variables" tab and copy connection details

### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select your repository
3. Select `backend` folder
4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=${{PORT}}
   DB_HOST=${{MYSQLHOST}}
   DB_USER=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   DB_NAME=${{MYSQLDATABASE}}
   DB_PORT=${{MYSQLPORT}}
   JWT_SECRET=your_secure_secret
   JWT_EXPIRE=7d
   ```
5. Deploy

### Step 4: Deploy Frontend
1. Click "New" → "GitHub Repo" (same project)
2. Select `frontend` folder
3. Add Environment Variables:
   ```
   VITE_API_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```
4. Deploy

---

## 📝 Required Files for Deployment

### 1. Backend: `render.yaml` (for Render)

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: stationery-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### 2. Backend: Update `package.json`

Add start script if not present:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 3. Frontend: Update `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
```

### 4. Frontend: Update `src/utils/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})
// ... rest of the file
```

### 5. Backend: Update CORS settings

Update `backend/server.js`:

```javascript
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 🔧 Database Setup on Production

### Option A: Using PlanetScale

1. Install PlanetScale CLI:
   ```bash
   brew install planetscale/tap/pscale
   ```

2. Login:
   ```bash
   pscale auth login
   ```

3. Connect and run schema:
   ```bash
   pscale connect stationery_shop --port 3306
   mysql -h 127.0.0.1 -P 3306 -u root -p < database/schema.sql
   ```

### Option B: Using Railway MySQL

1. Go to Railway dashboard
2. Click on your MySQL service
3. Go to "Data" tab
4. Use the web SQL editor or connect via MySQL client
5. Run the contents of `database/schema.sql`

---

## 🌐 Environment Variables Reference

### Backend (.env on production)

```env
NODE_ENV=production
PORT=10000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=stationery_shop
DB_PORT=3306
JWT_SECRET=generate_a_very_secure_random_string_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Environment Variables on Vercel/Netlify)

```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🚀 Quick Deploy Checklist

- [ ] Database created and schema imported
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] CORS configured for frontend URL
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Test login functionality
- [ ] Test API endpoints

---

## 🔍 Troubleshooting

### Backend not connecting to database
- Check database credentials
- Verify database allows connections from your hosting IP
- Check database is running

### CORS errors
- Update CORS origin in backend to match frontend URL
- Check environment variables

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly
- Check backend URL is accessible
- Verify backend is running

### Build errors
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## 📚 Alternative Free Hosting Options

### Backend Alternatives:
- **Fly.io**: https://fly.io (Free tier available)
- **Cyclic**: https://cyclic.sh (Free tier)
- **Heroku**: https://heroku.com (Limited free tier)

### Frontend Alternatives:
- **Netlify**: https://netlify.com (Free tier)
- **GitHub Pages**: For static sites (requires build)

### Database Alternatives:
- **Aiven**: https://aiven.io (Free tier MySQL)
- **Supabase**: https://supabase.com (Free PostgreSQL, would need migration)
- **Neon**: https://neon.tech (Free PostgreSQL)

---

## 💡 Tips for Free Tier

1. **Database**: PlanetScale free tier has limits, but good for small apps
2. **Backend**: Render free tier spins down after inactivity (first request may be slow)
3. **Frontend**: Vercel/Netlify free tiers are generous
4. **Monitoring**: Use free services like UptimeRobot to keep backend awake

---

## 🎉 After Deployment

1. Test all features
2. Update default passwords
3. Set up monitoring (optional)
4. Configure custom domain (optional)

---

**Need help?** Check the hosting platform's documentation or community forums.

