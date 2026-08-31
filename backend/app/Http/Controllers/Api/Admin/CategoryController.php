<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Traits\ApiResponse;
use App\Traits\HandlesImageUploads;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse, HandlesImageUploads;

    public function index()
    {
        $categories = Category::latest()->paginate(15);

        return $this->success($categories, 'Categories fetched successfully');
    }

    public function store(StoreCategoryRequest $request)
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $this->storeImage($request->file('image'), 'categories');
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'description' => $request->description,
            'image' => $imagePath,
            'status' => $request->status ?? true,
        ]);

        return $this->success($category, 'Category created successfully', 201);
    }

    public function update(UpdateCategoryRequest $request, string $id)
    {
        $category = Category::find($id);

        if (! $category) {
            return $this->error('Category not found', null, 404);
        }

        $data = $request->validated();
        unset($data['image']);

        if ($request->filled('name')) {
            $data['slug'] = Str::slug($request->name) . '-' . Str::random(5);
        }

        if ($request->hasFile('image')) {
            $this->deleteImage($category->image);
            $data['image'] = $this->storeImage($request->file('image'), 'categories');
        }

        $category->update($data);

        return $this->success($category->fresh(), 'Category updated successfully');
    }

    public function destroy(string $id)
    {
        $category = Category::find($id);

        if (! $category) {
            return $this->error('Category not found', null, 404);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }
}