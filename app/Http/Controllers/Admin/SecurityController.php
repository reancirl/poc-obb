<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'members' => User::where('role', 'member')->count(),
            'sellers' => User::where('role', 'seller')->count(),
            'buyers' => User::where('role', 'buyer')->count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'suspended' => User::whereNotNull('suspended_at')->count(),
        ];

        return Inertia::render('Admin/Security', [
            'stats' => $stats,
        ]);
    }
}
