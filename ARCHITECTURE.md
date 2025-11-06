# Freshoop Architecture

## System Overview

Freshoop is a full-stack food ordering platform following a client-server architecture with a managed PostgreSQL database (Supabase).

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   React + Vite + TailwindCSS                        │   │
│  │   - Components (Layout, ItemCard)                   │   │
│  │   - Pages (Home, Cart, Orders, Auth)                │   │
│  │   - Contexts (Auth, Cart)                           │   │
│  │   - API Client (Axios)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕ HTTP                             │
├─────────────────────────────────────────────────────────────┤
│                         Backend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Node.js + Express                                 │   │
│  │   - Routes (Categories, Items, Cart, Orders, Users) │   │
│  │   - Middleware (Auth)                               │   │
│  │   - Config (Supabase)                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕ SQL                              │
├─────────────────────────────────────────────────────────────┤
│                        Database                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Supabase (PostgreSQL)                             │   │
│  │   - Tables (7 tables with RLS)                      │   │
│  │   - Auth (Email/Password)                           │   │
│  │   - Storage (food-images bucket)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User → Frontend (Auth Page)
         ↓
     Supabase Auth API
         ↓
     JWT Token Generated
         ↓
     Frontend (AuthContext stores user)
         ↓
     Token sent with API requests
```

### 2. Browse & Add to Cart Flow

```
User Opens App → Frontend fetches Categories & Items
                      ↓
                 Backend API (GET /api/categories, /api/items)
                      ↓
                 Supabase Database
                      ↓
                 Returns data → Frontend displays
                      ↓
User Adds to Cart → Frontend (CartContext)
                      ↓
                 Backend API (POST /api/cart/:userId/items)
                      ↓
                 Supabase Database (Insert into cart_items)
```

### 3. Checkout & Order Flow

```
User Clicks Checkout → Frontend (Cart Page)
                           ↓
                      Backend API (POST /api/orders)
                           ↓
                      Database Transaction:
                      - Create Order
                      - Create Order Items
                      - Update Stock Quantities
                      - Clear Cart
                           ↓
                      Return Order → Frontend displays confirmation
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│   auth.users│ (Supabase Auth)
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ↓                  ↓
┌─────────────┐    ┌─────────────┐
│    users    │    │    carts    │
└─────────────┘    └──────┬──────┘
                          │
                          ↓
                   ┌─────────────┐
┌──────────────┐   │ cart_items  │
│  categories  │   └──────┬──────┘
└──────┬───────┘          │
       │                  │
       ↓                  │
┌─────────────┐◄──────────┘
│    items    │
└──────┬──────┘
       │
       │    ┌─────────────┐
       │    │   orders    │◄───── auth.users
       │    └──────┬──────┘
       │           │
       │           ↓
       │    ┌─────────────┐
       └───►│ order_items │
            └─────────────┘
```

### Table Details

#### users
- Extends Supabase auth.users
- Stores additional profile data
- RLS: Users can only view/update their own profile

#### categories
- Food categories (Pizza, Burgers, etc.)
- RLS: Public read access

#### items
- Food items with pricing and stock
- Foreign key to categories
- RLS: Public read access

#### carts
- One cart per user
- Foreign key to auth.users
- RLS: Users can only access their own cart

#### cart_items
- Items in a cart with quantities
- Foreign keys to carts and items
- RLS: Users can only access items in their cart

#### orders
- User orders with status tracking
- Foreign key to auth.users
- RLS: Users can only view their own orders

#### order_items
- Items in an order (snapshot at purchase time)
- Foreign keys to orders and items
- RLS: Users can only view items in their orders

## Frontend Architecture

### Component Hierarchy

```
App (BrowserRouter)
└── AuthProvider
    └── CartProvider
        └── Layout
            ├── Header (Navigation)
            ├── Outlet (React Router)
            │   ├── Home
            │   │   └── ItemCard (multiple)
            │   ├── Cart
            │   ├── Orders
            │   └── Auth
            └── Footer
```

### State Management

#### Global State (Context)
- **AuthContext**: User authentication state
  - Current user
  - Sign in/up/out methods
  - Loading state

- **CartContext**: Shopping cart state
  - Cart items
  - Add/update/remove methods
  - Total calculation
  - Cart count

#### Local State
- Component-specific state (forms, UI toggles, etc.)
- API loading states
- Error states

### API Communication

```javascript
// Client → Server
Frontend (Axios) → Express API → Supabase

// Authentication
Frontend → Supabase Auth API (direct)
```

## Backend Architecture

### Route Structure

```
Express App
├── /health (Health check)
└── /api
    ├── /categories (CRUD operations)
    ├── /items (CRUD operations)
    ├── /cart/:userId
    │   ├── GET (Get cart)
    │   ├── POST /items (Add item)
    │   ├── PUT /items/:itemId (Update quantity)
    │   └── DELETE (Clear cart)
    ├── /orders
    │   ├── GET /user/:userId (List orders)
    │   ├── GET /:id (Get order)
    │   ├── POST (Create order)
    │   └── PUT /:id/status (Update status)
    └── /users
        ├── GET /:id
        ├── POST (Create/upsert)
        └── PUT /:id
```

### Middleware Stack

```
Request → CORS → express.json() → Route Handler → Response
```

### Database Access

```
Route Handler → Supabase Client → PostgreSQL → Response
```

## Security

### Authentication
- Supabase Auth handles user authentication
- Email/password with email verification
- JWT tokens for session management

### Authorization
- Row Level Security (RLS) on all tables
- Users can only access their own data (carts, orders)
- Public read access for catalog data (categories, items)

### API Security
- CORS enabled for frontend origin
- Environment variables for sensitive data
- JWT middleware available (not currently enforced)

### Database Security
- RLS policies enforce data access rules
- Foreign key constraints maintain data integrity
- UUID primary keys prevent enumeration

## Performance Considerations

### Database
- Indexes on foreign keys
- Indexes on frequently queried columns (status, user_id)
- Efficient queries with proper JOINs

### Frontend
- React Context prevents prop drilling
- Lazy loading with React Router
- Optimistic UI updates for cart operations

### Backend
- Stateless API (horizontally scalable)
- Connection pooling via Supabase client
- Efficient SQL queries

## Deployment Architecture

### Recommended Setup

```
┌─────────────────────────────────────────────────┐
│  Frontend (Vercel/Netlify)                     │
│  - Static files served via CDN                 │
│  - Environment variables configured            │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS
                    ↓
┌─────────────────────────────────────────────────┐
│  Backend (Railway/Render/Heroku)               │
│  - Node.js server                              │
│  - Auto-scaling enabled                        │
└───────────────────┬─────────────────────────────┘
                    │ SSL
                    ↓
┌─────────────────────────────────────────────────┐
│  Supabase (Cloud)                              │
│  - PostgreSQL database                         │
│  - Authentication service                      │
│  - Storage service                             │
└─────────────────────────────────────────────────┘
```

## Scalability

### Horizontal Scaling
- Frontend: CDN distribution
- Backend: Multiple server instances
- Database: Supabase handles scaling

### Vertical Scaling
- Database: Upgrade Supabase plan
- Backend: Increase server resources

### Caching Opportunities
- Category and item listings (client-side)
- Static assets (CDN)
- API responses (Redis - future)

## Monitoring & Logging

### Frontend
- Browser console for client errors
- Supabase dashboard for auth metrics

### Backend
- Server logs (console.log)
- Supabase dashboard for database metrics

### Database
- Supabase dashboard for:
  - Query performance
  - Database size
  - Connection pool usage

## Future Enhancements

1. **Admin Panel**
   - Manage items, categories, orders
   - View analytics and reports

2. **Payment Integration**
   - Stripe/PayPal integration
   - Payment history

3. **Real-time Features**
   - Order status updates (Supabase Realtime)
   - Live inventory updates

4. **Advanced Features**
   - Search functionality
   - Filters (price range, dietary restrictions)
   - Reviews and ratings
   - Favorites/wishlists

5. **Notifications**
   - Email notifications for orders
   - Push notifications for status updates

6. **Analytics**
   - Order analytics
   - Popular items
   - Revenue tracking

## Development Workflow

```
Feature Development
↓
Local Testing (client + server + Supabase)
↓
Git Commit
↓
Push to Repository
↓
CI/CD Pipeline (GitHub Actions)
├─→ Frontend Deploy (Vercel)
└─→ Backend Deploy (Railway)
↓
Production
```

---

Last Updated: November 2025

