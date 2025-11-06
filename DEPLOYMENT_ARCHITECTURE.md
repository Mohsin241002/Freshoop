# Freshoop Deployment Architecture

## Current Architecture (November 7, 2025)

Freshoop uses a **decoupled architecture** with separate deployments for frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Architecture                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │         │   Database   │
│   (Vercel)   │────────▶│   (Render)   │────────▶│  (Supabase)  │
│              │   API   │              │         │              │
│ Static Site  │  Proxy  │ Node/Express │         │  PostgreSQL  │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
   Your Users              API Requests            Data Storage
```

## Components

### 1. Frontend (Static Site - Vercel)

**URL:** https://your-app.vercel.app (or your custom domain)

**Technology Stack:**
- React 19
- Vite
- TailwindCSS
- Axios for API calls

**Deployment:**
- Builds from `client/` directory
- Deployed to Vercel
- Automatically deploys on push to `main` branch
- All `/api/*` requests are proxied to Render backend

**Environment Variables (Vercel):**
```env
VITE_SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://freshoop.onrender.com/api
VITE_PEXELS_API_KEY=your_pexels_key
```

### 2. Backend (Node.js Server - Render)

**URL:** https://freshoop.onrender.com

**Technology Stack:**
- Node.js 20+
- Express.js
- JWT authentication
- Supabase Client

**Deployment:**
- Deploys from `server/` directory
- Hosted on Render
- Automatically deploys on push to `main` branch
- Always-on instance (no cold starts)

**Environment Variables (Render):**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-app.vercel.app
ADMIN_EMAILS=admin@example.com
```

### 3. Database (PostgreSQL - Supabase)

**URL:** https://wxpdzyfueemvrzsgeyah.supabase.co

**Services:**
- PostgreSQL database
- Authentication
- Storage (for images)
- Row Level Security (RLS)

## Data Flow

### User Authentication Flow
```
1. User logs in via frontend (Vercel)
2. Frontend calls Supabase Auth directly
3. Supabase returns JWT token
4. Frontend stores token in memory
5. All API requests include token in Authorization header
6. Backend validates token with Supabase
7. Backend returns protected data
```

### API Request Flow
```
1. Frontend makes API call to /api/items
2. Vercel proxy redirects to https://freshoop.onrender.com/api/items
3. Render backend processes request
4. Backend queries Supabase database
5. Backend returns data to frontend
6. Frontend renders data
```

## Removed Components

### ❌ Vercel Serverless Functions
- **Previously:** `/api/` directory with serverless functions
- **Reason for removal:** Cost optimization, cold start issues
- **Status:** DELETED

### ❌ Netlify Functions
- **Previously:** `/netlify/functions/` directory
- **Reason for removal:** Simplified deployment, using dedicated server instead
- **Status:** DELETED

### ❌ Netlify Configuration
- **Files removed:**
  - `netlify.toml`
  - `.netlify/`
  - `NETLIFY_ENV_SETUP.md`
- **Status:** DELETED

## Deployment Options

### Option 1: Render (Full Stack - Recommended)

Deploy both frontend and backend to Render using `render.yaml`:

```bash
# Deploy via Render Dashboard
1. Connect GitHub repository
2. Render auto-detects render.yaml
3. Creates both services automatically
```

**Pros:**
- Single platform for everything
- Easy to manage
- Automatic deployments
- Good free tier

**Cons:**
- Frontend might be slower than dedicated CDN
- Cold starts on free tier

### Option 2: Vercel (Frontend) + Render (Backend) - Current

Deploy frontend to Vercel, backend to Render:

```bash
# Frontend to Vercel
vercel --prod

# Backend to Render (automatic from GitHub)
```

**Pros:**
- Best frontend performance (Vercel CDN)
- Backend always on (Render)
- Separate scaling
- Cost-effective

**Cons:**
- Two platforms to manage
- Need to coordinate environment variables

### Option 3: Other Static Hosts + Render

Deploy frontend to Netlify/Cloudflare Pages/GitHub Pages, backend to Render:

**Pros:**
- Flexibility in choosing frontend host
- Can use any CDN
- Backend stays consistent

**Cons:**
- Similar to Option 2

## Environment Setup

### Development
```bash
# Frontend
cd client
npm install
npm run dev  # Runs on http://localhost:5173

# Backend
cd server
npm install
npm run dev  # Runs on http://localhost:3001

# Frontend uses proxy in vite.config.js:
# /api/* -> http://localhost:3001/api/*
```

### Production
```bash
# Frontend build
cd client
npm run build  # Outputs to client/dist

# Backend start
cd server
npm start  # Runs on $PORT (3001)
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- **Auth:** `/api/auth/register`, `/api/auth/login`
- **Users:** `/api/users/:id`
- **Categories:** `/api/categories`
- **Items:** `/api/items`, `/api/items/:id`
- **Cart:** `/api/cart/:userId`
- **Orders:** `/api/orders`, `/api/orders/:id`
- **Addresses:** `/api/addresses`, `/api/addresses/:id`

## Security

### Frontend Security
- No sensitive keys exposed (only public Supabase anon key)
- HTTPS enforced
- JWT tokens stored in memory (not localStorage)
- CORS configured on backend

### Backend Security
- Environment variables for secrets
- JWT validation on protected routes
- Admin middleware for admin-only routes
- Row Level Security on Supabase
- Input sanitization middleware
- Rate limiting (optional)

### Database Security
- Row Level Security (RLS) enabled
- Service role key only on backend
- Separate anon key for frontend
- Secure password hashing

## Monitoring

### Frontend (Vercel)
- Deployment logs: https://vercel.com/dashboard
- Analytics: Vercel Analytics (optional)
- Error tracking: Browser console

### Backend (Render)
- Server logs: https://dashboard.render.com
- Health check: https://freshoop.onrender.com/api/health
- Error logs: Render dashboard

### Database (Supabase)
- Query performance: Supabase dashboard
- Auth logs: Supabase Auth logs
- Storage usage: Supabase Storage

## Scaling Strategy

### Frontend Scaling
- Automatically handled by Vercel/CDN
- Global edge network
- Instant cache invalidation

### Backend Scaling
- Vertical scaling: Upgrade Render instance size
- Horizontal scaling: Add more Render instances (paid tier)
- Database connection pooling
- Caching layer (Redis) - optional

### Database Scaling
- Managed by Supabase
- Can upgrade plan as needed
- Built-in connection pooling

## Cost Optimization

### Current Setup (Free Tier)
- **Vercel:** Free for personal projects
- **Render:** Free tier with limitations (spins down after inactivity)
- **Supabase:** Free tier (500MB database, 1GB storage)

### Upgrade Path
1. **Render:** $7/month for always-on instance
2. **Supabase:** $25/month for Pro tier (8GB database, 100GB storage)
3. **Vercel:** Stays free for most use cases

## Troubleshooting

### Frontend Not Loading
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check browser console for errors
4. Verify DNS/domain settings

### API Requests Failing
1. Check Render service is running
2. Verify `VITE_API_URL` points to Render
3. Check CORS configuration on backend
4. Review Render logs for errors
5. Test health endpoint: `https://freshoop.onrender.com/api/health`

### Authentication Issues
1. Verify Supabase environment variables
2. Check JWT_SECRET on backend
3. Verify redirect URLs in Supabase
4. Check token expiration

## Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Project Guides:**
  - [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
  - [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
  - [SERVERLESS_REMOVAL.md](./SERVERLESS_REMOVAL.md)

---

**Last Updated:** November 7, 2025  
**Architecture:** Vercel (Frontend) + Render (Backend) + Supabase (Database)  
**Status:** ✅ Production Ready
