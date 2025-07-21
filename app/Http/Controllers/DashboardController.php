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
        return Inertia::render('Admin/Dashboard', [
            'user' => $request->user()
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
