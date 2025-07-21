<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the enum to include 'member'
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['buyer', 'seller', 'admin', 'member'])->default('member')->change();
        });
        
        // Then update existing buyer and seller roles to member
        DB::table('users')
            ->whereIn('role', ['buyer', 'seller'])
            ->update(['role' => 'member']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('member', function (Blueprint $table) {
            //
        });
    }
};
