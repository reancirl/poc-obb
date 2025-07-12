import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import ListingForm, { FormData } from '@/components/ListingForm';

export default function CreateListing() {
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

const form = useForm<FormData>({
    listing_type: '',
    industry: '',
    location_confidentiality: '',
    real_estate_type: '',
    headline: '',
    location_name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    asking_price: '',
    cash_flow: '',
    gross_revenue: '',
    ebitda: '',
    rent: '',
    year_established: '',
    seller_financing: '',
    business_description: '',
    ad_id: '',
    inventory: '',
    building_size: '',
    lease_expiration: '',
    employees: '',
    facilities: '',
    competition: '',
    growth_expansion: '',
    financing_details: '',
    support_training: '',
    other_details: '',
    email: '',
    phone_number: '',
    website: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    other_social_media: '',
    photos: '',
    videos: '',
    documents: '',
    status: '',
    user_id: '',
    created_at: '',
    updated_at: '',
    });

    const submit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form data being submitted:', form.data);

    form.post(route('seller.listings.store'), {
    onSuccess: (response: any) => {
    console.log('Success response:', response);
    toast.success('Listing created successfully!');
    },
    onError: (errors: any) => {
    console.error('Error response:', errors);
    if (errors?.response) {
    console.error('Response data:', errors.response);
    }
    if (errors?.message) {
    console.error('Error message:', errors.message);
    }
    toast.error('Failed to create listing. Please check the form for errors.');
    },
    });
    };

    const cancel = () => {
    router.get(route('seller.listings.index'));
    };

    return (
    <AppLayout>

        <Head title="Create New Listing" />

        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-semibold mb-6">
                            Create New Business Listing
                        </h2>

                        <form onSubmit={submit} className="space-y-6">
                            <ListingForm data={form.data} setData={form.setData} errors={form.errors}
                                processing={form.processing} listingTypes={listingTypes} industries={industries}
                                onCancel={cancel} locationConfidentialityOptions={locationConfidentialityOptions}
                                realEstateTypes={realEstateTypes} />

                            <div className="flex items-center justify-end space-x-3">
                                <button type="button" onClick={cancel}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                    Cancel
                                </button>
                                <button type="submit" disabled={form.processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                    {form.processing ? 'Saving…' : 'Save Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
    );
    }
