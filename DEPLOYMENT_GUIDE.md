# Deployment Guide: Portfolio Dashboard

This guide will help you deploy your Portfolio Dashboard to GitHub, Railway (Backend), and Vercel (Frontend).

## 📁 Current Project Structure

```
assignmentStock/
├── src/                    # Frontend (React)
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── server/                 # Backend (Express)
│   └── index.js
├── index.html
├── package.json
├── vite.config.js
└── ... (other config files)
```

**Important**: Both frontend and backend are in the SAME repository. This is called a "monorepo" and is perfectly fine! We'll deploy them separately.

---

## Part 1: Prepare for Deployment

### Step 1: Verify Your Project Structure

Make sure you have:
- ✅ Frontend files in root (`src/`, `index.html`, `vite.config.js`)
- ✅ Backend files in `server/` folder (`server/index.js`)
- ✅ `package.json` in root (for frontend)
- ✅ `server/package.json` (optional, for backend - we have it)

### Step 2: Check .gitignore

Your `.gitignore` should include:
```
node_modules/
.env
dist/
.vite
```

---

## Part 2: Deploy to GitHub

### Step 1: Initialize Git (If Not Done)

Open terminal in `D:\assignmentStock`:

```bash
git init
```

### Step 2: Check Git Status

```bash
git status
```

You should see all your files listed.

### Step 3: Add All Files

```bash
git add .
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Portfolio Dashboard with React frontend and Express backend"
```

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in top right → **"New repository"**
3. Repository name: `portfolio-dashboard` (or your choice)
4. Description: "Dynamic Portfolio Dashboard with Real-time Stock Data"
5. Choose **Public** or **Private**
6. **DO NOT** check any boxes (README, .gitignore, license) - we already have these
7. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-dashboard.git
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

### Step 7: Push Code to GitHub

```bash
git branch -M main
git push -u origin main
```

**Note**: If you're asked for credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - To create one: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Select scope: `repo`

### Step 8: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/portfolio-dashboard`
2. Verify you see:
   - `src/` folder (frontend)
   - `server/` folder (backend)
   - `package.json`
   - All other files

---

## Part 3: Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (click "Deploy from GitHub repo")
4. Authorize Railway to access your GitHub account

### Step 2: Create New Project from GitHub

1. After signing in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your repositories
4. Find and select **`portfolio-dashboard`**
5. Click **"Deploy Now"**

### Step 3: Configure Backend Service

Railway will automatically detect your project. Now we need to configure it for the backend:

1. Click on the service that was created (it might be named "portfolio-dashboard")
2. Click on **"Settings"** tab (gear icon)
3. Scroll down to **"Service Settings"**

**Configure these settings:**

1. **Root Directory**: 
   - Click **"Change"** next to Root Directory
   - Enter: `server`
   - Click **"Save"**
   - This tells Railway to only look in the `server/` folder

2. **Start Command**:
   - Under **"Start Command"**, enter: `node index.js`
   - Or leave it blank (Railway will auto-detect)

3. **Build Command**:
   - Leave blank (backend doesn't need building)

### Step 4: Set Environment Variables

1. Go to **"Variables"** tab
2. Click **"New Variable"**
3. Add these variables (if needed):
   - **Name**: `PORT`
   - **Value**: `4010` (or leave blank - Railway will assign automatically)
   - Click **"Add"**

**Note**: Railway automatically assigns a PORT, so you might not need to set it. But if your code requires PORT=4010, add it.

### Step 5: Wait for Deployment

1. Railway will automatically:
   - Install dependencies (`npm install` in server folder)
   - Start your server with `node index.js`
2. Watch the **"Deployments"** tab to see the build logs
3. Wait for status to show **"SUCCESS"** (green checkmark)

### Step 6: Get Your Backend URL

1. Once deployed, go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. You'll see a URL like: `https://portfolio-dashboard-production-xxxx.up.railway.app`
4. **Copy this URL** - this is your backend URL!
5. You can also create a custom domain if you want

**Important**: Save this URL somewhere - you'll need it for Vercel!

### Step 7: Test Backend

1. Open the Railway URL in browser
2. Add `/api/stocks/batch` to test: `https://your-app.railway.app/api/stocks/batch`
3. You should see an error (because it needs POST with symbols), but that means it's working!

---

## Part 4: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Project

1. After signing in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **`portfolio-dashboard`** and click **"Import"**

### Step 3: Configure Project Settings

Vercel will auto-detect some settings. Verify/configure:

**Framework Preset**: 
- Should auto-detect as **"Vite"**
- If not, select **"Vite"** from dropdown

**Root Directory**: 
- Leave as **`.`** (root) - this is correct because frontend files are in root

**Build and Output Settings**:
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `dist` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

**These should be correct by default. Don't change unless needed.**

### Step 4: Add Environment Variables

**This is CRITICAL!** You need to tell the frontend where your backend is.

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** or the input field
3. Add this variable:

   **Name**: `VITE_API_URL`
   
   **Value**: Your Railway backend URL (from Step 6 of Part 3)
   
   Example: `https://portfolio-dashboard-production-xxxx.up.railway.app`
   
   **Important**: 
   - Do NOT add `/api` at the end
   - Do NOT add trailing slash
   - Just the base URL: `https://your-app.railway.app`

4. Select all environments: **Production**, **Preview**, **Development**
5. Click **"Add"**

### Step 5: Deploy

1. Click **"Deploy"** button at the bottom
2. Wait for build to complete (2-3 minutes)
3. You'll see build logs in real-time
4. Once complete, you'll see: **"Congratulations! Your project has been deployed."**

### Step 6: Get Your Frontend URL

1. After deployment, you'll see your project dashboard
2. Your frontend URL will be: `https://portfolio-dashboard.vercel.app` (or similar)
3. **Copy this URL** - you'll need it for backend CORS

### Step 7: Update Backend CORS

Now you need to tell your backend to allow requests from Vercel.

1. Go back to **Railway** dashboard
2. Click on your backend service
3. Go to **"Variables"** tab
4. Add new variable:
   - **Name**: `FRONTEND_URL`
   - **Value**: Your Vercel URL (from Step 6 above)
   - Example: `https://portfolio-dashboard.vercel.app`
5. Click **"Add"**
6. Railway will automatically redeploy with the new variable

**Alternative**: If you want to allow all Vercel preview deployments, the code already handles this (checks for `.vercel.app` in origin).

### Step 8: Test Your Deployed App

1. Open your Vercel URL in browser: `https://portfolio-dashboard.vercel.app`
2. The app should load
3. Check browser console (F12) for any errors
4. Verify stock prices are updating

---

## Part 5: Verify Everything Works

### ✅ Checklist

**Backend (Railway)**:
- [ ] Backend is accessible at Railway URL
- [ ] Can access `/api/stocks/batch` endpoint (will show error without POST, but that's OK)
- [ ] Environment variables are set
- [ ] CORS is configured (FRONTEND_URL variable set)

**Frontend (Vercel)**:
- [ ] Frontend loads at Vercel URL
- [ ] Environment variable `VITE_API_URL` is set correctly
- [ ] No CORS errors in browser console
- [ ] Stock prices are fetching and updating
- [ ] Portfolio table displays correctly

**Integration**:
- [ ] Frontend can communicate with backend
- [ ] Stock data updates every 15 seconds
- [ ] No errors in browser console
- [ ] No errors in Railway logs

---

## Troubleshooting

### Issue: CORS Errors in Browser

**Symptoms**: Browser console shows "CORS policy" errors

**Solution**:
1. Go to Railway → Variables
2. Add `FRONTEND_URL` with your Vercel URL
3. Wait for redeploy
4. Clear browser cache and refresh

### Issue: "Failed to fetch stock data"

**Symptoms**: Frontend shows error message

**Solutions**:
1. **Check Vercel Environment Variable**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly
   - Should be: `https://your-app.railway.app` (no trailing slash, no /api)

2. **Check Backend is Running**:
   - Go to Railway → Deployments
   - Verify latest deployment is successful (green)
   - Check logs for any errors

3. **Test Backend Directly**:
   - Open Railway URL in browser
   - Try: `https://your-app.railway.app/api/stocks/batch`
   - Should see error (needs POST), but confirms backend is running

4. **Redeploy Frontend**:
   - After fixing environment variable, go to Vercel
   - Click "Redeploy" to rebuild with new variable

### Issue: Build Fails on Vercel

**Symptoms**: Vercel deployment shows error

**Solutions**:
1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing dependencies in `package.json`
   - Build command incorrect
   - Output directory incorrect

3. Verify `vite.config.js` is correct
4. Check `package.json` has all dependencies

### Issue: Backend Not Starting on Railway

**Symptoms**: Railway deployment fails or shows error

**Solutions**:
1. Check Railway logs (Deployments tab → Click on deployment → View logs)
2. Verify:
   - Root Directory is set to `server`
   - Start command is `node index.js` (or blank)
   - All dependencies are in `package.json` (in server folder or root)

3. Check `server/index.js` file exists
4. Verify no syntax errors in server code

### Issue: Environment Variables Not Working

**Symptoms**: Frontend still uses localhost

**Solutions**:
1. **Vercel**: 
   - Go to Settings → Environment Variables
   - Verify `VITE_API_URL` is set
   - **Important**: Variable name must start with `VITE_` for Vite to expose it
   - Redeploy after adding/changing variables

2. **Railway**:
   - Variables are available as `process.env.VARIABLE_NAME`
   - Check logs to see if variables are being read

---

## Quick Reference: URLs

After deployment, you'll have:

- **Frontend URL**: `https://portfolio-dashboard.vercel.app` (or your custom domain)
- **Backend URL**: `https://portfolio-dashboard-production-xxxx.up.railway.app`

**Where to use them:**

1. **Vercel Environment Variable** (`VITE_API_URL`):
   - Use: Backend URL (Railway URL)
   - Example: `https://portfolio-dashboard-production-xxxx.up.railway.app`

2. **Railway Environment Variable** (`FRONTEND_URL`):
   - Use: Frontend URL (Vercel URL)
   - Example: `https://portfolio-dashboard.vercel.app`

---

## Summary: What Happens Where

| Component | Location | Deployment Platform | Root Directory |
|-----------|----------|-------------------|----------------|
| **Frontend** | `src/`, `index.html` (root) | Vercel | `.` (root) |
| **Backend** | `server/index.js` | Railway | `server` |

**Key Points**:
- ✅ One GitHub repository contains both
- ✅ Railway deploys only `server/` folder
- ✅ Vercel deploys from root (frontend files)
- ✅ They communicate via environment variables

---

## Next Steps After Deployment

1. **Test thoroughly** on production URLs
2. **Monitor logs** in both Railway and Vercel
3. **Set up custom domains** (optional)
4. **Enable automatic deployments** (already enabled by default)
5. **Add monitoring/analytics** (optional)

---

## Support

If you encounter issues:

1. **Check Logs**:
   - Railway: Deployments → Click deployment → View logs
   - Vercel: Deployments → Click deployment → View build logs

2. **Verify Configuration**:
   - Railway: Root Directory = `server`, Start Command = `node index.js`
   - Vercel: Framework = Vite, Output = `dist`, Environment Variables set

3. **Test Endpoints**:
   - Backend: Use Postman or curl to test API
   - Frontend: Check browser console for errors

4. **Common Fixes**:
   - Redeploy after changing environment variables
   - Clear browser cache
   - Check CORS configuration
   - Verify URLs are correct (no typos, no trailing slashes)

---

## Deployment Flow Diagram

```
GitHub Repository (portfolio-dashboard)
│
├─── Railway (Backend)
│    ├─── Root: server/
│    ├─── Start: node index.js
│    └─── URL: https://xxx.railway.app
│
└─── Vercel (Frontend)
     ├─── Root: . (root)
     ├─── Build: npm run build
     ├─── Output: dist/
     ├─── Env Var: VITE_API_URL = Railway URL
     └─── URL: https://xxx.vercel.app
```

---

**You're all set!** Follow the steps above and your app will be live on the internet! 🚀
