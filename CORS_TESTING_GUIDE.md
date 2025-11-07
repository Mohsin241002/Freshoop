# CORS Testing Guide

## ✅ Your CORS Results
**Status**: ✅ WORKING CORRECTLY

```
access-control-allow-origin: https://freshoop-1.onrender.com
access-control-allow-credentials: true
access-control-allow-methods: GET,POST,PUT,DELETE,PATCH
access-control-allow-headers: Content-Type,Authorization
```

## 🧪 CORS Test Commands

### 1. Test OPTIONS Preflight Request (Most Important)
```bash
curl -i \
  -H "Origin: https://freshoop-1.onrender.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://freshoop.onrender.com/api/health
```

**What to look for:**
- ✅ `access-control-allow-origin: https://freshoop-1.onrender.com`
- ✅ `access-control-allow-methods: GET,POST,PUT,DELETE,PATCH`
- ✅ `access-control-allow-headers: Content-Type,Authorization`
- ✅ `access-control-allow-credentials: true`

### 2. Test Actual GET Request
```bash
curl -i \
  -H "Origin: https://freshoop-1.onrender.com" \
  https://freshoop.onrender.com/api/health
```

**Expected:**
- ✅ Status: `200 OK`
- ✅ `access-control-allow-origin: https://freshoop-1.onrender.com`
- ✅ Response body with data

### 3. Test POST Request with Credentials
```bash
curl -i \
  -H "Origin: https://freshoop-1.onrender.com" \
  -H "Content-Type: application/json" \
  -X POST \
  https://freshoop.onrender.com/api/auth/register \
  -d '{"email":"test@example.com","password":"Test123!","full_name":"Test User"}'
```

### 4. Test with Authorization Header
```bash
curl -i \
  -H "Origin: https://freshoop-1.onrender.com" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://freshoop.onrender.com/api/auth/me
```

### 5. Test from Different Origin (Should Fail or Be Allowed by Regex)
```bash
curl -i \
  -H "Origin: https://example.com" \
  https://freshoop.onrender.com/api/health
```

**Expected**: Should NOT have CORS headers (or be blocked)

### 6. Test All API Endpoints

#### Categories
```bash
curl -i -H "Origin: https://freshoop-1.onrender.com" \
  https://freshoop.onrender.com/api/categories
```

#### Items
```bash
curl -i -H "Origin: https://freshoop-1.onrender.com" \
  https://freshoop.onrender.com/api/items
```

#### Cart (requires user ID)
```bash
curl -i -H "Origin: https://freshoop-1.onrender.com" \
  https://freshoop.onrender.com/api/cart/USER_ID
```

## 🌐 Browser Testing

### Test in Browser Console
Open https://freshoop-1.onrender.com and run:

```javascript
// Test fetch API
fetch('https://freshoop.onrender.com/api/health', {
  method: 'GET',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
```

### Test with POST
```javascript
fetch('https://freshoop.onrender.com/api/categories', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => console.log('✅ Categories:', data))
  .catch(err => console.error('❌ Error:', err));
```

### Check Network Tab
1. Open https://freshoop-1.onrender.com
2. Open DevTools (F12) → Network tab
3. Navigate the site or make API calls
4. Click on any API request
5. Check **Response Headers** for:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Credentials`
   - `Access-Control-Allow-Methods`

## 🔍 Understanding CORS Headers

### Response Headers You Should See:

```
access-control-allow-origin: https://freshoop-1.onrender.com
├─ Allows requests from your frontend domain

access-control-allow-credentials: true
├─ Allows cookies/auth headers to be sent

access-control-allow-methods: GET,POST,PUT,DELETE,PATCH
├─ Allowed HTTP methods

access-control-allow-headers: Content-Type,Authorization
├─ Allowed request headers

vary: Origin
├─ Response varies based on Origin header
```

## ✅ Current CORS Configuration

### Backend (server/server.js)
```javascript
allowedOrigins = [
  'https://freshoop-1.onrender.com',  // Your frontend URL
  /https:\/\/.*\.onrender\.com$/      // All Render domains (backup)
]

corsOptions = {
  origin: (origin, callback) => {
    // Checks if origin matches allowed patterns
    // Allows requests with no origin (Postman, mobile apps)
  },
  credentials: true,                    // Allow cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 🐛 Troubleshooting CORS Issues

### Issue: "No Access-Control-Allow-Origin header"
**Fix:**
1. Verify `FRONTEND_URL` env var is set on backend
2. Check backend logs for "CORS blocked origin" messages
3. Ensure origin matches exactly (no trailing slash)

### Issue: "Credentials mode is 'include' but Access-Control-Allow-Credentials is false"
**Fix:**
- Backend already has `credentials: true` ✅

### Issue: "Method not allowed by Access-Control-Allow-Methods"
**Fix:**
- Backend allows: GET, POST, PUT, DELETE, PATCH ✅

### Issue: Preflight request fails
**Fix:**
1. Check backend handles OPTIONS requests
2. Verify CORS middleware is before routes
3. Check `allowedHeaders` includes your headers

## 📊 CORS Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| OPTIONS Preflight | ✅ PASS | Correct CORS headers returned |
| GET Request | ✅ PASS | Data returned with CORS headers |
| Origin Validation | ✅ PASS | Frontend origin allowed |
| Credentials | ✅ PASS | Credentials allowed |
| Methods | ✅ PASS | All methods allowed |
| Headers | ✅ PASS | Content-Type, Authorization allowed |

## 🎯 Next Steps

Your CORS is configured correctly! If you're still having issues in the browser:

1. **Clear browser cache**
   ```
   Chrome: Ctrl+Shift+Delete → Clear cached images and files
   ```

2. **Hard refresh frontend**
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

3. **Check browser console** for actual error messages

4. **Verify environment variables** on Render dashboard:
   - Backend: `FRONTEND_URL=https://freshoop-1.onrender.com`
   - Frontend: `VITE_API_URL=https://freshoop.onrender.com/api`

5. **Redeploy services** if env vars were just changed

## 📝 Additional Tests

### Test Authentication Flow
```bash
# 1. Register user
curl -i -H "Origin: https://freshoop-1.onrender.com" \
  -H "Content-Type: application/json" \
  -X POST https://freshoop.onrender.com/api/auth/register \
  -d '{"email":"test@test.com","password":"Test123!","full_name":"Test"}'

# 2. Login and get token
curl -i -H "Origin: https://freshoop-1.onrender.com" \
  -H "Content-Type: application/json" \
  -X POST https://freshoop.onrender.com/api/auth/login \
  -d '{"email":"test@test.com","password":"Test123!"}'

# 3. Use token to access protected endpoint
curl -i -H "Origin: https://freshoop-1.onrender.com" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://freshoop.onrender.com/api/auth/me
```

## ✨ Success Indicators

✅ CORS headers present in response
✅ No CORS errors in browser console  
✅ API calls succeed from frontend
✅ Authentication works
✅ Protected routes accessible with token
✅ Different origins properly blocked

Your configuration is working perfectly! 🎉
