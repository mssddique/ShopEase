<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $wishlist = Wishlist::with(['product.category', 'product.brand'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return $this->success($wishlist, 'Wishlist fetched successfully');
    }

    public function store(string $productId)
    {
        $product = Product::find($productId);

        if (! $product) {
            return $this->error('Product not found', null, 404);
        }

        $exists = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if ($exists) {
            return $this->error('Product is already in your wishlist', null, 409);
        }

        $wishlistItem = Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $productId,
        ]);

        $wishlistItem->load('product.category', 'product.brand');

        return $this->success($wishlistItem, 'Product added to wishlist', 201);
    }

    public function destroy(string $productId)
    {
        $wishlistItem = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (! $wishlistItem) {
            return $this->error('Product not found in wishlist', null, 404);
        }

        $wishlistItem->delete();

        return $this->success(null, 'Product removed from wishlist');
    }
}