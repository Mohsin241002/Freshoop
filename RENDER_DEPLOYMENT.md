# Freshoop - Render Deployment Guide

This guide explains how to deploy Freshoop on Render.com.

## Prerequisites

1. GitHub account with the Freshoop repository
2. Render.com account (free tier available)
3. Supabase project with credentials

## Deployment Options

### Option 1: Deploy via Render Dashboard (Recommended)

#### Step 1: Create Backend API Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Mohsin241002/Freshoop`
4. Configure the service:
   - **Name:** `freshoop-api`
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   SUPABASE_SERVICE_KEY=<your-service-key>
   SUPABASE_ANON_KEY=<your-anon-key>
   JWT_SECRET=<your-jwt-secret>
   ADMIN_EMAILS=chunawala241@gmail.com
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (takes 2-3 minutes)
8. Note your API URL (e.g., `https://freshoop-api.onrender.com`)

#### Step 2: Create Frontend Static Site

1. Click **"New +"** → **"Static Site"**
2. Select same GitHub repository
3. Configure the service:
   - **Name:** `freshoop-client`
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://freshoop-api.onrender.com/api
   VITE_SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   VITE_PEXELS_API_KEY=<your-pexels-key>
   ```

5. Add Rewrite Rules (in Settings → Redirects/Rewrites):
   - **Source:** `/api/*`
   - **Destination:** `https://freshoop-api.onrender.com/api/*`
   - **Action:** Rewrite

   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** Rewrite

6. Click **"Create Static Site"**

### Option 2: Deploy via Blueprint (render.yaml)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Add required environment variables when prompted
6. Click **"Apply"** to deploy both services

## Environment Variables Reference

### Backend (freshoop-api)
| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 3001 |
| SUPABASE_URL | Supabase project URL | https://xxx.supabase.co |
| SUPABASE_SERVICE_KEY | Supabase service role key | eyJhbGci... |
| JWT_SECRET | JWT signing secret | your_secret_key |
| ADMIN_EMAILS | Admin email addresses | admin@example.com |

### Frontend (freshoop-client)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | https://freshoop-api.onrender.com/api |
| VITE_SUPABASE_URL | Supabase project URL | https://xxx.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase anon key | eyJhbGci... |
| VITE_PEXELS_API_KEY | Pexels API key | imY45DES... |

## Post-Deployment Configuration

### 1. Update CORS Settings (Backend)

The server should automatically allow your frontend domain. Verify in `server/index.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://freshoop-client.onrender.com',
    /\.onrender\.com$/
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 2. Update Supabase Allowed Origins

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Add your Render URLs to allowed origins:
   - `https://freshoop-client.onrender.com`
   - `https://freshoop-api.onrender.com`

### 3. Test the Deployment

1. Visit your frontend URL: `https://freshoop-client.onrender.com`
2. Test authentication (login/register)
3. Test admin section (create/update items and categories)
4. Verify API connectivity

## Important Notes

### Free Tier Limitations

- **Backend:** Spins down after 15 minutes of inactivity (first request takes ~30 seconds)
- **Build Time:** 15 minutes max
- **Bandwidth:** 100 GB/month
- **Auto-deploys:** Triggered on Git push

### Custom Domain (Optional)

1. Go to your static site settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `freshoop.com`)
4. Update DNS records as instructed
5. SSL certificate is automatically provisioned

### Continuous Deployment

Render automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both frontend and backend will rebuild automatically.

## Troubleshooting

### Build Failures

**Check build logs:**
1. Go to service dashboard
2. Click on failed deployment
3. View logs for errors

**Common issues:**
- Missing environment variables
- Node version mismatch
- Build timeout (increase plan or optimize build)

### API Connection Issues

1. Verify environment variables are set correctly
2. Check CORS configuration in backend
3. Ensure API URL in frontend matches backend URL
4. Check backend health: `https://freshoop-api.onrender.com/api/health`

### Database Connection Issues

1. Verify Supabase credentials
2. Check RLS policies are properly configured
3. Verify service role key is used in backend
4. Check Supabase allowed origins

## Migration from Netlify

Your code is already prepared with:
- ✅ RLS policies fixed for admin updates
- ✅ Supabase client properly configured
- ✅ Environment variables ready
- ✅ CORS configuration updated

Simply follow the deployment steps above!

## Monitoring

- **Backend Logs:** Dashboard → freshoop-api → Logs
- **Frontend Logs:** Dashboard → freshoop-client → Logs
- **Metrics:** Available in each service dashboard
- **Uptime:** Render provides automatic health checks

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [GitHub Issues](https://github.com/Mohsin241002/Freshoop/issues)

---

**Deployment Status:**
- Backend: https://freshoop-api.onrender.com
- Frontend: https://freshoop-client.onrender.com
- Supabase: https://wxpdzyfueemvrzsgeyah.supabase.co
