<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [\App\Http\Controllers\PublicListingController::class, 'index'])->name('home');

Route::get('/before-login', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/search-business', function () {
    return Inertia::render('SearchBusiness');
})->name('search-business');

// Public listing routes
Route::get('/listings', [\App\Http\Controllers\PublicListingController::class, 'index'])->name('listings.index');
Route::get('/listings/{listing}', [\App\Http\Controllers\PublicListingController::class, 'show'])->name('listings.show');
Route::post('/listings/{listing}/contact', [\App\Http\Controllers\PublicListingController::class, 'contact'])->name('listings.contact');

// Authentication routes
require __DIR__.'/auth.php';

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Unified Messages Center for both seller and buyer
    Route::middleware(['role:seller,buyer'])->group(function () {
        Route::get('/messages', function () {
            return Inertia::render('Messages/Index');
        })->name('messages');
    });
    
    // Admin routes
    Route::prefix('admin')->middleware(['role:admin'])->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'admin'])->name('dashboard');
        
        // User Management
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::post('users/{user}/suspend', [\App\Http\Controllers\Admin\UserController::class, 'suspend'])
            ->name('users.suspend');
        Route::post('users/{user}/unsuspend', [\App\Http\Controllers\Admin\UserController::class, 'unsuspend'])
            ->name('users.unsuspend');
        
        // Listings Management - Admin can manage all listings
        Route::resource('listings', \App\Http\Controllers\Admin\ListingController::class);

        // Features in development for admin
        Route::get('/marketing', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Marketing Module',
                'returnUrl' => route('admin.dashboard')
            ]);
        })->name('marketing');

        Route::get('/website', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Website Management',
                'returnUrl' => route('admin.dashboard')
            ]);
        })->name('website');

        Route::get('/setup', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'System Setup',
                'returnUrl' => route('admin.dashboard')
            ]);
        })->name('setup');

        Route::get('/settings', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Admin Settings',
                'returnUrl' => route('admin.dashboard')
            ]);
        })->name('settings');

        Route::get('/dev-settings', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Developer Settings',
                'returnUrl' => route('admin.dashboard')
            ]);
        })->name('dev-settings');
    });
    
    // Seller routes
    Route::prefix('seller')->middleware(['role:seller'])->name('seller.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'seller'])->name('dashboard');
        
        // Listings Management - Sellers can only manage their own listings
        Route::resource('listings', \App\Http\Controllers\Seller\ListingController::class);
        
        // Messages now handled by unified Messages Center

        // Features in development for seller
        Route::get('/feedback', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Seller Feedback System',
                'returnUrl' => route('seller.dashboard')
            ]);
        })->name('feedback');
    });
    
    // Buyer routes
    Route::prefix('buyer')->middleware(['role:buyer'])->name('buyer.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'buyer'])->name('dashboard');
        
        // Features in development for buyer
        Route::get('/feedback', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Buyer Feedback System',
                'returnUrl' => route('buyer.dashboard')
            ]);
        })->name('feedback');
        
        // Messages now handled by unified Messages Center
        
        // Interested listings
        Route::get('/interested', [\App\Http\Controllers\Buyer\InterestedListingController::class, 'index'])->name('interested');
        Route::post('/interested/listings/{listing}/toggle', [\App\Http\Controllers\Buyer\InterestedListingController::class, 'toggle'])->name('interested.toggle');
        Route::post('/interested/listings/{listing}/star', [\App\Http\Controllers\Buyer\InterestedListingController::class, 'star'])->name('interested.star');
        Route::delete('/interested/listings/{listing}', [\App\Http\Controllers\Buyer\InterestedListingController::class, 'unstar'])->name('interested.unstar');
    });
});

// Settings routes
require __DIR__.'/settings.php';
