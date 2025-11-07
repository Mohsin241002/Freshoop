# Freshoop Client (Frontend)

React frontend for the Freshoop food ordering platform.

## 🛠️ Tech Stack

- React 19
- Vite
- TailwindCSS 4
- React Router v7
- Axios
- Supabase JS
- Lucide React (Icons)

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Runs on `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

Output in `dist/` folder

## 📁 Project Structure

```
src/
├── components/      # Reusable components
│   ├── Layout.jsx   # Main layout with header/footer
│   └── ItemCard.jsx # Food item card component
├── contexts/        # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   └── CartContext.jsx  # Shopping cart state
├── lib/            # Utilities and configurations
│   ├── api.js      # API client (Axios)
│   └── supabase.js # Supabase client
├── pages/          # Page components
│   ├── Home.jsx    # Menu/home page
│   ├── Cart.jsx    # Shopping cart page
│   ├── Orders.jsx  # Order history page
│   └── Auth.jsx    # Sign in/up page
├── App.jsx         # Main app with routing
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## 🔐 Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://freshoop.onrender.com/api
```

## 🎨 Styling

This project uses TailwindCSS 4. Customize in:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and Tailwind imports

## 🧩 Key Components

### Layout
Main application layout with header, navigation, and footer.

### ItemCard
Displays a food item with image, name, price, description, and "Add to Cart" button.

### Contexts

#### AuthContext
Provides authentication state and methods:
- `user` - Current user object
- `loading` - Auth loading state
- `signUp(email, password, fullName)` - Create account
- `signIn(email, password)` - Sign in
- `signOut()` - Sign out

#### CartContext
Provides cart state and methods:
- `cart` - Cart object with items
- `addToCart(itemId, quantity)` - Add item to cart
- `updateCartItem(itemId, quantity)` - Update quantity
- `removeFromCart(itemId)` - Remove item
- `clearCart()` - Clear all items
- `getCartTotal()` - Get total price
- `getCartItemsCount()` - Get item count

## 📄 License

MIT
