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
            ['name' => 'Electronics', 'description' => 'Phones, laptops, gadgets and accessories.'],
            ['name' => 'Fashion', 'description' => 'Clothing, footwear and accessories for men and women.'],
            ['name' => 'Home & Living', 'description' => 'Furniture, decor and household essentials.'],
            ['name' => 'Beauty & Personal Care', 'description' => 'Skincare, makeup and grooming products.'],
            ['name' => 'Sports & Outdoors', 'description' => 'Fitness equipment and outdoor gear.'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'image' => null,
                'status' => true,
            ]);
        }
    }
}