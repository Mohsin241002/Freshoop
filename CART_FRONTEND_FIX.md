# Cart Frontend Fix Applied ✅

## Changes Made

The frontend code has been updated to work with the new backend cart API. The issue was that the frontend was using the old API endpoints with userId in the URL path, but the new backend uses JWT authentication.

### Files Updated

#### 1. `/client/src/lib/api.js`
**Before**:
```javascript
export const cartApi = {
  get: (userId) => api.get(`/cart/${userId}`),
  addItem: (userId, data) => api.post(`/cart/${userId}/items`, data),
  ...
};
```

**After**:
```javascript
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (cartItemId, data) => api.put(`/cart/items/${cartItemId}`, data),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clear: () => api.delete('/cart'),
};
```

#### 2. `/client/src/contexts/CartContext.jsx`
- Updated all API calls to remove userId parameter
- Updated to use `cart_item_id` instead of `item_id` for update/remove
- Improved error handling with specific error messages
- Fixed cart state initialization with proper structure

#### 3. `/client/src/pages/Cart.jsx`
- Updated to use new response structure (flat item structure)
- Changed from `cartItem.items.name` to `item.name`
- Updated to use `cart_item_id` for update/remove operations

#### 4. `/client/src/components/ItemCard.jsx`
- Improved error handling to show backend error messages

---

## Backend Response Format

The new backend returns this structure:

```json
{
  "success": true,
  "data": {
    "cart_id": "uuid",
    "items": [
      {
        "cart_item_id": "uuid",      // Use this for update/delete
        "item_id": "uuid",            // Original product ID
        "name": "Fresh Apples",
        "description": "...",
        "price": 3.99,
        "image_url": "...",
        "is_available": true,
        "stock_quantity": 150,
        "quantity": 2,                // Quantity in cart
        "subtotal": 7.98              // Calculated
      }
    ],
    "total_items": 1,
    "total_amount": 7.98
  }
}
```

---

## Testing Steps

### 1. Make sure backend is running

```bash
cd server
npm start
```

Backend should be running on `http://localhost:3001`

### 2. Make sure frontend is running

```bash
cd client
npm run dev
```

Frontend should be running on `http://localhost:5173`

### 3. Check browser console

Open DevTools (F12) and check:
- Network tab for API requests
- Console tab for errors

### 4. Test adding to cart

1. Make sure you're logged in
2. Go to home page
3. Try adding an item to cart
4. Check browser console for errors
5. Check Network tab to see the API request

---

## Debugging Checklist

If you still see "failed to add to cart":

### ✅ 1. Check Backend is Running
```bash
# Should return server status
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "...",
  "uptime": 123.45
}
```

### ✅ 2. Check if Logged In
Open browser console and run:
```javascript
console.log(localStorage.getItem('access_token'));
```

Should return a JWT token. If `null`, you need to login.

### ✅ 3. Check API Request in Network Tab
1. Open DevTools → Network tab
2. Try adding item to cart
3. Look for request to `/api/cart/items`
4. Check:
   - Request URL
   - Request Headers (should have Authorization)
   - Request Body
   - Response status
   - Response body

### ✅ 4. Check Backend Logs
Look at your server terminal for error messages when you try to add to cart.

### ✅ 5. Verify Item Exists
```bash
# Get list of items
curl http://localhost:3001/api/items

# Should return items with IDs
```

### ✅ 6. Test Backend Directly
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get an item ID
ITEM_ID=$(curl -s http://localhost:3001/api/items | jq -r '.data[0].id')

echo "Item ID: $ITEM_ID"

# 3. Test add to cart
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"item_id\":\"$ITEM_ID\",\"quantity\":2}" | jq

# Should return success with cart data
```

---

## Common Issues & Solutions

### Issue 1: "No authorization token provided"
**Cause**: Not logged in or token expired  
**Solution**: 
1. Go to `/auth` page
2. Login again
3. Token will be saved in localStorage

### Issue 2: "Item not found"
**Cause**: Invalid item ID  
**Solution**: 
1. Check items exist: `curl http://localhost:3001/api/items`
2. Verify the item ID being sent

### Issue 3: "Insufficient stock"
**Cause**: Not enough stock available  
**Solution**: Check item's `stock_quantity` in database

### Issue 4: CORS errors
**Cause**: Backend not allowing frontend requests  
**Solution**: Backend already configured to allow `http://localhost:5173`

### Issue 5: 404 on `/api/cart/items`
**Cause**: Backend not running or wrong URL  
**Solution**: 
1. Verify backend is running on port 3001
2. Check Vite proxy config in `client/vite.config.js`

---

## Quick Test Script

Save this as `test-cart-frontend.sh`:

```bash
#!/bin/bash

echo "🔍 Testing Cart API Integration"
echo ""

# Check backend
echo "1️⃣ Checking backend..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running. Start it with: cd server && npm start"
    exit 1
fi

# Check if items exist
echo ""
echo "2️⃣ Checking items..."
ITEMS_COUNT=$(curl -s http://localhost:3001/api/items | jq '.data | length')
if [ "$ITEMS_COUNT" -gt 0 ]; then
    echo "✅ Found $ITEMS_COUNT items"
else
    echo "❌ No items found in database"
    exit 1
fi

echo ""
echo "3️⃣ To test cart:"
echo "   a. Make sure frontend is running: cd client && npm run dev"
echo "   b. Open http://localhost:5173"
echo "   c. Login with your account"
echo "   d. Try adding an item to cart"
echo "   e. Check browser console (F12) for any errors"
echo ""
echo "✅ Setup looks good!"
```

Run with:
```bash
chmod +x test-cart-frontend.sh
./test-cart-frontend.sh
```

---

## Browser Console Debugging

Add this to browser console to debug:

```javascript
// Check if logged in
console.log('Token:', localStorage.getItem('access_token'));

// Test API directly from browser
(async () => {
  try {
    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    const data = await response.json();
    console.log('Cart Response:', data);
  } catch (error) {
    console.error('Cart Error:', error);
  }
})();

// Test add to cart
(async () => {
  const itemId = 'YOUR_ITEM_ID_HERE'; // Replace with actual item ID
  try {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item_id: itemId, quantity: 1 })
    });
    const data = await response.json();
    console.log('Add to Cart Response:', data);
  } catch (error) {
    console.error('Add to Cart Error:', error);
  }
})();
```

---

## What to Look For

### Successful Add to Cart

**Network tab should show:**
- Request: `POST /api/cart/items`
- Status: `200 OK`
- Response: `{ "success": true, "message": "...", "data": {...} }`

**Console should show:**
- No errors
- Alert: "Item added to cart!"

### Failed Add to Cart

**Network tab might show:**
- Status: `401` → Not logged in
- Status: `404` → Item not found
- Status: `400` → Validation error (check response for details)
- Status: `500` → Server error (check backend logs)

**Console will show:**
- Error message from backend
- Alert with error details

---

## Still Having Issues?

1. **Clear browser cache and localStorage**
   ```javascript
   localStorage.clear();
   location.reload();
   ```
   Then login again.

2. **Restart both servers**
   ```bash
   # Kill and restart backend
   cd server
   npm start
   
   # Kill and restart frontend
   cd client
   npm run dev
   ```

3. **Check server logs** - Look for error messages in terminal where backend is running

4. **Enable verbose logging** - Add console.logs in `CartContext.jsx`:
   ```javascript
   const addToCart = async (itemId, quantity = 1) => {
     console.log('Adding to cart:', { itemId, quantity, user });
     try {
       console.log('Calling API...');
       const response = await cartApi.addItem({ item_id: itemId, quantity });
       console.log('API Response:', response);
       setCart(response.data.data || response.data);
     } catch (error) {
       console.error('Full error:', error);
       console.error('Error response:', error.response);
       throw new Error(error.response?.data?.error || error.message);
     }
   };
   ```

---

## Summary

✅ Frontend updated to match new backend API  
✅ Authentication now handled by JWT (no userId in URL)  
✅ Error messages now show actual backend errors  
✅ Response structure matches backend format  

**Next Steps:**
1. Restart frontend dev server: `cd client && npm run dev`
2. Make sure backend is running: `cd server && npm start`
3. Login to your account
4. Try adding an item to cart
5. If error persists, check browser console and follow debugging steps above

The code is now correct - if you're still seeing errors, it's likely a runtime issue (not logged in, backend not running, etc.) rather than a code issue.

