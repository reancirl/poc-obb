import React from 'react';
import { Head } from '@inertiajs/react';
import { Star } from 'lucide-react';
import StarButton from '@/components/StarButton';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/Pagination';

interface PageProps<T> {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    } | null;
  };
  [key: string]: any;
}

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

interface ListingImage {
  id: number;
  url: string;
  is_primary: boolean;
  order: number;
}

interface Listing {
  id: number;
  headline: string;
  industry: string;
  location_name: string;
  asking_price: number;
  formatted_asking_price: string;
  business_description: string;
  city: string;
  state: string;
  image_urls: ListingImage[];
  created_at: string;
}

interface InterestedListingsProps {
  listings: {
    data: Listing[];
    links: any[];
    current_page: number;
    last_page: number;
  };
}

export default function InterestedListings({ auth, listings }: PageProps<InterestedListingsProps>) {
  return (
    <AppLayout>
      <Head title="My Interested Listings" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <header className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">My Interested Listings</h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse through the business listings you've saved as interesting.
              </p>
            </header>

            {listings.data.length === 0 ? (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Interested Listings Yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse through listings and star the ones that interest you to save them here.
                </p>
                <div className="mt-6">
                  <a
                    href={route('listings.index')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Browse Listings
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.data.map((listing: Listing) => (
                    <div key={listing.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 flex flex-col">
                      {/* Listing image */}
                      <div className="relative h-48 w-full bg-gray-200">
                        {listing.image_urls?.length > 0 ? (
                          <img
                            src={listing.image_urls.find((img: ListingImage) => img.is_primary)?.url || listing.image_urls[0].url}
                            alt={listing.headline}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <StarButton 
                            listingId={listing.id} 
                            initialIsStarred={true}
                            className="bg-white p-1.5 rounded-full shadow-sm"
                            isLoggedIn={true}
                          />
                        </div>
                      </div>
                      
                      {/* Listing details */}
                      <div className="flex-1 p-4">
                        <h3 className="text-lg font-medium">
                          <a 
                            href={route('listings.show', listing.id)} 
                            className="text-gray-900 hover:text-green-600"
                          >
                            {listing.headline}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {listing.city}, {listing.state} • {listing.industry}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {listing.formatted_asking_price}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {listing.business_description}
                        </p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
                        <a
                          href={route('listings.show', listing.id)}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                                <Pagination 
                  links={listings.links} 
                  currentPage={listings.current_page}
                  lastPage={listings.last_page}
                  className="mb-6"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
