# Authentication System Setup & Testing Guide

Complete guide to test the new authentication and user management system.

## 📁 Server Structure

```
/server
  /config
    - supabase.js              ✅ Supabase client with service role
  /middleware
    - auth.js                  ✅ JWT verification middleware
    - logger.js                ✅ Request/error logging
    - errorHandler.js          ✅ Global error handler
    - validation.js            ✅ Input validation utilities
  /routes
    - auth.js                  ✅ Authentication routes
    - users.js                 ✅ User management routes
    - categories.js            ✅ Category routes
    - items.js                 ✅ Item routes
    - cart.js                  ✅ Cart routes
    - orders.js                ✅ Order routes
  /controllers
    - authController.js        ✅ Authentication logic
    - userController.js        ✅ User management logic
  - server.js                  ✅ Main server file (Port 5000)
  - package.json              ✅ Dependencies & scripts
  - .env                      ✅ Environment variables
```

## ✅ Features Implemented

### 1. Supabase Client Configuration
- ✅ Service role key support for admin operations
- ✅ Proper session management for backend
- ✅ Error handling for missing credentials

### 2. Authentication Middleware
- ✅ JWT token verification from Authorization header
- ✅ User ID extraction and attachment to `req.user`
- ✅ 401 responses for invalid/missing tokens
- ✅ Optional auth middleware for public/private routes

### 3. Authentication Routes

#### POST /api/auth/register
- ✅ Email/password validation
- ✅ Supabase Auth signUp
- ✅ Auto-create user profile in users table
- ✅ Return JWT token and user data

#### POST /api/auth/login
- ✅ Email/password validation
- ✅ Supabase Auth signInWithPassword
- ✅ Fetch user profile from users table
- ✅ Return JWT token and user data

#### POST /api/auth/logout
- ✅ Protected route (requires authentication)
- ✅ Supabase signOut

#### GET /api/auth/me
- ✅ Protected route
- ✅ Returns current user profile

### 4. User Management Routes

#### GET /api/users/profile
- ✅ Protected route
- ✅ Get current user profile

#### PUT /api/users/profile
- ✅ Protected route
- ✅ Update user profile (name, email)
- ✅ Sync email updates with Supabase Auth

#### DELETE /api/users/profile
- ✅ Protected route
- ✅ Delete user account

#### GET /api/users/:id
- ✅ Protected route
- ✅ Get user by ID

### 5. Error Handling
- ✅ Global error handler
- ✅ Consistent error response format
- ✅ Supabase-specific error handling
- ✅ Stack traces in development mode

### 6. Request Logging
- ✅ Log all incoming requests
- ✅ Log response times
- ✅ Color-coded console output
- ✅ Error logging with details

### 7. Security Features
- ✅ CORS configured for frontend origin
- ✅ Input sanitization (XSS prevention)
- ✅ Email format validation
- ✅ Password strength validation

### 8. Server Configuration
- ✅ Running on port 5000
- ✅ Environment-based configuration
- ✅ Health check endpoint
- ✅ 404 handler for unknown routes

## 🚀 Starting the Server

### 1. Update Environment Variables

Your `.env` file is already configured:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://wxpdzyfueemvrzsgeyah.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
JWT_SECRET=your_jwt_secret_change_in_production
NODE_ENV=development
```

### 2. Start the Server

```bash
cd server
npm run dev
```

Expected output:
```
=================================
✓ Server running on port 5000
✓ Environment: development
✓ Frontend URL: http://localhost:5173
=================================
✓ Supabase client initialized successfully
```

## 🧪 Testing with cURL

### 1. Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123",
    "fullName": "John Doe"
  }'
```

Expected response (201):
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "...",
      "expires_at": 1234567890
    }
  }
}
```

**Save the `access_token` for next steps!**

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

Expected response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "full_name": "John Doe"
    },
    "access_token": "eyJhbGc..."
  }
}
```

### 4. Get Current User (Protected Route)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Replace `YOUR_ACCESS_TOKEN` with the token from login/register.

Expected response (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "full_name": "John Doe",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### 5. Get User Profile

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Update User Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Smith"
  }'
```

Expected response (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "full_name": "John Smith",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### 7. Test Invalid Token

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer invalid_token"
```

Expected response (401):
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### 8. Test Missing Token

```bash
curl -X GET http://localhost:5000/api/users/profile
```

Expected response (401):
```json
{
  "success": false,
  "error": "No authorization token provided"
}
```

### 9. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🧪 Testing with Postman

### 1. Import Collection

Create a new Postman collection called "Freshoop API"

### 2. Set Environment Variables

Create environment variables:
- `base_url`: `http://localhost:5000`
- `access_token`: (will be set automatically)

### 3. Create Requests

#### Register
- Method: POST
- URL: `{{base_url}}/api/auth/register`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "test123456",
  "fullName": "Test User"
}
```

Add test script to save token:
```javascript
if (pm.response.code === 201) {
  const data = pm.response.json();
  pm.environment.set("access_token", data.data.session.access_token);
}
```

#### Login
- Method: POST
- URL: `{{base_url}}/api/auth/login`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "test123456"
}
```

Add test script:
```javascript
if (pm.response.code === 200) {
  const data = pm.response.json();
  pm.environment.set("access_token", data.data.access_token);
}
```

#### Get Profile
- Method: GET
- URL: `{{base_url}}/api/users/profile`
- Headers: `Authorization: Bearer {{access_token}}`

## 🔍 Checking Server Logs

The server logs all requests with colors:
- **Green**: Successful requests (2xx)
- **Red**: Error requests (4xx, 5xx)

Example log output:
```
[2025-01-01T10:00:00.000Z] POST /api/auth/register
[2025-01-01T10:00:00.500Z] POST /api/auth/register 201 - 500ms
[2025-01-01T10:00:01.000Z] GET /api/users/profile
[2025-01-01T10:00:01.100Z] GET /api/users/profile 200 - 100ms
```

## ❌ Common Errors & Solutions

### Error: "Missing Supabase environment variables"

**Solution**: Check your `.env` file has:
- SUPABASE_URL
- SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY

### Error: "No authorization token provided"

**Solution**: Include the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Error: "Invalid or expired token"

**Solution**: 
1. Login again to get a new token
2. Check token format (should be `Bearer <token>`)
3. Verify token hasn't expired

### Error: "User profile not found"

**Solution**: The user profile might not have been created in the users table. Check:
1. Supabase dashboard > users table
2. RLS policies are correct

### Error: Port 5000 already in use

**Solution**:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

## 🔐 Security Checklist

- [x] JWT tokens verified on protected routes
- [x] Passwords hashed by Supabase Auth
- [x] Input sanitization for XSS prevention
- [x] Email format validation
- [x] Password minimum length (6 characters)
- [x] CORS configured for specific origin
- [x] Error messages don't expose sensitive info
- [x] Service role key used server-side only

## 📊 Database Integration

The authentication system integrates with Supabase:

1. **Auth Table**: Managed by Supabase Auth
   - Stores authentication credentials
   - Handles password hashing
   - Manages sessions

2. **Users Table**: Custom profile data
   - Links to auth.users via user ID
   - Stores additional user information
   - Has RLS policies

3. **Automatic Sync**:
   - Register creates both auth user and profile
   - Profile updates sync with auth when needed

## 🚀 Next Steps

1. **Frontend Integration**: Update frontend to use new auth endpoints
2. **Email Verification**: Configure Supabase email templates
3. **Password Reset**: Implement forgot password flow
4. **Refresh Tokens**: Add token refresh logic
5. **Role-Based Access**: Add admin roles and permissions
6. **Rate Limiting**: Add rate limiting for security
7. **Session Management**: Add session tracking

## 📝 Notes

- Server runs on port **5000** (changed from 3000)
- Frontend should point to `http://localhost:5000/api`
- All auth responses include `success` boolean
- Tokens are JWT format from Supabase
- Protected routes automatically get `req.user` object

---

**Last Updated**: 2025-01-01  
**Status**: ✅ Ready for Testing

