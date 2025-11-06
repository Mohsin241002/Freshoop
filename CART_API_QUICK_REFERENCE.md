# Cart API Quick Reference

One-page reference for all cart endpoints.

## 🔗 Base URL
```
http://localhost:3001/api/cart
```

## 🔑 Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items/:cartItemId` | Update quantity |
| DELETE | `/api/cart/items/:cartItemId` | Remove item |
| DELETE | `/api/cart` | Clear cart |

---

## 1️⃣ Get Cart

**Request**:
```bash
GET /api/cart
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "cart_id": "uuid",
    "items": [
      {
        "cart_item_id": "uuid",
        "item_id": "uuid",
        "name": "Fresh Apples",
        "price": 3.99,
        "quantity": 3,
        "subtotal": 11.97,
        "stock_quantity": 150,
        "is_available": true
      }
    ],
    "total_items": 1,
    "total_amount": 11.97
  }
}
```

---

## 2️⃣ Add Item to Cart

**Request**:
```bash
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "item_id": "uuid",
  "quantity": 2
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Fresh Apples added to cart",
  "data": { /* full cart */ }
}
```

**Errors**:
- `400` - "item_id is required"
- `400` - "Quantity must be at least 1"
- `404` - "Item not found"
- `400` - "Fresh Apples is currently unavailable"
- `400` - "Insufficient stock. Only 5 available"

---

## 3️⃣ Update Cart Item Quantity

**Request**:
```bash
PUT /api/cart/items/:cartItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": { /* full cart */ }
}
```

**Notes**:
- Set `quantity: 0` to remove item
- Validates stock before updating

**Errors**:
- `404` - "Cart item not found"
- `400` - "Insufficient stock"

---

## 4️⃣ Remove Item from Cart

**Request**:
```bash
DELETE /api/cart/items/:cartItemId
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": { /* updated cart */ }
}
```

**Errors**:
- `404` - "Cart item not found"

---

## 5️⃣ Clear Entire Cart

**Request**:
```bash
DELETE /api/cart
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart_id": "uuid",
    "items": [],
    "total_items": 0,
    "total_amount": 0
  }
}
```

---

## 🔴 Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Error Codes
- `400` - Bad Request (validation, stock issues)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (item/cart_item not found)
- `500` - Internal Server Error

---

## 🧪 Quick Test Script

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}' \
  | jq -r '.token')

# 2. Get items
ITEM_ID=$(curl -s http://localhost:3001/api/items \
  | jq -r '.data[0].id')

# 3. Get cart
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer $TOKEN"

# 4. Add item
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"item_id\":\"$ITEM_ID\",\"quantity\":2}"

# 5. Get cart again
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📦 Request Body Fields

### Add Item (POST /api/cart/items)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| item_id | UUID | ✅ Yes | Item to add |
| quantity | Integer | ✅ Yes | Amount (≥ 1) |

### Update Quantity (PUT /api/cart/items/:id)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quantity | Integer | ✅ Yes | New amount (≥ 0) |

---

## 🎯 Common Operations

### Check if cart is empty
```javascript
if (cart.total_items === 0) {
  console.log('Cart is empty');
}
```

### Add multiple items
```javascript
for (const item of items) {
  await api.post('/cart/items', {
    item_id: item.id,
    quantity: item.quantity
  });
}
```

### Get cart total
```javascript
const { total_amount } = cart;
console.log(`Total: $${total_amount.toFixed(2)}`);
```

### Remove all items
```javascript
await api.delete('/cart');
```

---

## 💡 Tips

1. **cart_item_id vs item_id**
   - Use `cart_item_id` for update/delete operations
   - Use `item_id` when adding new items

2. **Auto Cart Creation**
   - Don't need to create cart manually
   - First operation creates it automatically

3. **Stock Validation**
   - Always done server-side
   - Can't bypass with client code

4. **Quantity = 0**
   - In UPDATE, removes item from cart
   - In ADD, returns error

5. **Cart Persistence**
   - Cart survives logout
   - Same cart across devices

---

## 🔄 Typical Flow

```
1. User visits site
   └─→ GET /api/cart (auto-creates if needed)

2. User browses items
   └─→ GET /api/items

3. User adds item
   └─→ POST /api/cart/items

4. User updates quantity
   └─→ PUT /api/cart/items/:id

5. User removes item
   └─→ DELETE /api/cart/items/:id

6. User checks out
   └─→ POST /api/orders (not cart endpoint)
   └─→ DELETE /api/cart (after order created)
```

---

## 📱 Frontend Integration

### React Example

```javascript
// Get cart
const fetchCart = async () => {
  const response = await api.get('/cart');
  setCart(response.data);
};

// Add item
const addToCart = async (itemId, quantity) => {
  const response = await api.post('/cart/items', {
    item_id: itemId,
    quantity: quantity
  });
  
  if (response.success) {
    setCart(response.data);
    toast.success(response.message);
  } else {
    toast.error(response.error);
  }
};

// Update quantity
const updateQuantity = async (cartItemId, quantity) => {
  const response = await api.put(`/cart/items/${cartItemId}`, {
    quantity: quantity
  });
  
  if (response.success) {
    setCart(response.data);
  }
};

// Remove item
const removeItem = async (cartItemId) => {
  const response = await api.delete(`/cart/items/${cartItemId}`);
  
  if (response.success) {
    setCart(response.data);
  }
};
```

---

## 🎨 Display Cart

```javascript
// Show cart items
cart.items.map(item => (
  <div key={item.cart_item_id}>
    <h3>{item.name}</h3>
    <p>Price: ${item.price}</p>
    <p>Quantity: {item.quantity}</p>
    <p>Subtotal: ${item.subtotal}</p>
    
    <button onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}>
      +
    </button>
    
    <button onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}>
      -
    </button>
    
    <button onClick={() => removeItem(item.cart_item_id)}>
      Remove
    </button>
  </div>
));

// Show total
<div>
  <strong>Total: ${cart.total_amount.toFixed(2)}</strong>
</div>
```

---

## ✅ Validation Rules

| Operation | Validation |
|-----------|------------|
| Add Item | Item exists, available, stock sufficient |
| Update | Stock sufficient, cart item belongs to user |
| Remove | Cart item exists and belongs to user |
| All | JWT token valid, user authenticated |

---

## 📚 More Information

- Full API Docs: `CART_API_DOCUMENTATION.md`
- Testing Guide: `CART_API_TESTING.md`
- Implementation: `CART_IMPLEMENTATION_SUMMARY.md`

---

**Quick Reference Version 1.0** - Updated: 2024

