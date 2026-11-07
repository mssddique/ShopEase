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
            ['name' => 'Samsung Galaxy S23', 'price' => 259999, 'sale_price' => 244999, 'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff025a6?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Samsung Galaxy A54', 'price' => 89999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Samsung 55" Smart TV', 'price' => 149999, 'sale_price' => 139999, 'image' => 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Samsung Galaxy Buds', 'price' => 24999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Nike Air Max Sneakers', 'price' => 18999, 'sale_price' => 15999, 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Nike Running T-Shirt', 'price' => 3999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Nike Track Pants', 'price' => 5999, 'sale_price' => 4999, 'image' => 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Nike Sports Cap', 'price' => 1999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'IKEA Office Chair', 'price' => 22999, 'sale_price' => 19999, 'image' => 'https://images.unsplash.com/photo-1580481077195-c328a37ea71a?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'IKEA Study Table', 'price' => 27999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'IKEA Bookshelf', 'price' => 15999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'IKEA Bed Frame', 'price' => 45999, 'sale_price' => 39999, 'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'L\'Oreal Face Serum', 'price' => 2999, 'sale_price' => 2499, 'image' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'L\'Oreal Shampoo 400ml', 'price' => 1499, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'L\'Oreal Lipstick', 'price' => 1899, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'L\'Oreal Sunscreen SPF50', 'price' => 2199, 'sale_price' => 1899, 'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Generic Yoga Mat', 'price' => 2499, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Generic Dumbbell Set 10kg', 'price' => 8999, 'sale_price' => 7499, 'image' => 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Generic Camping Tent', 'price' => 12999, 'sale_price' => null, 'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Generic Cricket Bat', 'price' => 3499, 'sale_price' => 2999, 'image' => 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=600&auto=format&fit=crop&q=80'],
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
                'image' => $data['image'],
                'status' => true,
                'featured' => rand(0, 1) === 1,
            ]);
        }
    }
}