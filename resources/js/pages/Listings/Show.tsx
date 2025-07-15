import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

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
  city: string;
  state: string;
  location_confidentiality: string;
  asking_price: number;
  cash_flow: number | null;
  gross_revenue: number | null;
  ebitda: string | null;
  year_established: number | null;
  business_description: string | null;
  real_estate_type: string | null;
  building_size: number | null;
  employees: number | null;
  facilities: string | null;
  competition: string | null;
  growth_expansion: string | null;
  financing_details: string | null;
  support_training: string | null;
  reason_for_selling: string | null;
  image_urls: Image[];
  email: string;
  listing_agent: string | null;
}

interface Props {
  listing: Listing;
}

export default function PublicListingDetail({ listing }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    listing.image_urls.findIndex(img => img.is_primary) >= 0
      ? listing.image_urls.findIndex(img => img.is_primary)
      : listing.image_urls.length > 0 ? 0 : null
  );

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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

  const handleContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual contact form submission logic
    alert('Contact form submission would be processed here');
  };

  return (
    <PublicLayout>
      <Head title={listing.headline} />
      
      <div className="">
        {/* Hero section with business type and location */}
        <div className="bg-green-700 text-white py-4">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="text-sm font-medium mb-1">{listing.industry} • {listing.listing_type}</div>
                <h1 className="text-2xl md:text-3xl font-bold">{listing.headline}</h1>
                <p className="text-green-100 mt-1">{listing.city}, {listing.state}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-sm font-medium">Asking Price</div>
                <div className="text-2xl md:text-3xl font-bold">{formatCurrency(listing.asking_price)}</div>
                {listing.cash_flow && (
                  <div className="text-green-100 text-sm">
                    Cash Flow: {formatCurrency(listing.cash_flow)}/year
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600">
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <a href="/listings" className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2">
                      Listings
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      {listing.headline}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white">
              {/* Headline and basic info */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{listing.headline}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
                  <span>{listing.industry}</span>
                  <span>•</span>
                  <span>{listing.listing_type}</span>
                  <span>•</span>
                  <span>{listing.city}, {listing.state}</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(listing.asking_price)}
                </div>
              </div>
              
              {/* Main content layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Left side - Images and details */}
                <div className="lg:col-span-2">
                  {/* Image gallery with better styling */}
                  {listing.image_urls && listing.image_urls.length > 0 ? (
                    <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {/* Main selected image */}
                      <div className="relative h-96 overflow-hidden border-b border-gray-200">
                        <img 
                          src={selectedImageIndex !== null ? listing.image_urls[selectedImageIndex].url : ''} 
                          alt={listing.headline}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                        
                        {/* Image counter */}
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {selectedImageIndex !== null ? selectedImageIndex + 1 : 1} / {listing.image_urls.length}
                        </div>
                      </div>
                      
                      {/* Thumbnail gallery */}
                      {listing.image_urls.length > 1 && (
                        <div className="flex overflow-x-auto p-2 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                          {listing.image_urls.map((image, index) => (
                            <div 
                              key={image.id} 
                              className={`flex-shrink-0 cursor-pointer w-24 h-24 mx-1 rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? 'border-green-500' : 'border-transparent'}`}
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              <img 
                                src={image.url} 
                                alt={`${listing.headline} - Image ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-8 bg-gray-100 border border-gray-200 rounded-lg h-96 flex items-center justify-center shadow-sm">
                      <div className="text-gray-400 flex flex-col items-center">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2">No images available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Business overview */}
                  <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Business Overview</h2>
                      {listing.business_description ? (
                        <div className="prose max-w-none text-gray-700">
                          <p className="whitespace-pre-line">{listing.business_description}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No business description provided.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Financial details */}
                  <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h2 className="text-xl font-bold text-gray-900">Financial Details</h2>
                    </div>
                    <div className="p-6">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderDetail('Asking Price', listing.asking_price, true)}
                        {renderDetail('Cash Flow', listing.cash_flow, true)}
                        {renderDetail('Gross Revenue', listing.gross_revenue, true)}
                        {renderDetail('EBITDA', listing.ebitda)}
                        {renderDetail('Year Established', listing.year_established)}
                      </dl>
                    </div>
                  </div>
                  
                  {/* Business details */}
                  <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h2 className="text-xl font-bold text-gray-900">Business Details</h2>
                    </div>
                    <div className="p-6">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderDetail('Location', `${listing.city}, ${listing.state}`)}
                        {renderDetail('Industry', listing.industry)}
                        {renderDetail('Listing Type', listing.listing_type)}
                        {renderDetail('Real Estate', listing.real_estate_type)}
                        {renderDetail('Building Size', listing.building_size ? `${listing.building_size} sq ft` : null)}
                        {renderDetail('Employees', listing.employees)}
                      </dl>
                    </div>
                  </div>
                  
                  {/* Additional information sections - only show if data exists */}
                  {listing.facilities && (
                    <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900">Facilities</h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line">{listing.facilities}</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.competition && (
                    <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900">Competition</h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line">{listing.competition}</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.growth_expansion && (
                    <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900">Growth & Expansion Opportunities</h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line">{listing.growth_expansion}</p>
                      </div>
                    </div>
                  )}
                  
                  {listing.reason_for_selling && (
                    <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900">Reason for Selling</h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line">{listing.reason_for_selling}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right side - Contact form */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm sticky top-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Interested in this Business?</h2>
                    <p className="text-gray-600 mb-4">Fill out the form below to contact the seller and learn more about this opportunity.</p>
                    
                    <form onSubmit={handleContactForm}>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          id="message"
                          rows={4}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2"
                          placeholder="I'm interested in learning more about this business opportunity..."
                          required
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Contact Seller
                      </button>
                    </form>
                    
                    {/* Listing contact details */}
                    {(listing.listing_agent || listing.email) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Listing Contact</h3>
                        {listing.listing_agent && (
                          <p className="text-gray-600">{listing.listing_agent}</p>
                        )}
                        <p className="text-gray-600">{listing.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Back to listings button */}
              <div className="mt-8">
                <a
                  href="/listings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to All Listings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
