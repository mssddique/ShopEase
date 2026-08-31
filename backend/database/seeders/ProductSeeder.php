<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        $brands = Brand::all();

        $products = [
            ['name' => 'Samsung Galaxy S23', 'price' => 259999, 'sale_price' => 244999],
            ['name' => 'Samsung Galaxy A54', 'price' => 89999, 'sale_price' => null],
            ['name' => 'Samsung 55" Smart TV', 'price' => 149999, 'sale_price' => 139999],
            ['name' => 'Samsung Galaxy Buds', 'price' => 24999, 'sale_price' => null],
            ['name' => 'Nike Air Max Sneakers', 'price' => 18999, 'sale_price' => 15999],
            ['name' => 'Nike Running T-Shirt', 'price' => 3999, 'sale_price' => null],
            ['name' => 'Nike Track Pants', 'price' => 5999, 'sale_price' => 4999],
            ['name' => 'Nike Sports Cap', 'price' => 1999, 'sale_price' => null],
            ['name' => 'IKEA Office Chair', 'price' => 22999, 'sale_price' => 19999],
            ['name' => 'IKEA Study Table', 'price' => 27999, 'sale_price' => null],
            ['name' => 'IKEA Bookshelf', 'price' => 15999, 'sale_price' => null],
            ['name' => 'IKEA Bed Frame', 'price' => 45999, 'sale_price' => 39999],
            ['name' => 'L\'Oreal Face Serum', 'price' => 2999, 'sale_price' => 2499],
            ['name' => 'L\'Oreal Shampoo 400ml', 'price' => 1499, 'sale_price' => null],
            ['name' => 'L\'Oreal Lipstick', 'price' => 1899, 'sale_price' => null],
            ['name' => 'L\'Oreal Sunscreen SPF50', 'price' => 2199, 'sale_price' => 1899],
            ['name' => 'Generic Yoga Mat', 'price' => 2499, 'sale_price' => null],
            ['name' => 'Generic Dumbbell Set 10kg', 'price' => 8999, 'sale_price' => 7499],
            ['name' => 'Generic Camping Tent', 'price' => 12999, 'sale_price' => null],
            ['name' => 'Generic Cricket Bat', 'price' => 3499, 'sale_price' => 2999],
        ];

        // Map product names to category based on keywords
        $categoryMap = [
            'Samsung' => 'Electronics',
            'Nike'    => 'Fashion',
            'IKEA'    => 'Home & Living',
            "L'Oreal" => 'Beauty & Personal Care',
            'Generic' => 'Sports & Outdoors',
        ];

        // Map product names to brand
        $brandMap = [
            'Samsung' => 'Samsung',
            'Nike'    => 'Nike',
            'IKEA'    => 'IKEA',
            "L'Oreal" => "L'Oreal",
            'Generic' => 'Generic',
        ];

        foreach ($products as $index => $data) {
            // find which brand this product belongs to based on name prefix
            $brandKey = collect($brandMap)->keys()->first(fn ($key) => str_starts_with($data['name'], $key));
            $categoryKey = $categoryMap[$brandKey];

            $category = $categories->firstWhere('name', $categoryKey);
            $brand = $brands->firstWhere('name', $brandMap[$brandKey]);

            Product::create([
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']) . '-' . ($index + 1),
                'sku' => 'SKU-' . strtoupper(Str::random(8)),
                'description' => 'High quality ' . $data['name'] . '. Great value for money with reliable performance.',
                'price' => $data['price'],
                'sale_price' => $data['sale_price'],
                'stock' => rand(5, 100),
                'image' => null,
                'status' => true,
                'featured' => rand(0, 1) === 1,
            ]);
        }
    }
}