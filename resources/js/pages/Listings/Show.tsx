import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/layouts/public-layout';
import StarButton from '@/components/StarButton';
import { toast } from 'react-toastify';

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
  asking_price: number;
  cash_flow: number | null;
  gross_revenue: number | null;
  ebitda: string | null;
  rent: number | null;
  year_established: number | null;
  business_description: string | null;
  inventory: number | null;
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
  phone_number: string | null;
  
  // Enhanced financial fields
  ffe: number | null;
  inventory_value: number | null;
  seller_financing_available: boolean | null;
  inventory_included_in_asking_price: boolean | null;
  financing_notes: string | null;
  
  // Business details
  absentee_owner: boolean | null;
  home_based: boolean | null;
  relocatable: boolean | null;
  established_franchise: boolean | null;
  business_website: string | null;
  website_confidential: boolean | null;
  
  // Social media and online presence
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
  other_social_media: string | null;
  
  // Additional information
  other_details: string | null;
  photos: string | null;
  videos: string | null;
  documents: string | null;
  
  image_urls: Image[];
  email: string;
}

interface Props {
  listing: Listing;
  auth: {
    user: {
      id: number;
      role: string;
      name?: string;
      email?: string;
    } | null;
  };
  userInterested?: boolean;
  interestedCount?: number;
}

export default function PublicListingDetail({ listing, auth, userInterested = false, interestedCount = 0 }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    listing.image_urls.findIndex(img => img.is_primary) >= 0
      ? listing.image_urls.findIndex(img => img.is_primary)
      : listing.image_urls.length > 0 ? 0 : null
  );
  
  // Form state - pre-populate with user data if available
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: '',
    message: ''
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update form data if auth changes (e.g., user logs in)
  useEffect(() => {
    if (auth.user) {
      setFormData(prevData => ({
        ...prevData,
        name: auth.user?.name || prevData.name,
        email: auth.user?.email || prevData.email
      }));
    }
  }, [auth.user]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to determine what location information to show based on confidentiality setting
  const getLocationDisplay = () => {
    switch (listing.location_confidentiality) {
      case 'Show my full location (most visibility)':
        return {
          showAddress: true,
          showCity: true,
          showZip: true,
          showCounty: true,
          locationText: `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}${listing.county ? `, ${listing.county} County` : ''}`
        };
      case 'Show only city/region':
        return {
          showAddress: false,
          showCity: true,
          showZip: false,
          showCounty: true,
          locationText: `${listing.city}, ${listing.state}${listing.county ? `, ${listing.county} County` : ''}`
        };
      case 'Show zip code only':
        return {
          showAddress: false,
          showCity: false,
          showZip: true,
          showCounty: false,
          locationText: `${listing.zip}, ${listing.state}`
        };
      case 'Hide location entirely':
        return {
          showAddress: false,
          showCity: false,
          showZip: false,
          showCounty: false,
          locationText: 'Location confidential'
        };
      default:
        return {
          showAddress: false,
          showCity: true,
          showZip: false,
          showCounty: false,
          locationText: `${listing.city}, ${listing.state}`
        };
    }
  };

  const locationDisplay = getLocationDisplay();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const handleContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    // Check if user is authenticated
    if (!auth.user) {
      // Show toast notification
      toast.info('Please login or register to contact the seller');
      
      // Redirect to login page with a redirect back to this listing
      router.visit('/login', { 
        data: { 
          redirect: `/listings/${listing.id}`,
          role: 'buyer' // Default to buyer role for registration
        }
      });
      setIsSubmitting(false);
      return;
    }
    
    // If user is authenticated but not a buyer, show a message
    if (auth.user && auth.user.role !== 'buyer') {
      toast.warning('Only buyers can contact sellers. Please switch to a buyer account.');
      setIsSubmitting(false);
      return;
    }
    
    // Validate form client-side
    const validationErrors: Record<string, string> = {};
    if (!formData.name.trim()) validationErrors.name = 'Name is required';
    if (!formData.email.trim()) validationErrors.email = 'Email is required';
    if (!formData.message.trim()) validationErrors.message = 'Message is required';
    
    // If there are validation errors, show them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Submit the form data via Inertia
    router.post(route('listings.contact', listing.id), formData, {
      onSuccess: () => {
        toast.success('Your message has been sent to the seller!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setIsSubmitting(false);
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        setErrors(errors as Record<string, string>);
        toast.error('Please fix the errors in the form.');
        setIsSubmitting(false);
      }
    });
  };

  return (
    <PublicLayout auth={auth}>
      <Head title={listing.headline} />
      
      <div className="">
        {/* Hero section with business type and location */}
        <div className="text-white py-4" style={{ backgroundColor: '#010079' }}>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="text-sm font-medium mb-1">{listing.industry} • {listing.listing_type}</div>
                <h1 className="text-2xl md:text-3xl font-bold">{listing.headline}</h1>
                <p className="text-blue-100 mt-1">{locationDisplay.locationText}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right flex flex-col items-end">
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium mr-3">Asking Price</div>
                  {auth?.user && auth.user.role === 'buyer' && (
                    <StarButton 
                      listingId={listing.id} 
                      initialIsStarred={userInterested}
                      className="bg-white bg-opacity-20 p-1 rounded-full hover:bg-opacity-30"
                      isLoggedIn={!!auth?.user}
                      showCount={true}
                      initialCount={interestedCount}
                    />
                  )}
                </div>
                <div className="text-2xl md:text-3xl font-bold">{formatCurrency(listing.asking_price)}</div>
                {listing.cash_flow && (
                  <div className="text-blue-100 text-sm">
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
                  <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#D5AD36]">
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <a href="/listings" className="ml-1 text-sm font-medium text-gray-700 hover:text-[#D5AD36] md:ml-2">
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
                  <span>{locationDisplay.locationText}</span>
                </div>
                <div className="mt-2 text-2xl font-bold" style={{ color: '#D5AD36' }}>
                  {formatCurrency(listing.asking_price)}
                </div>
              </div>
              
              {/* Main content layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Left side - Images and details */}
                <div className="lg:col-span-2">
                  {/* Image gallery redesigned to match Figma layout */}
                  {listing.image_urls && listing.image_urls.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-8">
                      {/* Main selected image */}
                      <div className="rounded-2xl overflow-hidden mb-4">
                        <img
                          src={
                            selectedImageIndex !== null
                              ? listing.image_urls[selectedImageIndex].url
                              : listing.image_urls[0].url
                          }
                          alt={listing.headline}
                          className="w-full h-[400px] object-cover"
                        />
                      </div>

                      {/* Thumbnail gallery (3 max + placeholders if missing) */}
                      <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => {
                          const image = listing.image_urls[index];
                          return image ? (
                            <div
                              key={image.id}
                              className={`rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                                selectedImageIndex === index
                                  ? 'border-[#0B2254]'
                                  : 'border-gray-200 hover:border-[#0B2254]/50'
                              }`}
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              <img
                                src={image.url}
                                alt={`${listing.headline} - Image ${index + 1}`}
                                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div
                              key={`placeholder-${index}`}
                              className="rounded-2xl h-32 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400"
                            >
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2
                                  l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6
                                  20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0
                                  00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 bg-gray-100 border border-gray-200 rounded-2xl h-96 flex items-center justify-center shadow-sm">
                      <div className="text-gray-400 flex flex-col items-center">
                        <svg
                          className="w-16 h-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16
                              16m-2-2l1.586-1.586a2 2 0 012.828 0L20
                              14m-6-6h.01M6 20h12a2 2 0 002-2V6a2
                              2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0
                              002 2z"
                          />
                        </svg>
                        <p className="mt-2">No images available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Business Overview Section */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-10">
                    {/* Title & Location */}
                    <h1 className="text-2xl font-bold text-[#003366] mb-1">
                      {listing.headline || 'FULL-SERVICE CAR WASH, Near major intersection'}
                    </h1>
                    <p className="text-gray-700 mb-4 border-b border-gray-200 pb-3">
                      {locationDisplay.locationText || 'Moreno Valley, CA (Riverside County)'}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 mb-6">
                      <div>
                        <p className="text-[#003366] font-semibold">
                          Asking Price:
                          <span className="text-[#0056B3] font-bold ml-1">
                            {listing.asking_price ? formatCurrency(listing.asking_price) : 'Not Disclosed'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#003366] font-semibold">
                          Cash Flow (SDE):
                          <span className="text-gray-700 font-medium ml-1">
                            {listing.cash_flow ? formatCurrency(listing.cash_flow) : 'Not Disclosed'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#003366] font-semibold">
                          EBITDA:
                          <span className="text-gray-700 font-medium ml-1">
                            {listing.ebitda || 'Not Disclosed'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#003366] font-semibold">
                          Gross Revenue:
                          <span className="text-gray-700 font-medium ml-1">
                            {listing.gross_revenue ? formatCurrency(listing.gross_revenue) : 'Not Disclosed'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#003366] font-semibold">
                          Established:
                          <span className="text-gray-700 font-medium ml-1">
                            {listing.year_established || 'Not Disclosed'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Business Description */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h2 className="text-lg font-bold text-[#003366] mb-3">Business Description</h2>
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {listing.business_description ? (
                          <p>{listing.business_description}</p>
                        ) : (
                          <p>No business description provided.</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 mt-6 border-t border-gray-200 pt-4 text-sm text-gray-600">
                      <button className="flex items-center gap-1 hover:text-[#0056B3] transition">
                        <i className="fa-regular fa-heart"></i> Save
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#0056B3] transition">
                        <i className="fa-solid fa-print"></i> Print
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#0056B3] transition">
                        <i className="fa-solid fa-share-nodes"></i> Share
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#0056B3] transition">
                        <i className="fa-solid fa-file-lines"></i> Evaluation Report
                      </button>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-10">
                    <h2 className="text-lg font-bold text-[#003366] mb-4">Detailed Information</h2>
                    <dl className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <i className="fa-solid fa-location-dot text-[#0056B3] mr-2"></i>
                        <dt className="font-medium text-gray-700 w-32">Location:</dt>
                        <dd className="text-gray-900">{locationDisplay.locationText || 'Not disclosed'}</dd>
                      </div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-chart-bar text-[#0056B3] mr-2"></i>
                        <dt className="font-medium text-gray-700 w-32">Listing Statistics:</dt>
                        <dd className="text-[#0056B3] cursor-pointer hover:underline">Unlock</dd>
                      </div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-users text-[#0056B3] mr-2"></i>
                        <dt className="font-medium text-gray-700 w-32">Demographic Info:</dt>
                        <dd className="text-[#0056B3] cursor-pointer hover:underline">Unlock</dd>
                      </div>
                    </dl>

                    <p className="text-xs text-gray-500 mt-6 leading-snug">
                      The information in this listing has been provided by the business seller or representative stated above. Monarch has no stake in the sale of this business, has not independently verified any of the information, and assumes no responsibility for its accuracy or completeness.
                      <br />
                      Read Monarch <a href="#" className="underline text-[#0056B3]">Terms of Use</a> before responding to any ad. Learn how to avoid <a href="#" className="underline text-[#0056B3]">scams</a>.
                    </p>
                  </div>

                </div>
                
                 {/* Right: Contact Form */}
                <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 self-start max-w-full">
                  <h2 className="text-2xl font-semibold text-[#0B2254] mb-6">
                    Contact Form
                  </h2>

                  <form className="space-y-5">
                    {/* Full Name */}
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full rounded-full border border-gray-300 py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                    />

                    {/* Email + Zip Code (70/30 split) */}
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="md:w-[60%] w-full rounded-full border border-gray-300 py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        className="md:w-[40%] w-full rounded-full border border-gray-300 py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                      />
                    </div>

                    {/* Phone */}
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="w-full rounded-full border border-gray-300 py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                    />

                    {/* Amount to Invest + Time Frame */}
                    <div className="grid grid-cols-20 gap-4">
                      <div className="col-span-11">
                        <input
                          type="text"
                          placeholder="Amount to Invest"
                          className="w-full rounded-full border border-gray-300 py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                        />
                      </div>
                      <div className="col-span-9">
                        <input
                          type="text"
                          placeholder="Time Frame"
                          className="w-full rounded-full border border-gray-300 py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <textarea
                      rows={3}
                      placeholder="Optional Message"
                      className="w-full rounded-2xl border border-gray-300 py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2254]"
                    />

                    {/* Button */}
                    <button
                      type="button"
                      className="w-full md:w-auto bg-[#0B2254] text-white font-medium py-3 px-10 rounded-full hover:bg-[#132e73] transition"
                    >
                      Send Message
                    </button>

                    {/* Terms Notice */}
                    <p className="text-xs text-gray-500 mt-2">
                      By clicking the button, you agree to Monarch’s{" "}
                      <a href="#" className="text-[#0B2254] underline">
                        Terms of Use
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#0B2254] underline">
                        Privacy Notice
                      </a>
                      .
                    </p>
                  </form>
                </div>
              </div>
              
              {/* Back to listings button */}
              <div className="mt-8">
                <a
                  href="/listings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010079]"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to All Listings  
                </a>
              </div>

              {/* ✅ Similar Listings Section */}
                <section className="mt-16 border-t border-gray-200 pt-10">
                  <h2 className="text-[24px] font-semibold text-[#0B2254] mb-8">
                    Similar Listings
                  </h2>

                  {/* If loading or no data */}
                  {!listing.similar_listings || listing.similar_listings.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white border border-[#0B2254]/20 rounded-2xl p-4 animate-pulse"
                        >
                          <div className="bg-gray-200 h-48 w-full rounded-xl mb-4" />
                          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
                          <div className="h-8 bg-gray-200 rounded-full w-24 mx-auto" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {listing.similar_listings.map((item: Listing) => (
                        <div
                          key={item.id}
                          className="bg-white border border-[#0B2254]/20 rounded-2xl p-4 flex flex-col hover:shadow-md transition-shadow duration-300"
                        >
                          {/* Image */}
                          <div className="overflow-hidden rounded-xl mb-4">
                            <img
                              src={
                                item.image_urls?.find((img) => img.is_primary)?.url ||
                                item.image_urls?.[0]?.url ||
                                '/images/placeholder.jpg'
                              }
                              alt={item.headline}
                              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Title + Description */}
                          <h3 className="text-[18px] font-bold text-[#0B2254] mb-1">
                            {item.headline}
                          </h3>
                          <p className="text-[14px] text-[#3D3935] mb-4">
                            Connect with verified business brokers who can help you buy or sell your business
                          </p>

                          {/* Button */}
                          <div className="mt-auto">
                            <a
                              href={`/listings/${item.id}`}
                              className="inline-block text-[#0B2254] border border-[#0B2254]/30 rounded-full px-5 py-2 text-sm font-medium hover:bg-[#0B2254] hover:text-white transition-colors duration-300"
                            >
                              See More
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
