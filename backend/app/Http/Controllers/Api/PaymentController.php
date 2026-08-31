<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Payments\StripePaymentService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    use ApiResponse;

    private const SHIPPING_COST = 250.00;

    /**
     * React calls this right before showing the Stripe card form,
     * so Stripe knows how much to charge based on the customer's current cart.
     */
    public function createStripeIntent(StripePaymentService $stripe)
    {
        $cart = Auth::user()->cart()->with('items')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return $this->error('Your cart is empty', null, 400);
        }

        $subtotal = $cart->items->sum(fn ($item) => $item->price * $item->quantity);
        $total = $subtotal + self::SHIPPING_COST;

        $intent = $stripe->createIntent($total);

        return $this->success($intent, 'Payment intent created');
    }
}