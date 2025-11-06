# Serverless Functions Removal - Deployment Architecture Update

## Summary

This document explains the removal of serverless functions from the Freshoop project and the transition to a dedicated backend server architecture.

## Changes Made

### 1. Removed Serverless Function Directories

The following serverless function implementations have been **completely removed**:

- ✅ `/api/` - Vercel serverless functions directory (DELETED)
- ✅ `/netlify/` - Netlify functions directory (DELETED)
- ✅ `netlify.toml` - Netlify configuration file (DELETED)
- ✅ `.netlify/` - Netlify cache directory (DELETED)
- ✅ `NETLIFY_ENV_SETUP.md` - Netlify documentation (DELETED)

**Result:** The project now only uses the dedicated Render server at https://freshoop.onrender.com

### 2. Updated Deployment Architecture

#### Old Architecture (Serverless)
```
Frontend (Vercel) → Serverless Functions (Vercel/api/) → Supabase
```

#### New Architecture (Dedicated Server)
```
Frontend (Vercel) → Backend Server (Render) → Supabase
      ↓                      ↓
https://your-app.vercel.app  https://freshoop.onrender.com
```

### 3. Configuration Updates

#### vercel.json
- Updated API proxy to point to Render server
- Removed serverless function configuration
- Now proxies `/api/*` to `https://freshoop.onrender.com/api/*`

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://freshoop.onrender.com/api/:path*"
    }
  ]
}
```

#### client/.env.production
- Changed `VITE_API_URL` from `/api` to `https://freshoop.onrender.com/api`
- Frontend now directly communicates with Render backend

```env
VITE_API_URL=https://freshoop.onrender.com/api
```

### 4. Documentation Updates

Updated the following files:
- `VERCEL_DEPLOYMENT.md` - Now focuses on frontend-only deployment
- `.env.production.example` - Simplified to only client variables
- `README.md` - Updated deployment section with new architecture

## Benefits of New Architecture

### 1. Cost Efficiency
- No serverless function invocation costs on Vercel
- Vercel free tier supports static site hosting
- Pay for backend compute on Render only

### 2. Simplified Deployment
- Frontend and backend are independently deployable
- No need to manage serverless function cold starts
- Easier debugging with persistent backend logs

### 3. Performance
- Dedicated server eliminates cold start delays
- Persistent connections to database
- Better control over server resources

### 4. Scalability
- Easier to scale backend independently
- Can upgrade Render instance as needed
- Frontend remains lightweight and fast

## Deployment Instructions

### Backend (Render)
The backend server is already deployed at:
- **URL:** https://freshoop.onrender.com
- **Health Check:** https://freshoop.onrender.com/api/health
- **Deployment:** Automatic from `main` branch

### Frontend (Vercel)

1. **Set Environment Variables in Vercel:**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_API_URL=https://freshoop.onrender.com/api
   VITE_PEXELS_API_KEY=your_pexels_key
   ```

2. **Deploy:**
   - Push to GitHub
   - Vercel will automatically deploy
   - Frontend will proxy API requests to Render

3. **Update Render Backend:**
   - Add your Vercel URL to `FRONTEND_URL` environment variable on Render
   - This enables CORS for your frontend domain

## Testing the Setup

1. **Test Backend Health:**
   ```bash
   curl https://freshoop.onrender.com/api/health
   ```

2. **Test Frontend Build:**
   ```bash
   cd client
   npm run build
   ```

3. **Test API Connection:**
   - Visit your Vercel deployment
   - Try logging in
   - Check browser network tab for API calls to Render

## Troubleshooting

### API Requests Failing
- Verify `VITE_API_URL=https://freshoop.onrender.com/api` in Vercel
- Check Render backend is running
- Review Render logs for errors

### CORS Errors
- Ensure `FRONTEND_URL` on Render includes your Vercel URL
- Check Render backend CORS configuration
- Verify both domains use HTTPS

### Authentication Issues
- Verify Supabase redirect URLs include your Vercel domain
- Check JWT_SECRET is set on Render backend
- Ensure Supabase env vars are correct

## Migration Checklist

- [x] Update `vercel.json` to proxy to Render
- [x] Update `client/.env.production` with Render API URL
- [x] Update `.env.production.example`
- [x] Update `VERCEL_DEPLOYMENT.md`
- [x] Update `README.md`
- [x] Document changes in `SERVERLESS_REMOVAL.md`
- [ ] Test Vercel deployment with new configuration
- [ ] Update Render backend with Vercel frontend URL
- [ ] Update Supabase redirect URLs

## Rollback Plan

If you need to revert to serverless functions:

1. Restore `vercel.json` to use `/api` functions
2. Restore `client/.env.production` to use `/api`
3. Ensure `api/` directory has all required dependencies
4. Redeploy to Vercel

## Support

- **Backend Logs:** https://dashboard.render.com
- **Frontend Logs:** https://vercel.com/dashboard
- **Vercel Deployment Guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Render Deployment Guide:** [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

---

**Date:** November 7, 2025  
**Architecture:** Vercel (Frontend) + Render (Backend) + Supabase (Database)
