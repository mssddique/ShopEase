<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Traits\ApiResponse;
use App\Traits\HandlesImageUploads;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    use ApiResponse, HandlesImageUploads;

    public function index()
    {
        $brands = Brand::latest()->paginate(15);

        return $this->success($brands, 'Brands fetched successfully');
    }

    public function store(StoreBrandRequest $request)
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $this->storeImage($request->file('image'), 'brands');
        }

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'description' => $request->description,
            'image' => $imagePath,
            'status' => $request->status ?? true,
        ]);

        return $this->success($brand, 'Brand created successfully', 201);
    }

    public function update(UpdateBrandRequest $request, string $id)
    {
        $brand = Brand::find($id);

        if (! $brand) {
            return $this->error('Brand not found', null, 404);
        }

        $data = $request->validated();
        unset($data['image']);

        if ($request->filled('name')) {
            $data['slug'] = Str::slug($request->name) . '-' . Str::random(5);
        }

        if ($request->hasFile('image')) {
            $this->deleteImage($brand->image);
            $data['image'] = $this->storeImage($request->file('image'), 'brands');
        }

        $brand->update($data);

        return $this->success($brand->fresh(), 'Brand updated successfully');
    }

    public function destroy(string $id)
    {
        $brand = Brand::find($id);

        if (! $brand) {
            return $this->error('Brand not found', null, 404);
        }

        $brand->delete();

        return $this->success(null, 'Brand deleted successfully');
    }
}
