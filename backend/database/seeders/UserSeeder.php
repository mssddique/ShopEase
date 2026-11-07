<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'phone' => '03000000000',
            'address' => 'Head Office, Main Street',
            'city' => 'Karachi',
            'role' => 'admin',
        ]);

        // 5 sample customers
        $customers = [
            ['name' => 'Ali Raza', 'email' => 'ali@example.com', 'city' => 'Karachi'],
            ['name' => 'Sara Khan', 'email' => 'sara@example.com', 'city' => 'Lahore'],
            ['name' => 'Bilal Ahmed', 'email' => 'bilal@example.com', 'city' => 'Islamabad'],
            ['name' => 'Ayesha Malik', 'email' => 'ayesha@example.com', 'city' => 'Faisalabad'],
            ['name' => 'Usman Tariq', 'email' => 'usman@example.com', 'city' => 'Multan'],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => 'password',
                'phone' => '0301' . rand(1000000, 9999999),
                'address' => 'Street ' . rand(1, 100) . ', ' . $customer['city'],
                'city' => $customer['city'],
                'role' => 'customer',
            ]);
        }
    }
}