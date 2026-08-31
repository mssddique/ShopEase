<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    use ApiResponse;

    // Ensures every user has exactly one cart, creates one if missing (safety net)
    private function getOrCreateCart()
    {
        return Cart::firstOrCreate(['user_id' => Auth::id()]);
    }

    private function formatCart(Cart $cart)
    {
        $cart->load('items.product.category', 'items.product.brand');

        $subtotal = $cart->items->sum(fn ($item) => $item->price * $item->quantity);

        return [
            'cart_id' => $cart->id,
            'items' => $cart->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => $item->product,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'item_total' => $item->price * $item->quantity,
                ];
            }),
            'subtotal' => $subtotal,
            'total' => $subtotal, // shipping added later at checkout
        ];
    }

    public function index()
    {
        $cart = $this->getOrCreateCart();

        return $this->success($this->formatCart($cart), 'Cart fetched successfully');
    }

    public function store(AddToCartRequest $request)
    {
        $product = Product::find($request->product_id);

        if (! $product) {
            return $this->error('Product not found', null, 404);
        }

        if (! $product->status) {
            return $this->error('This product is not available', null, 400);
        }

        $cart = $this->getOrCreateCart();

        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        $requestedQuantity = $request->quantity + ($existingItem->quantity ?? 0);

        if ($requestedQuantity > $product->stock) {
            return $this->error(
                "Only {$product->stock} item(s) in stock",
                null,
                400
            );
        }

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $requestedQuantity,
                'price' => $product->final_price,
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->final_price,
            ]);
        }

        return $this->success($this->formatCart($cart), 'Product added to cart');
    }

    public function update(UpdateCartRequest $request, string $id)
    {
        $cart = $this->getOrCreateCart();

        $item = CartItem::where('cart_id', $cart->id)->find($id);

        if (! $item) {
            return $this->error('Cart item not found', null, 404);
        }

        if ($request->quantity > $item->product->stock) {
            return $this->error(
                "Only {$item->product->stock} item(s) in stock",
                null,
                400
            );
        }

        $item->update(['quantity' => $request->quantity]);

        return $this->success($this->formatCart($cart), 'Cart updated successfully');
    }

    public function destroy(string $id)
    {
        $cart = $this->getOrCreateCart();

        $item = CartItem::where('cart_id', $cart->id)->find($id);

        if (! $item) {
            return $this->error('Cart item not found', null, 404);
        }

        $item->delete();

        return $this->success($this->formatCart($cart), 'Item removed from cart');
    }

    public function clear()
    {
        $cart = $this->getOrCreateCart();

        $cart->items()->delete();

        return $this->success($this->formatCart($cart), 'Cart cleared successfully');
    }
}