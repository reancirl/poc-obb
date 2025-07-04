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
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
        // Add more admin-specific routes here
    });
    
    // Seller routes
    Route::prefix('seller')->middleware(['role:seller'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'seller'])->name('seller.dashboard');
        // Add more seller-specific routes here
    });
    
    // Buyer routes
    Route::prefix('buyer')->middleware(['role:buyer'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'buyer'])->name('buyer.dashboard');
        // Add more buyer-specific routes here
    });
});

// Settings routes
require __DIR__.'/settings.php';
