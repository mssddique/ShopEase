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
            ['name' => 'Samsung', 'description' => 'South Korean electronics manufacturer.'],
            ['name' => 'Nike', 'description' => 'Sportswear and footwear brand.'],
            ['name' => 'IKEA', 'description' => 'Furniture and home goods brand.'],
            ['name' => 'L\'Oreal', 'description' => 'Global beauty and cosmetics brand.'],
            ['name' => 'Generic', 'description' => 'Unbranded / local products.'],
        ];

        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand['name'],
                'slug' => Str::slug($brand['name']),
                'description' => $brand['description'],
                'image' => null,
                'status' => true,
            ]);
        }
    }
}