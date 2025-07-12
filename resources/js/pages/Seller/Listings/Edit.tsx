import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import ListingForm, { FormData } from '@/components/ListingForm';

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
    const form = useForm<FormData>({
        ...listing,
        // Ensure all required fields have proper default values
        listing_type: listing.listing_type || '',
        industry: listing.industry || '',
        location_confidentiality: listing.location_confidentiality || '',
        real_estate_type: listing.real_estate_type || '',
        headline: listing.headline || '',
        location_name: listing.location_name || '',
        address: listing.address || '',
        city: listing.city || '',
        state: listing.state || '',
        zip: listing.zip || '',
        county: listing.county || '',
        email: listing.email || '',
        phone_number: listing.phone_number || '',
        asking_price: listing.asking_price || '',
        cash_flow: listing.cash_flow || '',
        gross_revenue: listing.gross_revenue || '',
        ebitda: listing.ebitda || '',
        rent: listing.rent || '',
        year_established: listing.year_established || '',
        seller_financing: Boolean(listing.seller_financing),
        business_description: listing.business_description || '',
        ad_id: listing.ad_id || '',
        inventory: listing.inventory || '',
        building_size: listing.building_size || '',
        lease_expiration: listing.lease_expiration || '',
        employees: listing.employees || '',
        facilities: listing.facilities || '',
        competition: listing.competition || '',
        growth_expansion: listing.growth_expansion || '',
        financing_details: listing.financing_details || '',
        support_training: listing.support_training || '',
        reason_for_selling: listing.reason_for_selling || '',
        listing_agent: listing.listing_agent || '',
        agent_phone_number: listing.agent_phone_number || '',
        status: listing.status || 'draft',
        });

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

        const submit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Form data being submitted:', form.data);

        form.put(route('seller.listings.update', listing.id), {
        onSuccess: (response: any) => {
        console.log('Success response:', response);
        toast.success('Listing updated successfully!');
        },
        onError: (errors: any) => {
        console.error('Error response:', errors);
        if (errors?.response) {
        console.error('Response data:', errors.response);
        }
        if (errors?.message) {
        console.error('Error message:', errors.message);
        }
        toast.error('Failed to update listing. Please check the form for errors.');
        },
        });
        };

        const cancel = () => {
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

                            <form onSubmit={submit} className="space-y-6">
                                <ListingForm data={form.data} setData={form.setData} errors={form.errors}
                                    processing={form.processing} onCancel={cancel} listingTypes={listingTypes}
                                    industries={industries}
                                    locationConfidentialityOptions={locationConfidentialityOptions}
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
