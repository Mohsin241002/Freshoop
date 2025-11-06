# 🚀 Quick Deployment to Vercel

## Option 1: Deploy via GitHub (Easiest - Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### Step 3: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

**Client Variables:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-deployment-url.vercel.app/api
VITE_PEXELS_API_KEY=your_pexels_key
```

**Server Variables:**
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-deployment-url.vercel.app
NODE_ENV=production
ADMIN_EMAILS=admin@example.com
```

### Step 4: Deploy
Click **"Deploy"** and wait for the build to complete!

---

## Option 2: Deploy via CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
# From project root
vercel

# For production
vercel --prod
```

Or use the deployment script:
```bash
./deploy.sh
```

### Step 4: Set Environment Variables
Use the Vercel dashboard or CLI:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# ... add all other variables
```

---

## Post-Deployment

### 1. Update Supabase
- Go to Supabase Dashboard → Authentication → URL Configuration
- Set **Site URL**: `https://your-deployment-url.vercel.app`
- Add **Redirect URLs**: `https://your-deployment-url.vercel.app/**`

### 2. Update Environment Variables
- After first deployment, update `VITE_API_URL` and `FRONTEND_URL` with your actual Vercel URL
- Trigger a new deployment for changes to take effect

### 3. Test Your Deployment
Visit your Vercel URL and test:
- ✅ User registration/login
- ✅ Browse items
- ✅ Add to cart
- ✅ Checkout process
- ✅ Admin dashboard

---

## Important Files Created

- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Root package file
- ✅ `.vercelignore` - Files to ignore during deployment
- ✅ `deploy.sh` - Deployment helper script
- ✅ `.env.production.example` - Production environment template
- ✅ `VERCEL_DEPLOYMENT.md` - Detailed deployment guide

---

## Need Help?

See `VERCEL_DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

## Security Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] `.env` files in `.gitignore`
- [ ] JWT_SECRET is secure and random
- [ ] Supabase redirect URLs updated
- [ ] Admin emails configured
- [ ] CORS configured properly
