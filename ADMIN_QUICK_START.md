# Admin Dashboard - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Admin Access
Edit `/server/.env` and add admin emails:
```env
ADMIN_EMAILS=your-email@example.com,admin2@example.com
```

### Step 2: Create Supabase Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Create bucket named `product-images`
3. Make it **Public**
4. Apply these policies:

```sql
-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow public read
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-images');
```

### Step 3: Restart Backend
```bash
cd server
npm start
```

### Step 4: Access Admin Dashboard
1. Go to `http://localhost:5173/login`
2. Click **"Admin Portal Access"** button
3. Login with your admin email
4. Start managing inventory! 🎉

## 📋 Quick Actions Cheat Sheet

### Add New Item
```
Dashboard → Manage Items → Add New Item
- Fill form (name, price, category, stock)
- Drag & drop image
- Click Create Item
```

### Update Stock
```
Dashboard → Manage Items
- Find item card
- Use +1/+10/-1/-10 buttons
- Or enter custom amount
```

### Create Category
```
Dashboard → Manage Categories → Add Category
- Enter name
- Set display order (0 = first)
- Click Create
```

### Process Orders
```
Dashboard → Manage Orders
- Click order to expand
- Update status:
  • Pending → Processing
  • Processing → Delivered
```

## 🎯 Dashboard Tabs

| Tab | Purpose | Key Features |
|-----|---------|-------------|
| **Overview** | Monitor stats | Stats cards, Low stock alerts, Recent orders |
| **Manage Items** | Inventory control | Add/Edit/Delete items, Stock management |
| **Manage Categories** | Organize products | Create/Edit/Delete categories |
| **Manage Orders** | Order processing | View all orders, Update status |

## 🔑 Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit forms
- `Esc` - Close modals
- `Ctrl/Cmd + Click` - Open in new tab

## ⚡ Pro Tips

1. **Stock Management**
   - Red = Out of stock (0)
   - Orange = Low stock (< 10)
   - Green = Good stock (≥ 10)

2. **Image Upload**
   - Recommended size: 800x800px
   - Max file size: 5MB
   - Formats: JPG, PNG, WEBP

3. **Categories**
   - Use display_order: 0, 1, 2, 3...
   - Lower numbers appear first
   - Don't delete categories with items

4. **Orders**
   - Check pending orders regularly
   - Update status promptly
   - Search by order number or email

## 🛠️ Troubleshooting

### Can't Access Admin Panel?
✅ Check ADMIN_EMAILS in .env  
✅ Restart backend server  
✅ Clear browser cache  

### Image Upload Fails?
✅ Verify bucket exists: `product-images`  
✅ Check bucket is public  
✅ File size under 5MB  

### Orders Not Loading?
✅ Check browser console  
✅ Verify API endpoint: `/api/orders/admin/all`  
✅ Check admin middleware  

## 📞 Support

Need help? Check:
1. Full guide: `ADMIN_DASHBOARD_GUIDE.md`
2. Backend logs: `server/server.log`
3. Browser console: `F12` → Console tab

## 🎨 UI Colors

- **Brand Green**: `#77BF54` - Primary actions
- **Orange**: Stock warnings
- **Red**: Alerts & delete actions
- **Blue**: Edit actions
- **Purple**: Orders & deliveries

---

**Happy Managing! 🎊**

*For detailed documentation, see [ADMIN_DASHBOARD_GUIDE.md](./ADMIN_DASHBOARD_GUIDE.md)*

