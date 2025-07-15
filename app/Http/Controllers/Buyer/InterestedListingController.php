<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterestedListingController extends Controller
{
    /**
     * Display a listing of the user's interested listings.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $interestedListings = $user->interestedListings()
            ->with('images')
            ->orderBy('interested_listings.created_at', 'desc')
            ->paginate(10);
            
        return Inertia::render('Buyer/Listings/Interested', [
            'listings' => $interestedListings,
        ]);
    }
    
    /**
     * Toggle the interested status of a listing for the current user.
     *
     * @param  \App\Models\Listing  $listing
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggle(Listing $listing)
    {
        $user = Auth::user();
        
        if ($user->isInterestedIn($listing->id)) {
            $user->interestedListings()->detach($listing->id);
            $isInterested = false;
        } else {
            $user->interestedListings()->attach($listing->id);
            $isInterested = true;
        }
        
        return back()->with('flash', [
            'data' => [
                'success' => true,
                'isInterested' => $isInterested,
                'interestedCount' => $listing->interestedUsers()->count(),
            ]
        ]);
    }
    
    /**
     * Mark a listing as interested for the current user.
     *
     * @param  \App\Models\Listing  $listing
     * @return \Illuminate\Http\JsonResponse
     */
    public function star(Listing $listing)
    {
        $user = Auth::user();
        
        if (!$user->isInterestedIn($listing->id)) {
            $user->interestedListings()->attach($listing->id);
        }
        
        return back()->with('flash', [
            'data' => [
                'success' => true,
                'isInterested' => true,
                'interestedCount' => $listing->interestedUsers()->count(),
            ]
        ]);
    }
    
    /**
     * Remove the interested mark from a listing for the current user.
     *
     * @param  \App\Models\Listing  $listing
     * @return \Illuminate\Http\JsonResponse
     */
    public function unstar(Listing $listing)
    {
        $user = Auth::user();
        
        if ($user->isInterestedIn($listing->id)) {
            $user->interestedListings()->detach($listing->id);
        }
        
        return back()->with('flash', [
            'data' => [
                'success' => true,
                'isInterested' => false,
                'interestedCount' => $listing->interestedUsers()->count(),
            ]
        ]);
    }
}
