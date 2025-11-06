# Vercel Deployment Guide for Freshoop

This guide will help you deploy both the frontend (React/Vite) and backend (Express) to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for command-line deployment)
3. A GitHub account (for automatic deployments)
4. Your Supabase project URL and keys
5. Your Pexels API key (for image service)

## Environment Variables

### Client Environment Variables (Frontend)
Set these in your Vercel project dashboard under "Environment Variables":

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-project-name.vercel.app/api
VITE_PEXELS_API_KEY=your_pexels_api_key
```

### Server Environment Variables (Backend)
Set these in your Vercel project dashboard under "Environment Variables":

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_secure_jwt_secret_key
PORT=3001
FRONTEND_URL=https://your-project-name.vercel.app
NODE_ENV=production
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

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

5. **Update VITE_API_URL:**
   - After first deployment, update `VITE_API_URL` to point to your Vercel deployment URL
   - Set it to: `https://your-project-name.vercel.app/api`
   - Redeploy for changes to take effect

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
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_KEY
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   vercel env add ADMIN_EMAILS
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

1. **Update CORS Settings:**
   - The server is configured to accept requests from your frontend URL
   - Verify `FRONTEND_URL` environment variable is set correctly

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

4. **Set up Custom Domain (Optional):**
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Update environment variables with your custom domain

## Troubleshooting

### API Requests Failing
- Verify `VITE_API_URL` is set correctly to your Vercel deployment URL
- Check that all server environment variables are set in Vercel dashboard
- Review Vercel function logs for errors

### Authentication Issues
- Verify Supabase environment variables are correct
- Check that redirect URLs are properly configured in Supabase
- Ensure `JWT_SECRET` is the same across deployments

### CORS Errors
- Verify `FRONTEND_URL` environment variable matches your deployment URL
- Check server logs in Vercel for CORS-related errors

### Images Not Loading
- Verify `VITE_PEXELS_API_KEY` is set correctly
- Check browser console for API errors
- Ensure Pexels API key is valid

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Monitoring and Logs

- **View Logs:** Go to your Vercel project → Deployments → Click on a deployment → View Function Logs
- **Runtime Logs:** Check the "Functions" tab for serverless function logs
- **Build Logs:** Available in the deployment details

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
2. Rotate your `JWT_SECRET` periodically
3. Keep your Supabase service key secure
4. Use Vercel's environment variable encryption
5. Review and limit CORS origins in production

## Performance Optimization

1. **Enable Caching:**
   - Vercel automatically caches static assets
   - Configure cache headers in `vercel.json` if needed

2. **Monitor Performance:**
   - Use Vercel Analytics for insights
   - Monitor serverless function execution times

3. **Optimize Build:**
   - Ensure production builds are minified
   - Remove console.logs in production code

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Supabase Documentation](https://supabase.com/docs)
