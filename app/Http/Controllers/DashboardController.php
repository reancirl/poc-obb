<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    /**
     * Display the dashboard view.
     * This is a fallback for users without a specific role
     */
    public function index(): Response
    {
        $user = auth()->user();
        
        // Redirect based on user role
        return match($user->role) {
            'admin' => $this->admin(request()),
            'member' => $this->member(request()),
            // Legacy support for existing buyer/seller roles
            'seller' => $this->member(request()),
            'buyer' => $this->member(request()),
            default => $this->member(request()),
        };
    }
    
    /**
     * Display the admin dashboard.
     */
    public function admin(Request $request): Response
    {
        $now = now();

        $stats = [
            'totalUsers' => User::count(),
            'adminCount' => User::where('role', 'admin')->count(),
            'memberCount' => User::where('role', 'member')->count(),
            'sellerCount' => User::where('role', 'seller')->count(),
            'buyerCount' => User::where('role', 'buyer')->count(),
            'verifiedUsers' => User::whereNotNull('email_verified_at')->count(),
            'suspendedUsers' => User::whereNotNull('suspended_at')->count(),
            'newUsers30' => User::where('created_at', '>=', $now->copy()->subDays(30))->count(),
        ];

        $listingStats = [
            'total' => Listing::count(),
            'published' => Listing::where('status', 'published')->count(),
            'draft' => Listing::where('status', 'draft')->count(),
            'sold' => Listing::where('status', 'sold')->count(),
            'inactive' => Listing::where('status', 'inactive')->count(),
            'newLast30' => Listing::where('created_at', '>=', $now->copy()->subDays(30))->count(),
        ];

        $leadStats = [
            'total' => 0,
            'recentLast30' => 0,
        ];

        if (Schema::hasTable('interested_listings')) {
            $leadStats['total'] = DB::table('interested_listings')->count();
            $leadStats['recentLast30'] = DB::table('interested_listings')
                ->where('created_at', '>=', $now->copy()->subDays(30))
                ->count();
        }

        return Inertia::render('Admin/Dashboard', [
            'user' => $request->user(),
            'stats' => $stats,
            'listingStats' => $listingStats,
            'leadStats' => $leadStats,
        ]);
    }
    
    /**
     * Display the seller dashboard.
     * @deprecated Use member() instead
     */
    public function seller(Request $request): Response
    {
        return $this->member($request);
    }
    
    /**
     * Display the member dashboard (unified buyer/seller).
     */
    public function member(Request $request): Response
    {
        return Inertia::render('Member/Dashboard', [
            'user' => $request->user()
        ]);
    }
    
    /**
     * Display the buyer dashboard.
     * @deprecated Use member() instead
     */
    public function buyer(Request $request): Response
    {
        return $this->member($request);
    }
}
