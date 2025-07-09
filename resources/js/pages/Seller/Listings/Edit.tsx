import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import ListingForm from '@/components/ListingForm';
import type { FormData } from '@/components/ListingForm';

// Define a type that matches our form data structure
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
  ad_id?: string;
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
  status?: 'draft' | 'published' | 'sold' | 'inactive';
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow additional properties
};

interface Props {
  listing: Listing;
}

// Helper function to convert form data to the expected format
const prepareFormData = (data: FormData): Record<string, any> => {
  const formData = { ...data };
  
  // Convert empty strings to null for optional fields
  Object.keys(formData).forEach(key => {
    if (formData[key] === '') {
      formData[key] = null;
    }
  });
  
  // Convert string numbers to actual numbers
  if (formData.asking_price) {
    formData.asking_price = Number(formData.asking_price);
  }
  
  if (formData.cash_flow) {
    formData.cash_flow = Number(formData.cash_flow);
  }
  
  if (formData.gross_revenue) {
    formData.gross_revenue = Number(formData.gross_revenue);
  }
  
  if (formData.year_established) {
    formData.year_established = Number(formData.year_established);
  }
  
  if (formData.building_size) {
    formData.building_size = Number(formData.building_size);
  }
  
  if (formData.employees) {
    formData.employees = Number(formData.employees);
  }
  
  // Convert string booleans to actual booleans
  if (formData.seller_financing !== undefined) {
    formData.seller_financing = formData.seller_financing === 'true' || formData.seller_financing === true;
  }
  
  return formData;
};

export default function EditListing({ listing }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const listingTypes = [
    'Established Business',
    'Asset Sale',
    'Business Real Estate for Sale'
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

  const locationConfidentialityOptions = [
    'Show my full location (most visibility)',
    'Show only city/region',
    'Show zip code only',
    'Hide location entirely'
  ];

  const realEstateTypes = ['Leased', 'Owned'];

  const handleSubmit = (formData: FormData) => {
    const processedData = prepareFormData(formData);
    
    setIsProcessing(true);
    
    router.put(route('seller.listings.update', listing.id), processedData, {
      onSuccess: () => {
        toast.success('Listing updated successfully!');
      },
      onError: (errors) => {
        toast.error('Failed to update listing. Please check the form for errors.');
      },
      onFinish: () => {
        setIsProcessing(false);
      },
    });
  };

  const handleCancel = () => {
    router.get(route('seller.listings.index'));
  };

  return (
    <AppLayout>
      <Head title={`Edit Listing: ${listing.headline}`} />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Edit Business Listing</h2>
              
              <ListingForm
                listing={listing}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isProcessing={isProcessing}
                listingTypes={listingTypes}
                industries={industries}
                locationConfidentialityOptions={locationConfidentialityOptions}
                realEstateTypes={realEstateTypes}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
