<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrokerUpgradeController extends Controller
{
    /**
     * Show the broker upgrade form
     */
    public function show()
    {
        $user = auth()->user();
        
        // If user is already a broker, redirect to profile
        if ($user->is_broker) {
            return redirect()->route('broker.profile');
        }
        
        return Inertia::render('settings/broker-upgrade', [
            'user' => $user
        ]);
    }

    /**
     * Handle the broker upgrade request
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Prevent upgrading if already a broker
        if ($user->is_broker) {
            return redirect()->route('broker.profile');
        }

        $request->validate([
            'company_name' => 'required|string|max:255',
            'broker_phone' => 'required|string|max:20',
            'serving_area' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'bio' => 'required|string|max:1000',
            'license_number' => 'nullable|string|max:100',
            'license_state' => 'nullable|string|max:50',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only([
            'company_name',
            'broker_phone', 
            'serving_area',
            'website',
            'bio',
            'license_number',
            'license_state'
        ]);

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('broker-photos', 'public');
            $data['profile_photo'] = $path;
        }

        // Set broker status and upgrade timestamp
        $data['is_broker'] = true;
        $data['broker_upgraded_at'] = now();

        $user->update($data);

        return redirect()->route('broker.profile')->with('success', 'Congratulations! You are now a verified broker.');
    }

    /**
     * Show the broker profile page
     */
    public function profile()
    {
        $user = auth()->user();
        
        // Redirect non-brokers to upgrade page
        if (!$user->is_broker) {
            return redirect()->route('broker.upgrade');
        }
        
        return Inertia::render('settings/broker-profile', [
            'user' => $user
        ]);
    }

    /**
     * Update broker profile
     */
    public function update(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->is_broker) {
            return redirect()->route('broker.upgrade');
        }
        $request->validate([
            'company_name' => 'required|string|max:255',
            'broker_phone' => 'required|string|max:20',
            'serving_area' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'bio' => 'required|string|max:1000',
            'license_number' => 'nullable|string|max:100',
            'license_state' => 'nullable|string|max:50',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only([
            'company_name',
            'broker_phone',
            'serving_area', 
            'website',
            'bio',
            'license_number',
            'license_state'
        ]);

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            
            $path = $request->file('profile_photo')->store('broker-photos', 'public');
            $data['profile_photo'] = $path;
        }

        $user->update($data);

        return back()->with('success', 'Broker profile updated successfully.');
    }
}
