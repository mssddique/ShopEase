<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


//
//Chatgpt Give PROMPT For Claude
//Start with:

STEP 1:
Laravel project setup.

STEP 2:
Database migrations.

STEP 3:
Models and relationships.

STEP 4:
Seeders.

STEP 5:
Authentication.

STEP 6:
Product/category/brand APIs.

STEP 7:
Cart.

STEP 8:
Wishlist.

STEP 9:
Checkout and orders.

STEP 10:
Admin APIs.

STEP 11:
Image uploads.

STEP 12:
Validation and error handling.

STEP 13:
CORS.

STEP 14:
API testing.

//
//
// Old Code Have To Replace 

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//
//
// this is the README TEXT of every step what is done Today(18-Aug-2026) there is 7 Steps  

---------------- STEP 1:  Laravel project setup. ----------------
This command (Laravel 12's new API installer) will:

Publish Sanctum's config and migration
Create routes/api.php if it doesn't exist
Add the api middleware group

ecommerce-backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php      ← we will build all our endpoints here
│   └── web.php
├── storage/
│   └── app/public/  ← product images will live here
└── .env

---------------- STEP 2: Database migrations. ----------------

This creates 9 files inside database/migrations/, each timestamped in the order you ran them (so foreign keys will resolve correctly). Now open each one and paste the code below.

Note: product_id is nullable with nullOnDelete() — if an admin deletes a product later, old orders stay intact (we already stored product_name and price at time of purchase, per the spec).

You should see all 10 tables created (users, password_reset_tokens, sessions, cache, jobs, categories, brands, products, product_images, carts, cart_items, orders, order_items, wishlists — the extra ones like cache/jobs come from Laravel's defaults and are harmless).


---------------- STEP 3: Models and relationships. ----------------
All 10 models are done with full relationships mapped (belongsTo, hasMany, hasOne).

---------------- STEP 4: Seeders. ----------------
⚠️ These are development-only credentials. Before deploying to production, change the admin password and remove/replace the seeder's test accounts.

---------------- STEP 5: Authentication. ----------------
5.1 Create an API Response helper trait

This keeps every controller's JSON responses consistent (per the spec in section 11).
Every controller we write will use App\Traits\ApiResponse; and call $this->success(...) / $this->error(...).

Note: password_confirmation / new_password_confirmation fields must be sent alongside password / new_password because of the confirmed rule.

Register the middleware (Laravel 12 style)

Laravel 12 doesn't use Kernel.php anymore — middleware aliases go in bootstrap/app.php.

Open bootstrap/app.php and update the ->withMiddleware() section:
(If your file already has other lines inside withMiddleware/withExceptions, just add the alias([...]) line — don't delete existing content.)

We'll keep appending to this file in later steps (products, cart, checkout, admin, etc.) — nothing here will need to be renamed later.

What we now have
----------------
Customer registration (auto-creates their cart)
Login (customer or admin, same endpoint — role is just a field on the user)
Logout (revokes current token)
Get/update profile
Change password
admin middleware alias ready to protect admin-only routes later

---------------- STEP 6: Product/category/brand APIs. ----------------

Note on search: Since GET /api/products?search=iphone already works through index(), the dedicated GET /api/products/search endpoint just calls the same method — this avoids duplicating filter logic while still matching the exact endpoint list from the spec.

GET /api/products — full filtering: search, category, brand, price range, featured, sorting, pagination (12 per page)
GET /api/products/search — same engine, dedicated endpoint
GET /api/products/{id} — single product with category, brand, and images loaded
GET /api/categories, GET /api/categories/{id}
GET /api/brands, GET /api/brands/{id}
All filters combine correctly (e.g. category + price range + sort together)

---------------- STEP 7: Cart. ----------------
Key points implemented (per spec section 5):

Checks product exists → 404 if not.
Checks product is active (status) → 400 if not.
Checks stock → 400 with clear message if exceeded.
If already in cart → increases quantity (accounting for existing quantity in the stock check).
Otherwise → creates new cart item.
Never allows quantity greater than available stock (checked on both add and update).
Response always returns product, quantity, price, item total, and cart subtotal/total.
Price is taken from $product->final_price (sale price if set, otherwise price) — never trusted from the frontend, satisfying the "never trust frontend prices" rule from section 18 in advance.

What we now have
----------------
GET /api/cart — view cart with items, product details, subtotal, total
POST /api/cart — add product (merges quantity if already present, enforces stock limit)
PUT /api/cart/{id} — update quantity (enforces stock limit)
DELETE /api/cart/{id} — remove one item
DELETE /api/cart — clear entire cart
Prices always pulled from the database (final_price), never trusted from the request

---------------- STEP 8: Wishlist. ----------------
Key points:

Checks product exists before adding → 404 if not.
Prevents duplicate wishlist entries → 409 Conflict if already added (the database's unique(['user_id', 'product_id']) constraint from the migration backs this up as a second layer of protection).
destroy() looks up by product_id (not wishlist row id), matching the route spec DELETE /api/wishlist/{product_id}.

What we now have
GET /api/wishlist — customer's wishlist with full product details
POST /api/wishlist/{product_id} — add product (blocks duplicates)
DELETE /api/wishlist/{product_id} — remove product

---------------- STEP 9: Checkout and orders. ----------------
Everything from spec section 6 is covered:

✅ Validates customer info (CheckoutRequest)
✅ Gets current cart
✅ Re-verifies products still exist
✅ Re-verifies stock (with lockForUpdate() to prevent race conditions if two requests hit at once)
✅ Calculates subtotal from the database, not the cart's cached price or frontend
✅ Calculates shipping (flat rate for now, easy to swap for a real calculation later)
✅ Calculates total
✅ Creates order
✅ Creates order items
✅ Reduces product stock
✅ Clears cart
✅ Returns order information
✅ Wrapped in DB::transaction() — if anything throws, the entire block rolls back automatically (order, order items, stock changes, cart deletion — all undone)

Why lockForUpdate()? It locks the product rows during the transaction so that if two customers try to buy the last item at the exact same time, the second one waits and then correctly sees the reduced stock — preventing overselling.

What we now have
POST /api/checkout — full transaction-safe order creation: re-validates stock, locks rows against race conditions, calculates everything server-side, rolls back completely on any failure
GET /api/orders — paginated order history for the logged-in customer
GET /api/orders/{id} — single order detail (customer can only see their own orders — enforced by where('user_id', Auth::id()))
Product prices and totals are always calculated from the database, never trusted from the frontend, satisfying spec section 18's most critical security rule

---------------- STEP 10: Admin APIs. ----------------
Note: POST /api/admin/products/{id}/images (image upload) is intentionally not added yet — that's Step 11.

(Using $headers, your customer token from earlier — this should return the "Unauthorized. Admin access only." message with a 403.)

What we now have
Full admin dashboard with live stats
Admin CRUD for products, categories, brands
Admin can view customers and all orders
Admin can change order status (and payment status)
Customer accounts are correctly blocked from every /api/admin/* route by the admin middleware

---------------- STEP 11: Image uploads. ----------------
What we now have
Product image upload (main image on create/update) — validated, size-limited, old image auto-deleted on replace
Product gallery images (multiple images per product) via dedicated endpoint
Category and brand image upload, following the same pattern
Automatic cleanup: images deleted from disk when their parent record is deleted
image_url accessor on all three models, so the frontend always gets a ready-to-use full URL

---------------- STEP 12: Validation and error handling.----------------
12.1 Centralize exception handling in bootstrap/app.php

Right now, our controllers manually return $this->error(...) for expected cases (like "Product not found"). But there are still cases we haven't covered globally:

Invalid/non-numeric ID passed to a route (e.g. /api/products/abc)
Model binding failures
Unhandled server exceptions (currently would leak a raw HTML/debug error if APP_DEBUG=true, or a blank 500 if false)
404 for routes that don't exist at all (e.g. typo'd endpoint)
Method not allowed (e.g. DELETE on a GET-only route)

---------------- STEP 13: CORS. ----------------

---------------- STEP 14: API testing. ----------------