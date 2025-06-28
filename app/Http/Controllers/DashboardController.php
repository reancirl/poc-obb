<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

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
            'seller' => $this->seller(request()),
            default => $this->buyer(request()),
        };
    }
    
    /**
     * Display the admin dashboard.
     */
    public function admin(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'user' => $request->user()
        ]);
    }
    
    /**
     * Display the seller dashboard.
     */
    public function seller(Request $request): Response
    {
        return Inertia::render('Seller/Dashboard', [
            'user' => $request->user()
        ]);
    }
    
    /**
     * Display the buyer dashboard.
     */
    public function buyer(Request $request): Response
    {
        return Inertia::render('Buyer/Dashboard', [
            'user' => $request->user()
        ]);
    }
}
