<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use App\Traits\ApiResponse;
use App\Traits\HandlesImageUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse, HandlesImageUploads;

    public function index()
    {
        $products = Product::with(['category', 'brand', 'images'])
            ->latest()
            ->paginate(15);

        return $this->success($products, 'Products fetched successfully');
    }

    public function store(StoreProductRequest $request)
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $this->storeImage($request->file('image'), 'products');
        }

        $product = Product::create([
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'sku' => $request->sku,
            'description' => $request->description,
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'stock' => $request->stock,
            'image' => $imagePath,
            'status' => $request->status ?? true,
            'featured' => $request->featured ?? false,
        ]);

        return $this->success($product, 'Product created successfully', 201);
    }

    public function show(string $id)
    {
        $product = Product::with(['category', 'brand', 'images'])->find($id);

        if (! $product) {
            return $this->error('Product not found', null, 404);
        }

        return $this->success($product, 'Product fetched successfully');
    }

    public function update(UpdateProductRequest $request, string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->error('Product not found', null, 404);
        }

        $data = $request->validated();
        unset($data['image']); // handle image separately below

        if ($request->filled('name')) {
            $data['slug'] = Str::slug($request->name) . '-' . Str::random(5);
        }

        if ($request->hasFile('image')) {
            // delete old image before storing new one
            $this->deleteImage($product->image);
            $data['image'] = $this->storeImage($request->file('image'), 'products');
        }

        $product->update($data);

        return $this->success($product->fresh(), 'Product updated successfully');
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->error('Product not found', null, 404);
        }

        $product->delete(); // triggers the booted() event to clean up images

        return $this->success(null, 'Product deleted successfully');
    }

    /**
     * Upload one or more additional gallery images for a product.
     */
    public function uploadImages(Request $request, string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->error('Product not found', null, 404);
        }

        $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $uploaded = [];

        foreach ($request->file('images') as $file) {
            $path = $this->storeImage($file, 'products/gallery');

            $uploaded[] = ProductImage::create([
                'product_id' => $product->id,
                'image' => $path,
            ]);
        }

        return $this->success($uploaded, 'Images uploaded successfully', 201);
    }
}
