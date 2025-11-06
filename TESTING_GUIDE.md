# Complete Testing Guide for Freshoop API

Step-by-step guide to test all endpoints including authentication, categories, items, cart, and orders.

## 📋 Prerequisites

1. **Server Running**: Port 3001
   ```bash
   cd server && npm run dev
   ```

2. **Database**: Supabase with sample data loaded
3. **Admin Email**: Configured in `.env`

## 🧪 Test Sequence

### Phase 1: Public Endpoints (No Auth Required)

#### 1.1 Health Check
```bash
curl http://localhost:3001/health
```

**Expected**: 200 OK with server status

#### 1.2 Get All Categories
```bash
curl http://localhost:3001/api/categories
```

**Expected**: 6 categories (Fruits, Vegetables, Dairy & Eggs, Bakery, Meat & Seafood, Beverages)

#### 1.3 Get Category by ID
```bash
# Use ID from previous response
curl http://localhost:3001/api/categories/CATEGORY_ID
```

**Expected**: Single category object

#### 1.4 Get All Items
```bash
curl http://localhost:3001/api/items
```

**Expected**: 24 grocery items with category details

#### 1.5 Filter Items by Category
```bash
# Get Fruits category ID first, then:
curl "http://localhost:3001/api/items?category_id=FRUITS_CATEGORY_ID"
```

**Expected**: Only fruit items (Apples, Bananas, Oranges, Strawberries, Grapes)

#### 1.6 Search Items
```bash
curl "http://localhost:3001/api/items?search=apple"
```

**Expected**: Items containing "apple" in name

#### 1.7 Get Item by ID
```bash
curl http://localhost:3001/api/items/ITEM_ID
```

**Expected**: Single item with category details

---

### Phase 2: Authentication

#### 2.1 Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123456",
    "fullName": "Test User"
  }'
```

**Expected**: 201 Created with user data and access_token

**Save the token**: Export for next commands
```bash
export TOKEN="paste_access_token_here"
```

#### 2.2 Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123456"
  }'
```

**Expected**: 200 OK with user data and access_token

#### 2.3 Get Current User
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: Current user profile

#### 2.4 Get User Profile
```bash
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: User profile data

#### 2.5 Update Profile
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Updated Name"}'
```

**Expected**: 200 OK with updated profile

---

### Phase 3: Cart Operations (Requires Auth)

#### 3.1 Get Cart
```bash
# Get user ID from auth/me response
export USER_ID="paste_user_id_here"

curl http://localhost:3001/api/cart/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: Empty cart or cart with items

#### 3.2 Add Item to Cart
```bash
# Get item ID from items list
export ITEM_ID="paste_item_id_here"

curl -X POST http://localhost:3001/api/cart/$USER_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "'$ITEM_ID'",
    "quantity": 2
  }'
```

**Expected**: 201 Created with cart item

#### 3.3 Update Cart Item Quantity
```bash
curl -X PUT http://localhost:3001/api/cart/$USER_ID/items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**Expected**: 200 OK with updated cart item

#### 3.4 Remove Item from Cart
```bash
curl -X DELETE http://localhost:3001/api/cart/$USER_ID/items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: 200 OK with success message

#### 3.5 Add Multiple Items
```bash
# Add 3 different items
curl -X POST http://localhost:3001/api/cart/$USER_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "ITEM_ID_1", "quantity": 2}'

curl -X POST http://localhost:3001/api/cart/$USER_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "ITEM_ID_2", "quantity": 1}'

curl -X POST http://localhost:3001/api/cart/$USER_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "ITEM_ID_3", "quantity": 3}'
```

---

### Phase 4: Orders (Requires Auth)

#### 4.1 Create Order from Cart
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "'$USER_ID'"}'
```

**Expected**: 201 Created with order details
- Order number generated
- Cart items converted to order items
- Cart cleared
- Stock quantities updated

#### 4.2 Get User Orders
```bash
curl http://localhost:3001/api/orders/user/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: List of orders with items

#### 4.3 Get Order by ID
```bash
export ORDER_ID="paste_order_id_here"

curl http://localhost:3001/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: Order details with items

#### 4.4 Update Order Status
```bash
curl -X PUT http://localhost:3001/api/orders/$ORDER_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

**Expected**: 200 OK with updated order

---

### Phase 5: Admin Operations

#### 5.1 Setup Admin User

First, add your email to `.env`:
```env
ADMIN_EMAILS=admin@freshoop.com
```

Restart server, then register/login with admin email:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@freshoop.com",
    "password": "admin123456",
    "fullName": "Admin User"
  }'
```

Save admin token:
```bash
export ADMIN_TOKEN="paste_admin_token_here"
```

#### 5.2 Create Category
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frozen Foods",
    "display_order": 7
  }'
```

**Expected**: 201 Created with new category

#### 5.3 Update Category
```bash
export CATEGORY_ID="paste_new_category_id_here"

curl -X PUT http://localhost:3001/api/categories/$CATEGORY_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frozen & Refrigerated",
    "display_order": 8
  }'
```

**Expected**: 200 OK with updated category

#### 5.4 Create Item (Text Only)
```bash
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frozen Pizza",
    "description": "Delicious frozen pizza",
    "category_id": "'$CATEGORY_ID'",
    "price": 8.99,
    "stock_quantity": 50,
    "is_available": true
  }'
```

**Expected**: 201 Created with new item (no image)

#### 5.5 Create Item with Image
```bash
# Create a test image file first or use an existing one
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Ice Cream" \
  -F "description=Premium vanilla ice cream" \
  -F "category_id=$CATEGORY_ID" \
  -F "price=6.99" \
  -F "stock_quantity=75" \
  -F "is_available=true" \
  -F "image=@/path/to/image.jpg"
```

**Expected**: 201 Created with item including image_url

#### 5.6 Update Item
```bash
export ITEM_ID="paste_item_id_here"

curl -X PUT http://localhost:3001/api/items/$ITEM_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Premium Ice Cream" \
  -F "price=7.99" \
  -F "stock_quantity=100"
```

**Expected**: 200 OK with updated item

#### 5.7 Update Stock Only
```bash
curl -X PATCH http://localhost:3001/api/items/$ITEM_ID/stock \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stock_quantity": 150}'
```

**Expected**: 200 OK with updated stock

#### 5.8 Delete Item
```bash
curl -X DELETE http://localhost:3001/api/items/$ITEM_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected**: 200 OK, item and image deleted

#### 5.9 Try to Delete Category with Items
```bash
# Try to delete a category that has items
curl -X DELETE http://localhost:3001/api/categories/FRUITS_CATEGORY_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected**: 400 Bad Request (cannot delete category with items)

#### 5.10 Delete Empty Category
```bash
curl -X DELETE http://localhost:3001/api/categories/$CATEGORY_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected**: 200 OK if category has no items

---

### Phase 6: Security Tests

#### 6.1 Try Admin Action Without Token
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
```

**Expected**: 401 Unauthorized

#### 6.2 Try Admin Action as Regular User
```bash
# Use regular user token (not admin)
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
```

**Expected**: 403 Forbidden

#### 6.3 Try Invalid Image Type
```bash
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Test" \
  -F "category_id=$CATEGORY_ID" \
  -F "price=9.99" \
  -F "image=@/path/to/document.pdf"
```

**Expected**: 400 Bad Request (invalid file type)

---

## 📊 Expected Results Summary

### Successful Tests
- ✅ All public endpoints accessible without auth
- ✅ User registration and login working
- ✅ Cart operations for authenticated users
- ✅ Order creation and retrieval
- ✅ Admin can manage categories and items
- ✅ Image upload and deletion working
- ✅ Stock updates functional

### Security Tests
- ✅ Admin endpoints reject non-admin users
- ✅ Protected endpoints require authentication
- ✅ Invalid file types rejected
- ✅ Category deletion prevented if has items

## 🔍 Debugging Tips

### Server Not Responding
```bash
# Check if server is running
lsof -i :3001

# Check logs
tail -f /tmp/freshoop-server.log

# Restart server
cd server && npm run dev
```

### Token Issues
```bash
# Decode JWT token (optional)
echo "TOKEN_HERE" | cut -d'.' -f2 | base64 -d | python3 -m json.tool

# Re-login to get fresh token
```

### Database Issues
```bash
# Check Supabase connection in server logs
# Verify .env has correct credentials
```

## 📱 Testing with Frontend

1. Start frontend:
   ```bash
   cd client && npm run dev
   ```

2. Open: http://localhost:5173

3. Test flow:
   - Sign up / Sign in
   - Browse items
   - Add to cart
   - Place order
   - View orders

## 🎯 Complete Test Checklist

### Public Endpoints
- [ ] Health check returns 200
- [ ] Get all categories (6 items)
- [ ] Get category by ID
- [ ] Get all items (24 items)
- [ ] Filter items by category
- [ ] Search items by name
- [ ] Get item by ID

### Authentication
- [ ] Register new user
- [ ] Login existing user
- [ ] Get current user info
- [ ] Update user profile
- [ ] Logout user

### Cart (Auth Required)
- [ ] Get empty cart
- [ ] Add item to cart
- [ ] Update cart item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart

### Orders (Auth Required)
- [ ] Create order from cart
- [ ] Get user orders
- [ ] Get order by ID
- [ ] Update order status

### Admin - Categories
- [ ] Create category
- [ ] Update category
- [ ] Delete empty category
- [ ] Prevent delete category with items

### Admin - Items
- [ ] Create item without image
- [ ] Create item with image
- [ ] Update item
- [ ] Update item with new image
- [ ] Update stock quantity
- [ ] Delete item

### Security
- [ ] Non-admin blocked from admin endpoints
- [ ] Invalid token rejected
- [ ] Missing token rejected
- [ ] Invalid image type rejected

---

**Total Tests**: 35+  
**Estimated Time**: 30-45 minutes

**Status**: Ready for Testing ✅


