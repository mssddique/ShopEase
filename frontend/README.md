# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


✅ Step 1 Complete!
Your project is now set up with:

✅ React + Vite

✅ Bootstrap 5 installed

✅ React Router installed

✅ Axios installed

✅ Clean folder structure

✅ Environment variables configured

✅ Step 2 Complete!
You now have:

✅ Complete folder structure

✅ Axios configuration with interceptors

✅ MainLayout and AdminLayout

✅ Navbar with Bootstrap

✅ Footer

✅ Admin Sidebar

✅ Bootstrap Icons installed

✅ Step 3 Complete!
You now have:

✅ Complete Authentication System

✅ Login page with validation

✅ Register page with validation

✅ Logout functionality

✅ AuthContext for state management

✅ ProtectedRoute for protected pages

✅ AdminRoute for admin-only pages

✅ Navbar with user dropdown

✅ Token management with localStorage

✅ Axios interceptors for token handling

//
//
//
✅ Step 4 Complete!
You now have:

✅ Complete Homepage with all sections

✅ Hero section with CTA

✅ Categories section

✅ Featured Products

✅ Latest Products

✅ Brands section

✅ Promotional banner

✅ Why Choose Us section

✅ ProductCard component

✅ Loading component

✅ API services for products, categories, brands

✅ Responsive design

✅ Hover effects on cards

✅ Dummy data fallback when API is not available

//
//
//
✅ Step 5 Complete!
You now have:

✅ Complete Products page with filters

✅ Filter sidebar (desktop) and collapsible (mobile)

✅ Search, Category, Brand filters

✅ Price range filter

✅ Sorting (Latest, Price Low-High, Price High-Low)

✅ Pagination component

✅ Product grid with responsive layout (4 per row desktop, 2-3 tablet, 1-2 mobile)

✅ Empty state handling

✅ URL parameter synchronization

✅ Search functionality in Navbar

✅ Clear filters button


//
//
//
✅ Step 6 Complete!
You now have:

✅ Complete Product Details page

✅ Image gallery with main image and thumbnails

✅ Product information (name, brand, SKU, price)

✅ Discount calculation and display

✅ Stock status indicator

✅ Quantity selector with min/max validation

✅ Add to Cart button with loading state

✅ Buy Now button

✅ Wishlist button

✅ Related products section

✅ Breadcrumb navigation

✅ Additional product info (shipping, returns, etc.)

✅ Responsive design

✅ Step 7 Complete!
You now have:

✅ Categories listing page with cards

✅ Category detail page with products

✅ Brands listing page with cards

✅ Brand detail page with products

✅ Proper navigation between pages

✅ Loading states for all pages

✅ Empty states when no data

✅ Responsive grid layouts

✅ Product counts displayed

✅ Breadcrumb navigation

Current Routes Working:

/ - Homepage

/products - Products with filters

/products/:id - Product details

/categories - All categories

/categories/:id - Category products

/brands - All brands

/brands/:id - Brand products

/login - Login

/register - Register

//
//
//
✅ Step 8 Complete!
You now have:

✅ Cart API integration (get, add, update, remove, clear)

✅ CartContext for global cart state management

✅ Cart icon with item count badge

✅ Complete Cart page with:

Product list with images

Quantity controls

Item total calculation

Remove item functionality

Clear cart functionality

Order summary (subtotal, shipping, grand total)

Continue shopping button

Proceed to checkout button

✅ Add to Cart functionality in ProductCard

✅ Add to Cart and Buy Now in ProductDetails

✅ Free shipping threshold ($50)

//
//
//
✅ Step 9 Complete!
You now have:

✅ Wishlist API integration (get, add, remove)

✅ WishlistContext for global state

✅ Complete Wishlist page with:

Product cards with images

Remove from wishlist

Add to cart from wishlist

Empty state

✅ Complete Profile page with:

Display user info

Update profile (name, phone, address, city)

Form validation

Success/error messages

✅ Wishlist count in navbar

✅ Wishlist toggle in ProductCard and ProductDetails

✅ Protected routes for wishlist and profile

//
//
//
✅ Step 10 Complete!
You now have:

✅ Checkout page with:

Shipping information form

Pre-filled user data

Form validation

Order summary with items

Total calculation (subtotal, shipping, grand total)

Cash on Delivery payment

Place order functionality

✅ Order confirmation page

✅ Orders listing page with:

Order cards with status badges

Date, total, payment status

View order button

✅ Order details page with:

Order information

Shipping information

Order items with product details

Total calculation

✅ Order API integration

✅ Protected routes for checkout and orders

✅ Redirects for empty cart

✅ Success/error messages

//
//
//
✅ Step 11 Complete!
You now have a complete admin panel with:

Dashboard:
✅ Statistics cards (products, categories, brands, customers, orders, pending orders, sales)

✅ Recent orders list

✅ Low stock products list

Product Management:
✅ Product listing with table

✅ Create product form with all fields

✅ Edit product form

✅ Delete product

✅ Image upload

Category Management:
✅ Category listing with table

✅ Create category form

✅ Edit category form

✅ Delete category

✅ Image upload

Brand Management:
✅ Brand listing with table

✅ Create brand form

✅ Edit brand form

✅ Delete brand

✅ Image upload

Customer Management:
✅ Customer listing with table

Order Management:
✅ Order listing with table

✅ Order details page

✅ Update order status

✅ Customer information display

✅ Order items display

✅ Total calculations

🎉 Project Complete!
Your E-Commerce Frontend is now fully functional!

All Features Implemented:
✅ Authentication (Register, Login, Logout)

✅ Homepage with sections

✅ Products with filters and pagination

✅ Product details with gallery

✅ Categories and Brands

✅ Cart with quantity management

✅ Wishlist

✅ Checkout

✅ Orders

✅ Profile

✅ Admin Dashboard

✅ Admin Product Management

✅ Admin Category Management

✅ Admin Brand Management

✅ Admin Customer Management

✅ Admin Order Management

there is card load again and again why is this because of image because there is some dummy products has not have images yet so because of this the images or card is load in website because there is some products are show so that isn't load 
yeah i check that in backend there is products folder is located 
document.querySelectorAll('img').forEach(img => console.log(img.src)); {there isn't in console any output} 

1. see there is output 
2. PS C:\xampp8\htdocs\ecommerce-backend> Get-ChildItem public
    Directory: C:\xampp8\htdocs\ecommerce-backend\public
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
l----           8/13/2026  6:13 PM                storage -> 
                                                  C:\xampp8\htdocs\ecommerce-backend\storage\app\public
-a---           2/23/2025  2:49 PM            740 .htaccess
-a---           2/23/2025  2:49 PM              0 favicon.ico
-a---           2/23/2025  2:49 PM            543 index.php
-a---           2/23/2025  2:49 PM             24 robots.txt
PS C:\xampp8\htdocs\ecommerce-backend> 
3. PS C:\xampp8\htdocs\ecommerce-backend> Get-ChildItem public\storage\products
    Directory: C:\xampp8\htdocs\ecommerce-backend\public\storage\products
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           8/21/2026  4:55 PM          20007 2pjHSK7AXYYlqILuNQnv23AgqaIvcYI3ZbL9onNU.jpg
-a---           8/24/2026  4:25 PM          30777 ceDgUtjGUjD8gFnEkkrYD6GimOmxDn3ODGYZ5cFI.jpg
-a---           8/24/2026  4:23 PM          43973 EK6zuTyGZMAUjV3xPaoKDfU3c8jghc1b2n9b5r9n.jpg
-a---           8/24/2026  4:24 PM          32951 iySlWVNyuRu6uNZDKE4tF5UloesbQCBUGgjV3ndH.jpg
-a---           8/24/2026  4:09 PM          32950 M1VpgA6QHrw7fOi6MKySEHldcbGUOgXTRRsRaU3d.jpg
-a---           8/24/2026 11:14 AM          13837 uNjED0sQNdKadINGtvHg1JLhzuGWPo1XR5PjT5Nv.jpg
PS C:\xampp8\htdocs\ecommerce-backend>

//
//
//
PS C:\Users\Dev\ecommerce-frontend> $loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -ContentType "application/json" -Headers @{Accept="application/json"} -Body '{"email":"sara@example.com","password":"password"}'                        
>> $token = $loginResponse.data.token                                          
>> $headers = @{ Authorization = "Bearer $token"; Accept = "application/json" }
>>                                                                                                                   
>> (Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/cart" -Method GET -Headers $headers) | ConvertTo-Json -Depth 10
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "cart_id": 6,
    "items": [],
    "subtotal": 0,
    "total": 0
  }
}
PS C:\Users\Dev\ecommerce-frontend> 