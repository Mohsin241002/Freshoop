# Admin Dashboard Guide

## Overview

The Freshoop Admin Dashboard is a comprehensive inventory management system that allows administrators to manage products, categories, orders, and monitor business metrics in real-time.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics Cards**
  - Total items count
  - Low stock alerts (< 10 units)
  - Total orders count
  - Pending deliveries count
- **Low Stock Alerts** - Quick view of items needing restocking
- **Recent Orders** - Latest 5 orders with status

### 📦 Inventory Management
- **Add/Edit/Delete Items**
  - Full CRUD operations for products
  - Image upload with drag & drop support
  - Form validation
  - Real-time preview
- **Stock Management**
  - Quick stock adjustments (+1, +10, -1, -10)
  - Custom stock quantity input
  - Stock level color coding (green/orange/red)
  - Low stock warnings
- **Availability Toggle**
  - Enable/disable items for sale
  - Visual indicators for item status

### 🏷️ Category Management
- Create, edit, and delete categories
- Display order control
- Category-based item filtering
- Item count per category

### 🛍️ Order Management
- View all orders with detailed information
- Filter by status (pending, processing, delivered, cancelled)
- Search by order number or customer email
- Update order status
- View customer information and delivery address
- Order item breakdown with pricing

## Setup Instructions

### 1. Backend Configuration

#### Set Admin Emails
Add admin email addresses to your environment variables in `/server/.env`:

```env
ADMIN_EMAILS=admin@example.com,manager@example.com
```

Multiple admin emails can be separated by commas.

#### Supabase Storage Setup

1. **Create Storage Bucket**
   - Go to your Supabase Dashboard
   - Navigate to Storage
   - Create a new bucket named `product-images`
   - Make it **public** (allow public access for images)

2. **Set Bucket Policies**
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Allow authenticated users to upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'product-images');

   -- Allow public read access
   CREATE POLICY "Allow public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'product-images');

   -- Allow authenticated users to update
   CREATE POLICY "Allow authenticated users to update"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'product-images');

   -- Allow authenticated users to delete
   CREATE POLICY "Allow authenticated users to delete"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'product-images');
   ```

#### Update Database Schema (if needed)

Ensure your `users` table has a `role` column:

```sql
-- Add role column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';

-- Update existing admin users
UPDATE users SET role = 'admin' WHERE email IN ('admin@example.com', 'manager@example.com');
```

### 2. Frontend Setup

No additional configuration needed! The admin dashboard is already integrated.

### 3. Access the Admin Dashboard

#### For Admins:
1. Go to the login page at `/login`
2. Look for the "Admin Portal Access" button at the bottom
3. Click it to navigate to `/admin`
4. Sign in with your admin credentials
5. You'll be automatically verified and granted access

#### For Regular Users:
- Non-admin users will see an "Access Denied" message
- They'll be redirected to the shop after 2 seconds

## File Structure

```
client/src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.jsx       # Main admin layout with sidebar
│   │   ├── StatsCards.jsx        # Dashboard statistics cards
│   │   ├── ItemForm.jsx          # Add/Edit item form with image upload
│   │   ├── AdminItemCard.jsx     # Item card with quick actions
│   │   ├── CategoryForm.jsx      # Add/Edit category form
│   │   └── OrdersList.jsx        # Orders list with filtering
│   └── AdminRoute.jsx            # Protected route for admin access
├── pages/
│   └── AdminDashboard.jsx        # Main dashboard page with tabs
└── services/
    └── adminService.js           # Admin API service layer

server/
├── controllers/
│   └── ordersController.js       # Enhanced with admin endpoints
├── middleware/
│   └── isAdmin.js                # Admin authorization middleware
└── routes/
    └── orders.js                 # Admin order routes
```

## Usage Guide

### Managing Items

#### Adding a New Item
1. Navigate to the "Manage Items" tab
2. Click "Add New Item" button
3. Fill in the form:
   - Item Name (required)
   - Description (required)
   - Price (required)
   - Unit (kg, g, l, ml, piece, dozen, pack)
   - Category (required)
   - Stock Quantity (required)
   - Upload image (drag & drop or click to upload)
   - Toggle availability
4. Click "Create Item"

#### Editing an Item
1. Find the item in the grid
2. Click the "Edit" button
3. Modify the fields
4. Click "Update Item"

#### Quick Stock Updates
- Use +1/+10/-1/-10 buttons for quick adjustments
- Or enter a custom stock quantity and click "Set"

#### Deleting an Item
1. Click the "Delete" button on the item card
2. Confirm the deletion
3. Click "Yes, Delete"

### Managing Categories

#### Adding a Category
1. Navigate to "Manage Categories" tab
2. Click "Add Category"
3. Enter category name and display order
4. Click "Create Category"

#### Editing/Deleting Categories
- Click "Edit" to modify category details
- Click "Delete" to remove a category (requires confirmation)

### Managing Orders

#### Viewing Orders
1. Navigate to "Manage Orders" tab
2. Use filters to show specific status:
   - All
   - Pending
   - Processing
   - Delivered
   - Cancelled
3. Search by order number or customer email

#### Updating Order Status
1. Click on an order to expand details
2. Use status update buttons:
   - **Pending** → "Mark Processing" or "Cancel"
   - **Processing** → "Mark Delivered"
   - **Delivered/Cancelled** → No further actions

#### Order Details
Each expanded order shows:
- Customer information (name, address, phone)
- Order details (ID, items count, payment method)
- Order items with quantities and prices
- Total amount

## Security Features

### Access Control
- ✅ Admin verification on dashboard mount
- ✅ Redirect non-admins with error message
- ✅ Protected API endpoints with `isAdmin` middleware
- ✅ Email-based admin authorization
- ✅ Token-based authentication for all requests

### Data Protection
- ✅ Form validation for all inputs
- ✅ Confirmation dialogs for destructive actions
- ✅ Stock validation during updates
- ✅ Image upload size limits (5MB max)
- ✅ File type validation for uploads

## UI/UX Features

### Design Elements
- 🎨 Modern gradient buttons and cards
- 📱 Fully responsive layout
- 🌈 Color-coded stock levels (green/orange/red)
- ⚡ Loading states for all async operations
- 📢 Toast notifications for actions
- 🎭 Smooth transitions and animations

### User Interactions
- ✨ Hover effects on cards
- 🔄 Auto-refresh after CRUD operations
- 🎯 Real-time stock updates
- 🖼️ Image preview before upload
- 🗂️ Tab-based navigation
- 🔍 Search and filter functionality

## API Endpoints

### Admin Items
```
POST   /api/items              # Create item
PUT    /api/items/:id          # Update item
DELETE /api/items/:id          # Delete item
GET    /api/items              # Get all items
```

### Admin Categories
```
POST   /api/categories         # Create category
PUT    /api/categories/:id     # Update category
DELETE /api/categories/:id     # Delete category
GET    /api/categories         # Get all categories
```

### Admin Orders
```
GET    /api/orders/admin/all   # Get all orders (admin only)
PATCH  /api/orders/:id/status  # Update order status (admin only)
```

### Image Upload
```
Supabase Storage API
Bucket: product-images
Path: items/{timestamp}-{random}.{ext}
```

## Troubleshooting

### "Access Denied" Error
- Verify your email is in `ADMIN_EMAILS` environment variable
- Restart the backend server after updating .env
- Clear browser cache and try again

### Image Upload Fails
- Check if `product-images` bucket exists in Supabase
- Verify bucket is set to public
- Check storage policies are correctly set
- Ensure file size is under 5MB

### Orders Not Loading
- Verify admin middleware is working
- Check browser console for API errors
- Ensure `/api/orders/admin/all` endpoint is accessible

### Stock Not Updating
- Check item exists in database
- Verify authentication token is valid
- Check network tab for API errors

## Best Practices

### Inventory Management
1. **Regular Stock Checks**
   - Monitor low stock alerts daily
   - Restock items before they run out
   - Use color indicators to prioritize restocking

2. **Product Images**
   - Use high-quality, clear images
   - Prefer square format (1:1 ratio)
   - Keep images under 2MB for faster loading
   - Use descriptive filenames

3. **Categories**
   - Keep category names short and clear
   - Use display order to prioritize popular categories
   - Don't delete categories with existing items

4. **Order Processing**
   - Check pending orders multiple times daily
   - Update status promptly
   - Mark as "Processing" when preparing order
   - Mark as "Delivered" only after confirmation

### Performance Tips
- Filter items by category when managing large inventories
- Use search to quickly find specific items
- Close expanded orders after updating to reduce DOM size
- Refresh dashboard periodically to get latest stats

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check backend logs in `/server/server.log`
4. Verify Supabase configuration and policies

## Future Enhancements

Potential features for future versions:
- [ ] Bulk item operations (import/export CSV)
- [ ] Advanced analytics and charts
- [ ] Sales reports and insights
- [ ] Customer management panel
- [ ] Email notifications for low stock
- [ ] Order printing functionality
- [ ] Multi-admin role management
- [ ] Activity logs and audit trails
- [ ] Inventory forecasting
- [ ] Mobile app version

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Author:** Freshoop Development Team

