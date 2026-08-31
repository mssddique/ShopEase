<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Traits\ApiResponse;

class BrandController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $brands = Brand::where('status', true)->orderBy('name')->get();

        return $this->success($brands, 'Brands fetched successfully');
    }

    public function show(string $id)
    {
        $brand = Brand::where('status', true)->find($id);

        if (! $brand) {
            return $this->error('Brand not found', null, 404);
        }

        return $this->success($brand, 'Brand fetched successfully');
    }
}