<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'description' => 'Phones, laptops, gadgets and accessories.', 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Fashion', 'description' => 'Clothing, footwear and accessories for men and women.', 'image' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Home & Living', 'description' => 'Furniture, decor and household essentials.', 'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Beauty & Personal Care', 'description' => 'Skincare, makeup and grooming products.', 'image' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Sports & Outdoors', 'description' => 'Fitness equipment and outdoor gear.', 'image' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'image' => $category['image'],
                'status' => true,
            ]);
        }
    }
}