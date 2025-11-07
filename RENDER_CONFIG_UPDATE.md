# Render Configuration Update

## Your Render Services
- **Frontend**: https://freshoop-1.onrender.com
- **Backend**: https://freshoop.onrender.com

## ✅ Files Updated
1. `render.yaml` - Updated with correct URLs
2. `client/.env.production` - Already correctly configured

## 🚀 Action Required on Render Dashboard

### Backend Service (https://freshoop.onrender.com)

1. Go to: https://dashboard.render.com/web/srv-XXXXX (your backend service)
2. Click **Environment** in the left sidebar
3. **Add/Update** this environment variable:
   ```
   FRONTEND_URL=https://freshoop-1.onrender.com
   ```
4. Click **Save Changes**
5. Service will automatically redeploy

### Frontend Service (https://freshoop-1.onrender.com)

1. Go to: https://dashboard.render.com/static/srv-XXXXX (your frontend service)
2. Click **Environment** in the left sidebar
3. **Verify** these environment variables are set:
   ```
   VITE_API_URL=https://freshoop.onrender.com/api
   VITE_SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-key>
   VITE_PEXELS_API_KEY=<your-key>
   ```
4. If `VITE_API_URL` is wrong, update it to: `https://freshoop.onrender.com/api`
5. Click **Save Changes** and **Manual Deploy** → **Clear build cache & deploy**

## 🧪 Testing After Update

### 1. Test Backend Health
```bash
curl https://freshoop.onrender.com/api/health
```
Expected: `{"status":"ok","message":"Server is running"}`

### 2. Test CORS
```bash
curl -H "Origin: https://freshoop-1.onrender.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://freshoop.onrender.com/api/health -v
```
Expected: Should see `Access-Control-Allow-Origin: https://freshoop-1.onrender.com` in response headers

### 3. Test Frontend
Open https://freshoop-1.onrender.com in browser and check:
- Network tab for API calls
- Console for any CORS errors
- Try logging in or browsing products

## 🔧 Current Configuration Summary

### Backend CORS
```javascript
allowedOrigins = [
  'https://freshoop-1.onrender.com',  // from FRONTEND_URL env var
  /https:\/\/.*\.onrender\.com$/       // regex pattern (allows all Render domains)
]
```

### Frontend API Endpoint
```javascript
VITE_API_URL=https://freshoop.onrender.com/api
```

All API calls from frontend will go to: `https://freshoop.onrender.com/api/*`

## ✅ Checklist

- [ ] Update `FRONTEND_URL` on backend service
- [ ] Verify `VITE_API_URL` on frontend service
- [ ] Redeploy backend (automatic after env change)
- [ ] Redeploy frontend (manual with cache clear)
- [ ] Test backend health endpoint
- [ ] Test CORS with curl command
- [ ] Test frontend in browser
- [ ] Verify no CORS errors in browser console
- [ ] Test login functionality
- [ ] Test API calls (categories, items, cart, orders)

## 🐛 Troubleshooting

### If CORS errors persist:
1. Check backend logs for "CORS blocked origin" messages
2. Verify `FRONTEND_URL` is exactly: `https://freshoop-1.onrender.com` (no trailing slash)
3. Check browser Network tab → Response Headers for `Access-Control-Allow-Origin`

### If API calls fail:
1. Check browser Console for error messages
2. Verify `VITE_API_URL` in frontend build (check `window.` variables)
3. Test backend directly with curl
4. Check Render logs for both services

### If frontend shows blank page:
1. Check browser Console for errors
2. Verify frontend build completed successfully
3. Check Render static site logs
4. Verify all environment variables are set

## 📝 Notes

- Render free tier services spin down after inactivity
- First request may take 30-60 seconds to wake up
- CORS configuration allows all `*.onrender.com` domains as backup
- Both services must be running for the app to work
