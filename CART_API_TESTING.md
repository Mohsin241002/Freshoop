# Cart API Testing Guide

Step-by-step guide to test all shopping cart functionality.

## Prerequisites

1. **Server Running**: Start the backend server
   ```bash
   cd server
   npm start
   ```

2. **User Account**: Create a test user account
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!@#",
       "full_name": "Test User"
     }'
   ```

3. **Get Token**: Login to get JWT token
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!@#"
     }'
   ```
   
   Save the token from the response:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {...}
   }
   ```

4. **Get Item ID**: Get an item to add to cart
   ```bash
   curl http://localhost:3001/api/items
   ```
   
   Save an `id` from the response items list.

---

## Test Suite

### Test 1: Get Empty Cart (Auto-Creation)

**Purpose**: Verify cart is automatically created for new users

```bash
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result**:
```json
{
  "success": true,
  "data": {
    "cart_id": "uuid-here",
    "items": [],
    "total_items": 0,
    "total_amount": 0
  }
}
```

**✅ Pass Criteria**:
- Status code: 200
- `success: true`
- Empty items array
- Cart ID is returned
- Total amount is 0

---

### Test 2: Add Item to Cart

**Purpose**: Add first item to cart

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "ITEM_UUID_HERE",
    "quantity": 2
  }'
```

**Expected Result**:
```json
{
  "success": true,
  "message": "Item Name added to cart",
  "data": {
    "cart_id": "uuid",
    "items": [
      {
        "cart_item_id": "uuid",
        "item_id": "uuid",
        "name": "Item Name",
        "description": "...",
        "price": 3.99,
        "image_url": "...",
        "is_available": true,
        "stock_quantity": 150,
        "quantity": 2,
        "subtotal": 7.98
      }
    ],
    "total_items": 1,
    "total_amount": 7.98
  }
}
```

**✅ Pass Criteria**:
- Status code: 200
- Item appears in cart
- Quantity is 2
- Subtotal calculated correctly
- Total amount matches subtotal

---

### Test 3: Add Same Item Again (Quantity Increase)

**Purpose**: Verify quantity increases when adding existing item

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "SAME_ITEM_UUID",
    "quantity": 3
  }'
```

**Expected Result**:
```json
{
  "success": true,
  "message": "Item Name added to cart",
  "data": {
    "cart_id": "uuid",
    "items": [
      {
        "cart_item_id": "same-uuid",
        "quantity": 5,
        "subtotal": 19.95
      }
    ],
    "total_items": 1,
    "total_amount": 19.95
  }
}
```

**✅ Pass Criteria**:
- Status code: 200
- Quantity increased from 2 to 5 (2 + 3)
- Same cart_item_id (not a new item)
- Subtotal updated correctly

---

### Test 4: Add Different Item

**Purpose**: Add a second different item to cart

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "DIFFERENT_ITEM_UUID",
    "quantity": 1
  }'
```

**Expected Result**:
```json
{
  "success": true,
  "message": "Different Item added to cart",
  "data": {
    "cart_id": "uuid",
    "items": [
      {
        "cart_item_id": "uuid2",
        "quantity": 1
      },
      {
        "cart_item_id": "uuid1",
        "quantity": 5
      }
    ],
    "total_items": 2,
    "total_amount": 24.94
  }
}
```

**✅ Pass Criteria**:
- Status code: 200
- Two items in cart
- New item has different cart_item_id
- Total amount is sum of both subtotals
- Items ordered by creation date (newest first)

---

### Test 5: Update Cart Item Quantity

**Purpose**: Change quantity of existing cart item

```bash
curl -X PUT http://localhost:3001/api/cart/items/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

**Expected Result**:
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": {
    "cart_id": "uuid",
    "items": [
      {
        "cart_item_id": "CART_ITEM_UUID",
        "quantity": 3,
        "subtotal": 11.97
      }
    ],
    "total_amount": 16.96
  }
}
```

**✅ Pass Criteria**:
- Status code: 200
- Quantity changed to 3
- Subtotal recalculated
- Total amount updated

---

### Test 6: Update Quantity to Zero (Remove)

**Purpose**: Setting quantity to 0 should remove item

```bash
curl -X PUT http://localhost:3001/api/cart/items/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 0
  }'
```

**Expected Result**:
```json
{
  "success": true,
  "message": "Item Name removed from cart",
  "data": {
    "cart_id": "uuid",
    "items": [
      // Only the other item remains
    ],
    "total_items": 1
  }
}
```

**✅ Pass Criteria**:
- Status code: 200
- Item removed from cart
- Message says "removed from cart"
- Total items decreased

---

### Test 7: Delete Cart Item

**Purpose**: Remove item using DELETE endpoint

```bash
curl -X DELETE http://localhost:3001/api/cart/items/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result**:
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

**✅ Pass Criteria**:
- Status code: 200
- Item removed from cart
- Cart updated in response

---

### Test 8: Clear Entire Cart

**Purpose**: Remove all items at once

**Setup**: First add multiple items to cart

```bash
# Add items first
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID1", "quantity": 2}'

curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID2", "quantity": 3}'

# Then clear cart
curl -X DELETE http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result**:
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

**✅ Pass Criteria**:
- Status code: 200
- All items removed
- Cart is empty
- Total amount is 0

---

## Validation Tests

### Test 9: Missing Authorization Token

**Purpose**: Verify authentication is required

```bash
curl -X GET http://localhost:3001/api/cart
```

**Expected Result**:
```json
{
  "success": false,
  "error": "No authorization token provided"
}
```

**✅ Pass Criteria**:
- Status code: 401
- Error message about missing token

---

### Test 10: Invalid Item ID

**Purpose**: Verify item validation

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "invalid-uuid",
    "quantity": 1
  }'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Item not found"
}
```

**✅ Pass Criteria**:
- Status code: 404
- Error message about item not found

---

### Test 11: Missing Item ID

**Purpose**: Verify required fields

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 1
  }'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "item_id is required"
}
```

**✅ Pass Criteria**:
- Status code: 400
- Error message about missing item_id

---

### Test 12: Invalid Quantity (Negative)

**Purpose**: Verify quantity validation

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "VALID_UUID",
    "quantity": -1
  }'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Quantity must be at least 1"
}
```

**✅ Pass Criteria**:
- Status code: 400
- Error about invalid quantity

---

### Test 13: Invalid Quantity (Zero for Add)

**Purpose**: Can't add with quantity 0

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "VALID_UUID",
    "quantity": 0
  }'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Quantity must be at least 1"
}
```

**✅ Pass Criteria**:
- Status code: 400
- Error message

---

## Stock Validation Tests

### Test 14: Insufficient Stock

**Purpose**: Can't add more than available stock

**Setup**: Find an item with low stock (or modify in database)

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "ITEM_WITH_LOW_STOCK",
    "quantity": 999999
  }'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Insufficient stock. Only 10 Item Name(s) available"
}
```

**✅ Pass Criteria**:
- Status code: 400
- Error message includes actual stock quantity
- Item not added to cart

---

### Test 15: Can't Add More When Already in Cart

**Purpose**: Total quantity can't exceed stock

**Setup**:
```bash
# Step 1: Add item with quantity 5 (assume stock is 10)
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID", "quantity": 5}'

# Step 2: Try to add 10 more (would exceed stock of 10)
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID", "quantity": 10}'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Cannot add 10 more. Only 5 more Item Name(s) available"
}
```

**✅ Pass Criteria**:
- Status code: 400
- Error shows how many more can be added
- Cart quantity unchanged

---

### Test 16: Unavailable Item

**Purpose**: Can't add items marked as unavailable

**Setup**: Set an item's `is_available` to false in database

```bash
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "UNAVAILABLE_ITEM_UUID",
    "quantity": 1
  }'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Item Name is currently unavailable"
}
```

**✅ Pass Criteria**:
- Status code: 400
- Error message includes item name
- Item not added to cart

---

## Cross-Device Persistence Tests

### Test 17: Cart Persists After Logout

**Purpose**: Verify cart is saved in database

```bash
# Step 1: Add items to cart
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID", "quantity": 3}'

# Step 2: Logout (optional)
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 3: Login again
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Step 4: Get cart with new token
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer NEW_TOKEN"
```

**Expected Result**:
```json
{
  "success": true,
  "data": {
    "cart_id": "same-uuid-as-before",
    "items": [
      // Same items as before logout
    ],
    "total_items": 1,
    "total_amount": 11.97
  }
}
```

**✅ Pass Criteria**:
- Cart has same items
- Cart ID unchanged
- Quantities preserved

---

### Test 18: Different Users Have Different Carts

**Purpose**: Verify cart isolation between users

```bash
# Step 1: User 1 adds item
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID1", "quantity": 2}'

# Step 2: User 2 adds different item
curl -X POST http://localhost:3001/api/cart/items \
  -H "Authorization: Bearer USER2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "UUID2", "quantity": 5}'

# Step 3: Get User 1 cart
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer USER1_TOKEN"

# Step 4: Get User 2 cart
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer USER2_TOKEN"
```

**Expected Result**:
- User 1 cart contains only UUID1 with quantity 2
- User 2 cart contains only UUID2 with quantity 5
- Different cart IDs

**✅ Pass Criteria**:
- Carts are completely separate
- No data leakage between users

---

## Edge Cases

### Test 19: Update Non-Existent Cart Item

**Purpose**: Verify cart item ownership

```bash
curl -X PUT http://localhost:3001/api/cart/items/fake-uuid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Cart item not found"
}
```

**✅ Pass Criteria**:
- Status code: 404
- Error message

---

### Test 20: Delete Non-Existent Cart Item

```bash
curl -X DELETE http://localhost:3001/api/cart/items/fake-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result**:
```json
{
  "success": false,
  "error": "Cart item not found"
}
```

**✅ Pass Criteria**:
- Status code: 404
- Error message

---

## Performance Tests

### Test 21: Multiple Items in Cart

**Purpose**: Verify cart handles many items

```bash
# Add 10 different items
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/cart/items \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"item_id\": \"ITEM_UUID_$i\", \"quantity\": 1}"
done

# Get cart
curl -X GET http://localhost:3001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**✅ Pass Criteria**:
- All items returned
- Total calculated correctly
- Response time < 2 seconds

---

## Test Results Template

Use this template to track your test results:

```
# Cart API Test Results

Date: __________
Tester: __________

## Basic Operations
- [ ] Test 1: Get Empty Cart
- [ ] Test 2: Add Item to Cart
- [ ] Test 3: Add Same Item Again
- [ ] Test 4: Add Different Item
- [ ] Test 5: Update Cart Item Quantity
- [ ] Test 6: Update Quantity to Zero
- [ ] Test 7: Delete Cart Item
- [ ] Test 8: Clear Entire Cart

## Validation Tests
- [ ] Test 9: Missing Authorization Token
- [ ] Test 10: Invalid Item ID
- [ ] Test 11: Missing Item ID
- [ ] Test 12: Invalid Quantity (Negative)
- [ ] Test 13: Invalid Quantity (Zero for Add)

## Stock Validation
- [ ] Test 14: Insufficient Stock
- [ ] Test 15: Can't Add More When Already in Cart
- [ ] Test 16: Unavailable Item

## Persistence Tests
- [ ] Test 17: Cart Persists After Logout
- [ ] Test 18: Different Users Have Different Carts

## Edge Cases
- [ ] Test 19: Update Non-Existent Cart Item
- [ ] Test 20: Delete Non-Existent Cart Item

## Performance
- [ ] Test 21: Multiple Items in Cart

## Notes:
_Add any issues or observations here_
```

---

## Automated Testing Script

Save this as `test-cart.sh`:

```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3001"
EMAIL="test@example.com"
PASSWORD="Test123!@#"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"

# Test 1: Get Cart
echo -e "\nTest 1: Get Cart"
RESPONSE=$(curl -s -X GET $BASE_URL/api/cart \
  -H "Authorization: Bearer $TOKEN")
  
if echo $RESPONSE | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✅ Passed${NC}"
else
  echo -e "${RED}❌ Failed${NC}"
fi

# Add more tests here...

echo -e "\n${GREEN}All tests completed!${NC}"
```

Run with:
```bash
chmod +x test-cart.sh
./test-cart.sh
```

---

## Troubleshooting

### Issue: 401 Unauthorized

**Solution**: 
- Check token is valid
- Token may have expired (login again)
- Verify Authorization header format: `Bearer <token>`

### Issue: 404 Cart Item Not Found

**Solution**:
- Use `cart_item_id` not `item_id` for update/delete
- Get cart first to see correct IDs
- Ensure item belongs to authenticated user

### Issue: Stock validation not working

**Solution**:
- Check item stock_quantity in database
- Verify item is_available is true
- Check for concurrent operations

---

## Success Criteria Summary

All tests should pass with:
- ✅ Correct status codes
- ✅ Proper response format
- ✅ Accurate calculations
- ✅ Appropriate error messages
- ✅ Data persistence
- ✅ Security enforcement

---

## Next Steps

After all tests pass:
1. ✅ Test with frontend application
2. ✅ Test concurrent operations
3. ✅ Load testing with multiple users
4. ✅ Integration with order system

