# 🚀 Vercel + Render Deployment Guide

## Architecture
- **Frontend**: Deployed on Vercel (React)
- **Backend**: Deployed on Render (Node.js + Express)
- **Database**: MongoDB Atlas

## 📋 Prerequisites

1. **GitHub Repository** with your project
2. **Vercel Account** (free tier available)
3. **Render Account** (free tier available)
4. **MongoDB Atlas** database

## 🚀 Step-by-Step Deployment

### Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `mern-registration-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/registration_app
   PORT=10000
   EXCEL_FILE_PATH=./data/registrations.xlsx
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-backend-name.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`

3. **Configure Build Settings**
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-name.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL: `https://your-app.vercel.app`

### Step 3: Update CORS Configuration

1. **Get your Vercel domain**
   - It will be something like: `https://your-app.vercel.app`

2. **Update Backend CORS**
   - In your `server.js`, update the CORS origins:
   ```javascript
   origin: process.env.NODE_ENV === 'production' 
       ? [
           'https://your-app.vercel.app',
           'https://project5-wud7.onrender.com'
         ]
       : 'http://localhost:3000',
   ```

3. **Redeploy Backend**
   - Push changes to GitHub
   - Render will auto-deploy

## 🔧 Configuration Files

### Backend (Render)
- `render.yaml` - Render deployment configuration
- `server.js` - Express server (API-only)
- `package.json` - Backend dependencies

### Frontend (Vercel)
- `client/vercel.json` - Vercel configuration
- `client/package.json` - Frontend dependencies
- `client/src/components/*.js` - React components

## 🧪 Testing Your Deployment

### Backend Testing
1. **Health Check**: `https://your-backend.onrender.com/api/health`
2. **API Info**: `https://your-backend.onrender.com/`

### Frontend Testing
1. **Main App**: `https://your-app.vercel.app`
2. **Registration Form**: Should work with backend
3. **Stats Section**: Should fetch data from backend

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check that your Vercel domain is in the CORS origins
   - Update backend and redeploy

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` is set correctly in Vercel
   - Check that backend is running on Render

3. **Build Failures**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`

### Environment Variables Checklist

**Backend (Render)**:
- ✅ `MONGODB_URI`
- ✅ `PORT`
- ✅ `EXCEL_FILE_PATH`
- ✅ `NODE_ENV`

**Frontend (Vercel)**:
- ✅ `REACT_APP_API_URL`

## 📊 Benefits of This Setup

1. **Better Performance**: Vercel's CDN for frontend
2. **Scalability**: Separate scaling for frontend/backend
3. **Reliability**: Each service can be managed independently
4. **Cost Effective**: Both platforms have generous free tiers

## 🔄 Updates and Maintenance

### Backend Updates
1. Push changes to GitHub
2. Render auto-deploys
3. No frontend changes needed

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys
3. No backend changes needed

---

**🎉 Your app is now deployed with optimal architecture!** 