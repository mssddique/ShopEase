<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Traits\ApiResponse;

class OrderController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $orders = Order::with('user:id,name,email')
            ->latest()
            ->paginate(15);

        return $this->success($orders, 'Orders fetched successfully');
    }

    public function show(string $id)
    {
        $order = Order::with(['user:id,name,email,phone', 'items'])->find($id);

        if (! $order) {
            return $this->error('Order not found', null, 404);
        }

        return $this->success($order, 'Order details fetched successfully');
    }

    public function updateStatus(UpdateOrderStatusRequest $request, string $id)
    {
        $order = Order::find($id);

        if (! $order) {
            return $this->error('Order not found', null, 404);
        }

        $order->update($request->validated());

        return $this->success($order->fresh(), 'Order status updated successfully');
    }
}