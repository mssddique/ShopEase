<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Samsung', 'description' => 'South Korean electronics manufacturer.', 'image' => 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Nike', 'description' => 'Sportswear and footwear brand.', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'IKEA', 'description' => 'Furniture and home goods brand.', 'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'L\'Oreal', 'description' => 'Global beauty and cosmetics brand.', 'image' => 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Generic', 'description' => 'Unbranded / local products.', 'image' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
        ];

        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand['name'],
                'slug' => Str::slug($brand['name']),
                'description' => $brand['description'],
                'image' => $brand['image'],
                'status' => true,
            ]);
        }
    }
}