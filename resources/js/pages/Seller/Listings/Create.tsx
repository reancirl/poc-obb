import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import ListingForm from '@/components/ListingForm';

export default function CreateListing() {
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

  const handleSubmit = (data: any) => {
    setIsProcessing(true);
    
    router.post(route('seller.listings.store'), data, {
      onSuccess: () => {
        toast.success('Listing created successfully!');
      },
      onError: (errors) => {
        toast.error('Failed to create listing. Please check the form for errors.');
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
      <Head title="Create New Listing" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Create New Business Listing</h2>
              
              <ListingForm
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
