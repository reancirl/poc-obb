<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'suspended_at',
        // Broker fields
        'is_broker',
        'company_name',
        'broker_phone',
        'serving_area',
        'website',
        'profile_photo',
        'bio',
        'license_number',
        'license_state',
        'broker_upgraded_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'suspended_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
            'is_broker' => 'boolean',
            'broker_upgraded_at' => 'datetime',
        ];
    }

    // Helper methods to check user role
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMember(): bool
    {
        return $this->role === 'member';
    }

    public function isSeller(): bool
    {
        // Legacy support: both seller and member can sell
        return $this->role === 'seller' || $this->role === 'member';
    }

    public function isBuyer(): bool
    {
        // Legacy support: both buyer and member can buy
        return $this->role === 'buyer' || $this->role === 'member';
    }

    public function isBroker(): bool
    {
        return $this->is_broker === true;
    }

    /**
     * Check if the user is suspended.
     *
     * @return bool
     */
    public function isSuspended(): bool
    {
        return $this->suspended_at !== null;
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
    
    /**
     * Get the listings that the user has marked as interested.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function interestedListings(): BelongsToMany
    {
        return $this->belongsToMany(Listing::class, 'interested_listings')
            ->withTimestamps();
    }
    
    /**
     * Check if the user is interested in a listing.
     *
     * @param int $listingId
     * @return bool
     */
    public function isInterestedIn(int $listingId): bool
    {
        return $this->interestedListings()->where('listing_id', $listingId)->exists();
    }
}
