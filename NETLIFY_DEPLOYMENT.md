# 🚀 Netlify Deployment Guide for Freshoop

## Quick Deploy to Netlify

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (already done)

2. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"

3. **Connect to GitHub**
   - Select your repository: `Mohsin241002/Freshoop`
   - Netlify will auto-detect the `netlify.toml` configuration

4. **Set Environment Variables**
   Click "Show advanced" → "New variable" and add:

   **Client Variables:**
   ```
   VITE_SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cGR6eWZ1ZWVtdnJ6c2dleWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTAzODUsImV4cCI6MjA3Nzk4NjM4NX0.ptX7JycIdEg6WlJ2F3ebbV034srQXZdzGq-210h5kNI
   VITE_API_URL=/api
   VITE_PEXELS_API_KEY=imY45DES967sZGy0D3e3wz8XAx6iNXvIzdbzmzDSlQPr5OmZlhNtMedH
   ```

   **Server Variables:**
   ```
   SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cGR6eWZ1ZWVtdnJ6c2dleWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTAzODUsImV4cCI6MjA3Nzk4NjM4NX0.ptX7JycIdEg6WlJ2F3ebbV034srQXZdzGq-210h5kNI
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cGR6eWZ1ZWVtdnJ6c2dleWFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQxMDM4NSwiZXhwIjoyMDc3OTg2Mzg1fQ.yhx8OhcGxR-Q0fHg2j-Onsrr2hsP1y1HxykKNtIZJrQ
   JWT_SECRET=your_jwt_secret_change_in_production
   NODE_ENV=production
   ADMIN_EMAILS=chunawala241@gmail.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete

6. **Update Environment Variables**
   - After deployment, go to Site settings → Environment variables
   - Update `FRONTEND_URL` with your Netlify URL (e.g., `https://your-site.netlify.app`)
   - Trigger a new deployment

7. **Update Supabase**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Netlify URL to:
     - Site URL: `https://your-site.netlify.app`
     - Redirect URLs: `https://your-site.netlify.app/**`

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   cd /Users/mohsin/Freshoop
   netlify init
   ```

4. **Follow prompts:**
   - Create & configure a new site
   - Choose your team
   - Enter site name
   - Netlify will detect `netlify.toml`

5. **Set Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://wxpdzyfueemvrzsgeyah.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_anon_key"
   netlify env:set VITE_API_URL "/api"
   netlify env:set VITE_PEXELS_API_KEY "your_pexels_key"
   netlify env:set SUPABASE_URL "https://wxpdzyfueemvrzsgeyah.supabase.co"
   netlify env:set SUPABASE_ANON_KEY "your_anon_key"
   netlify env:set SUPABASE_SERVICE_KEY "your_service_key"
   netlify env:set JWT_SECRET "your_jwt_secret"
   netlify env:set NODE_ENV "production"
   netlify env:set ADMIN_EMAILS "chunawala241@gmail.com"
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Configuration Files

- ✅ `netlify.toml` - Netlify configuration
- ✅ `netlify/functions/api.js` - Serverless function for API
- ✅ `netlify/functions/package.json` - Function dependencies

## How It Works

### Build Process:
1. Builds client from `client/` folder
2. Outputs to `client/dist`
3. Deploys serverless function from `netlify/functions/api.js`

### Routing:
- `/api/*` → Netlify serverless function
- `/*` → React SPA (client/dist)

### Serverless Functions:
- Located in `netlify/functions/`
- Automatically deployed
- Use `serverless-http` to wrap Express app

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` → Production deployment
- Pull requests → Preview deployments
- Automatic build previews

## Troubleshooting

### Build Failures
- Check build logs in Netlify dashboard
- Verify all dependencies are in package.json
- Check Node version (should be 18+)

### API Not Working
- Verify environment variables are set
- Check function logs in Netlify dashboard
- Ensure `serverless-http` is installed

### CORS Errors
- Check CORS configuration in `netlify/functions/api.js`
- Verify origin settings

### Authentication Issues
- Update Supabase redirect URLs
- Check JWT_SECRET is set
- Verify Supabase keys are correct

## Monitoring

- **Function Logs:** Site overview → Functions → View logs
- **Build Logs:** Deploys → Click deployment → View logs
- **Analytics:** Built-in Netlify Analytics

## Custom Domain

1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration steps
4. Update environment variables with new domain

## Benefits of Netlify

✅ Automatic HTTPS
✅ CDN distribution
✅ Serverless functions included
✅ Easy environment variable management
✅ Automatic deployments from Git
✅ Built-in form handling
✅ Split testing capabilities
✅ Deploy previews for PRs

## Cost

- Free tier includes:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  - Serverless functions

Your app should fit comfortably in the free tier! 🎉
