# 🚀 Railway Deployment Checklist

## ✅ **Required Environment Variables**

**Minimum required for deployment:**
```bash
NODE_ENV=production
SESSION_SECRET=6a219a1996851292921587c759568aca1040d7544f2db765d5227db20b0a325f
JWT_SECRET=25ac91c107316d758036d007577972a786befa16206c9de9ffc06779bba7cd1b
```

**Optional (for Google OAuth):**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-app-name.railway.app
```

## 🔍 **Health Check Status**

Your app should pass health checks at: `https://your-app-name.railway.app/api/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-07-02T...",
  "message": "Career Evaluation System API is running",
  "database": "Connected",
  "environment": "production",
  "port": 3001
}
```

## 🛠️ **If Health Check Fails**

1. **Check Railway Logs** for startup errors
2. **Verify Environment Variables** are set correctly
3. **Check Build Logs** for dependency issues
4. **Test locally**: `npm start && npm run verify`

## 📊 **After Successful Deployment**

1. **Login** with existing credentials (System Manager / admin123)
2. **Test** core functionality (evaluations, expectations)
3. **Set up** Google OAuth (if needed)
4. **Monitor** with: `npm run db:monitor`

## 🎯 **Default Login**

- **Username**: System Manager  
- **Password**: admin123
- **Role**: Manager (can see all team members)

## 🔄 **Regular Maintenance**

- Monitor health: `GET /api/health`
- Database validation: `npm run db:validate`
- View logs in Railway dashboard
- Backup database periodically 