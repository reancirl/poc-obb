import React, { useState, useCallback } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { Stepper } from '@/components/ui/stepper';
import PlanSelection from '@/components/PlanSelection';
import ListingForm, { type FormData } from '@/components/ListingForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData } from '@/types';

type FileWithPreview = File & {
    preview: string;
    isPrimary: boolean;
    name: string;
    type: string;
    size: number;
};

export default function CreateListing() {
    const { auth } = usePage<SharedData>().props;
    const [currentStep, setCurrentStep] = useState(1);
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter out invalid files
        const validFiles = acceptedFiles.filter(file => {
            const isValid = file && file.size > 0 && file.type.startsWith('image/');
            if (!isValid) {
                console.warn('Skipping invalid file:', file.name);
            }
            return isValid;
        });

        const newFiles = validFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
            isPrimary: files.length === 0 // Set first uploaded image as primary
        }));

        if (newFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    }, [files.length]);

    const removeFile = (index: number) => {
        setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            // If we removed the primary image and there are still files left, set the first one as primary
            if (newFiles.length > 0 && !newFiles.some(file => file.isPrimary)) {
                newFiles[0].isPrimary = true;
            }
            return newFiles;
        });
    };

    const setPrimary = (index: number) => {
        setFiles(prevFiles =>
            prevFiles.map((file, i) => ({
                ...file,
                isPrimary: i === index
            }))
        );
    };

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
        'Food & Beverage',
        'Agriculture',
        'Automotive and Boat',
        'Beauty and Personal Care',
        'Communication and Media',
        'Pet Services',
        'Service Businesses',
        'Transportation and Storage',
        'Wholesale and Distributors'
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

    // Define steps for the stepper
    const steps = [
        {
            id: 1,
            title: 'Basic Info',
            description: 'Basic, Location & Contact Information',
            completed: currentStep > 1,
            current: currentStep === 1
        },
        {
            id: 2,
            title: 'Choose a Plan',
            description: 'Select your listing plan',
            completed: currentStep > 2,
            current: currentStep === 2
        },
        {
            id: 3,
            title: 'Listing Details',
            description: 'Additional details and photos',
            completed: currentStep > 3,
            current: currentStep === 3
        },
        {
            id: 4,
            title: 'Describe Your Business',
            description: 'Business description and details',
            completed: false,
            current: currentStep === 4
        }
    ];

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isUploading) return;

        setIsUploading(true);

        try {
            const formData = new FormData();

            // Append all form data
            Object.entries(form.data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value as string | Blob);
                }
            });

            // Handle files differently - use a single file approach for simplicity
            let primaryImageIndex = -1;

            // Find the primary image index
            files.forEach((file, index) => {
                if (file.isPrimary) {
                    primaryImageIndex = index;
                }
            });

            if (primaryImageIndex >= 0) {
                formData.append('primary_image_index', primaryImageIndex.toString());
            }

            // Append files exactly as Laravel expects them
            // Laravel controller uses $request->file('images') which means we need 'images[]'
            files.forEach((file, index) => {
                // Check if file is valid before appending
                if (file && file.size > 0) {
                    try {
                        formData.append('images[]', file);
                        console.log(`Adding file ${index}:`, {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            constructor: file.constructor.name
                        });
                    } catch (err) {
                        console.error(`Error appending file ${index}:`, err);
                    }
                } else {
                    console.warn(`Skipping invalid file at index ${index}`);
                }
            });

            console.log('Form data being submitted:', Object.fromEntries(formData.entries()));

            // Log the final form data for debugging
            console.log('File count:', files.length);

            // For debugging, check what's in the formData
            for (const pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            await router.post(route('member.listings.store'), formData, {
                forceFormData: true,
                preserveState: false, // Don't preserve the form state
                preserveScroll: false, // Don't preserve scroll position
                onSuccess: (page: any) => {
                    console.log('Success response:', page);

                    // Clean up object URLs to avoid memory leaks
                    files.forEach(file => URL.revokeObjectURL(file.preview));

                    // Let the automatic Inertia redirect happen (from Laravel controller)
                    // If needed, manually redirect
                    if (page.component === 'Seller/Listings/Create') {
                        // If we're still on the create page, manually redirect
                        toast.success('Listing created successfully!');
                        router.visit(route('member.listings.index'));
                    }
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
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form.');
        } finally {
            setIsUploading(false);
        }
    };

    const cancel = () => {
        router.get(route('member.listings.index'));
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <form onSubmit={submit} className="space-y-6">
                            <ListingForm 
                                data={form.data} 
                                setData={form.setData} 
                                errors={form.errors}
                                processing={form.processing} 
                                listingTypes={listingTypes} 
                                industries={industries}
                                locationConfidentialityOptions={locationConfidentialityOptions}
                                realEstateTypes={realEstateTypes} 
                                user={auth.user} 
                                onCancel={cancel}
                            />
                            
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Next: Choose Plan
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 2:
                return (
                    <PlanSelection
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 3:
                return (
                    <div className="space-y-6">
                        {/* Listing Images */}
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Listing Images</h3>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload files</span>
                                            <input id="file-upload" name="file-upload" type="file"
                                                className="sr-only" multiple onChange={(e) => {
                                                if (e.target.files) {
                                                    onDrop(Array.from(e.target.files));
                                                }
                                                e.target.value = '';
                                            }}
                                            accept="image/*"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({files.length})</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {files.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <div className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${file.isPrimary ? 'ring-2 ring-indigo-500' : ''}`}>
                                                    <img src={file.preview} alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button type="button" onClick={() => setPrimary(index)}
                                                        className="p-1.5 bg-white rounded-full text-indigo-600 hover:bg-indigo-50"
                                                        title="Set as primary">
                                                        <span className="sr-only">Set as primary</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button type="button" onClick={() => removeFile(index)}
                                                        className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                                                        title="Remove image">
                                                        <span className="sr-only">Remove image</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {file.isPrimary && (
                                                    <span className="absolute top-1 right-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Financial Information */}
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-6">Financial Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    'asking_price',
                                    'cash_flow',
                                    'gross_revenue',
                                    'ebitda',
                                    'rent',
                                    'year_established',
                                ].map((field) => (
                                    <div key={field} className="space-y-2">
                                        <Label htmlFor={field}>
                                            {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} *
                                        </Label>
                                        <Input
                                            id={field}
                                            name={field}
                                            type="number"
                                            value={
                                                form.data[field as keyof FormData] !== undefined && form.data[field as keyof FormData] !== null
                                                    ? String(form.data[field as keyof FormData])
                                                    : ''
                                            }
                                            onChange={(e) => form.setData(field as keyof FormData, e.target.value)}
                                            required
                                        />
                                        {form.errors[field as keyof FormData] && (
                                            <p className="text-sm text-red-500">{form.errors[field as keyof FormData]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-6">Business Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="business_description">Business Description *</Label>
                                    <textarea
                                        id="business_description"
                                        name="business_description"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={String(form.data.business_description || '')}
                                        onChange={(e) => form.setData('business_description', e.target.value)}
                                        required
                                    />
                                    {form.errors.business_description && (
                                        <p className="text-sm text-red-500">{form.errors.business_description}</p>
                                    )}
                                </div>
                                {[
                                    'ad_id',
                                    'inventory',
                                    'building_size',
                                    'employees',
                                    'facilities',
                                    'competition',
                                    'growth_expansion',
                                    'financing_details',
                                    'support_training',
                                    'reason_for_selling',
                                ].map((field) => (
                                    <div key={field} className="space-y-2">
                                        <Label htmlFor={field}>
                                            {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </Label>
                                        <Input
                                            id={field}
                                            name={field}
                                            type={
                                                ['inventory', 'building_size', 'employees'].includes(field)
                                                    ? 'number'
                                                    : 'text'
                                            }
                                            value={String(form.data[field as keyof FormData] || '')}
                                            onChange={(e) => form.setData(field as keyof FormData, e.target.value)}
                                        />
                                        {form.errors[field as keyof FormData] && (
                                            <p className="text-sm text-red-500">{form.errors[field as keyof FormData]}</p>
                                        )}
                                    </div>
                                ))}

                                {/* Real Estate Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="real_estate_type">Real Estate Type *</Label>
                                    <Select
                                        value={String(form.data.real_estate_type || '')}
                                        onValueChange={(value) => form.setData('real_estate_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select real estate type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {realEstateTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.real_estate_type && (
                                        <p className="text-sm text-red-500">{form.errors.real_estate_type}</p>
                                    )}
                                </div>

                                {/* Lease Expiration */}
                                <div className="space-y-2">
                                    <Label htmlFor="lease_expiration">Lease Expiration *</Label>
                                    <Input
                                        id="lease_expiration"
                                        name="lease_expiration"
                                        type="date"
                                        value={String(form.data.lease_expiration || '')}
                                        onChange={(e) => form.setData('lease_expiration', e.target.value)}
                                        required
                                    />
                                    {form.errors.lease_expiration && (
                                        <p className="text-sm text-red-500">{form.errors.lease_expiration}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Listing Agent */}
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-6">Listing Agent</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="listing_agent">Agent Name *</Label>
                                    <Input
                                        id="listing_agent"
                                        name="listing_agent"
                                        value={String(form.data.listing_agent || '')}
                                        onChange={(e) => form.setData('listing_agent', e.target.value)}
                                        required
                                    />
                                    {form.errors.listing_agent && (
                                        <p className="text-sm text-red-500">{form.errors.listing_agent}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agent_phone_number">Agent Phone Number *</Label>
                                    <Input
                                        id="agent_phone_number"
                                        name="agent_phone_number"
                                        type="tel"
                                        value={String(form.data.agent_phone_number || '')}
                                        onChange={(e) => form.setData('agent_phone_number', e.target.value)}
                                        required
                                    />
                                    {form.errors.agent_phone_number && (
                                        <p className="text-sm text-red-500">{form.errors.agent_phone_number}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Next: Describe Business
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div className="bg-white shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Describe Your Business</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe your business, what makes it unique, and why someone should buy it..."
                                        value={String(form.data.business_description || '')}
                                        onChange={(e) => form.setData('business_description', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Asking Price
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="$0"
                                            value={String(form.data.asking_price || '')}
                                            onChange={(e) => form.setData('asking_price', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gross Revenue
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="$0"
                                            value={String(form.data.gross_revenue || '')}
                                            onChange={(e) => form.setData('gross_revenue', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={form.processing || isUploading}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {form.processing || isUploading ? 'Creating Listing...' : 'Create Listing'}
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Step {currentStep} - Coming Soon
                        </h3>
                        <p className="text-gray-600 mb-6">
                            This step is under development.
                        </p>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Back
                            </button>
                            {currentStep < 4 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <AppLayout>
            <Head title="Create New Listing" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Stepper steps={steps} />
                            {renderCurrentStep()}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
