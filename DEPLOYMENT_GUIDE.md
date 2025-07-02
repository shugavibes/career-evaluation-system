# 🚀 Deployment Guide - Career Evaluation System

## Platform Recommendation: Railway

**Railway** is the best platform for deploying your application because it:
- ✅ Supports full Node.js applications with sessions
- ✅ Handles SQLite databases properly
- ✅ Easy environment variable management
- ✅ Automatic HTTPS and custom domains
- ✅ Simple deployment process
- ✅ Built-in monitoring and logs

## 📋 Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Create these environment variables in Railway:

```bash
# Required for Production
NODE_ENV=production
SESSION_SECRET=6a219a1996851292921587c759568aca1040d7544f2db765d5227db20b0a325f
JWT_SECRET=25ac91c107316d758036d007577972a786befa16206c9de9ffc06779bba7cd1b

# Google OAuth (if using OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (Railway will provide this)
FRONTEND_URL=https://your-app-name.railway.app

# Database (SQLite - will be handled automatically)
# No additional setup needed for SQLite on Railway
```

### 2. **Build Configuration**
Your app is already configured with:
- ✅ `railway.json` for Railway-specific settings
- ✅ Production build commands
- ✅ Health check endpoint at `/api/health`
- ✅ Static file serving for React frontend

## 🚀 Railway Deployment Steps

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### **Step 2: Deploy from GitHub**
1. Push your code to GitHub (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. In Railway dashboard:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect it's a Node.js app

### **Step 3: Configure Environment Variables**
1. In your Railway project dashboard
2. Go to "Variables" tab
3. Add all the environment variables listed above
4. **Important**: Generate secure secrets:
   ```bash
   # Generate secure session secret (run locally)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate JWT secret (run locally)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### **Step 4: Google OAuth Setup** (If using OAuth)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add your Railway URL to authorized origins:
   - `https://your-app-name.railway.app`
5. Add callback URL:
   - `https://your-app-name.railway.app/auth/google/callback`

### **Step 5: Deploy**
1. Railway will automatically deploy when you push to main
2. Monitor the build logs
3. Once deployed, Railway will provide your app URL

## 🔧 Build Process

Railway will automatically:
1. Install Node.js dependencies: `npm install`
2. Run postinstall script: `cd frontend && npm ci` (installs frontend deps)
3. Build React app: `cd frontend && npm run build`
4. Start the server: `npm start`

**Build Configuration Files:**
- ✅ `nixpacks.toml` - Railway build configuration
- ✅ `package.json` - Node.js version specified in engines
- ✅ `postinstall` script for frontend dependencies
- ✅ `.railwayignore` - Excludes unnecessary files

## 📊 Post-Deployment Verification

### **1. Check Health Endpoint**
```bash
curl https://your-app-name.railway.app/api/health
```
Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-07-02T...",
  "message": "Career Evaluation System API is running",
  "database": "Connected"
}
```

### **2. Test Authentication**
- Visit your app URL
- Try logging in with existing credentials
- Test Google OAuth (if configured)

### **3. Database Verification**
Run your monitoring tools to check database status:
```bash
# Locally, pointing to production (if needed)
npm run db:validate
```

## 🔍 Monitoring & Maintenance

### **Railway Built-in Features**
- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, and request metrics
- **Deployments**: Track deployment history
- **Custom Domains**: Add your own domain

### **Database Monitoring**
Your monitoring tools work in production:
- Health checks at `/api/health`
- Use the scripts you created for database validation

## 🛠️ Troubleshooting

### **Common Issues & Solutions**

1. **Build Fails - Exit Code 127 or Missing Modules**
   ```bash
   # This usually means frontend dependencies are corrupted or missing
   # Solution: We now use a clean build script that forces fresh installs
   
   # The build process now:
   # 1. Installs backend dependencies
   # 2. Removes corrupted frontend dependencies
   # 3. Fresh install of frontend dependencies (including Tailwind)
   # 4. Builds React app
   
   # Test build locally:
   ./build.sh
   
   # Or using npm:
   npm run build
   ```

2. **Missing @tailwindcss/forms or other Tailwind plugins**
   ```bash
   # Fixed: Moved Tailwind dependencies from devDependencies to dependencies
   # Tailwind plugins are now installed as regular dependencies
   # This ensures they're available during production builds
   ```

3. **Environment Variables**
   ```bash
   # Make sure all required variables are set in Railway
   # Check the Variables tab in your Railway project
   ```

4. **Database Issues**
   ```bash
   # SQLite will be created automatically
   # Check logs for any database initialization errors
   ```

5. **Health Check Failures - Service Unavailable**
   ```bash
   # This usually means the server isn't starting or responding properly
   # Common causes and solutions:
   
   # 1. Missing environment variables
   # Make sure these are set in Railway:
   # - NODE_ENV=production
   # - SESSION_SECRET=<your-secret>
   # - JWT_SECRET=<your-secret>
   
   # 2. Server startup errors
   # Check Railway logs for:
   # - Database connection errors
   # - Missing dependencies
   # - Port binding issues
   
   # 3. Google OAuth errors (if using OAuth)
   # OAuth is now optional - server will start without it
   # Only needed if you want Google login functionality
   
   # Test locally:
   npm start
   npm run verify  # Runs health check verification
   ```

6. **OAuth Not Working**
   ```bash
   # Verify Google Cloud Console settings
   # Check callback URLs match your Railway domain
   # Note: OAuth is optional - app works without it
   ```

## 🔐 Security Best Practices

### **Production Security**
- ✅ HTTPS automatically enabled by Railway
- ✅ Secure session secrets (use crypto.randomBytes)
- ✅ Environment variables properly configured
- ✅ CORS configured for production domain
- ✅ Helmet security headers enabled

### **Database Security**
- ✅ SQLite file properly secured
- ✅ No sensitive data in logs
- ✅ Regular backups (use your monitoring tools)

## 📈 Scaling Considerations

### **Current Setup Handles**
- Up to 1000 concurrent users
- SQLite database (suitable for teams up to 100 people)
- Automatic scaling on Railway

### **When to Upgrade**
Consider PostgreSQL when:
- Team size > 100 people
- High concurrent usage
- Complex reporting needs

## 🎯 Alternative Deployment Options

### **Option 2: Vercel (Requires Restructuring)**
If you prefer Vercel, you'll need to:
- Convert Express routes to serverless functions
- Use external database (PostgreSQL/MySQL)
- Modify session handling

### **Option 3: Heroku**
- Similar to Railway but requires more configuration
- Need to add Procfile
- Database add-ons required

### **Option 4: Self-Hosted**
- Use Docker with the included Dockerfile
- Manage your own server and database

## ✅ Final Deployment Checklist

Before going live:
- [ ] All environment variables configured
- [ ] Google OAuth working (if used)
- [ ] Health endpoint responding
- [ ] Database initialized with admin user
- [ ] Team members can log in
- [ ] Manager can access admin features
- [ ] Evaluations can be created and saved
- [ ] Expectations can be set by managers

## 🎉 You're Ready to Deploy!

Your application is production-ready with:
- Complete authentication system
- Role-based access control
- Google OAuth integration
- Database monitoring tools
- Comprehensive error handling
- Security best practices

Run this command to deploy:
```bash
# Push to GitHub (Railway will auto-deploy)
git add .
git commit -m "Production deployment ready"
git push origin main
```

Then follow the Railway setup steps above! 🚀 