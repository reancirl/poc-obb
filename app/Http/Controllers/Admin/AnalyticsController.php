<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * Basic admin analytics derived from existing data.
     */
    public function index(Request $request): Response
    {
        $now = now();

        $userStats = [
            'total' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'members' => User::where('role', 'member')->count(),
            'sellers' => User::where('role', 'seller')->count(),
            'buyers' => User::where('role', 'buyer')->count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'suspended' => User::whereNotNull('suspended_at')->count(),
            'newLast30' => User::where('created_at', '>=', $now->copy()->subDays(30))->count(),
        ];

        $listingStats = [
            'total' => Listing::count(),
            'published' => Listing::where('status', 'published')->count(),
            'draft' => Listing::where('status', 'draft')->count(),
            'sold' => Listing::where('status', 'sold')->count(),
            'inactive' => Listing::where('status', 'inactive')->count(),
            'avgPrice' => (float) (Listing::avg('asking_price') ?? 0),
            'totalValue' => (float) Listing::sum('asking_price'),
            'newLast30' => Listing::where('created_at', '>=', $now->copy()->subDays(30))->count(),
        ];

        $topIndustries = Listing::select('industry', DB::raw('count(*) as count'))
            ->whereNotNull('industry')
            ->groupBy('industry')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($row) use ($listingStats) {
                $total = $listingStats['total'] ?: 1;
                return [
                    'name' => $row->industry,
                    'count' => (int) $row->count,
                    'share' => round(($row->count / $total) * 100, 1),
                ];
            })
            ->values();

        $topLocations = Listing::select('state', DB::raw('count(*) as count'))
            ->whereNotNull('state')
            ->groupBy('state')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($row) use ($listingStats) {
                $total = $listingStats['total'] ?: 1;
                return [
                    'name' => $row->state,
                    'count' => (int) $row->count,
                    'share' => round(($row->count / $total) * 100, 1),
                ];
            })
            ->values();

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

        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'first_name', 'last_name', 'email', 'role', 'created_at'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')) ?: $user->email,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => optional($user->created_at)->toDateTimeString(),
                ];
            });

        return Inertia::render('Admin/Analytics', [
            'stats' => $userStats,
            'listingStats' => $listingStats,
            'topIndustries' => $topIndustries,
            'topLocations' => $topLocations,
            'leadStats' => $leadStats,
            'recentUsers' => $recentUsers,
        ]);
    }
}
