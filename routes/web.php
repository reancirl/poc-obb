<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [\App\Http\Controllers\PublicListingController::class, 'welcome'])->name('home');

Route::get('/all-listings', [\App\Http\Controllers\PublicListingController::class, 'index'])->name('public-listings');

// Hidden admin login route (keep this secret!)
Route::get('/admin-portal-x7k9m', function () {
    return Inertia::render('auth/login', ['role' => 'admin']);
})->name('admin.login');

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
    
    // Unified Messages Center for members
    Route::middleware(['role:member'])->group(function () {
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
    
    // Member routes (unified buyer and seller functionality)
    Route::prefix('member')->middleware(['role:member'])->name('member.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'member'])->name('dashboard');
        
        // Listings Management - Members can manage their own listings
        Route::resource('listings', \App\Http\Controllers\Member\ListingController::class);
        
        // Interested listings (buying functionality)
        Route::get('/interested', [\App\Http\Controllers\Member\InterestedListingController::class, 'index'])->name('interested');
        Route::post('/interested/listings/{listing}/toggle', [\App\Http\Controllers\Member\InterestedListingController::class, 'toggle'])->name('interested.toggle');
        Route::post('/interested/listings/{listing}/star', [\App\Http\Controllers\Member\InterestedListingController::class, 'star'])->name('interested.star');
        Route::delete('/interested/listings/{listing}', [\App\Http\Controllers\Member\InterestedListingController::class, 'unstar'])->name('interested.unstar');
        
        // Features in development for members
        Route::get('/feedback', function () {
            return Inertia::render('FeatureInDevelopment', [
                'featureName' => 'Member Feedback System',
                'returnUrl' => route('member.dashboard')
            ]);
        })->name('feedback');
    });
    
    // Broker upgrade routes
    Route::prefix('broker')->name('broker.')->group(function () {
        Route::get('/upgrade', [\App\Http\Controllers\BrokerUpgradeController::class, 'show'])->name('upgrade');
        Route::post('/upgrade', [\App\Http\Controllers\BrokerUpgradeController::class, 'store']);
        Route::get('/profile', [\App\Http\Controllers\BrokerUpgradeController::class, 'profile'])->name('profile');
        Route::patch('/profile', [\App\Http\Controllers\BrokerUpgradeController::class, 'update'])->name('update');
    });
});

// Settings routes
require __DIR__.'/settings.php';
