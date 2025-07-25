<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicListingController extends Controller
{
    /**
     * Display a listing of published listings.
     */
    public function index(Request $request)
    {
        $query = Listing::query()->where('status', 'published');
        
        // Apply search filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('headline', 'like', "%{$search}%")
                  ->orWhere('business_description', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('industry') && $request->input('industry') !== '') {
            $query->where('industry', $request->input('industry'));
        }
        
        $listings = $query->with('images')
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString()
            ->through(function ($listing) {
                return [
                    'id' => $listing->id,
                    'headline' => $listing->headline,
                    'industry' => $listing->industry,
                    'listing_type' => $listing->listing_type,
                    'city' => $listing->city,
                    'state' => $listing->state,
                    'asking_price' => $listing->asking_price,
                    'cash_flow' => $listing->cash_flow,
                    'gross_revenue' => $listing->gross_revenue,
                    'image_urls' => $listing->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'path' => $image->path,
                            'is_primary' => $image->is_primary,
                            'url' => asset('storage/' . $image->path),
                        ];
                    }),
                ];
            });
        
        // Add interest information if user is logged in as a buyer
        $user = Auth::user();
        $interestedListingIds = [];
        
        if ($user && $user->role === 'buyer') {
            $interestedListingIds = $user->interestedListings()->pluck('listing_id')->toArray();
        }
        
        return Inertia::render('Listings/Index', [
            'listings' => $listings,
            'filters' => $request->only(['search', 'industry']),
            'interestedListingIds' => $interestedListingIds,
        ]);
    }

    /**
     * Display the specified listing.
     */
    public function show(string $id)
    {
        $listing = Listing::with('images')->findOrFail($id);
        
        // Only allow viewing of published listings on the public side
        if ($listing->status !== 'published') {
            abort(404);
        }
        
        // Check if the authenticated user is interested in this listing
        $user = Auth::user();
        $userInterested = false;
        $interestedCount = 0;
        
        if ($user && $user->role === 'buyer') {
            $userInterested = $user->isInterestedIn($listing->id);
        }
        
        // Get the count of interested users
        $interestedCount = $listing->interestedUsers()->count();
        
        return Inertia::render('Listings/Show', [
            'userInterested' => $userInterested,
            'interestedCount' => $interestedCount,
            'listing' => [
                'id' => $listing->id,
                'headline' => $listing->headline,
                'industry' => $listing->industry,
                'listing_type' => $listing->listing_type,
                'location_name' => $listing->location_name,
                'city' => $listing->city,
                'state' => $listing->state,
                'location_confidentiality' => $listing->location_confidentiality,
                'asking_price' => $listing->asking_price,
                'cash_flow' => $listing->cash_flow,
                'gross_revenue' => $listing->gross_revenue,
                'ebitda' => $listing->ebitda,
                'year_established' => $listing->year_established,
                'business_description' => $listing->business_description,
                'real_estate_type' => $listing->real_estate_type,
                'building_size' => $listing->building_size,
                'employees' => $listing->employees,
                'facilities' => $listing->facilities,
                'competition' => $listing->competition,
                'growth_expansion' => $listing->growth_expansion,
                'financing_details' => $listing->financing_details,
                'support_training' => $listing->support_training,
                'reason_for_selling' => $listing->reason_for_selling,
                'email' => $listing->email,
                'listing_agent' => $listing->listing_agent,
                'image_urls' => $listing->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'path' => $image->path,
                        'is_primary' => $image->is_primary,
                        'url' => asset('storage/' . $image->path),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Handle listing contact form submissions
     */
    public function contact(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);
        
        $listing = Listing::findOrFail($id);
        
        // Here you would typically:
        // 1. Send an email to the listing owner with the inquiry
        // 2. Maybe store the inquiry in the database
        // 3. Send confirmation to the person inquiring
        
        // For this example, we'll just return a success message
        return back()->with('success', 'Your inquiry has been sent to the business owner.');
    }
}
