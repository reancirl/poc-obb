<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/search-business', function () {
    return Inertia::render('SearchBusiness');
})->name('search-business');

// Authentication routes
require __DIR__.'/auth.php';

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
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
    });
    
    // Seller routes
    Route::prefix('seller')->middleware(['role:seller'])->name('seller.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'seller'])->name('dashboard');
        
        // Listings Management - Sellers can only manage their own listings
        Route::resource('listings', \App\Http\Controllers\Seller\ListingController::class);
        
        // Messages
        Route::get('/messages', function () {
            return Inertia::render('Seller/Messages/Index');
        })->name('seller.messages.index');
    });
    
    // Buyer routes
    Route::prefix('buyer')->middleware(['role:buyer'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'buyer'])->name('buyer.dashboard');
        // Add more buyer-specific routes here
    });
});

// Settings routes
require __DIR__.'/settings.php';
