<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ListingController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $listings = Listing::where('user_id', Auth::id())
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

        return Inertia::render('Seller/Listings/Index', [
            'listings' => $listings,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Seller/Listings/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'headline' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'listing_type' => 'required|string|in:Established Business for Sale,Asset Sale,Business Real Estate for Sale (No Business Included),Business Real Estate for Lease (No Business Included),Startup Opportunity',
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
            'ebitda' => 'nullable|integer',
            'rent' => 'nullable|integer',
            'year_established' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            // 'seller_financing' => 'boolean',
            'business_description' => 'nullable|string',
            'ad_id' => 'nullable|string|max:100',
            'inventory' => 'nullable|integer',
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
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max per file
            'primary_image_index' => 'nullable|integer',
        ]);

        // Set the authenticated user as the owner
        $validated['user_id'] = Auth::user()->id;

        // Create the listing
        $listing = Listing::create($validated);

        // Handle image uploads if any
        if ($request->hasFile('images')) {
            $primaryIndex = $request->input('primary_image_index', 0);
            
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('listings/' . $listing->id, 'public');
                
                $listing->images()->create([
                    'path' => $path,
                    'is_primary' => $index == $primaryIndex,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('seller.listings.show', $listing->id)
            ->with('success', 'Listing created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing)
    {        
        $listing->load(['user', 'images']);
        
        return Inertia::render('Seller/Listings/Show', [
            'listing' => $listing->append('image_urls'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing)
    {
        $listing->load('images');
        
        return Inertia::render('Seller/Listings/Edit', [
            'listing' => $listing->append('image_urls'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        $validated = $request->validate([
            'headline' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'listing_type' => 'required|string|in:Established Business for Sale,Asset Sale,Business Real Estate for Sale (No Business Included),Business Real Estate for Lease (No Business Included),Startup Opportunity',
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
            'ebitda' => 'nullable|integer',
            'rent' => 'nullable|integer',
            'year_established' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            // 'seller_financing' => 'boolean',
            'business_description' => 'nullable|string',
            'ad_id' => 'nullable|string|max:100',
            'inventory' => 'nullable|integer|min:0',
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
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max per file
            'primary_image_index' => 'nullable|integer',
            'deleted_image_ids' => 'nullable|array',
            'deleted_image_ids.*' => 'exists:listing_images,id',
        ]);

        // Update the listing
        $listing->update($validated);

        // Handle deleted images
        if ($request->has('deleted_image_ids') && is_array($request->deleted_image_ids)) {
            $listing->images()->whereIn('id', $request->deleted_image_ids)->delete();
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $primaryIndex = $request->input('primary_image_index', 0);
            $order = $listing->images()->max('order') ?? 0;
            
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('listings/' . $listing->id, 'public');
                
                $listing->images()->create([
                    'path' => $path,
                    'is_primary' => $index == $primaryIndex,
                    'order' => ++$order,
                ]);
            }
        }

        // Update primary image if changed
        if ($request->has('primary_image_id')) {
            $listing->images()->update(['is_primary' => false]);
            $listing->images()->where('id', $request->primary_image_id)->update(['is_primary' => true]);
        }

        return redirect()->back()
            ->with('success', 'Listing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        $listing->delete();
        
        if (request()->wantsJson()) {
            return response()->noContent();
        }
        
        return redirect()->route('seller.listings.index')
            ->with('success', 'Listing deleted successfully!');
    }
}
