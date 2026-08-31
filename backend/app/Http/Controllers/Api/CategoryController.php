<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $categories = Category::where('status', true)->orderBy('name')->get();

        return $this->success($categories, 'Categories fetched successfully');
    }

    public function show(string $id)
    {
        $category = Category::where('status', true)->find($id);

        if (! $category) {
            return $this->error('Category not found', null, 404);
        }

        return $this->success($category, 'Category fetched successfully');
    }
}