# Netlify Deployment Guide

## Overview
Frontend hosted on Netlify with backend on Render at https://freshoop.onrender.com

## Prerequisites
- Netlify account
- Netlify CLI (optional): `npm install -g netlify-cli`
- Backend deployed and running on Render

## Environment Variables Setup

Set these environment variables in Netlify Dashboard:
```
VITE_API_URL=https://freshoop.onrender.com/api
VITE_SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_PEXELS_API_KEY=<your-pexels-api-key>
```

## Deployment Options

### Option 1: Deploy via Netlify Dashboard

1. **Connect Repository**
   ```
   1. Go to https://app.netlify.com
   2. Click "Add new site" → "Import an existing project"
   3. Connect to your Git provider (GitHub/GitLab/Bitbucket)
   4. Select the Freshoop repository
   ```

2. **Configure Build Settings**
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: dist
   ```

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables listed above
   - Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site (First Time)**
   ```bash
   cd /Users/mohsin/Freshoop
   netlify init
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Set site name (e.g., freshoop)
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_API_URL "https://freshoop.onrender.com/api"
   netlify env:set VITE_SUPABASE_URL "https://wxpdzyfueemvrzsgeyah.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
   netlify env:set VITE_PEXELS_API_KEY "your-key"
   ```

5. **Deploy**
   ```bash
   # Deploy to production
   netlify deploy --prod
   
   # Or deploy preview first
   netlify deploy
   ```

## Configuration Files

### netlify.toml
Located at project root, configures:
- Build command and publish directory
- API redirects to Render backend
- SPA routing fallback
- CORS headers

### client/public/_redirects
Additional redirect rules for API proxy and SPA routing.

## API Routing
All `/api/*` requests are automatically proxied to:
```
https://freshoop.onrender.com/api/*
```

This is handled by:
1. `netlify.toml` redirect rules
2. `client/public/_redirects` file

## Post-Deployment Steps

### 1. Update Supabase Redirect URLs
Add your Netlify domain to Supabase Auth settings:
```
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add Site URL: https://your-site.netlify.app
3. Add Redirect URLs:
   - https://your-site.netlify.app
   - https://your-site.netlify.app/auth/callback
```

### 2. Test the Deployment
```bash
# Test home page
curl https://your-site.netlify.app

# Test API proxy
curl https://your-site.netlify.app/api/health

# Test authentication flow in browser
```

### 3. Configure Custom Domain (Optional)
```
1. Go to Netlify Dashboard → Domain settings
2. Add custom domain
3. Configure DNS records
4. Update VITE_API_URL if needed
5. Update Supabase redirect URLs with new domain
```

## Build Information

- **Build Time**: ~1.4s
- **Bundle Size**: 
  - JS: ~590KB
  - CSS: ~47KB
- **Node Version**: 20
- **Package Manager**: npm

## Troubleshooting

### Build Fails
```bash
# Check Netlify build logs
netlify watch

# Test build locally
cd client
npm install
npm run build
```

### API Calls Failing
```bash
# Verify API redirect in Netlify
curl -I https://your-site.netlify.app/api/health

# Should return 200 and proxy to Render
```

### Environment Variables Not Working
```bash
# List current environment variables
netlify env:list

# Clear cache and redeploy
netlify build --clear-cache
netlify deploy --prod
```

### CORS Issues
Check that:
1. Render backend has CORS enabled
2. netlify.toml has correct CORS headers
3. API proxy redirects are working

## CI/CD Integration

Netlify automatically deploys on git push:
- **Main branch** → Production deployment
- **Other branches** → Preview deployments

## Monitoring

- **Build Logs**: Netlify Dashboard → Deploys
- **Analytics**: Netlify Dashboard → Analytics
- **Forms**: Netlify Dashboard → Forms (if using Netlify Forms)
- **Functions**: N/A (using Render backend)

## Cost
- **Netlify**: Free tier includes:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  
- **Render Backend**: 
  - Free tier with 750 hours/month
  - Spins down after inactivity

## Support & Resources

- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com
- Status: https://www.netlifystatus.com

## Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Netlify CDN    │  ← Static React App
│  (Frontend)     │
└────────┬────────┘
         │
         │ /api/* proxy
         ↓
┌─────────────────┐
│  Render Server  │  ← Express API
│  (Backend)      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Supabase DB    │  ← PostgreSQL + Auth
└─────────────────┘
```

## Notes
- No serverless functions needed - all backend logic on Render
- API calls automatically proxied via Netlify redirects
- Frontend is statically served from CDN
- Backend handles all business logic, auth, and database operations
