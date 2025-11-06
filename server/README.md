# Freshoop Server (Backend)

Node.js/Express backend API for the Freshoop food ordering platform.

## 🛠️ Tech Stack

- Node.js
- Express 5
- Supabase (PostgreSQL)
- CORS
- dotenv
- bcrypt
- jsonwebtoken
- nodemon (dev)

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Runs on `http://localhost:3000` with auto-reload

## 🏗️ Production

```bash
npm start
```

## 📁 Project Structure

```
server/
├── config/
│   └── supabase.js      # Supabase client configuration
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   ├── categories.js    # Category endpoints
│   ├── items.js         # Food item endpoints
│   ├── cart.js          # Shopping cart endpoints
│   ├── orders.js        # Order endpoints
│   └── users.js         # User profile endpoints
├── index.js             # Server entry point
└── package.json
```

## 🔐 Environment Variables

Create `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
PORT=3000
```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Items
- `GET /api/items` - Get all items (query: ?category_id=xxx)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/items` - Add item to cart
- `PUT /api/cart/:userId/items/:itemId` - Update cart item
- `DELETE /api/cart/:userId/items/:itemId` - Remove from cart
- `DELETE /api/cart/:userId` - Clear cart

### Orders
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order from cart
- `PUT /api/orders/:id/status` - Update order status

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users` - Create/update user profile
- `PUT /api/users/:id` - Update user profile

## 🔒 Authentication

JWT authentication middleware is available in `middleware/auth.js` but not currently applied to routes. To enable:

```javascript
import { authenticateToken } from './middleware/auth.js';

router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains decoded JWT
  res.json({ user: req.user });
});
```

## 🗄️ Database

Uses Supabase (PostgreSQL) with:
- Row Level Security (RLS)
- UUID primary keys
- Foreign key constraints
- Indexes for performance

## 📄 License

MIT

