import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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
  location_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string | null;
  location_confidentiality: string;
  email: string;
  phone_number: string | null;
  asking_price: number;
  cash_flow: number | null;
  gross_revenue: number | null;
  ebitda: string | null;
  rent: string | null;
  year_established: number | null;
  seller_financing: boolean;
  business_description: string | null;
  ad_id: string | null;
  inventory: string | null;
  real_estate_type: string | null;
  building_size: number | null;
  lease_expiration: string | null;
  employees: number | null;
  facilities: string | null;
  competition: string | null;
  growth_expansion: string | null;
  financing_details: string | null;
  support_training: string | null;
  reason_for_selling: string | null;
  listing_agent: string | null;
  agent_phone_number: string | null;
  status: 'draft' | 'published' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
  image_urls?: Image[];
}

interface Props {
  listing: Listing;
}

export default function ShowListing({ listing }: Props) {
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderDetail = (label: string, value: string | number | null, isCurrency = false) => {
    if (value === null || value === '') return null;
    
    return (
      <div className="py-2">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">
          {isCurrency && typeof value === 'number' ? formatCurrency(value) : value}
        </dd>
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title={listing.headline} />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{listing.headline}</h2>
                  <p className="text-gray-600">{listing.industry} • {listing.listing_type}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={route('seller.listings.edit', listing.id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-300 disabled:opacity-25 transition"
                  >
                    Edit
                  </Link>
                  {listing.status === 'published' && (
                    <Link
                      href={route('listings.show', listing.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring focus:ring-green-300 disabled:opacity-25 transition"
                      target="_blank"
                    >
                      Preview Listing
                    </Link>
                  )}
                  <Link
                    href={route('seller.listings.index')}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-25 transition"
                  >
                    Back to Listings
                  </Link>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3">
                {getStatusBadge(listing.status)}
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">{formatCurrency(listing.asking_price)}</span>
              </div>
              
              {/* Image Gallery */}
              {listing.image_urls && listing.image_urls.length > 0 && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Primary image (larger) */}
                    {listing.image_urls.find(img => img.is_primary) && (
                      <div className="md:col-span-2 row-span-2">
                        <img 
                          src={listing.image_urls.find(img => img.is_primary)?.url} 
                          alt={listing.headline} 
                          className="h-64 w-full object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    
                    {/* Other images */}
                    {listing.image_urls
                      .filter(img => !img.is_primary)
                      .slice(0, 5)
                      .map(image => (
                        <div key={image.id} className="h-32">
                          <img 
                            src={image.url} 
                            alt={listing.headline} 
                            className="h-full w-full object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Business Overview</h3>
                    {listing.business_description && (
                      <p className="text-gray-700 whitespace-pre-line">{listing.business_description}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderDetail('Asking Price', listing.asking_price, true)}
                      {renderDetail('Cash Flow (SDE)', listing.cash_flow, true)}
                      {renderDetail('Gross Revenue', listing.gross_revenue, true)}
                      {renderDetail('EBITDA', listing.ebitda)}
                      {renderDetail('Rent', listing.rent)}
                      {renderDetail('Year Established', listing.year_established)}
                      <div className="py-2">
                        <dt className="text-sm font-medium text-gray-500">Seller Financing</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {listing.seller_financing ? 'Yes' : 'No'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">{listing.location_name}</p>
                      <p className="text-gray-700">{listing.address}</p>
                      <p className="text-gray-700">
                        {listing.city}, {listing.state} {listing.zip}
                        {listing.county && `, ${listing.county} County`}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Visibility:</span> {listing.location_confidentiality}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderDetail('Real Estate Type', listing.real_estate_type)}
                      {renderDetail('Building Size', listing.building_size ? `${listing.building_size} sq ft` : null)}
                      {renderDetail('Lease Expiration', listing.lease_expiration)}
                      {renderDetail('Inventory', listing.inventory)}
                      {renderDetail('Employees', listing.employees)}
                      {renderDetail('Ad ID', listing.ad_id)}
                    </dl>
                  </div>

                  {listing.facilities && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Facilities</h3>
                      <p className="text-gray-700 whitespace-pre-line">{listing.facilities}</p>
                    </div>
                  )}

                  {listing.competition && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Competition</h3>
                      <p className="text-gray-700 whitespace-pre-line">{listing.competition}</p>
                    </div>
                  )}

                  {listing.growth_expansion && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Growth & Expansion</h3>
                      <p className="text-gray-700 whitespace-pre-line">{listing.growth_expansion}</p>
                    </div>
                  )}

                  {listing.financing_details && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Financing</h3>
                      <p className="text-gray-700 whitespace-pre-line">{listing.financing_details}</p>
                    </div>
                  )}

                  {listing.support_training && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Support & Training</h3>
                      <p className="text-gray-700 whitespace-pre-line">{listing.support_training}</p>
                    </div>
                  )}

                  {listing.reason_for_selling && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Reason for Selling</h3>
                      <p className="text-gray-700">{listing.reason_for_selling}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">{listing.email}</p>
                      {listing.phone_number && <p className="text-gray-700">{listing.phone_number}</p>}
                      
                      {(listing.listing_agent || listing.agent_phone_number) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-500">Listing Agent</h4>
                          {listing.listing_agent && <p className="text-gray-700">{listing.listing_agent}</p>}
                          {listing.agent_phone_number && <p className="text-gray-700">{listing.agent_phone_number}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Listing Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between py-1">
                        <dt className="text-sm text-gray-500">Status</dt>
                        <dd className="text-sm text-gray-900">
                          {getStatusBadge(listing.status)}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-sm text-gray-500">Created</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-sm text-gray-500">Last Updated</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(listing.updated_at).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
