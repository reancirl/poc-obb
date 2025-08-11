<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Broker upgrade fields
            $table->boolean('is_broker')->default(false)->after('role');
            $table->string('company_name')->nullable()->after('is_broker');
            $table->string('broker_phone')->nullable()->after('company_name');
            $table->string('serving_area')->nullable()->after('broker_phone');
            $table->string('website')->nullable()->after('serving_area');
            $table->string('profile_photo')->nullable()->after('website');
            $table->text('bio')->nullable()->after('profile_photo');
            $table->string('license_number')->nullable()->after('bio');
            $table->string('license_state')->nullable()->after('license_number');
            $table->timestamp('broker_upgraded_at')->nullable()->after('license_state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_broker',
                'company_name',
                'broker_phone',
                'serving_area',
                'website',
                'profile_photo',
                'bio',
                'license_number',
                'license_state',
                'broker_upgraded_at'
            ]);
        });
    }
};
