<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // In production, use a more secure password
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        // Create seller user
        User::create([
            'name' => 'Seller User',
            'email' => 'seller@example.com',
            'password' => Hash::make('password'), // In production, use a more secure password
            'role' => 'seller',
            'email_verified_at' => now(),
        ]);
        
        // Create buyer user
        User::create([
            'name' => 'Buyer User',
            'email' => 'buyer@example.com',
            'password' => Hash::make('password'), // In production, use a more secure password
            'role' => 'buyer',
            'email_verified_at' => now(),
        ]);
    }
}
