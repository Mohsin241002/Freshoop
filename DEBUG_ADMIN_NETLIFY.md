# 🔍 Debugging Admin Update Issues on Netlify

## Problem
Admin delete works, but create/update operations fail on the deployed site.

## Most Likely Causes

### 1. **Missing Environment Variables** (Most Common)
The serverless function needs environment variables to connect to Supabase.

**How to Fix:**
1. Go to your Netlify dashboard
2. Navigate to: **Site settings → Environment variables**
3. Verify ALL these variables are set:

```
SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_jwt_secret_change_in_production
NODE_ENV=production
ADMIN_EMAILS=chunawala241@gmail.com
```

4. After adding variables, click **"Trigger deploy"** → **"Deploy site"**

### 2. **Check Browser Console for Errors**
1. Open your deployed site
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Try to update an item
5. Look for error messages

**Common errors:**
- `401 Unauthorized` → Authentication issue (JWT_SECRET missing or wrong)
- `500 Internal Server Error` → Supabase connection issue (env variables missing)
- `403 Forbidden` → Admin permission issue (ADMIN_EMAILS not set)
- `CORS error` → Already handled in code, unlikely

### 3. **Check Network Tab**
1. Open DevTools → **Network** tab
2. Try to update an item
3. Find the failed request (usually red)
4. Click on it to see:
   - Request URL
   - Request Headers
   - Response

**What to check:**
- Is the URL correct? (should be `/api/items/{id}`)
- Is the method correct? (should be `PUT`)
- What's the response status code?
- What's the response body? (may contain error message)

### 4. **Check Netlify Function Logs**
1. Go to Netlify dashboard
2. Click on **Functions** in the left sidebar
3. Click on the **api** function
4. Click **View logs**
5. Try to update an item
6. Check the logs for errors

**Look for:**
- Connection errors to Supabase
- Authentication errors
- Validation errors
- Missing environment variables warnings

### 5. **Verify Admin Access**
Make sure your email is in the ADMIN_EMAILS environment variable:

```bash
ADMIN_EMAILS=chunawala241@gmail.com
```

If you have multiple admins, separate with commas:
```bash
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## Quick Diagnosis Steps

### Step 1: Test Health Endpoint
Open this URL in your browser:
```
https://your-site.netlify.app/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

If this fails → API isn't deployed properly

### Step 2: Test Authentication
1. Login to your site
2. Open DevTools → Console
3. Check if you see your auth token in localStorage
4. Or check Network tab for Authorization header

### Step 3: Test a Simple Update
Try updating just one field at a time to isolate the issue:
- Update stock quantity only
- Update availability toggle only
- Update name only

## Common Solutions

### Solution 1: Redeploy with Environment Variables
```bash
# In Netlify dashboard:
1. Set all environment variables
2. Click "Trigger deploy" → "Clear cache and deploy site"
```

### Solution 2: Check Supabase RLS Policies
The issue might be Row Level Security in Supabase:

1. Go to Supabase Dashboard
2. Navigate to **Authentication → Policies**
3. Check the `items` table policies
4. Ensure admin users can UPDATE items

### Solution 3: Verify JWT Secret
The JWT_SECRET on Netlify must match what you use locally:

1. Check your local `.env` file
2. Copy the exact JWT_SECRET value
3. Set it in Netlify environment variables
4. Redeploy

## Testing Locally vs Production

### Local Test (Should Work):
```bash
cd /Users/mohsin/Freshoop
cd server && npm run dev     # Terminal 1
cd client && npm run dev     # Terminal 2
```

Visit: http://localhost:5173
Try updating items → Should work

### Production Test:
Visit: https://your-site.netlify.app
Try updating items → Currently fails

**If local works but production doesn't** → It's definitely an environment variable issue!

## Debug Script to Add

You can temporarily add console.logs to check what's happening:

1. Check if the API is being called
2. Check what error is returned
3. Check the request payload

Open your browser console and run:
```javascript
// Check if API URL is correct
console.log('API URL:', import.meta.env.VITE_API_URL);

// Check if user is authenticated
console.log('Is authenticated:', !!localStorage.getItem('sb-wxpdzyfueemvrzsgeyah-auth-token'));
```

## Need More Help?

If none of this works:
1. Share the exact error message from browser console
2. Share the Network tab response
3. Share the Netlify function logs

The issue is almost certainly missing/incorrect environment variables! ✅
