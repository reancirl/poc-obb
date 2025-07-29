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
            // Enhanced Business Details Fields
            $table->boolean('absentee_owner')->default(false)->after('real_estate_property_type');
            $table->boolean('home_based')->default(false)->after('absentee_owner');
            $table->boolean('relocatable')->default(false)->after('home_based');
            $table->boolean('established_franchise')->default(false)->after('relocatable');
            $table->string('business_website')->nullable()->after('established_franchise');
            $table->boolean('keep_website_confidential')->default(false)->after('business_website');
            $table->text('facilities_assets')->nullable()->after('keep_website_confidential');
            $table->text('market_competition')->nullable()->after('facilities_assets');
            
            // Social Media and Additional Fields
            $table->string('website')->nullable()->after('market_competition');
            $table->string('facebook')->nullable()->after('website');
            $table->string('twitter')->nullable()->after('facebook');
            $table->string('linkedin')->nullable()->after('twitter');
            $table->string('instagram')->nullable()->after('linkedin');
            $table->string('youtube')->nullable()->after('instagram');
            $table->string('other_social_media')->nullable()->after('youtube');
            $table->text('photos')->nullable()->after('other_social_media');
            $table->text('videos')->nullable()->after('photos');
            $table->text('documents')->nullable()->after('videos');
            $table->text('other_details')->nullable()->after('documents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            // Drop Enhanced Business Details Fields
            $table->dropColumn([
                'absentee_owner',
                'home_based',
                'relocatable',
                'established_franchise',
                'business_website',
                'keep_website_confidential',
                'facilities_assets',
                'market_competition',
                'website',
                'facebook',
                'twitter',
                'linkedin',
                'instagram',
                'youtube',
                'other_social_media',
                'photos',
                'videos',
                'documents',
                'other_details'
            ]);
        });
    }
};
