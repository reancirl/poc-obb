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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Basic Information
            $table->enum('listing_type', ['Established Business for Sale', 'Asset Sale', 'Business Real Estate for Sale (No Business Included)', 'Business Real Estate for Lease (No Business Included)', 'Startup Opportunity']);
            $table->string('industry');
            $table->string('headline', 70);
            
            // Location Information
            $table->string('location_name');
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->string('county')->nullable();
            $table->string('location_confidentiality');
            
            // Contact Information
            $table->string('email');
            $table->string('phone_number')->nullable();
            
            // Financial Information
            $table->decimal('asking_price', 15, 2);
            $table->decimal('cash_flow', 15, 2)->nullable();
            $table->decimal('gross_revenue', 15, 2)->nullable();
            $table->string('ebitda')->nullable();
            $table->string('rent')->nullable();
            
            // Business Details
            $table->integer('year_established')->nullable();
            $table->boolean('seller_financing')->default(false);
            $table->text('business_description')->nullable();
            $table->string('ad_id')->nullable();
            $table->string('inventory')->nullable();
            
            // Real Estate Information
            $table->enum('real_estate_type', ['Leased', 'Owned'])->nullable();
            $table->integer('building_size')->nullable(); // in square feet
            $table->string('lease_expiration')->nullable();
            
            // Additional Information
            $table->integer('employees')->nullable();
            $table->text('facilities')->nullable();
            $table->text('competition')->nullable();
            $table->text('growth_expansion')->nullable();
            $table->text('financing_details')->nullable();
            $table->text('support_training')->nullable();
            $table->string('reason_for_selling')->nullable();
            
            // Agent Information
            $table->string('listing_agent')->nullable();
            $table->string('agent_phone_number')->nullable();
            
            // Status
            $table->enum('status', ['draft', 'published', 'sold', 'inactive'])->default('draft');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
