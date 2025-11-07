# Freshoop - Online Grocery Store

A full-stack online grocery shopping platform built with React, Node.js, Express, and Supabase (PostgreSQL).

## 🚀 Features

- **User Authentication** - Sign up, sign in, and secure authentication with Supabase Auth
- **Browse Groceries** - View fresh fruits, vegetables, dairy, meat, and more
- **Shopping Cart** - Add items to cart, update quantities, and manage cart
- **Order Management** - Place orders and view order history
- **Responsive Design** - Mobile-friendly UI with TailwindCSS
- **Real-time Updates** - Cart and order status updates
- **Image Storage** - Supabase Storage for product images

## 📁 Project Structure

```
Freshoop/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth, Cart)
│   │   ├── lib/          # API and Supabase clients
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main app component
│   ├── .env              # Environment variables
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   ├── .env             # Environment variables
│   └── package.json
│
└── README.md            # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Supabase JS** - Authentication & database

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Supabase** - Database & Auth
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT tokens

### Database
- **Supabase (PostgreSQL)** - Database
- **Supabase Storage** - File storage

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Freshoop
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. The database schema has already been created with migrations
3. Get your project URL and anon key from Project Settings > API

### 3. Configure Environment Variables

#### Client (.env)

Create or update `client/.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

#### Server (.env)

Create or update `server/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_secure_jwt_secret
PORT=3000
```

### 4. Install Dependencies

#### Install Client Dependencies

```bash
cd client
npm install
```

#### Install Server Dependencies

```bash
cd ../server
npm install
```

## 🚀 Running the Application

### Development Mode

You'll need two terminal windows/tabs:

#### Terminal 1 - Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:3000`

#### Terminal 2 - Start the Frontend

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd client
npm run build
```

#### Run Server in Production

```bash
cd server
npm start
```

## 📊 Database Schema

The application uses the following tables:

- **users** - User profiles
- **categories** - Food categories
- **items** - Food items/products
- **carts** - User shopping carts
- **cart_items** - Items in shopping carts
- **orders** - User orders
- **order_items** - Items in orders

All tables have Row Level Security (RLS) enabled with appropriate policies.

## 🗄️ Storage

A Supabase Storage bucket named `food-images` is configured for storing food item images with:
- Public read access
- Authenticated user upload/update/delete access
- 5MB file size limit
- Supported formats: JPEG, PNG, WebP, GIF

## 🔐 Authentication

The app uses Supabase Authentication with email/password:

1. Users can sign up with email and password
2. Email verification is required (configured in Supabase)
3. Authenticated users can access cart and orders
4. User sessions are managed by Supabase Auth

## 📝 API Endpoints

### Categories
- `GET /api/categories` - Get all grocery categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Items
- `GET /api/items` - Get all products (optional: ?category_id=xxx)
- `GET /api/items/:id` - Get product by ID
- `POST /api/items` - Create product
- `PUT /api/items/:id` - Update product
- `DELETE /api/items/:id` - Delete product

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/items` - Add item to cart
- `PUT /api/cart/:userId/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/:userId/items/:itemId` - Remove item from cart
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

## 🎨 UI Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Category Filtering** - Filter items by category
- **Real-time Cart** - Cart updates instantly
- **Order History** - View all past orders with status
- **Stock Management** - Shows stock availability
- **Toast Notifications** - User feedback for actions

## 🧪 Testing the Application

1. **Sign Up**: Create a new account
2. **Browse Products**: View all grocery items
3. **Filter by Category**: Click category buttons to filter (Fruits, Vegetables, etc.)
4. **Add to Cart**: Select quantity and add items
5. **View Cart**: Check items in your cart
6. **Place Order**: Checkout and create an order
7. **View Orders**: Check your order history

## 📱 Sample Data

The database includes sample grocery data:
- 6 Categories (Fruits, Vegetables, Dairy & Eggs, Bakery, Meat & Seafood, Beverages)
- 24 Grocery items across categories
- All items have stock and pricing

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Find and kill the process using the port
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Or change the port in .env files
```

### Database Connection Issues

1. Verify Supabase credentials in .env files
2. Check if your IP is allowed in Supabase (usually all IPs are allowed by default)
3. Ensure RLS policies are properly set up

### CORS Issues

Make sure the server is running and CORS is enabled in `server/index.js`

## 🚀 Deployment

### Render.com (Recommended)

Freshoop is optimized for deployment on Render.com with automatic builds and zero-downtime deployments.

#### Quick Deploy to Render

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Deploy via Render Dashboard:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create both services
   - Add environment variables when prompted
   - Click "Apply"

3. **Or deploy using the helper script:**
   ```bash
   npm run render:deploy
   ```

📖 **Full deployment guide:** See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

#### Environment Variables for Render

**Backend Service (freshoop-api):**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
ADMIN_EMAILS=your_admin_email
```

### Netlify Deployment (Recommended Frontend Host)

**Frontend on Netlify + Backend on Render**

The recommended setup uses:
- **Frontend:** Netlify (static hosting with CDN)
- **Backend:** Render (already running at https://freshoop.onrender.com)

1. **Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login and deploy
   netlify login
   netlify init
   netlify deploy --prod
   ```

2. **Set environment variables in Netlify Dashboard:**
   ```env
   VITE_API_URL=https://freshoop.onrender.com/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_PEXELS_API_KEY=your_pexels_key
   ```

3. **Configuration:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `client`

📖 **Full Netlify deployment guide:** See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

### Alternative: Vercel Deployment

For deploying the frontend to Vercel with Render backend:

1. **Backend:** Already running on Render at https://freshoop.onrender.com
2. **Frontend:** Deploy to Vercel (not recommended due to platform limitations)
   ```bash
   cd client
   npm run build
   ```

📖 **Note:** Vercel has strict serverless function limits on free tier. Netlify is recommended for this project.

### Alternative: Other Static Hosts (Cloudflare Pages, etc.)

1. Build the frontend: `cd client && npm run build`
2. Deploy the `client/dist` folder to your preferred static hosting service
3. Set environment variables:
   ```env
   VITE_API_URL=https://freshoop.onrender.com/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_PEXELS_API_KEY=your_pexels_key
   ```

### Alternative: Backend on Railway/Heroku

1. Deploy the `server` folder
2. Set environment variables
3. Ensure PORT is set correctly

### Database

Supabase is already hosted and managed. No additional deployment needed.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React, Node.js, and Supabase  
Fresh groceries delivered to your door 🥬🍎🥕

