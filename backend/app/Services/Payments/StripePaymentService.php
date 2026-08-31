<?php

namespace App\Services\Payments;

use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;

class StripePaymentService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Create a PaymentIntent for the given amount (in the smallest currency unit).
     */
    public function createIntent(float $amount, string $currency = 'usd'): array
    {
        $intent = $this->stripe->paymentIntents->create([
            'amount' => (int) round($amount * 100), // Stripe expects the smallest unit (cents)
            'currency' => $currency,
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return [
            'client_secret' => $intent->client_secret,
            'id' => $intent->id,
        ];
    }

    /**
     * Confirm a PaymentIntent actually succeeded, before we trust it and create the order.
     */
    public function verify(string $paymentIntentId): bool
    {
        try {
            $intent = $this->stripe->paymentIntents->retrieve($paymentIntentId);
            return $intent->status === 'succeeded';
        } catch (ApiErrorException $e) {
            return false;
        }
    }
}