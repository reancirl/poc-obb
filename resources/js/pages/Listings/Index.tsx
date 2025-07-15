import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import StarButton from '@/components/StarButton';
import Pagination from '@/components/Pagination';

interface Image {
  id: number;
  path: string;
  is_primary: boolean;
  url: string;
}

interface Listing {
  id: number;
  headline: string;
  industry: string;
  listing_type: string;
  city: string;
  state: string;
  asking_price: number;
  cash_flow: number | null;
  gross_revenue: number | null;
  image_urls: Image[];
}

interface Props {
  listings: {
    data: Listing[];
    links: any;
    current_page: number;
    last_page: number;
  };
  filters: {
    search?: string;
    industry?: string;
  };
  auth: {
    user: {
      id: number;
      role: string;
    } | null;
  };
  interestedListingIds?: number[];
}

export default function PublicListings({ listings, filters, auth, interestedListingIds = [] }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [industry, setIndustry] = useState(filters.industry || '');
  
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (industry) queryParams.append('industry', industry);
    
    const queryString = queryParams.toString();
    window.location.href = `/listings${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <PublicLayout>
      <Head title="Business Listings" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Listings</h1>
              <p className="mt-2 text-gray-600">Browse our available businesses for sale</p>
            </div>
            <div className="flex space-x-2">
              <Link
                href={auth?.user ? route('dashboard') : route('welcome')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {auth?.user ? 'View Dashboard' : 'Portal Login'}
              </Link>
              {!auth?.user && (
                <Link
                  href={route('register')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Register
                </Link>
              )}
            </div>
          </div>
          
          {/* Search and filter */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                  <input
                    type="text"
                    id="search"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                    placeholder="Search by business name, location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-1/4">
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                  <select
                    id="industry"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="">All Industries</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Education & Training">Education & Training</option>
                    <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Finance & Insurance">Finance & Insurance</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Construction & Contractors">Construction & Contractors</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Listings grid */}
          {listings.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.data.map((listing) => (
                <Link key={listing.id} href={route('listings.show', listing.id)}>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all hover:shadow-md">
                    {/* Listing image */}
                    <div className="h-48 overflow-hidden">
                      {listing.image_urls && listing.image_urls.length > 0 ? (
                        <img
                          src={listing.image_urls.find(img => img.is_primary)?.url || listing.image_urls[0].url}
                          alt={listing.headline}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Listing details */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{listing.headline}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{listing.city}, {listing.state}</span>
                        <span className="mx-2">•</span>
                        <span>{listing.industry}</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-500">
                          Asking Price
                        </div>
                        <div className="flex items-center">
                          <div className="text-lg font-bold text-green-600 mr-2">
                            {formatCurrency(listing.asking_price)}
                          </div>
                          {auth?.user && auth.user.role === 'buyer' && (
                            <div onClick={(e) => e.preventDefault()}>  
                              <StarButton 
                                listingId={listing.id} 
                                initialIsStarred={interestedListingIds.includes(listing.id)}
                                className="bg-white bg-opacity-20 p-1 rounded-full hover:bg-opacity-30"
                                isLoggedIn={!!auth?.user}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {listing.cash_flow && (
                        <div className="mt-1 flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-500">
                            Cash Flow
                          </div>
                          <div className="text-sm text-gray-900">
                            {formatCurrency(listing.cash_flow)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
                <p className="mt-2 text-gray-400">Try adjusting your search filters.</p>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          <Pagination 
            links={listings.links} 
            currentPage={listings.current_page}
            lastPage={listings.last_page} 
            className="mt-8"
          />
        </div>
      </div>
    </PublicLayout>
  );
}
