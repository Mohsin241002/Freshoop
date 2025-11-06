# Freshoop - Quick Deployment Guide

## ✅ Configuration Complete

Your project is now configured for:
- **Frontend:** Vercel (Static Site)
- **Backend:** Render (Node.js Server)
- **Database:** Supabase (PostgreSQL)

---

## 🚀 Deploy to Vercel (Frontend)

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `Mohsin241002/Freshoop`
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_URL=https://freshoop.onrender.com/api
   VITE_PEXELS_API_KEY=imY45DES967sZGy0D3e3wz8XAx6iNXvIzdbzmzDSlQPr5OmZlhNtMedH
   ```
6. Click **"Deploy"**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts, then deploy to production
vercel --prod
```

---

## 🔧 Deploy to Render (Backend)

Your backend is already configured with `render.yaml`

### Deploy Steps:

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `Mohsin241002/Freshoop`
4. Render will detect `render.yaml`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   SUPABASE_SERVICE_KEY=your_service_key_here
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ADMIN_EMAILS=your-admin-email@example.com
   ```
6. Click **"Apply"**

**Note:** After Vercel deployment, update `FRONTEND_URL` on Render with your actual Vercel URL.

---

## 📋 Post-Deployment Checklist

### 1. Update Supabase Redirect URLs
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add your Vercel URL:
  - Site URL: `https://your-app.vercel.app`
  - Redirect URLs: `https://your-app.vercel.app/**`

### 2. Test Your Deployment
```bash
# Test backend health
curl https://freshoop.onrender.com/api/health

# Test frontend
# Visit: https://your-app.vercel.app
```

### 3. Update CORS on Render
- Add your Vercel URL to `FRONTEND_URL` environment variable on Render
- This ensures API requests work properly

---

## 🔍 Verify Build Locally

Before deploying, you can test the build:

```bash
# Build frontend
cd client
npm run build

# Preview the build
npm run preview

# Test backend
cd ../server
npm start
```

---

## 📁 Current Structure

```
Freshoop/
├── client/              → Deploys to Vercel
│   ├── dist/           → Build output
│   ├── .env            → Local dev (uses /api proxy)
│   └── .env.production → Production (uses Render URL)
│
├── server/              → Deploys to Render
│   └── (All backend code)
│
├── vercel.json          → Vercel configuration
├── render.yaml          → Render configuration
└── .vercelignore        → Excludes server from Vercel
```

---

## 🎯 Key Points

1. **No Serverless Functions**: We removed `/api/` and `/netlify/` directories
2. **Static Frontend**: Vercel hosts only the React app
3. **Dedicated Backend**: Render runs the Express server
4. **API Proxy**: Vercel proxies `/api/*` to Render
5. **Independent Scaling**: Frontend and backend scale separately

---

## 🆘 Troubleshooting

### Vercel Build Fails
- Ensure `client/dist` is in `.gitignore`
- Check `vercel.json` configuration
- Verify environment variables are set

### API Requests Fail
- Verify `VITE_API_URL=https://freshoop.onrender.com/api` in Vercel
- Check Render backend is running
- Test: `curl https://freshoop.onrender.com/api/health`

### CORS Errors
- Update `FRONTEND_URL` on Render with your Vercel URL
- Ensure both use HTTPS

---

## 📚 Documentation

- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) - Full architecture details
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel guide
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Render guide
- [SERVERLESS_REMOVAL.md](./SERVERLESS_REMOVAL.md) - What we changed

---

**Ready to Deploy!** 🎉

Your project is configured and ready. Just follow the steps above to deploy to Vercel and Render.
