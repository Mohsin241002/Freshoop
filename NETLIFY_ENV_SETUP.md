# Netlify Environment Variables Setup

## Required Environment Variables

Your Freshoop app needs these environment variables set in Netlify:

### Frontend Variables (Client)
Go to: **Netlify Dashboard > Site Settings > Environment Variables**

Add these variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=/api
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

### Backend Variables (Functions)
These are also set in the same place:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_here
```

## How to Set Variables in Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Select your **Freshoop** site
3. Go to **Site Settings** (in the top navigation)
4. Click **Environment Variables** in the left sidebar
5. Click **Add a variable**
6. For each variable:
   - Enter the **Key** (e.g., `VITE_SUPABASE_URL`)
   - Enter the **Value**
   - Select **All scopes** (or just Production if you prefer)
   - Click **Create variable**

## Getting Your Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** → Use as `VITE_SUPABASE_ANON_KEY`
   - **service_role** → Use as `SUPABASE_SERVICE_KEY` (⚠️ Keep this secret!)

## After Setting Variables

1. Go to **Deploys** in Netlify
2. Click **Trigger deploy** > **Deploy site**
3. Wait for the build to complete
4. Your site should now work properly!

## Current Issue

The blank screen you're seeing is because the app is trying to initialize Supabase without the required environment variables. Once you add them and redeploy, the app will load correctly.
