<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingImage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'listing_id',
        'path',
        'is_primary',
        'order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
