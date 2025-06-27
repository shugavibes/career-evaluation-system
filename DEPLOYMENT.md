# Deployment Guide

## GitHub Setup

1. **Create a new repository on GitHub:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `career-evaluation-system`
   - Don't initialize with README (we already have one)

2. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/career-evaluation-system.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/career-evaluation-system)

### Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `LEADER_PASSWORD`: Your secure leader password
   - `NODE_ENV`: production

## Environment Variables

### Backend
- `LEADER_PASSWORD`: Password for leader evaluations (default: leader123)
- `NODE_ENV`: Set to production for deployment

### Frontend  
- `REACT_APP_API_URL`: Backend API URL (auto-configured in Vercel)

## Quick Commands

```bash
# Commit all changes
git commit -m "Initial commit: Career Evaluation System"

# Push to GitHub (after setting up remote)
git push origin main

# Deploy to Vercel
vercel --prod
``` 