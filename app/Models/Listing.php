<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Listing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'headline',
        'industry',
        'listing_type',
        'location_name',
        'address',
        'city',
        'state',
        'zip',
        'county',
        'location_confidentiality',
        'email',
        'phone_number',
        'asking_price',
        'cash_flow',
        'gross_revenue',
        'ebitda',
        'rent',
        'year_established',
        'seller_financing',
        'business_description',
        'ad_id',
        'inventory',
        'real_estate_type',
        'building_size',
        'lease_expiration',
        'employees',
        'facilities',
        'competition',
        'growth_expansion',
        'financing_details',
        'support_training',
        'reason_for_selling',
        'listing_agent',
        'agent_phone_number',
        'status',
    ];

    protected $appends = ['image_urls'];

    /**
     * Get the images for the listing.
     */
    public function images()
    {
        return $this->hasMany(ListingImage::class)->orderBy('order');
    }

    /**
     * Get the image URLs for the listing.
     *
     * @return array
     */
    public function getImageUrlsAttribute()
    {
        if (!$this->relationLoaded('images')) {
            $this->load('images');
        }

        return $this->images->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => Storage::url($image->path),
                'is_primary' => (bool) $image->is_primary,
                'order' => $image->order,
            ];
        })->toArray();
    }

    protected $casts = [
        'asking_price' => 'decimal:2',
        'cash_flow' => 'decimal:2',
        'gross_revenue' => 'decimal:2',
        'year_established' => 'integer',
        'seller_financing' => 'boolean',
        'building_size' => 'integer',
        'employees' => 'integer',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'lease_expiration',
        'deleted_at',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'inactive');
    }

    // Helpers
    public function isPublished()
    {
        return $this->status === 'published';
    }

    public function isDraft()
    {
        return $this->status === 'draft';
    }

    public function markAsPublished()
    {
        $this->update(['status' => 'published']);
    }

    public function markAsDraft()
    {
        $this->update(['status' => 'draft']);
    }

    /**
     * Get the status badge class.
     *
     * @return string
     */
    public function getStatusBadgeClassAttribute()
    {
        return [
            'draft' => 'bg-yellow-100 text-yellow-800',
            'published' => 'bg-green-100 text-green-800',
            'sold' => 'bg-blue-100 text-blue-800',
            'inactive' => 'bg-gray-100 text-gray-800',
        ][$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Get the formatted asking price.
     *
     * @return string
     */
    public function getFormattedAskingPriceAttribute()
    {
        return '$' . number_format($this->asking_price, 2);
    }
}
