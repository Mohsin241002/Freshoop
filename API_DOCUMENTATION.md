# Freshoop API Documentation

Complete API reference for the Freshoop online grocery store backend.

**Base URL**: `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Categories](#categories)
- [Items](#items)
- [Cart](#cart)
- [Orders](#orders)

---

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1234567890
    }
  }
}
```

**Error Responses**:
- `400`: Missing required fields or invalid input
- `500`: Server error

---

### Login User

Authenticate and get access token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    },
    "access_token": "jwt_token"
  }
}
```

**Error Responses**:
- `400`: Missing required fields
- `401`: Invalid credentials
- `500`: Server error

---

### Logout User

Logout current user (requires authentication).

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Get Current User

Get currently authenticated user info (requires authentication).

**Endpoint**: `GET /api/auth/me`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `401`: Invalid or missing token
- `404`: User profile not found

---

## Users

All user routes require authentication.

### Get User Profile

Get current user's profile.

**Endpoint**: `GET /api/users/profile`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update User Profile

Update current user's profile.

**Endpoint**: `PUT /api/users/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "full_name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "newemail@example.com",
      "full_name": "Jane Doe",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Delete User Account

Delete current user's account (requires authentication).

**Endpoint**: `DELETE /api/users/profile`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

### Get User by ID

Get user information by ID (requires authentication).

**Endpoint**: `GET /api/users/:id`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Categories

### Get All Categories

Get all grocery categories.

**Endpoint**: `GET /api/categories`

**Success Response** (200):
```json
[
  {
    "id": "uuid",
    "name": "Fruits",
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Category by ID

**Endpoint**: `GET /api/categories/:id`

---

### Create Category

**Endpoint**: `POST /api/categories`

**Request Body**:
```json
{
  "name": "Organic Products",
  "display_order": 7
}
```

---

## Items

### Get All Items

Get all grocery items with optional category filter.

**Endpoint**: `GET /api/items?category_id=uuid`

**Query Parameters**:
- `category_id` (optional): Filter by category

**Success Response** (200):
```json
[
  {
    "id": "uuid",
    "name": "Fresh Apples",
    "description": "Crisp and sweet red apples",
    "category_id": "uuid",
    "price": "3.99",
    "stock_quantity": 150,
    "image_url": null,
    "is_available": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "categories": {
      "id": "uuid",
      "name": "Fruits"
    }
  }
]
```

---

### Get Item by ID

**Endpoint**: `GET /api/items/:id`

---

### Create Item

**Endpoint**: `POST /api/items`

**Request Body**:
```json
{
  "name": "Organic Bananas",
  "description": "Fresh organic bananas",
  "category_id": "uuid",
  "price": 4.99,
  "stock_quantity": 100,
  "is_available": true
}
```

---

## Cart

All cart routes work with user ID from the URL parameter.

### Get User Cart

**Endpoint**: `GET /api/cart/:userId`

**Success Response** (200):
```json
{
  "cart_id": "uuid",
  "items": [
    {
      "id": "uuid",
      "cart_id": "uuid",
      "item_id": "uuid",
      "quantity": 2,
      "added_at": "2024-01-01T00:00:00.000Z",
      "items": {
        "id": "uuid",
        "name": "Fresh Apples",
        "price": "3.99",
        "image_url": null
      }
    }
  ]
}
```

---

### Add Item to Cart

**Endpoint**: `POST /api/cart/:userId/items`

**Request Body**:
```json
{
  "item_id": "uuid",
  "quantity": 2
}
```

---

### Update Cart Item

**Endpoint**: `PUT /api/cart/:userId/items/:itemId`

**Request Body**:
```json
{
  "quantity": 3
}
```

---

### Remove Item from Cart

**Endpoint**: `DELETE /api/cart/:userId/items/:itemId`

---

### Clear Cart

**Endpoint**: `DELETE /api/cart/:userId`

---

## Orders

### Get User Orders

**Endpoint**: `GET /api/orders/user/:userId`

**Success Response** (200):
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "order_number": "ORD-1234567890-001",
    "total_amount": "45.99",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z",
    "delivered_at": null,
    "order_items": [
      {
        "id": "uuid",
        "item_name": "Fresh Apples",
        "quantity": 3,
        "price_at_purchase": "3.99"
      }
    ]
  }
]
```

---

### Get Order by ID

**Endpoint**: `GET /api/orders/:id`

---

### Create Order

Create order from cart items.

**Endpoint**: `POST /api/orders`

**Request Body**:
```json
{
  "user_id": "uuid"
}
```

**Success Response** (201):
```json
{
  "id": "uuid",
  "order_number": "ORD-1234567890-001",
  "total_amount": "45.99",
  "status": "pending",
  "order_items": [...]
}
```

---

### Update Order Status

**Endpoint**: `PUT /api/orders/:id/status`

**Request Body**:
```json
{
  "status": "delivered"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Resource created
- `400`: Bad request (invalid input)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `409`: Conflict (duplicate resource)
- `500`: Internal server error

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get Profile (authenticated)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## CORS

CORS is configured to allow requests from `http://localhost:5173` by default. Update `FRONTEND_URL` in `.env` for production.

---

**Last Updated**: 2025-01-01  
**API Version**: 1.0.0

