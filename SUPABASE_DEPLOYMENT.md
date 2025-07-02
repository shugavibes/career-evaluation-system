# 🚀 Supabase Deployment Guide

This guide will help you deploy the Career Evaluation System using Supabase (PostgreSQL database) instead of Railway. Supabase provides a better, more reliable deployment experience.

## 🎯 Why Supabase?

- ✅ **No health check issues** like Railway
- ✅ **PostgreSQL database** (better than SQLite for production)
- ✅ **Built-in authentication** (optional upgrade path)
- ✅ **Real-time subscriptions** (for future features)
- ✅ **Easy deployment** with Vercel integration
- ✅ **Better scalability** and performance

## 📋 Prerequisites

- GitHub account (for code)
- Supabase account (free tier available)
- Vercel account (free tier available)

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up/login
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: `career-evaluation-system`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait for the project to be ready (usually 1-2 minutes)

### 1.2 Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJhbGci...` (long key)

### 1.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire contents of `database/supabase-schema.sql`
4. Click **"Run"** to execute the schema
5. Verify tables were created in **Table Editor**

You should see these tables:
- ✅ users (8 users including manager)
- ✅ evaluations (empty initially)
- ✅ user_expectations (2 users with expectations)
- ✅ sessions (for authentication)

## Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Make sure your code is pushed to GitHub
2. Go to [vercel.com](https://vercel.com/) and sign up/login
3. Click **"New Project"**
4. Import your `career-evaluation-system` repository
5. Configure the project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm install`

### 2.2 Set Environment Variables

In Vercel project settings, add these environment variables:

**Required Variables:**
```
NODE_ENV=production
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...your-actual-anon-key
SESSION_SECRET=6a219a1996851292921587c759568aca1040d7544f2db765d5227db20b0a325f
JWT_SECRET=25ac91c107316d758036d007577972a786befa16206c9de9ffc06779bba7cd1b
```

**Optional (for Google OAuth):**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-app.vercel.app
```

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Click **"Visit"** to see your live application

## Step 3: Test Your Deployment

### 3.1 Test Database Connection

Visit: `https://your-app.vercel.app/api/health/detailed`

You should see:
```json
{
  "status": "OK",
  "database": "Supabase Connected",
  "environment": "production"
}
```

### 3.2 Test Login

1. Go to your deployed app
2. Login with:
   - **Email**: `manager@company.com`
   - **Password**: `admin123`
3. You should see the manager dashboard

### 3.3 Test User Features

Try logging in as team members:
- **Email**: `fede.miranda@company.com` | **Password**: `password123`
- **Email**: `jose.biskis@company.com` | **Password**: `password123`

## Step 4: Supabase Configuration (Optional)

### 4.1 Row Level Security (RLS)

The schema includes basic RLS policies. To enhance security:

1. Go to **Authentication** → **Policies** in Supabase
2. Customize policies based on your needs
3. Integrate with Supabase Auth (optional upgrade)

### 4.2 Real-time Features

Enable real-time for live updates:

1. Go to **Database** → **Replication** in Supabase
2. Enable replication for relevant tables
3. Update frontend to use Supabase real-time subscriptions

## 🔧 Local Development with Supabase

### Update Local Environment

1. Copy `environment.example` to `.env`
2. Update with your Supabase credentials:
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run Locally

```bash
# Install dependencies (if not done already)
npm install

# Start development server with Supabase
npm run dev

# Or use SQLite for local development
npm run dev-sqlite
```

## 🚀 Deployment Commands

```bash
# Build for production
npm run build

# Start production server locally
npm start

# Deploy to Vercel (if using Vercel CLI)
vercel --prod
```

## 🔄 Migration from Railway/SQLite

If you were using SQLite before:

### Export Existing Data

```bash
# Export current evaluations (if any)
node scripts/validate-database.js > current-data.json
```

### Import to Supabase

1. Use Supabase dashboard to manually import data
2. Or write a migration script using the SQL editor

## 📊 Monitoring and Maintenance

### Supabase Dashboard

Monitor your application through:
- **Database** → **Tables** (view data)
- **Auth** → **Users** (if using Supabase auth)
- **Logs** → **API** (API usage)
- **Settings** → **Usage** (quotas)

### Vercel Analytics

Monitor deployment through:
- **Functions** tab (API performance)
- **Analytics** (if enabled)
- **Deployment** logs

## 🛠️ Troubleshooting

### Common Issues

**1. "Supabase connection failed"**
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Verify project is not paused
- Check network connectivity

**2. "User not found" on login**
- Verify schema was executed correctly
- Check users table in Supabase dashboard
- Re-run the schema if needed

**3. Deployment fails**
- Check environment variables are set correctly
- Verify build command succeeds locally
- Check Vercel build logs

**4. CORS errors**
- Update FRONTEND_URL environment variable
- Check Supabase CORS settings if needed

### Getting Help

1. **Supabase**: [docs.supabase.com](https://docs.supabase.com/)
2. **Vercel**: [vercel.com/docs](https://vercel.com/docs)
3. **Project Issues**: Create GitHub issue in your repository

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Supabase credentials obtained
- [ ] Vercel project configured
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Health check passes
- [ ] Login works
- [ ] Database operations work
- [ ] (Optional) Google OAuth configured

## 🎉 Success!

Your Career Evaluation System is now running on:
- **Database**: Supabase PostgreSQL
- **Frontend/Backend**: Vercel
- **Authentication**: Local + Optional Google OAuth
- **Monitoring**: Supabase + Vercel dashboards

This setup is much more reliable than Railway and provides better scalability for your team's needs!

## 📈 Next Steps

Consider these enhancements:
1. **Migrate to Supabase Auth** for better user management
2. **Add real-time features** using Supabase subscriptions
3. **Set up automated backups** in Supabase
4. **Configure custom domain** in Vercel
5. **Add monitoring alerts** for production issues 