import React, { useState, useCallback, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData } from '@/types';

type FileWithPreview = (File & {
  preview: string;
  isPrimary: boolean;
  id?: number;
  name: string;
  type: string;
  size: number;
}) | {
  preview: string;
  isPrimary: boolean;
  id: number;
  url: string;
  is_primary: boolean;
};

interface FormData {
  headline: string;
  industry: string;
  listing_type: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  location_confidentiality: string;
  email: string;
  phone_number: string;
  asking_price: number;
  cash_flow: number;
  gross_revenue: number;
  ebitda: number;
  rent: number;
  year_established: number;
  seller_financing: boolean;
  business_description: string;
  inventory: string;
  real_estate_type: string;
  building_size: number;
  lease_expiration: string;
  employees: number;
  facilities: string;
  competition: string;
  growth_expansion: string;
  financing_details: string;
  support_training: string;
  reason_for_selling: string;
  listing_agent: string;
  agent_phone_number: string;
  status: string;
  // Enhanced financial fields
  ffe: number;
  inventory_value: number;
  inventory_included_in_asking_price: boolean;
  financing_notes: string;
  seller_financing_available: boolean;
  real_estate_property_type: string;
  // Enhanced Business Details fields
  absentee_owner: boolean;
  home_based: boolean;
  relocatable: boolean;
  established_franchise: boolean;
  business_website: string;
  keep_website_confidential: boolean;
  facilities_assets: string;
  market_competition: string;
  // Social Media and Additional Fields
  website: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  other_social_media: string;
  photos: string;
  videos: string;
  documents: string;
  other_details: string;
  user_id: string;
  [key: string]: any;
}

type Listing = {
  id?: number;
  listing_type?: string;
  industry?: string;
  headline?: string;
  location_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  location_confidentiality?: string;
  email?: string;
  phone_number?: string;
  asking_price?: number | string | null;
  cash_flow?: number | string | null;
  gross_revenue?: number | string | null;
  ebitda?: string | null;
  rent?: string | null;
  year_established?: number | string | null;
  seller_financing?: boolean;
  business_description?: string;
  inventory?: string;
  real_estate_type?: string;
  building_size?: number | string | null;
  lease_expiration?: string | null;
  employees?: number | string | null;
  facilities?: string;
  competition?: string;
  growth_expansion?: string;
  financing_details?: string;
  support_training?: string;
  reason_for_selling?: string;
  listing_agent?: string;
  agent_phone_number?: string;
  status?: string;
  // Enhanced financial fields
  ffe?: number;
  inventory_value?: number;
  inventory_included_in_asking_price?: boolean;
  financing_notes?: string;
  seller_financing_available?: boolean;
  real_estate_property_type?: string;
  // Enhanced Business Details fields
  absentee_owner?: boolean;
  home_based?: boolean;
  relocatable?: boolean;
  established_franchise?: boolean;
  business_website?: string;
  keep_website_confidential?: boolean;
  facilities_assets?: string;
  market_competition?: string;
  // Social Media and Additional Fields
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  other_social_media?: string;
  photos?: string;
  videos?: string;
  documents?: string;
  other_details?: string;
  image_urls?: string[];
  [key: string]: any;
};

interface Props extends SharedData {
  listing: Listing;
}

export default function EditListing({ listing, auth }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFinancialSectionCollapsed, setIsFinancialSectionCollapsed] = useState(false);
  const [isBusinessDetailsSectionCollapsed, setIsBusinessDetailsSectionCollapsed] = useState(false);

  // Initialize form with listing data
  const form = useForm<FormData>({
    headline: listing.headline ?? '',
    industry: listing.industry ?? '',
    listing_type: listing.listing_type ?? '',
    location_name: listing.location_name ?? '',
    address: listing.address ?? '',
    city: listing.city ?? '',
    state: listing.state ?? '',
    zip: listing.zip ?? '',
    county: listing.county ?? '',
    location_confidentiality: listing.location_confidentiality ?? '',
    email: listing.email ?? '',
    phone_number: listing.phone_number ?? '',
    asking_price: Number(listing.asking_price) || 0,
    cash_flow: Number(listing.cash_flow) || 0,
    gross_revenue: Number(listing.gross_revenue) || 0,
    ebitda: Number(listing.ebitda) || 0,
    rent: Number(listing.rent) || 0,
    year_established: Number(listing.year_established) || 0,
    seller_financing: listing.seller_financing ?? false,
    business_description: listing.business_description ?? '',
    inventory: listing.inventory ?? '',
    real_estate_type: listing.real_estate_type ?? '',
    building_size: Number(listing.building_size) || 0,
    lease_expiration: listing.lease_expiration ?? '',
    employees: Number(listing.employees) || 0,
    facilities: listing.facilities ?? '',
    competition: listing.competition ?? '',
    growth_expansion: listing.growth_expansion ?? '',
    financing_details: listing.financing_details ?? '',
    support_training: listing.support_training ?? '',
    reason_for_selling: listing.reason_for_selling ?? '',
    listing_agent: listing.listing_agent ?? '',
    agent_phone_number: listing.agent_phone_number ?? '',
    status: listing.status ?? 'draft',
    // Enhanced financial fields
    ffe: listing.ffe ?? 0,
    inventory_value: listing.inventory_value ?? 0,
    inventory_included_in_asking_price: listing.inventory_included_in_asking_price ?? false,
    financing_notes: listing.financing_notes ?? '',
    seller_financing_available: listing.seller_financing_available ?? false,
    real_estate_property_type: listing.real_estate_property_type ?? '',
    // Enhanced Business Details fields
    absentee_owner: listing.absentee_owner ?? false,
    home_based: listing.home_based ?? false,
    relocatable: listing.relocatable ?? false,
    established_franchise: listing.established_franchise ?? false,
    business_website: listing.business_website ?? '',
    keep_website_confidential: listing.keep_website_confidential ?? false,
    facilities_assets: listing.facilities_assets ?? '',
    market_competition: listing.market_competition ?? '',
    // Social Media and Additional Fields
    website: listing.website ?? '',
    facebook: listing.facebook ?? '',
    twitter: listing.twitter ?? '',
    linkedin: listing.linkedin ?? '',
    instagram: listing.instagram ?? '',
    youtube: listing.youtube ?? '',
    other_social_media: listing.other_social_media ?? '',
    photos: listing.photos ?? '',
    videos: listing.videos ?? '',
    documents: listing.documents ?? '',
    other_details: listing.other_details ?? '',
    user_id: auth.user.id.toString(),
  });

  // Load existing images
  useEffect(() => {
    if (listing.image_urls && listing.image_urls.length > 0) {
      const existingImages = listing.image_urls.map((url: string, index: number) => ({
        preview: url,
        isPrimary: index === 0,
        id: index + 1,
        url: url,
        is_primary: index === 0
      }));
      setFiles(existingImages);
    }
  }, [listing.image_urls]);

  const listingTypes = [
    'Established Business for Sale',
    'Asset Sale',
    'Business Real Estate for Sale (No Business Included)',
    'Business Real Estate for Lease (No Business Included)',
    'Startup Opportunity'
  ];

  const industries = [
    'IT & Software',
    'Healthcare',
    'Retail & E-commerce',
    'Education & Training',
    'Hospitality & Tourism',
    'Manufacturing',
    'Finance & Insurance',
    'Real Estate',
    'Construction & Contractors',
    'Food & Beverage'
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!form.data.headline?.trim()) errors.headline = 'Business headline is required';
      if (!form.data.industry?.trim()) errors.industry = 'Industry is required';
      if (!form.data.listing_type?.trim()) errors.listing_type = 'Listing type is required';
      if (!form.data.location_name?.trim()) errors.location_name = 'Location is required';
      if (!form.data.city?.trim()) errors.city = 'City is required';
      if (!form.data.state?.trim()) errors.state = 'State is required';
      if (!form.data.email?.trim()) errors.email = 'Email is required';
      if (!form.data.phone_number?.trim()) errors.phone_number = 'Phone number is required';
    }

    if (step === 3) {
      if (!form.data.asking_price || form.data.asking_price <= 0) {
        errors.asking_price = 'Asking price is required and must be greater than 0';
      }
    }

    if (step === 4) {
      if (!form.data.business_description?.trim()) {
        errors.business_description = 'Business description is required';
      }
    }

    // Set errors and return validation result
    if (Object.keys(errors).length > 0) {
      form.setError(errors);
      return false;
    }

    form.clearErrors();
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    
    // Add form fields with proper type conversion
    Object.entries(form.data).forEach(([key, value]) => {
      if (key === 'user_id') return; // Skip user_id for updates
      
      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (typeof value === 'number') {
        formData.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    formData.append('_method', 'PUT');

    router.post(route('member.listings.update', listing.id), formData, {
      preserveState: false,
      preserveScroll: false,
      onSuccess: () => {
        toast.success('Listing updated successfully!');
        setIsUploading(false);
      },
      onError: (errors) => {
        console.error('Update errors:', errors);
        toast.error('Failed to update listing. Please check the form and try again.');
        setIsUploading(false);
      },
      onFinish: () => {
        setIsUploading(false);
      }
    });
  };

  const cancel = () => {
    router.visit(route('member.listings.index'));
  };

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Business details and location', completed: currentStep > 1, current: currentStep === 1 },
    { id: 2, title: 'Plan Selection', description: 'Choose your listing plan', completed: currentStep > 2, current: currentStep === 2 },
    { id: 3, title: 'Financial & Business Details', description: 'Enhanced business information', completed: currentStep > 3, current: currentStep === 3 },
    { id: 4, title: 'Description', description: 'Business description and final details', completed: currentStep > 4, current: currentStep === 4 }
  ];

  return (
    <AppLayout>
      <Head title="Edit Business Listing" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Edit Business Listing</h2>
              
              <Stepper steps={steps} />
              
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="headline">Business Headline *</Label>
                        <Input
                          id="headline"
                          value={form.data.headline}
                          onChange={(e) => form.setData('headline', e.target.value)}
                          error={form.errors.headline}
                          placeholder="Enter a compelling business headline"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Select value={form.data.industry} onValueChange={(value) => form.setData('industry', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.errors.industry && (
                          <p className="text-red-500 text-sm mt-1">{form.errors.industry}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="listing_type">Listing Type *</Label>
                        <Select value={form.data.listing_type} onValueChange={(value) => form.setData('listing_type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                          <SelectContent>
                            {listingTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.errors.listing_type && (
                          <p className="text-red-500 text-sm mt-1">{form.errors.listing_type}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="location_name">Location Name *</Label>
                        <Input
                          id="location_name"
                          value={form.data.location_name}
                          onChange={(e) => form.setData('location_name', e.target.value)}
                          error={form.errors.location_name}
                          placeholder="Business location name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={form.data.city}
                          onChange={(e) => form.setData('city', e.target.value)}
                          error={form.errors.city}
                          placeholder="City"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={form.data.state}
                          onChange={(e) => form.setData('state', e.target.value)}
                          error={form.errors.state}
                          placeholder="State"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Contact Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.data.email}
                          onChange={(e) => form.setData('email', e.target.value)}
                          error={form.errors.email}
                          placeholder="contact@business.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone_number">Phone Number *</Label>
                        <Input
                          id="phone_number"
                          value={form.data.phone_number}
                          onChange={(e) => form.setData('phone_number', e.target.value)}
                          error={form.errors.phone_number}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Plan Selection</h3>
                    <p className="text-gray-600">Choose your listing plan (this is a placeholder for plan selection)</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Financial & Business Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="asking_price">Asking Price *</Label>
                        <Input
                          id="asking_price"
                          type="number"
                          value={form.data.asking_price}
                          onChange={(e) => form.setData('asking_price', Number(e.target.value))}
                          error={form.errors.asking_price}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cash_flow">Cash Flow</Label>
                        <Input
                          id="cash_flow"
                          type="number"
                          value={form.data.cash_flow}
                          onChange={(e) => form.setData('cash_flow', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="gross_revenue">Gross Revenue</Label>
                        <Input
                          id="gross_revenue"
                          type="number"
                          value={form.data.gross_revenue}
                          onChange={(e) => form.setData('gross_revenue', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="year_established">Year Established</Label>
                        <Input
                          id="year_established"
                          type="number"
                          value={form.data.year_established}
                          onChange={(e) => form.setData('year_established', Number(e.target.value))}
                          placeholder="2020"
                        />
                      </div>
                    </div>

                    {/* Enhanced Financial Section */}
                    <div className="border rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => setIsFinancialSectionCollapsed(!isFinancialSectionCollapsed)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-md font-medium">Enhanced Financial Details</h4>
                        <span>{isFinancialSectionCollapsed ? '▼' : '▲'}</span>
                      </button>
                      
                      {!isFinancialSectionCollapsed && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ffe">Furniture, Fixtures & Equipment (FFE)</Label>
                            <Input
                              id="ffe"
                              type="number"
                              value={form.data.ffe}
                              onChange={(e) => form.setData('ffe', Number(e.target.value))}
                              placeholder="0"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="inventory_value">Inventory Value</Label>
                            <Input
                              id="inventory_value"
                              type="number"
                              value={form.data.inventory_value}
                              onChange={(e) => form.setData('inventory_value', Number(e.target.value))}
                              placeholder="0"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="inventory_included_in_asking_price"
                              checked={form.data.inventory_included_in_asking_price}
                              onChange={(e) => form.setData('inventory_included_in_asking_price', e.target.checked)}
                            />
                            <Label htmlFor="inventory_included_in_asking_price">Inventory included in asking price</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="seller_financing_available"
                              checked={form.data.seller_financing_available}
                              onChange={(e) => form.setData('seller_financing_available', e.target.checked)}
                            />
                            <Label htmlFor="seller_financing_available">Seller financing available</Label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Business Details Section */}
                    <div className="border rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => setIsBusinessDetailsSectionCollapsed(!isBusinessDetailsSectionCollapsed)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h4 className="text-md font-medium">Enhanced Business Details</h4>
                        <span>{isBusinessDetailsSectionCollapsed ? '▼' : '▲'}</span>
                      </button>
                      
                      {!isBusinessDetailsSectionCollapsed && (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="absentee_owner"
                                checked={form.data.absentee_owner}
                                onChange={(e) => form.setData('absentee_owner', e.target.checked)}
                              />
                              <Label htmlFor="absentee_owner">Absentee Owner</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="home_based"
                                checked={form.data.home_based}
                                onChange={(e) => form.setData('home_based', e.target.checked)}
                              />
                              <Label htmlFor="home_based">Home Based</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="relocatable"
                                checked={form.data.relocatable}
                                onChange={(e) => form.setData('relocatable', e.target.checked)}
                              />
                              <Label htmlFor="relocatable">Relocatable</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="established_franchise"
                                checked={form.data.established_franchise}
                                onChange={(e) => form.setData('established_franchise', e.target.checked)}
                              />
                              <Label htmlFor="established_franchise">Established Franchise</Label>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="business_website">Business Website</Label>
                            <Input
                              id="business_website"
                              type="url"
                              value={form.data.business_website}
                              onChange={(e) => form.setData('business_website', e.target.value)}
                              placeholder="https://business.com"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Business Description</h3>
                    
                    <div>
                      <Label htmlFor="business_description">Business Description *</Label>
                      <textarea
                        id="business_description"
                        value={form.data.business_description}
                        onChange={(e) => form.setData('business_description', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={8}
                        placeholder="Describe your business in detail..."
                      />
                      {form.errors.business_description && (
                        <p className="text-red-500 text-sm mt-1">{form.errors.business_description}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">
                        {form.data.business_description.length} characters
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex space-x-3">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Previous
                      </button>
                    )}
                    
                    <button type="button" onClick={cancel}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={form.processing || isUploading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {form.processing || isUploading ? 'Updating...' : 'Update Listing'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
