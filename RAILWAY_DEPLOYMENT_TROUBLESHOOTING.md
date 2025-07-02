# Railway Deployment Troubleshooting Guide

## Health Check Failures

### Issue: "service unavailable" during health checks

**Symptoms:**
- Railway shows "Attempt #X failed with service unavailable"
- Build succeeds but deployment fails during health check phase
- Server starts locally but fails on Railway

**Root Causes & Solutions:**

#### 1. Server Binding Issues
**Problem:** Server not binding to 0.0.0.0
**Solution:** Ensure server binds to all interfaces:
```javascript
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
```

#### 2. Health Check Timing
**Problem:** Server needs more time to start up
**Solution:** Updated `nixpacks.toml` with extended timeouts:
```toml
[healthcheck]
path = "/api/health"
interval = "60s"
timeout = "30s"
retries = 5
grace_period = "60s"
```

#### 3. Database Connection Delays
**Problem:** Database initialization takes too long
**Solution:** Added database connection timeout in health check:
```javascript
const dbTest = await Promise.race([
    db.all('SELECT 1'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 5000))
]);
```

#### 4. Missing Environment Variables
**Problem:** Server crashes due to missing required variables
**Solution:** Made Google OAuth optional and added fallback values:
```javascript
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Enable OAuth
} else {
    console.log('⚠️  Google OAuth not configured');
}
```

#### 5. Port Configuration
**Problem:** Railway expects specific port configuration
**Solution:** Use Railway's PORT environment variable:
```javascript
const port = process.env.PORT || 3001;
```

### Alternative Health Check Configurations

#### Option 1: Root Path Health Check
Some platforms check the root path instead of `/api/health`:
```javascript
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Career Evaluation System is running'
    });
});
```

#### Option 2: Simplified Health Check
If database checks are causing issues:
```javascript
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

#### Option 3: Custom Health Check Path
Update nixpacks.toml to use a different path:
```toml
[healthcheck]
path = "/health"
# or
path = "/"
```

### Debugging Steps

#### 1. Check Railway Logs
```bash
railway logs
```

#### 2. Test Health Endpoint Locally
```bash
# Start server
npm start

# Test health endpoint
curl -f http://localhost:3001/api/health
```

#### 3. Verify Startup Script
```bash
node scripts/verify-startup.js
```

#### 4. Check Environment Variables
```bash
railway variables
```

#### 5. Test Database Connection
```bash
node scripts/validate-database.js
```

### Environment Variables for Railway

#### Minimal Required Variables:
```
NODE_ENV=production
SESSION_SECRET=your-secret-here
JWT_SECRET=your-jwt-secret-here
```

#### Optional Variables:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-railway-app.railway.app
```

### Health Check Response Format

The health endpoint returns detailed information for debugging:

**Success Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Career Evaluation System API is running",
  "database": "Connected",
  "environment": "production",
  "port": 3001,
  "uptime": 123.45,
  "memory": {...},
  "responseTime": "25ms",
  "version": "1.0.0",
  "nodejs": "v18.17.0",
  "platform": "linux",
  "arch": "x64"
}
```

**Error Response (503):**
```json
{
  "status": "ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Service unavailable",
  "database": "Failed",
  "error": "Database timeout",
  "environment": "production",
  "port": 3001,
  "uptime": 123.45,
  "responseTime": "5025ms",
  "details": {
    "stack": "Error: Database timeout...",
    "code": "SQLITE_CANTOPEN"
  }
}
```

### Common Error Patterns

#### 1. "EADDRINUSE" Error
```
Port 3001 is already in use
```
**Solution:** Kill existing processes or use different port

#### 2. Database Connection Failures
```
SQLITE_CANTOPEN: unable to open database file
```
**Solution:** Check file permissions and database path

#### 3. "MODULE_NOT_FOUND" Error
```
Cannot find module 'some-package'
```
**Solution:** Check package.json dependencies and build script

#### 4. OAuth Configuration Errors
```
GoogleStrategy requires a clientID option
```
**Solution:** Make OAuth optional or provide environment variables

### Quick Fixes

#### 1. Emergency Health Check Bypass
If health checks keep failing, temporarily use a simple endpoint:
```javascript
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});
```

#### 2. Database-Free Mode
For testing, temporarily disable database checks:
```javascript
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'API running (database checks disabled)'
    });
});
```

#### 3. Extended Timeout Test
Increase nixpacks.toml timeout values:
```toml
[healthcheck]
path = "/api/health"
interval = "120s"
timeout = "60s"
retries = 10
grace_period = "120s"
```

### Testing Checklist

Before deploying, verify:
- [ ] Local server starts successfully
- [ ] Health endpoint responds within 30 seconds
- [ ] Database connection works
- [ ] All required environment variables are set
- [ ] Frontend build completes successfully
- [ ] No critical dependencies are missing

### Support Commands

```bash
# Generate new secrets
npm run generate:secrets

# Verify local setup
npm run verify

# Test database
npm run db:validate

# Build frontend
npm run build

# Start production server
npm start
```

### Contact Information

If issues persist, check:
1. Railway documentation: https://docs.railway.app
2. Railway community: https://railway.app/discord
3. Project GitHub issues
4. Railway status page: https://status.railway.app 