<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin, seller, and buyer users
        $this->call([
            AdminUserSeeder::class,
        ]);
        
        // You can uncomment and use factories for testing
        // \App\Models\User::factory(10)->create();
    }
}
