# Shopping Cart API Documentation

Complete documentation for the shopping cart functionality.

## Overview

The cart API provides endpoints for managing a user's shopping cart with full stock validation, persistence across devices, and automatic synchronization. All endpoints require authentication.

## Base URL

```
http://localhost:3001/api/cart
```

## Authentication

All cart endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The user is identified from the JWT token, ensuring users can only access their own cart.

---

## Endpoints

### 1. Get User's Cart

Retrieve the authenticated user's cart with all items and calculated total.

**Endpoint**: `GET /api/cart`

**Headers**:
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response** (200):
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
        "description": "Crisp and sweet red apples",
        "price": 3.99,
        "image_url": "https://...",
        "is_available": true,
        "stock_quantity": 150,
        "quantity": 3,
        "subtotal": 11.97
      }
    ],
    "total_items": 1,
    "total_amount": 11.97
  }
}
```

**Notes**:
- If the user doesn't have a cart, one is automatically created
- Returns empty cart if no items have been added
- Items are sorted by creation date (newest first)
- `subtotal` = `price × quantity` for each item
- `total_amount` is the sum of all subtotals

**Error Response** (401):
```json
{
  "success": false,
  "error": "No authorization token provided"
}
```

---

### 2. Add Item to Cart

Add an item to the cart or increase quantity if it already exists.

**Endpoint**: `POST /api/cart/items`

**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "item_id": "uuid",
  "quantity": 2
}
```

**Validation**:
- `item_id` (required): Must be a valid item UUID
- `quantity` (required): Must be an integer ≥ 1

**Success Response** (200):
```json
{
  "success": true,
  "message": "Fresh Apples added to cart",
  "data": {
    "cart_id": "uuid",
    "items": [...],
    "total_items": 2,
    "total_amount": 23.97
  }
}
```

**Error Responses**:

**400 - Missing/Invalid Data**:
```json
{
  "success": false,
  "error": "item_id is required"
}
```

**404 - Item Not Found**:
```json
{
  "success": false,
  "error": "Item not found"
}
```

**400 - Item Unavailable**:
```json
{
  "success": false,
  "error": "Fresh Apples is currently unavailable"
}
```

**400 - Insufficient Stock**:
```json
{
  "success": false,
  "error": "Insufficient stock. Only 150 Fresh Apples(s) available"
}
```

**400 - Cannot Add More (Item Already in Cart)**:
```json
{
  "success": false,
  "error": "Cannot add 5 more. Only 3 more Fresh Apples(s) available"
}
```

**Business Logic**:
1. Validates item exists in database
2. Checks if item is marked as available
3. Verifies sufficient stock quantity
4. If item already in cart:
   - Increases existing quantity
   - Validates total quantity doesn't exceed stock
5. If item not in cart:
   - Creates new cart_item entry
6. Returns updated cart with new totals

---

### 3. Update Cart Item Quantity

Update the quantity of a specific item in the cart.

**Endpoint**: `PUT /api/cart/items/:cartItemId`

**URL Parameters**:
- `cartItemId`: The UUID of the cart_item (not the item itself)

**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "quantity": 5
}
```

**Validation**:
- `quantity` (required): Must be an integer ≥ 0
- If quantity is 0, the item is removed from the cart

**Success Response** (200):
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": {
    "cart_id": "uuid",
    "items": [...],
    "total_items": 1,
    "total_amount": 19.95
  }
}
```

**Success Response - Item Removed** (200):
```json
{
  "success": true,
  "message": "Fresh Apples removed from cart",
  "data": {
    "cart_id": "uuid",
    "items": [],
    "total_items": 0,
    "total_amount": 0
  }
}
```

**Error Responses**:

**400 - Missing Quantity**:
```json
{
  "success": false,
  "error": "Quantity is required"
}
```

**404 - Cart Item Not Found**:
```json
{
  "success": false,
  "error": "Cart item not found"
}
```

**400 - Item Unavailable**:
```json
{
  "success": false,
  "error": "Fresh Apples is currently unavailable"
}
```

**400 - Insufficient Stock**:
```json
{
  "success": false,
  "error": "Insufficient stock. Only 10 Fresh Apples(s) available"
}
```

**Business Logic**:
1. Verifies cart_item belongs to authenticated user
2. If quantity is 0, removes item from cart
3. Otherwise:
   - Validates item is still available
   - Checks stock availability
   - Updates quantity
4. Returns updated cart with recalculated totals

---

### 4. Remove Item from Cart

Remove a specific item from the cart completely.

**Endpoint**: `DELETE /api/cart/items/:cartItemId`

**URL Parameters**:
- `cartItemId`: The UUID of the cart_item

**Headers**:
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cart_id": "uuid",
    "items": [],
    "total_items": 0,
    "total_amount": 0
  }
}
```

**Error Responses**:

**404 - Cart Item Not Found**:
```json
{
  "success": false,
  "error": "Cart item not found"
}
```

**401 - Unauthorized**:
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Business Logic**:
1. Verifies cart_item exists and belongs to authenticated user
2. Deletes the cart_item from database
3. Returns updated cart with remaining items

---

### 5. Clear Entire Cart

Remove all items from the cart at once.

**Endpoint**: `DELETE /api/cart`

**Headers**:
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response** (200):
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

**Error Response** (401):
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Business Logic**:
1. Gets or creates user's cart
2. Deletes all cart_items associated with the cart
3. Returns empty cart structure
4. Cart itself remains in database (only items are removed)

---

## Cart Persistence

### Features

1. **Database Storage**: All cart data is stored in Supabase database
2. **Cross-Device Sync**: Cart automatically syncs across all devices using the same user account
3. **Login Persistence**: Cart persists after logout and is restored on next login
4. **Auto-Creation**: Cart is automatically created for user on first cart operation

### Database Schema

**carts table**:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**cart_items table**:
- `id` (uuid, primary key)
- `cart_id` (uuid, foreign key to carts)
- `item_id` (uuid, foreign key to items)
- `quantity` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## Stock Management

### Real-Time Validation

Every cart operation validates stock in real-time:

1. **Adding Items**: Checks current stock before adding
2. **Updating Quantity**: Validates new quantity against stock
3. **Multiple Operations**: Prevents race conditions with database constraints

### Stock Error Messages

Messages are user-friendly and specific:

- "Insufficient stock. Only 5 Fresh Apples(s) available"
- "Cannot add 3 more. Only 2 more Fresh Apples(s) available"
- "Fresh Apples is currently unavailable"

### Edge Cases Handled

1. **Out of Stock**: Cannot add items with 0 stock
2. **Unavailable Items**: Cannot add items marked as unavailable
3. **Stock Decrease**: If stock decreases after item is in cart, user is notified when trying to update
4. **Item Deletion**: If item is deleted, cart_item is automatically removed (cascade delete)

---

## Testing the Cart API

### Using cURL

**1. Get Cart**:
```bash
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**2. Add Item**:
```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "ITEM_UUID", "quantity": 2}'
```

**3. Update Quantity**:
```bash
curl -X PUT http://localhost:3001/api/cart/items/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**4. Remove Item**:
```bash
curl -X DELETE http://localhost:3001/api/cart/items/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**5. Clear Cart**:
```bash
curl -X DELETE http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman/Thunder Client

1. Create a new request collection for Cart API
2. Set base URL: `http://localhost:3001/api/cart`
3. Add Authorization header with your JWT token
4. Test each endpoint with sample data

---

## Common Use Cases

### Adding First Item to Cart

```javascript
// 1. User clicks "Add to Cart" on item page
const response = await fetch('http://localhost:3001/api/cart/items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    item_id: 'uuid',
    quantity: 1
  })
});

// 2. Cart is automatically created for user
// 3. Item is added to cart
// 4. Response includes full cart with totals
```

### Updating Item Quantity

```javascript
// User changes quantity in cart
const response = await fetch(`http://localhost:3001/api/cart/items/${cartItemId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quantity: 3
  })
});

// Stock is validated before update
// Cart totals are recalculated
```

### Checkout Process

```javascript
// 1. Get cart to display items and total
const cartResponse = await fetch('http://localhost:3001/api/cart', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 2. User confirms and places order
// (Order API will handle creating order and clearing cart)

// 3. After successful order, cart is cleared
const clearResponse = await fetch('http://localhost:3001/api/cart', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Error Handling

### Common Error Codes

- **400**: Bad Request (validation errors, stock issues)
- **401**: Unauthorized (missing/invalid token)
- **404**: Not Found (cart item or item not found)
- **500**: Internal Server Error (database/server issues)

### Error Response Format

All errors follow the same format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Handling Errors in Frontend

```javascript
try {
  const response = await fetch('http://localhost:3001/api/cart/items', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item_id, quantity })
  });

  const data = await response.json();

  if (!data.success) {
    // Show error to user
    alert(data.error);
  } else {
    // Update cart UI
    updateCartUI(data.data);
  }
} catch (error) {
  console.error('Cart error:', error);
  alert('Failed to add item to cart');
}
```

---

## Security

### Authentication Required

- All endpoints require valid JWT token
- Users can only access their own cart
- Token is verified on every request

### Input Validation

- All inputs are validated and sanitized
- SQL injection protection via Supabase client
- Type checking for all parameters

### Race Condition Prevention

- Database constraints ensure data integrity
- Transactions used for critical operations
- Stock checks performed atomically

---

## Performance Considerations

### Optimizations

1. **Single Query**: Cart items fetched with item details in one query (JOIN)
2. **Efficient Updates**: Only necessary fields are updated
3. **Minimal Data Transfer**: Only essential data is returned

### Database Indexes

Ensure the following indexes exist for optimal performance:

```sql
-- On cart_items table
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_item_id ON cart_items(item_id);

-- On carts table
CREATE INDEX idx_carts_user_id ON carts(user_id);
```

---

## Changelog

### Version 1.0.0 (Current)

- ✅ Full CRUD operations for cart
- ✅ Real-time stock validation
- ✅ Automatic cart creation
- ✅ Total amount calculation
- ✅ Cross-device persistence
- ✅ Comprehensive error handling
- ✅ JWT authentication on all endpoints

---

## Support

For issues or questions:
1. Check the error message for specific details
2. Verify authentication token is valid
3. Ensure item IDs are correct UUIDs
4. Check server logs for detailed error information

