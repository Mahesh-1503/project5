# Deployment Guide for MERN Registration App

This guide will help you deploy your MERN stack registration application to either Render or Vercel.

## 🚀 Quick Deployment Options

### Option 1: Render (Recommended for Full-Stack)
Render is ideal for MERN applications because it supports both frontend and backend deployment.

### Option 2: Vercel
Vercel is excellent for frontend deployment and can handle backend APIs too.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

1. ✅ **GitHub Repository**: Your project is pushed to GitHub
2. ✅ **MongoDB Atlas**: Set up a cloud MongoDB database
3. ✅ **Environment Variables**: Prepare your production environment variables
4. ✅ **Build Scripts**: Ensure your package.json has proper build scripts

---

## 🎯 Option 1: Deploy to Render

### Step 1: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your database password

### Step 2: Deploy Backend to Render
1. **Sign up/Login** to [Render](https://render.com)
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `mern-registration-backend`
   - **Root Directory**: Leave empty (root of repo)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/registration_app
   PORT=10000
   EXCEL_FILE_PATH=./data/registrations.xlsx
   NODE_ENV=production
   ```

6. **Click "Create Web Service"**

### Step 3: Deploy Frontend to Render
1. **Click "New +"** → **"Static Site"**
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Name**: `mern-registration-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-service.onrender.com
   ```

5. **Click "Create Static Site"**

### Step 4: Update Frontend API Configuration
Create a file `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-service.onrender.com
```

---

## 🎯 Option 2: Deploy to Vercel

### Step 1: Deploy Backend to Vercel
1. **Sign up/Login** to [Vercel](https://vercel.com)
2. **Import your GitHub repository**
3. **Configure the project**:
   - **Framework Preset**: `Node.js`
   - **Root Directory**: Leave empty
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/registration_app
   PORT=3000
   EXCEL_FILE_PATH=./data/registrations.xlsx
   NODE_ENV=production
   ```

5. **Click "Deploy"**

### Step 2: Deploy Frontend to Vercel
1. **Create a new project** in Vercel
2. **Import your GitHub repository**
3. **Configure the project**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-vercel-url.vercel.app
   ```

5. **Click "Deploy"**

---

## 🔧 Configuration Files

### For Render Deployment

Create `render.yaml` in your root directory:
```yaml
services:
  - type: web
    name: mern-registration-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        value: mongodb+srv://username:password@cluster.mongodb.net/registration_app
      - key: PORT
        value: 10000
      - key: EXCEL_FILE_PATH
        value: ./data/registrations.xlsx
      - key: NODE_ENV
        value: production

  - type: web
    name: mern-registration-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://mern-registration-backend.onrender.com
```

### For Vercel Deployment

Create `vercel.json` in your root directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

Create `client/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
```

---

## 🔄 Update Frontend for Production

Update your `client/src/components/RegistrationForm.js` to use environment variables:

```javascript
// Add this at the top of the file
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Replace all axios.post calls with api.post
```

Do the same for `client/src/components/StatsSection.js`.

---

## 🌐 Domain Configuration

### Custom Domain Setup
1. **Render**: Go to your service → Settings → Custom Domains
2. **Vercel**: Go to your project → Settings → Domains

### CORS Configuration
Update your backend CORS settings in `server.js`:

```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com', 'https://your-frontend-domain.vercel.app']
        : 'http://localhost:3000',
    credentials: true
}));
```

---

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Ensure build scripts are correct
   - Verify Node.js version compatibility

2. **API Connection Issues**:
   - Verify environment variables are set correctly
   - Check CORS configuration
   - Ensure MongoDB connection string is correct

3. **Excel File Issues**:
   - Ensure the `data` directory exists
   - Check file permissions
   - Verify file path in environment variables

### Debug Commands:
```bash
# Check build locally
npm run build

# Test production build
npm start

# Check environment variables
echo $MONGODB_URI
```

---

## 📊 Monitoring and Logs

### Render:
- Go to your service → Logs
- Monitor real-time logs
- Set up alerts for errors

### Vercel:
- Go to your project → Functions
- View function logs
- Monitor performance

---

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **MongoDB**: Use strong passwords and IP whitelisting
3. **HTTPS**: Both platforms provide SSL certificates
4. **Rate Limiting**: Consider adding rate limiting for production

---

## 🚀 Post-Deployment Checklist

- [ ] Backend is accessible via API endpoints
- [ ] Frontend loads without errors
- [ ] Registration form submits successfully
- [ ] Data is saved to MongoDB
- [ ] Excel file is created/updated
- [ ] Statistics page displays data
- [ ] Custom domain is configured (if needed)
- [ ] SSL certificate is active
- [ ] Error monitoring is set up

---

## 📞 Support

If you encounter issues:

1. **Check the logs** in your deployment platform
2. **Verify environment variables** are set correctly
3. **Test locally** with production environment variables
4. **Check MongoDB Atlas** connection and permissions

---

## 🎉 Success!

Once deployed, your application will be accessible at:
- **Frontend**: `https://your-app-name.onrender.com` (Render) or `https://your-app-name.vercel.app` (Vercel)
- **Backend API**: `https://your-backend-service.onrender.com` (Render) or `https://your-backend-service.vercel.app` (Vercel)

Your MERN stack registration application is now live and ready to accept registrations! 🚀 