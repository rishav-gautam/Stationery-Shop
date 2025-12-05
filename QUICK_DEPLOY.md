# Quick Deploy Guide - 5 Steps to Go Live

## 🚀 Fastest Way: Railway (All-in-One)

### Step 1: Prepare Your Code
```bash
# Make sure everything is committed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Sign Up & Create Project
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

### Step 3: Add MySQL Database
1. In Railway project, click "New" → "Database" → "MySQL"
2. Wait for it to provision
3. Go to "Variables" tab - note down the connection details

### Step 4: Deploy Backend
1. Click "New" → "GitHub Repo" (same project)
2. Select `backend` folder
3. Add these Environment Variables:
   ```
   NODE_ENV=production
   PORT=${{PORT}}
   DB_HOST=${{MYSQLHOST}}
   DB_USER=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   DB_NAME=${{MYSQLDATABASE}}
   DB_PORT=${{MYSQLPORT}}
   JWT_SECRET=change_this_to_random_string_min_32_chars
   JWT_EXPIRE=7d
   FRONTEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```
4. Click "Deploy"
5. Wait for deployment (2-3 minutes)
6. Copy the generated URL (e.g., `https://your-app.up.railway.app`)

### Step 5: Deploy Frontend
1. In same Railway project, click "New" → "GitHub Repo"
2. Select `frontend` folder
3. Add Environment Variable:
   ```
   VITE_API_URL=<paste_backend_url_here>
   ```
4. Click "Deploy"
5. Wait for deployment
6. Copy frontend URL

### Step 6: Setup Database
1. Go to MySQL service in Railway
2. Click "Data" tab
3. Click "Open MySQL Console"
4. Copy and paste contents of `database/schema.sql`
5. Run it
6. (Optional) Import sample data from `database/sample_data.sql`

### Step 7: Update Frontend URL in Backend
1. Go to backend service
2. Add/Update environment variable:
   ```
   FRONTEND_URL=<your_frontend_railway_url>
   ```
3. Redeploy backend

### ✅ Done!
- Frontend: `https://your-frontend.up.railway.app`
- Backend: `https://your-backend.up.railway.app`

---

## 🎯 Alternative: Render + Vercel (More Steps but More Control)

### Backend on Render:
1. Sign up: https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add environment variables (see DEPLOYMENT_GUIDE.md)
6. Deploy

### Frontend on Vercel:
1. Sign up: https://vercel.com
2. Import GitHub repo
3. Root Directory: `frontend`
4. Framework: Vite
5. Environment Variable: `VITE_API_URL=<render_backend_url>`
6. Deploy

### Database:
- Use PlanetScale (free MySQL): https://planetscale.com
- Or Railway MySQL (separate service)

---

## 💡 Pro Tips

1. **Keep Backend Awake**: Use https://uptimerobot.com (free) to ping your backend every 5 minutes
2. **Custom Domain**: Both Railway and Render support custom domains (free)
3. **SSL**: Automatically handled by hosting platforms
4. **Monitoring**: Use Railway/Render dashboards to monitor usage

---

## 🔧 Troubleshooting

**Backend won't start?**
- Check environment variables are set
- Check build logs for errors
- Verify database connection string

**Frontend can't connect?**
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Make sure backend URL is accessible

**Database connection fails?**
- Verify credentials
- Check if database allows external connections
- Test connection locally first

---

**Need more details?** See `DEPLOYMENT_GUIDE.md` for comprehensive instructions.

