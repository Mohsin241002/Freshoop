# Admin API Documentation

Complete API reference for managing categories and items with admin privileges.

**Base URL**: `http://localhost:3001/api`

## 🔐 Admin Authentication

Admin routes require:
1. Valid JWT token in Authorization header
2. User email must be in `ADMIN_EMAILS` environment variable

```
Authorization: Bearer <access_token>
```

### Setting Up Admin Users

Add admin emails to `.env`:
```env
ADMIN_EMAILS=admin@freshoop.com,manager@freshoop.com
```

---

## Categories Management

### Get All Categories (Public)

**Endpoint**: `GET /api/categories`

**Access**: Public

**Response** (200):
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "uuid",
      "name": "Fruits",
      "display_order": 1,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Category by ID (Public)

**Endpoint**: `GET /api/categories/:id`

**Access**: Public

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fruits",
    "display_order": 1,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Create Category (Admin Only)

**Endpoint**: `POST /api/categories`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Organic Products",
  "display_order": 7
}
```

**Validation**:
- `name` (required): Must be at least 2 characters
- `display_order` (optional): Integer, defaults to 999
- Name must be unique

**Success Response** (201):
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Organic Products",
    "display_order": 7,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Invalid input or missing required fields
- `403`: Not admin
- `409`: Category name already exists

---

### Update Category (Admin Only)

**Endpoint**: `PUT /api/categories/:id`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Fresh Organic Products",
  "display_order": 5
}
```

**Validation**:
- At least one field required
- Name must be at least 2 characters if provided
- Name must be unique

**Success Response** (200):
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "uuid",
    "name": "Fresh Organic Products",
    "display_order": 5,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Invalid input
- `403`: Not admin
- `404`: Category not found
- `409`: Name already exists

---

### Delete Category (Admin Only)

**Endpoint**: `DELETE /api/categories/:id`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Responses**:
- `400`: Category has items (must delete/reassign items first)
- `403`: Not admin
- `404`: Category not found

---

## Items Management

### Get All Items (Public)

**Endpoint**: `GET /api/items`

**Access**: Public

**Query Parameters**:
- `category_id` (optional): Filter by category UUID
- `is_available` (optional): Filter by availability (true/false)
- `search` (optional): Search by name (case-insensitive)

**Examples**:
```
GET /api/items?category_id=uuid-here
GET /api/items?is_available=true
GET /api/items?search=apple
```

**Response** (200):
```json
{
  "success": true,
  "count": 24,
  "data": [
    {
      "id": "uuid",
      "name": "Fresh Apples",
      "description": "Crisp and sweet red apples",
      "category_id": "uuid",
      "price": 3.99,
      "stock_quantity": 150,
      "image_url": "https://...storage.../items/image.jpg",
      "is_available": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "categories": {
        "id": "uuid",
        "name": "Fruits"
      }
    }
  ]
}
```

---

### Get Item by ID (Public)

**Endpoint**: `GET /api/items/:id`

**Access**: Public

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Fresh Apples",
    "description": "Crisp and sweet red apples",
    "category_id": "uuid",
    "price": 3.99,
    "stock_quantity": 150,
    "image_url": "https://...storage.../items/image.jpg",
    "is_available": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "categories": {
      "id": "uuid",
      "name": "Fruits"
    }
  }
}
```

---

### Create Item (Admin Only)

**Endpoint**: `POST /api/items`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data**:
```
name: Fresh Apples (required)
description: Crisp and sweet apples (optional)
category_id: uuid-here (required)
price: 3.99 (required)
stock_quantity: 150 (optional, defaults to 0)
is_available: true (optional, defaults to true)
image: <file> (optional, max 5MB, JPEG/PNG/WebP/GIF)
```

**Validation**:
- `name`: Required, at least 2 characters
- `category_id`: Required, must exist
- `price`: Required, must be positive number
- `stock_quantity`: Optional, must be non-negative integer
- `image`: Optional, max 5MB, allowed types: JPEG, PNG, WebP, GIF

**Success Response** (201):
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": "uuid",
    "name": "Fresh Apples",
    "description": "Crisp and sweet apples",
    "category_id": "uuid",
    "price": 3.99,
    "stock_quantity": 150,
    "image_url": "https://...storage.../items/1234567890-abc123.jpg",
    "is_available": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "categories": {
      "id": "uuid",
      "name": "Fruits"
    }
  }
}
```

**Error Responses**:
- `400`: Invalid input or file type
- `403`: Not admin
- `413`: File too large (max 5MB)

---

### Update Item (Admin Only)

**Endpoint**: `PUT /api/items/:id`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data** (all optional):
```
name: Updated Name
description: Updated description
category_id: uuid-here
price: 4.99
stock_quantity: 200
is_available: false
image: <file> (replaces existing image)
```

**Notes**:
- Providing new image will delete the old image from storage
- All fields are optional, only provided fields will be updated

**Success Response** (200):
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "description": "Updated description",
    "category_id": "uuid",
    "price": 4.99,
    "stock_quantity": 200,
    "image_url": "https://...storage.../items/new-image.jpg",
    "is_available": false,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T01:00:00.000Z",
    "categories": {
      "id": "uuid",
      "name": "Fruits"
    }
  }
}
```

**Error Responses**:
- `400`: Invalid input
- `403`: Not admin
- `404`: Item not found

---

### Delete Item (Admin Only)

**Endpoint**: `DELETE /api/items/:id`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Notes**:
- Automatically deletes associated image from Supabase Storage

**Success Response** (200):
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

**Error Responses**:
- `403`: Not admin
- `404`: Item not found

---

### Update Stock (Admin Only)

**Endpoint**: `PATCH /api/items/:id/stock`

**Access**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "stock_quantity": 250
}
```

**Validation**:
- `stock_quantity`: Required, must be non-negative integer

**Success Response** (200):
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": {
    "id": "uuid",
    "name": "Fresh Apples",
    "stock_quantity": 250
  }
}
```

**Error Responses**:
- `400`: Invalid input
- `403`: Not admin
- `404`: Item not found

---

## Image Upload Details

### Specifications
- **Storage**: Supabase Storage bucket `food-images`
- **Path Pattern**: `items/{timestamp}-{random}.{ext}`
- **Max Size**: 5MB
- **Allowed Types**: JPEG, JPG, PNG, WebP, GIF
- **Upload Method**: multipart/form-data

### Filename Generation
```
{Date.now()}-{random-string}.{original-extension}
Example: 1704067200000-abc123.jpg
```

### Image URLs
Images are stored with public URLs:
```
https://wxpdzyfueemvrzsgeyah.supabase.co/storage/v1/object/public/food-images/items/1704067200000-abc123.jpg
```

### Automatic Cleanup
- Updating item with new image: Old image is deleted
- Deleting item: Associated image is deleted

---

## Testing with cURL

### 1. Login as Admin

First, ensure your email is in `ADMIN_EMAILS`:
```bash
# In .env
ADMIN_EMAILS=your-email@example.com
```

```bash
# Register/Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'

# Save the access_token from response
```

### 2. Create Category

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Products",
    "display_order": 7
  }'
```

### 3. Create Item with Image

```bash
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Organic Apples" \
  -F "description=Fresh organic apples" \
  -F "category_id=uuid-here" \
  -F "price=4.99" \
  -F "stock_quantity=100" \
  -F "image=@/path/to/image.jpg"
```

### 4. Update Item

```bash
curl -X PUT http://localhost:3001/api/items/uuid-here \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Updated Name" \
  -F "price=5.99" \
  -F "image=@/path/to/new-image.jpg"
```

### 5. Update Stock

```bash
curl -X PATCH http://localhost:3001/api/items/uuid-here/stock \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stock_quantity": 200}'
```

### 6. Delete Item

```bash
curl -X DELETE http://localhost:3001/api/items/uuid-here \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing with Postman

### Setup Environment Variables

Create Postman environment with:
- `base_url`: `http://localhost:3001`
- `admin_token`: (set after login)

### Create Item with Image

1. Method: POST
2. URL: `{{base_url}}/api/items`
3. Headers:
   - `Authorization: Bearer {{admin_token}}`
4. Body: form-data
   - `name`: Fresh Apples
   - `description`: Crisp apples
   - `category_id`: uuid-from-categories
   - `price`: 3.99
   - `stock_quantity`: 150
   - `image`: (Select file)

---

## Error Response Format

All errors follow consistent format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Status Codes

- `200`: Success
- `201`: Resource created
- `400`: Bad request (invalid input)
- `401`: Unauthorized (no token)
- `403`: Forbidden (not admin)
- `404`: Resource not found
- `409`: Conflict (duplicate)
- `413`: Payload too large
- `500`: Server error

---

## Security Notes

### Admin Validation
- Admin emails stored in environment variable
- Case-insensitive comparison
- Comma-separated list support

### Image Security
- File type validation
- Size limit enforcement (5MB)
- Unique filename generation
- Automatic cleanup on deletion

### Best Practices
1. Never commit `.env` file
2. Use strong admin email passwords
3. Regularly rotate JWT secrets
4. Monitor storage usage
5. Implement rate limiting in production

---

**Last Updated**: 2025-01-01  
**API Version**: 1.0.0  
**Admin Features**: Categories, Items, Stock Management, Image Upload

