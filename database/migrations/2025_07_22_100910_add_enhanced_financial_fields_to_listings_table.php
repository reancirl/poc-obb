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
        Schema::table('listings', function (Blueprint $table) {
            // Enhanced financial fields
            $table->decimal('ffe', 15, 2)->nullable()->after('ebitda'); // Furniture, Fixtures & Equipment
            $table->decimal('inventory_value', 15, 2)->nullable()->after('ffe');
            $table->boolean('inventory_included_in_asking_price')->default(false)->after('inventory_value');
            $table->string('financing_notes', 80)->nullable()->after('inventory_included_in_asking_price');
            $table->boolean('seller_financing_available')->default(false)->after('financing_notes');
            $table->string('real_estate_property_type')->nullable()->after('seller_financing_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'ffe',
                'inventory_value',
                'inventory_included_in_asking_price',
                'financing_notes',
                'seller_financing_available',
                'real_estate_property_type'
            ]);
        });
    }
};
