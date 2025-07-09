<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $this->authorize('viewAny', Listing::class);

        $listings = Listing::with('user')
            ->latest()
            ->when($request->search, function ($query, $search) {
                $query->where('headline', 'like', "%{$search}%")
                    ->orWhere('business_description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Listings/Index', [
            'listings' => $listings,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Listing::class);
        
        return Inertia::render('Admin/Listings/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Listing::class);

        $validated = $request->validate([
            'headline' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'listing_type' => 'required|string|in:Established Business,Asset Sale,Business Real Estate for Sale',
            'location_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip' => 'required|string|max:20',
            'county' => 'nullable|string|max:100',
            'location_confidentiality' => 'required|string',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'asking_price' => 'required|numeric|min:0',
            'cash_flow' => 'nullable|numeric|min:0',
            'gross_revenue' => 'nullable|numeric|min:0',
            'ebitda' => 'nullable|string|max:255',
            'rent' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'seller_financing' => 'boolean',
            'business_description' => 'nullable|string',
            'ad_id' => 'nullable|string|max:100',
            'inventory' => 'nullable|string',
            'real_estate_type' => 'nullable|string|max:100',
            'building_size' => 'nullable|numeric|min:0',
            'lease_expiration' => 'nullable|string|max:100',
            'employees' => 'nullable|integer|min:0',
            'facilities' => 'nullable|string',
            'competition' => 'nullable|string',
            'growth_expansion' => 'nullable|string',
            'financing_details' => 'nullable|string',
            'support_training' => 'nullable|string',
            'reason_for_selling' => 'nullable|string',
            'listing_agent' => 'nullable|string|max:255',
            'agent_phone_number' => 'nullable|string|max:20',
            'status' => 'required|in:draft,published,sold,inactive',
        ]);

        $listing = Listing::create($validated);

        return redirect()->route('admin.listings.show', $listing->id)
            ->with('success', 'Listing created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing)
    {
        $this->authorize('view', $listing);
        
        $listing->load('user');
        
        return Inertia::render('Admin/Listings/Show', [
            'listing' => $listing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing)
    {
        $this->authorize('update', $listing);
        
        $sellers = User::role('seller')->select('id', 'name', 'email')->get();
        
        return Inertia::render('Admin/Listings/Edit', [
            'listing' => $listing,
            'sellers' => $sellers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'headline' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'listing_type' => 'required|string|in:Established Business,Asset Sale,Business Real Estate for Sale',
            'location_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip' => 'required|string|max:20',
            'county' => 'nullable|string|max:100',
            'location_confidentiality' => 'required|string',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'asking_price' => 'required|numeric|min:0',
            'cash_flow' => 'nullable|numeric|min:0',
            'gross_revenue' => 'nullable|numeric|min:0',
            'ebitda' => 'nullable|string|max:255',
            'rent' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'seller_financing' => 'boolean',
            'business_description' => 'nullable|string',
            'ad_id' => 'nullable|string|max:100',
            'inventory' => 'nullable|string',
            'real_estate_type' => 'nullable|string|max:100',
            'building_size' => 'nullable|numeric|min:0',
            'lease_expiration' => 'nullable|string|max:100',
            'employees' => 'nullable|integer|min:0',
            'facilities' => 'nullable|string',
            'competition' => 'nullable|string',
            'growth_expansion' => 'nullable|string',
            'financing_details' => 'nullable|string',
            'support_training' => 'nullable|string',
            'reason_for_selling' => 'nullable|string',
            'listing_agent' => 'nullable|string|max:255',
            'agent_phone_number' => 'nullable|string|max:20',
            'status' => 'required|in:draft,published,sold,inactive',
        ]);

        $listing->update($validated);

        return redirect()->route('admin.listings.show', $listing->id)
            ->with('success', 'Listing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);
        
        $listing->delete();
        
        if (request()->wantsJson()) {
            return response()->noContent();
        }
        
        return redirect()->route('admin.listings.index')
            ->with('success', 'Listing deleted successfully!');
    }
}
