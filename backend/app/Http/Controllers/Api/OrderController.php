<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\Payments\StripePaymentService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    use ApiResponse;

    private const SHIPPING_COST = 250.00;

    public function checkout(CheckoutRequest $request, StripePaymentService $stripe)
    {
        $cart = Cart::with('items.product')->where('user_id', Auth::id())->first();

        if (! $cart || $cart->items->isEmpty()) {
            return $this->error('Your cart is empty', null, 400);
        }

        $paymentMethod = $request->payment_method ?? 'cod';

        // Verify the Stripe payment actually succeeded BEFORE creating the order or touching stock
        if ($paymentMethod === 'stripe') {
            if (! $stripe->verify($request->payment_intent_id)) {
                return $this->error('Payment verification failed. Please try again.', null, 400);
            }
        }

        try {
            $order = DB::transaction(function () use ($request, $cart, $paymentMethod) {

                $subtotal = 0;
                $orderItemsData = [];

                foreach ($cart->items as $item) {
                    $product = Product::lockForUpdate()->find($item->product_id);

                    if (! $product) {
                        throw new \Exception("A product in your cart no longer exists.");
                    }
                    if (! $product->status) {
                        throw new \Exception("\"{$product->name}\" is no longer available.");
                    }
                    if ($item->quantity > $product->stock) {
                        throw new \Exception("Insufficient stock for \"{$product->name}\". Only {$product->stock} left.");
                    }

                    $currentPrice = $product->final_price;
                    $lineTotal = $currentPrice * $item->quantity;
                    $subtotal += $lineTotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'price' => $currentPrice,
                        'quantity' => $item->quantity,
                        'total' => $lineTotal,
                        'product' => $product,
                    ];
                }

                $shippingCost = self::SHIPPING_COST;
                $total = $subtotal + $shippingCost;

                // Stripe was already verified above → mark paid immediately
                // COD stays pending, exactly as before
                $paymentStatus = $paymentMethod === 'stripe' ? 'paid' : 'pending';

                $order = Order::create([
                    'user_id' => Auth::id(),
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'status' => 'pending',
                    'payment_method' => $paymentMethod,
                    'payment_status' => $paymentStatus,
                    'shipping_name' => $request->shipping_name,
                    'shipping_phone' => $request->shipping_phone,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city' => $request->shipping_city,
                    'notes' => $request->notes,
                ]);

                foreach ($orderItemsData as $data) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $data['product_id'],
                        'product_name' => $data['product_name'],
                        'price' => $data['price'],
                        'quantity' => $data['quantity'],
                        'total' => $data['total'],
                    ]);

                    $data['product']->decrement('stock', $data['quantity']);
                }

                $cart->items()->delete();

                return $order;
            });
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), null, 400);
        }

        $order->load('items');

        return $this->success($order, 'Order placed successfully', 201);
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())->latest()->paginate(10);
        return $this->success($orders, 'Orders fetched successfully');
    }

    public function show(string $id)
    {
        $order = Order::with('items')->where('user_id', Auth::id())->find($id);
        if (! $order) {
            return $this->error('Order not found', null, 404);
        }
        return $this->success($order, 'Order details fetched successfully');
    }
}