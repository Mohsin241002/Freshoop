# Fix: Items Not Showing in Shop

## 🔴 The Problem

Items are stuck on "Loading..." (spinner) and never display on the home page.

---

## ✅ **Quick Fix - Restart Frontend**

The frontend needs to be restarted to pick up the API changes:

### **Step 1: Stop Frontend**
```bash
# Go to the terminal running frontend (where you see Vite dev server)
# Press: Ctrl + C
```

### **Step 2: Restart Frontend**
```bash
cd client
npm run dev
```

### **Step 3: Hard Refresh Browser**
```bash
# In your browser:
# Press: Cmd + Shift + R (Mac)
# Or: Ctrl + Shift + R (Windows/Linux)
```

### **Step 4: Check Items Load**
1. Go to: http://localhost:5173
2. Items should now display!

---

## 🔍 **If Still Not Working**

### **Check 1: Backend is Running**
```bash
curl http://localhost:3001/api/items
```

**Expected:** Should return JSON with 24 items

**If error:** Restart backend:
```bash
cd server
pkill -f "node.*server"
npm start
```

### **Check 2: Frontend is Running**
```bash
curl http://localhost:5173
```

**Expected:** Should return HTML

**If error:** Frontend not running. Start it:
```bash
cd client
npm run dev
```

### **Check 3: Browser Console**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for errors

**Common errors:**
- ❌ "Failed to fetch" → Backend not running
- ❌ "Network Error" → CORS issue
- ❌ "Session check error" → Ignore this (it's harmless)

### **Check 4: Network Tab**
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for `/api/items` request

**What to check:**
- ✅ Status should be **200 OK** or **304 Not Modified**
- ✅ Response should show items array
- ❌ If **failed** or **pending** → Backend issue

---

## 🎯 **Root Cause**

The async interceptor in `client/src/lib/api.js` was updated to properly handle Supabase sessions. Frontend needs restart to pick up these changes.

---

## 📋 **Complete Restart Procedure**

If you want to restart everything cleanly:

### **1. Stop Everything**
```bash
# Terminal 1 (Backend):
Ctrl + C

# Terminal 2 (Frontend):
Ctrl + C
```

### **2. Kill Any Stray Processes**
```bash
# Kill backend
pkill -f "node.*server"

# Kill frontend (if needed)
pkill -f "vite"
```

### **3. Start Backend**
```bash
cd /Users/mohsin/Freshoop/server
npm start
```

**Wait for:**
```
✓ Server running on port 3001
✓ Supabase client initialized successfully
```

### **4. Start Frontend** (in new terminal)
```bash
cd /Users/mohsin/Freshoop/client
npm run dev
```

**Wait for:**
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

### **5. Open Browser**
```bash
# Open: http://localhost:5173
# Hard refresh: Cmd + Shift + R
```

---

## ✅ **Expected Result**

You should see:
- ✅ Categories showing (All, Fruits, Vegetables, etc.)
- ✅ **24 items displayed** in a grid
- ✅ Each item showing name, price, and "Add to Cart" button
- ✅ No loading spinner

---

## 🧪 **Test Items API Directly**

I created a test file: `test-frontend-items.html`

Open it in browser to verify API works:
```bash
open test-frontend-items.html
```

Should show: **"Success! Found 24 items"**

---

## 🐛 **Debug Mode**

If items still not showing, add this to browser console (F12):

```javascript
// Test items fetch directly
fetch('/api/items')
  .then(res => res.json())
  .then(data => {
    console.log('Items count:', data.count);
    console.log('First item:', data.data[0]);
  })
  .catch(err => console.error('Error:', err));
```

**Expected output:**
```javascript
Items count: 24
First item: {id: "...", name: "Fresh Apples", price: 3.99, ...}
```

---

## 📊 **What Was Fixed**

### **Before (Broken):**
- Async interceptor could hang on session check
- No error handling in interceptor
- Items stuck loading forever

### **After (Fixed):**
- Try-catch around session check
- Continues without token if session fails
- Proper error handling

### **Code Change in `client/src/lib/api.js`:**
```javascript
// Before:
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// After:
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Session check error:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
```

---

## 🎬 **Quick Action Checklist**

- [ ] Stop frontend (Ctrl+C)
- [ ] Restart frontend (`cd client && npm run dev`)
- [ ] Hard refresh browser (Cmd+Shift+R)
- [ ] Verify items show on home page
- [ ] Try adding item to cart (after fixing cart RLS issue)

---

## 💡 **Pro Tip**

After making changes to:
- `src/lib/api.js`
- `src/contexts/*.jsx`
- Any other JavaScript files

**Always restart the dev server** or use hot-reload (which usually happens automatically with Vite, but not always for certain files).

---

## 🆘 **Still Having Issues?**

1. **Check server logs:**
   ```bash
   cd server
   tail -f server.log
   ```
   Should see: `GET /api/items 200` or `304`

2. **Check frontend terminal:**
   Look for any error messages

3. **Clear browser cache:**
   ```bash
   # In browser:
   Cmd + Shift + Delete (Mac)
   Ctrl + Shift + Delete (Windows)
   # Clear "Cached images and files"
   ```

4. **Try incognito/private window:**
   Opens fresh session without cache

---

## ✅ **Summary**

**Problem:** Items not loading due to API interceptor changes not picked up

**Solution:** Restart frontend dev server

**Command:**
```bash
cd client
# Ctrl+C to stop, then:
npm run dev
```

**Result:** Items should load and display! 🎉

---

Let me know if items show up after restarting! 🚀

