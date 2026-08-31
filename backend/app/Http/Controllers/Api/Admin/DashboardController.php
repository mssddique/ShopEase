<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Traits\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $data = [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_brands' => Brand::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_sales' => Order::where('payment_status', 'paid')->sum('total'),
            'recent_orders' => Order::with('user:id,name,email')
                ->latest()
                ->take(5)
                ->get(),
            'low_stock_products' => Product::where('stock', '<=', 5)
                ->where('status', true)
                ->select('id', 'name', 'stock', 'sku')
                ->get(),
        ];

        return $this->success($data, 'Dashboard data fetched successfully');
    }
}