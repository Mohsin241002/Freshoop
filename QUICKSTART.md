# Quick Start Guide

Get Freshoop up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Environment Setup (Already Done ✓)

Your `.env` files are already configured with Supabase credentials:
- ✅ Client environment: `client/.env`
- ✅ Server environment: `server/.env`
- ✅ Database schema created
- ✅ Sample data loaded
- ✅ Storage bucket configured

### 2. Start the Application

Open **TWO** terminal windows/tabs:

#### Terminal 1: Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
Server is running on port 3000
```

#### Terminal 2: Frontend

```bash
cd client
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 3. Open the App

Visit: **http://localhost:5173**

## 🎯 Test the Application

### Step 1: Create an Account
1. Click "Sign In" button in the header
2. Click "Don't have an account? Sign Up"
3. Fill in:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: (min 6 characters)
4. Click "Create Account"
5. Check your email for verification link (required by Supabase)

### Step 2: Browse Groceries
1. After signing in, you'll see the home page
2. Browse through 24 pre-loaded grocery items across 6 categories:
   - Fruits (Apples, Bananas, Oranges, Strawberries, Grapes)
   - Vegetables (Tomatoes, Carrots, Broccoli, Lettuce, Bell Peppers, Onions)
   - Dairy & Eggs (Milk, Greek Yogurt, Cheddar Cheese, Eggs)
   - Bakery (Whole Wheat Bread, Croissants, Bagels)
   - Meat & Seafood (Chicken Breast, Ground Beef, Salmon)
   - Beverages (Orange Juice, Almond Milk, Sparkling Water)

### Step 3: Add Items to Cart
1. Select quantity using +/- buttons
2. Click "Add" to add item to cart
3. Cart icon in header shows item count

### Step 4: View Cart
1. Click "Cart" in the header
2. Review items, adjust quantities
3. See total price
4. Click "Checkout" to place order

### Step 5: View Orders
1. Click "Orders" in the header
2. See your order history
3. Check order status (Pending/Delivered)

## 📦 What's Included

### Pre-loaded Data
- ✅ 6 Categories
- ✅ 24 Grocery Items (Fruits, Vegetables, Dairy, etc.)
- ✅ Stock quantities
- ✅ Realistic pricing

### Features Ready to Use
- ✅ User Authentication (Supabase Auth)
- ✅ Shopping Cart (Real-time updates)
- ✅ Order Management
- ✅ Category Filtering
- ✅ Stock Tracking
- ✅ Responsive Design

## 🔧 Common Issues

### Port Already in Use

If you see an error like "Port 3000 is already in use":

```bash
# Kill the process using the port
lsof -ti:3000 | xargs kill -9
# or
lsof -ti:5173 | xargs kill -9
```

### Email Verification Required

Supabase requires email verification by default. To disable for development:

1. Go to Supabase Dashboard
2. Authentication > Settings
3. Disable "Confirm email"

### Can't Sign In

Make sure:
1. You verified your email
2. Backend server is running
3. Supabase credentials are correct in `.env` files

## 📱 Mobile Testing

The app is fully responsive! Test on mobile:

1. Find your local IP: `ifconfig | grep inet` (macOS/Linux)
2. Update `VITE_API_URL` in `client/.env` to use your IP:
   ```
   VITE_API_URL=http://YOUR_IP:3000/api
   ```
3. Restart the frontend
4. Access from mobile: `http://YOUR_IP:5173`

## 🎨 Customization

### Add New Grocery Items

Use the Supabase Dashboard or API:

```bash
POST https://freshoop.onrender.com/api/items
{
  "name": "Organic Spinach",
  "description": "Fresh organic spinach leaves",
  "category_id": "uuid-of-vegetables-category",
  "price": 3.49,
  "stock_quantity": 100,
  "is_available": true
}
```

### Upload Product Images

1. Go to Supabase Dashboard > Storage
2. Select `food-images` bucket
3. Upload images
4. Copy public URL
5. Update item's `image_url` field

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI with TailwindCSS
- Add admin panel for managing items
- Implement payment gateway
- Add delivery tracking

## 🆘 Need Help?

- Check the main [README.md](README.md)
- Review server logs in Terminal 1
- Check browser console for errors (F12)
- Verify Supabase credentials

---

Happy coding! 🚀

