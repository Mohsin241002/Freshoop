# Vercel Deployment Guide for Freshoop

This guide will help you deploy the frontend (React/Vite) to Vercel using the Render backend.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for command-line deployment)
3. A GitHub account (for automatic deployments)
4. Your Supabase project URL and keys
5. Your Pexels API key (for image service)
6. Backend server running on Render at https://freshoop.onrender.com

## Architecture

- **Frontend:** Deployed on Vercel (Static Site)
- **Backend:** Deployed on Render (Node.js Server)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (for images)

## Environment Variables

### Client Environment Variables (Frontend Only)
Set these in your Vercel project dashboard under "Environment Variables":

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://freshoop.onrender.com/api
VITE_PEXELS_API_KEY=your_pexels_api_key
```

**Note:** No server environment variables are needed on Vercel since the backend is hosted on Render.

## Deployment Methods

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the `vercel.json` configuration

3. **Configure Environment Variables:**
   - In the Vercel project settings, go to "Environment Variables"
   - Add all the environment variables listed above
   - Make sure to add them for "Production", "Preview", and "Development" environments

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://your-project-name.vercel.app`

5. **No additional configuration needed:**
   - The API URL is already set to use the Render backend
   - All API requests will be proxied to https://freshoop.onrender.com

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new one
   - Confirm settings
   - Wait for deployment

5. **Set Environment Variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_API_URL
   vercel env add VITE_PEXELS_API_KEY
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

1. **Update Render Backend:**
   - Ensure your Render backend at https://freshoop.onrender.com is running
   - Update the `FRONTEND_URL` environment variable on Render to include your Vercel URL
   - Add CORS configuration for your Vercel domain if needed

2. **Update Supabase Authentication:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication → URL Configuration
   - Add your Vercel URL to "Site URL": `https://your-project-name.vercel.app`
   - Add redirect URLs:
     - `https://your-project-name.vercel.app/**`
     - `https://your-project-name.vercel.app/auth/callback`

3. **Test the Deployment:**
   - Visit your Vercel URL
   - Test user registration and login
   - Test adding items to cart
   - Test the checkout process
   - Verify admin dashboard access
   - Check that API requests are reaching the Render backend

4. **Set up Custom Domain (Optional):**
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Update FRONTEND_URL on Render with your custom domain

## Troubleshooting

### API Requests Failing
- Verify `VITE_API_URL` is set to `https://freshoop.onrender.com/api`
- Check that the Render backend is running and accessible
- Review Render logs for backend errors
- Test the backend directly: `https://freshoop.onrender.com/api/health`

### Authentication Issues
- Verify Supabase environment variables are correct
- Check that redirect URLs are properly configured in Supabase
- Ensure the Render backend has the correct JWT_SECRET

### CORS Errors
- Verify Render backend has your Vercel URL in `FRONTEND_URL`
- Check Render server logs for CORS-related errors
- Ensure CORS is properly configured on the Render backend

### Images Not Loading
- Verify `VITE_PEXELS_API_KEY` is set correctly
- Check browser console for API errors
- Ensure Pexels API key is valid

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Monitoring and Logs

- **Frontend Logs:** Go to your Vercel project → Deployments → Click on a deployment → View Logs
- **Backend Logs:** Check Render dashboard for your service logs at https://dashboard.render.com
- **Build Logs:** Available in the Vercel deployment details

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy every push to the `main` branch to production
- Create preview deployments for pull requests
- Provide unique URLs for each deployment

## Rolling Back

If you need to roll back to a previous deployment:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the deployment you want to restore
3. Click the three dots → "Promote to Production"

## Security Notes

1. Never commit `.env` files to Git
2. Keep your Supabase service key secure (stored only on Render backend)
3. Rotate your `JWT_SECRET` periodically on the Render backend
4. Use Vercel's environment variable encryption for frontend env vars
5. Review and limit CORS origins on the Render backend

## Performance Optimization

1. **Enable Caching:**
   - Vercel automatically caches static assets
   - Configure cache headers in `vercel.json` if needed

2. **Monitor Performance:**
   - Use Vercel Analytics for frontend insights
   - Monitor Render backend performance in Render dashboard
   - Keep Render service active to avoid cold starts

3. **Optimize Build:**
   - Ensure production builds are minified
   - Remove console.logs in production code

## Architecture Benefits

- **Separation of Concerns:** Frontend and backend are independently deployed
- **Scalability:** Vercel handles frontend scaling, Render handles backend scaling
- **Cost-Effective:** No serverless function costs on Vercel
- **Easy Maintenance:** Update backend without redeploying frontend

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Supabase Documentation](https://supabase.com/docs)
