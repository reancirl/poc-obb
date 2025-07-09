<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ListingController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        // $this->middleware(['auth', 'verified']);
        // $this->middleware('can:update,listing')->only(['edit', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listings = auth()->user()->listings()
            ->latest()
            ->paginate(10);

        return Inertia::render('Seller/Listings/Index', [
            'listings' => $listings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Seller/Listings/Create', [
            'listingTypes' => ['Established Business', 'Asset Sale', 'Business Real Estate for Sale'],
            'industries' => [
                'IT & Software',
                'Healthcare',
                'Retail & E-commerce',
                'Education & Training',
                'Hospitality & Tourism',
                'Manufacturing',
                'Finance & Insurance',
                'Real Estate',
                'Construction & Contractors',
                'Food & Beverage'
            ],
            'locationConfidentialityOptions' => [
                'Show my full location (most visibility)',
                'Show only city/region',
                'Show zip code only',
                'Hide location entirely'
            ],
            'realEstateTypes' => ['Leased', 'Owned']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_type' => 'required|in:Established Business,Asset Sale,Business Real Estate for Sale',
            'industry' => 'required|string|max:255',
            'headline' => 'required|string|max:70',
            'location_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'county' => 'nullable|string|max:255',
            'location_confidentiality' => 'required|string|max:255',
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
            'inventory' => 'nullable|string|max:255',
            'real_estate_type' => 'nullable|in:Leased,Owned',
            'building_size' => 'nullable|integer|min:0',
            'lease_expiration' => 'nullable|string|max:255',
            'employees' => 'nullable|integer|min:0',
            'facilities' => 'nullable|string',
            'competition' => 'nullable|string',
            'growth_expansion' => 'nullable|string',
            'financing_details' => 'nullable|string',
            'support_training' => 'nullable|string',
            'reason_for_selling' => 'nullable|string|max:255',
            'listing_agent' => 'nullable|string|max:255',
            'agent_phone_number' => 'nullable|string|max:20',
            'status' => 'required|in:draft,published,sold,inactive'
        ]);

        $listing = auth()->user()->listings()->create($validated);

        return redirect()
            ->route('listings.show', $listing->id)
            ->with('success', 'Listing created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing)
    {
        $this->authorize('view', $listing);
        
        return Inertia::render('Seller/Listings/Show', [
            'listing' => $listing->load('user')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing)
    {
        $this->authorize('update', $listing);
        
        return Inertia::render('Seller/Listings/Edit', [
            'listing' => $listing,
            'listingTypes' => ['Established Business', 'Asset Sale', 'Business Real Estate for Sale'],
            'industries' => [
                'IT & Software',
                'Healthcare',
                'Retail & E-commerce',
                'Education & Training',
                'Hospitality & Tourism',
                'Manufacturing',
                'Finance & Insurance',
                'Real Estate',
                'Construction & Contractors',
                'Food & Beverage'
            ],
            'locationConfidentialityOptions' => [
                'Show my full location (most visibility)',
                'Show only city/region',
                'Show zip code only',
                'Hide location entirely'
            ],
            'realEstateTypes' => ['Leased', 'Owned']
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $validated = $request->validate([
            'listing_type' => 'required|in:Established Business,Asset Sale,Business Real Estate for Sale',
            'industry' => 'required|string|max:255',
            'headline' => 'required|string|max:70',
            'location_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'county' => 'nullable|string|max:255',
            'location_confidentiality' => 'required|string|max:255',
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
            'inventory' => 'nullable|string|max:255',
            'real_estate_type' => 'nullable|in:Leased,Owned',
            'building_size' => 'nullable|integer|min:0',
            'lease_expiration' => 'nullable|string|max:255',
            'employees' => 'nullable|integer|min:0',
            'facilities' => 'nullable|string',
            'competition' => 'nullable|string',
            'growth_expansion' => 'nullable|string',
            'financing_details' => 'nullable|string',
            'support_training' => 'nullable|string',
            'reason_for_selling' => 'nullable|string|max:255',
            'listing_agent' => 'nullable|string|max:255',
            'agent_phone_number' => 'nullable|string|max:20',
            'status' => 'required|in:draft,published,sold,inactive'
        ]);

        $listing->update($validated);

        return redirect()
            ->route('listings.show', $listing->id)
            ->with('success', 'Listing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);
        
        $listing->delete();

        return redirect()
            ->route('listings.index')
            ->with('success', 'Listing deleted successfully!');
    }
}
