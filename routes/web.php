<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\SystemLogController;
use App\Http\Controllers\Admin\DatabaseController;
use App\Http\Controllers\Admin\SecurityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [\App\Http\Controllers\PublicListingController::class, 'welcome'])->name('home');
Route::get('/latest-listings', [ListingController::class, 'latest']);
Route::get('/all-listings', [\App\Http\Controllers\PublicListingController::class, 'index'])->name('public-listings');

// Hidden admin login route (keep this secret!)
Route::get('/admin-portal-x7k9m', function () {
    return Inertia::render('auth/login', ['role' => 'admin']);
})->name('admin.login');

Route::get('/search-business', function () {
    return Inertia::render('SearchBusiness');
})->name('search-business');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/sell-a-business', function () {
    return Inertia::render('SellABusiness');
})->name('sell-a-business');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');


// Public listing routes
Route::get('/listings', [\App\Http\Controllers\PublicListingController::class, 'index'])->name('listings.index');
Route::get('/listings/{listing}', [\App\Http\Controllers\PublicListingController::class, 'show'])->name('listings.show');
Route::post('/listings/{listing}/contact', [\App\Http\Controllers\PublicListingController::class, 'contact'])->name('listings.contact');

// Public broker routes
Route::get('/brokers/{broker}', [\App\Http\Controllers\PublicListingController::class, 'showBroker'])->name('broker.show');
Route::get('/brokers', [\App\Http\Controllers\PublicListingController::class, 'brokers'])->name('brokers.index');

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
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
        Route::get('/logs', [SystemLogController::class, 'index'])->name('logs');
        Route::get('/database', [DatabaseController::class, 'index'])->name('database');
        Route::get('/security', [SecurityController::class, 'index'])->name('security');
        Route::get('/settings/profile', function () {
            return Inertia::render('Admin/Settings/Profile');
        })->name('settings.profile');
        Route::get('/settings/profile/edit', [AdminSettingsController::class, 'editProfile'])->name('settings.profile.edit');
        Route::patch('/settings/profile', [AdminSettingsController::class, 'updateProfile'])->name('settings.profile.update');
        Route::get('/settings/password', [AdminSettingsController::class, 'editPassword'])->name('settings.password.edit');
        Route::put('/settings/password', [AdminSettingsController::class, 'updatePassword'])->name('settings.password.update');
        Route::redirect('/settings', '/admin/settings/profile')->name('settings');
        
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
    
    // Broker upgrade & profile routes
        Route::prefix('broker')->name('broker.')->group(function () {
            Route::get('/upgrade', [\App\Http\Controllers\BrokerUpgradeController::class, 'show'])
                ->name('upgrade');
            Route::post('/upgrade', [\App\Http\Controllers\BrokerUpgradeController::class, 'store'])
                ->name('upgrade.store');
            Route::get('/profile', [\App\Http\Controllers\BrokerUpgradeController::class, 'profile'])
                ->name('profile');
            Route::match(['patch', 'post'], '/profile', [\App\Http\Controllers\BrokerUpgradeController::class, 'update'])
                ->name('update');
        });

});

// Settings routes
require __DIR__.'/settings.php';
