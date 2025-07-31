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
        const [isFinancialSectionCollapsed, setIsFinancialSectionCollapsed] = useState(false);
        const [isBusinessDetailsSectionCollapsed, setIsBusinessDetailsSectionCollapsed] = useState(false);

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
            asking_price: 0,
            cash_flow: 0,
            gross_revenue: 0,
            ebitda: 0,
            rent: 0,
            year_established: 0,
            seller_financing: false,
            // Enhanced financial fields
            ffe: 0,
            inventory_value: 0,
            inventory_included_in_asking_price: false,
            financing_notes: '',
            seller_financing_available: false,
            real_estate_property_type: '',
            business_description: '',
            // Business Details fields
            absentee_owner: false,
            home_based: false,
            relocatable: false,
            established_franchise: false,
            business_website: '',
            keep_website_confidential: false,
            facilities_assets: '',
            market_competition: '',
            reason_for_selling: '',
            building_size: 0,
            lease_expiration: '',
            employees: 0,
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

            // Frontend validation before submission
            const validationErrors: Record<string, string> = {};
            
            // Check required fields
            if (!form.data.industry || (typeof form.data.industry === 'string' && form.data.industry.trim() === '')) {
                validationErrors.industry = 'Industry is required';
            }
            if (!form.data.listing_type || (typeof form.data.listing_type === 'string' && form.data.listing_type.trim() === '')) {
                validationErrors.listing_type = 'Listing type is required';
            }
            if (!form.data.headline || (typeof form.data.headline === 'string' && form.data.headline.trim() === '')) {
                validationErrors.headline = 'Headline is required';
            }
            if (!form.data.location_name || (typeof form.data.location_name === 'string' && form.data.location_name.trim() === '')) {
                validationErrors.location_name = 'Location name is required';
            }
            if (!form.data.address || (typeof form.data.address === 'string' && form.data.address.trim() === '')) {
                validationErrors.address = 'Address is required';
            }
            if (!form.data.city || (typeof form.data.city === 'string' && form.data.city.trim() === '')) {
                validationErrors.city = 'City is required';
            }
            if (!form.data.state || (typeof form.data.state === 'string' && form.data.state.trim() === '')) {
                validationErrors.state = 'State is required';
            }
            if (!form.data.zip || (typeof form.data.zip === 'string' && form.data.zip.trim() === '')) {
                validationErrors.zip = 'ZIP code is required';
            }
            if (!form.data.location_confidentiality || (typeof form.data.location_confidentiality === 'string' && form.data.location_confidentiality.trim() === '')) {
                validationErrors.location_confidentiality = 'Location confidentiality is required';
            }
            if (!form.data.email || (typeof form.data.email === 'string' && form.data.email.trim() === '')) {
                validationErrors.email = 'Email is required';
            }
            
            // Validate numeric fields - ensure they're proper numbers
            const numericFields = ['asking_price', 'cash_flow', 'gross_revenue', 'ebitda', 'rent', 'year_established', 'ffe', 'inventory_value', 'building_size', 'employees'];
            numericFields.forEach(field => {
                const value = form.data[field];
                if (value !== null && value !== undefined && value !== '' && value !== 0) {
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                        validationErrors[field] = `${field.replace('_', ' ')} must be a valid positive number`;
                    }
                }
            });
            
            // If there are validation errors, show them and stop submission
            if (Object.keys(validationErrors).length > 0) {
                // Set form errors
                Object.keys(validationErrors).forEach(key => {
                    form.setError(key, validationErrors[key]);
                });
                toast.error('Please fix the form errors before submitting.');
                return;
            }
            
            // Clear any existing errors
            form.clearErrors();

            setIsUploading(true);

            try {
            const formData = new FormData();

            // Append all form data with proper type handling and validation
            Object.entries(form.data).forEach(([key, value]) => {
                // Skip null, undefined, or empty string values for optional fields
                if (value === null || value === undefined) {
                    return;
                }
                
                // Handle boolean values
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                }
                // Handle numeric values - ensure they're valid numbers
                else if (typeof value === 'number') {
                    // Only append if it's a valid number and not 0 for optional fields
                    const numericFields = ['asking_price', 'cash_flow', 'gross_revenue', 'ebitda', 'rent', 'year_established', 'ffe', 'inventory_value', 'building_size', 'employees'];
                    if (numericFields.includes(key)) {
                        // For required fields like asking_price, always append
                        if (key === 'asking_price' || value > 0) {
                            formData.append(key, value.toString());
                        }
                    } else {
                        formData.append(key, value.toString());
                    }
                }
                // Handle string values - skip empty strings for optional fields
                else if (typeof value === 'string') {
                    // Required fields should always be appended
                    const requiredFields = ['headline', 'industry', 'listing_type', 'location_name', 'address', 'city', 'state', 'zip', 'location_confidentiality', 'email'];
                    if (requiredFields.includes(key) || value.trim() !== '') {
                        formData.append(key, value);
                    }
                }
                // Handle other types (Blob, etc.)
                else {
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

            // Step-specific validation functions
    const validateStep1 = (): boolean => {
        console.log('🔍 Validating Step 1...');
        console.log('📋 Form data:', form.data);
        const errors: Record<string, string> = {};
        
        // Required fields for Step 1 (Basic Information)
        if (!form.data.industry || (typeof form.data.industry === 'string' && form.data.industry.trim() === '')) {
            errors.industry = 'Industry is required';
        }
        if (!form.data.listing_type || (typeof form.data.listing_type === 'string' && form.data.listing_type.trim() === '')) {
            errors.listing_type = 'Listing type is required';
        }
        if (!form.data.headline || (typeof form.data.headline === 'string' && form.data.headline.trim() === '')) {
            errors.headline = 'Headline is required';
        }
        if (!form.data.location_name || (typeof form.data.location_name === 'string' && form.data.location_name.trim() === '')) {
            errors.location_name = 'Location name is required';
        }
        if (!form.data.address || (typeof form.data.address === 'string' && form.data.address.trim() === '')) {
            errors.address = 'Address is required';
        }
        if (!form.data.city || (typeof form.data.city === 'string' && form.data.city.trim() === '')) {
            errors.city = 'City is required';
        }
        if (!form.data.state || (typeof form.data.state === 'string' && form.data.state.trim() === '')) {
            errors.state = 'State is required';
        }
        if (!form.data.zip || (typeof form.data.zip === 'string' && form.data.zip.trim() === '')) {
            errors.zip = 'ZIP code is required';
        }
        if (!form.data.location_confidentiality || (typeof form.data.location_confidentiality === 'string' && form.data.location_confidentiality.trim() === '')) {
            errors.location_confidentiality = 'Location confidentiality is required';
        }
        if (!form.data.email || (typeof form.data.email === 'string' && form.data.email.trim() === '')) {
            errors.email = 'Email is required';
        }
        
        // Email format validation
        if (form.data.email && typeof form.data.email === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.data.email)) {
                errors.email = 'Please enter a valid email address';
            }
        }
        
        if (Object.keys(errors).length > 0) {
            console.log('❌ Step 1 validation failed with errors:', errors);
            // Set form errors
            Object.keys(errors).forEach(key => {
                form.setError(key, errors[key]);
            });
            toast.error('Please fix the errors before proceeding to the next step.');
            return false;
        }
        
        console.log('✅ Step 1 validation passed!');
        // Clear errors if validation passes
        form.clearErrors();
        return true;
    };
    
    const validateStep2 = (): boolean => {
        // Step 2 is plan selection - no specific validation needed as it's handled by PlanSelection component
        return true;
    };
    
    const validateStep3 = (): boolean => {
        console.log('🔍 Validating Step 3...');
        console.log('📋 Form data for Step 3:', form.data);
        const errors: Record<string, string> = {};
        
        // Validate asking price (required and must be positive)
        if (!form.data.asking_price || (typeof form.data.asking_price === 'number' && form.data.asking_price <= 0)) {
            errors.asking_price = 'Asking price is required and must be greater than 0';
        }
        
        // Validate numeric fields if they have values
        const numericFields = ['cash_flow', 'gross_revenue', 'ebitda', 'rent', 'year_established', 'ffe', 'inventory_value', 'building_size', 'employees'];
        numericFields.forEach(field => {
            const value = form.data[field];
            if (value !== null && value !== undefined && value !== '' && value !== 0) {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue < 0) {
                    errors[field] = `${field.replace('_', ' ')} must be a valid positive number`;
                }
            }
        });
        
        // Validate required agent fields if they exist
        if (form.data.listing_agent && typeof form.data.listing_agent === 'string' && form.data.listing_agent.trim() !== '' && 
            (!form.data.agent_phone_number || (typeof form.data.agent_phone_number === 'string' && form.data.agent_phone_number.trim() === ''))) {
            errors.agent_phone_number = 'Agent phone number is required when agent name is provided';
        }
        if (form.data.agent_phone_number && typeof form.data.agent_phone_number === 'string' && form.data.agent_phone_number.trim() !== '' && 
            (!form.data.listing_agent || (typeof form.data.listing_agent === 'string' && form.data.listing_agent.trim() === ''))) {
            errors.listing_agent = 'Agent name is required when agent phone number is provided';
        }
        
        if (Object.keys(errors).length > 0) {
            console.log('❌ Step 3 validation failed with errors:', errors);
            Object.keys(errors).forEach(key => {
                form.setError(key, errors[key]);
            });
            toast.error('Please fix the errors before proceeding to the next step.');
            return false;
        }
        
        console.log('✅ Step 3 validation passed!');
        form.clearErrors();
        return true;
    };
    
    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 1:
                return validateStep1();
            case 2:
                return validateStep2();
            case 3:
                return validateStep3();
            default:
                return true;
        }
    };

    const handleNext = () => {
        console.log('🚀 handleNext called for step:', currentStep);
        const isValid = validateCurrentStep();
        console.log('✨ Validation result:', isValid);
        if (isValid) {
            console.log('➡️ Moving to next step:', currentStep + 1);
            setCurrentStep(prev => prev + 1);
        } else {
            console.log('⛔ Cannot proceed - validation failed');
        }
    };

    const handleBack = () => {
        // Clear any validation errors when going back
        form.clearErrors();
        setCurrentStep(prev => prev - 1);
    };

            const renderCurrentStep = () => {
            switch (currentStep) {
            case 1:
            return (
            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-6">
                    <ListingForm data={form.data} setData={form.setData} errors={form.errors}
                        processing={form.processing} listingTypes={listingTypes} industries={industries}
                        locationConfidentialityOptions={locationConfidentialityOptions}
                        realEstateTypes={realEstateTypes} user={auth.user} onCancel={cancel} />

                    <div className="flex justify-end">
                        <button type="button" onClick={handleNext}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Next: Choose Plan
                        </button>
                    </div>
                </form>
            </div>
            );
            case 2:
            return (
            <PlanSelection onNext={handleNext} onBack={handleBack} />
            );
            case 3:
            return (
            <>
                <div className="space-y-6">
                    {/* Listing Images */}
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Listing Images</h3>
                        <div
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload files</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only"
                                            multiple onChange={(e)=> {
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
                                    <div className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${file.isPrimary
                                        ? 'ring-2 ring-indigo-500' : '' }`}>
                                        <img src={file.preview} alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover" />
                                    </div>
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button type="button" onClick={()=> setPrimary(index)}
                                            className="p-1.5 bg-white rounded-full text-indigo-600 hover:bg-indigo-50"
                                            title="Set as primary">
                                            <span className="sr-only">Set as primary</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button type="button" onClick={()=> removeFile(index)}
                                            className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                                            title="Remove image">
                                            <span className="sr-only">Remove image</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    {file.isPrimary && (
                                    <span
                                        className="absolute top-1 right-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        Primary
                                    </span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Enhanced Business Financials */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Business Financials</h2>
                            <button type="button" onClick={()=>
                                setIsFinancialSectionCollapsed(!isFinancialSectionCollapsed)}
                                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                {isFinancialSectionCollapsed ? (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Show <span className="hidden md:inline ml-1">Section</span>
                                </>
                                ) : (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M5 15l7-7 7 7" />
                                    </svg>
                                    Hide <span className="hidden md:inline ml-1">Section</span>
                                </>
                                )}
                            </button>
                        </div>

                        {!isFinancialSectionCollapsed && (
                        <div className="p-6 space-y-8">
                            {/* Financial guidance */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    Listings that provide an Asking Price, Cash Flow (Seller's Discretionary Earnings),
                                    and Gross Revenue{' '}
                                    <span className="font-semibold">receive more leads.</span>
                                </p>
                            </div>

                            {/* Financial Essentials */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <h3 className="text-base font-semibold text-gray-900">Financial Essentials*</h3>
                                    <div className="ml-2 group relative">
                                        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <div
                                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            We require at least one of these fields
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-6">
                                    (We require that you include <span className="font-semibold">at least one</span> of
                                    the following financial details)
                                </p>

                                <div className="space-y-6">
                                    {/* Asking Price */}
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            1
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="asking_price"
                                                className="text-base font-medium text-gray-900">
                                                Asking Price
                                            </Label>
                                            <Input id="asking_price" name="asking_price" type="text" placeholder="$0"
                                                value={String(form.data.asking_price || '' )} onChange={(e)=>
                                            form.setData('asking_price', e.target.value)}
                                            className="mt-2"
                                            />
                                            {form.errors.asking_price && (
                                            <p className="text-sm text-red-500 mt-1">{form.errors.asking_price}</p>
                                            )}
                                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                <p className="text-xs text-yellow-800">
                                                    Listings with no asking price will not be shown to potential buyers
                                                    who specify a price range.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cash Flow (SDE) */}
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            2
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="cash_flow"
                                                className="text-base font-medium text-gray-900">
                                                Cash Flow (SDE)
                                            </Label>
                                            <Input id="cash_flow" name="cash_flow" type="text" placeholder="$0"
                                                value={String(form.data.cash_flow || '' )} onChange={(e)=>
                                            form.setData('cash_flow', e.target.value)}
                                            className="mt-2"
                                            />
                                            {form.errors.cash_flow && (
                                            <p className="text-sm text-red-500 mt-1">{form.errors.cash_flow}</p>
                                            )}
                                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                <p className="text-xs text-yellow-800">
                                                    Net (before tax) profit plus payments made to owner, interest and
                                                    depreciation of assets.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EBITDA */}
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            3
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="ebitda" className="text-base font-medium text-gray-900">
                                                EBITDA
                                            </Label>
                                            <Input id="ebitda" name="ebitda" type="text" placeholder="$0"
                                                value={String(form.data.ebitda || '' )} onChange={(e)=>
                                            form.setData('ebitda', e.target.value)}
                                            className="mt-2"
                                            />
                                            {form.errors.ebitda && (
                                            <p className="text-sm text-red-500 mt-1">{form.errors.ebitda}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Financial Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gross Revenue */}
                                <div className="space-y-2">
                                    <Label htmlFor="gross_revenue" className="text-base font-medium text-gray-900">
                                        Gross Revenue
                                    </Label>
                                    <Input id="gross_revenue" name="gross_revenue" type="text" placeholder="$0"
                                        value={String(form.data.gross_revenue || '' )} onChange={(e)=>
                                    form.setData('gross_revenue', e.target.value)}
                                    />
                                    {form.errors.gross_revenue && (
                                    <p className="text-sm text-red-500">{form.errors.gross_revenue}</p>
                                    )}
                                    <div
                                        className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-xs text-yellow-800">
                                            All annual business income (prior calendar year or trailing 12 months)
                                            before any cost-of-sales or expenses have been deducted.
                                        </p>
                                    </div>
                                </div>

                                {/* FF&E */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="ffe" className="text-base font-medium text-gray-900">
                                            FF&E
                                        </Label>
                                        <div className="group relative">
                                            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                    clipRule="evenodd" />
                                            </svg>
                                            <div
                                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Furniture, Fixtures & Equipment
                                            </div>
                                        </div>
                                    </div>
                                    <Input id="ffe" name="ffe" type="text" placeholder="$0"
                                        value={String(form.data.ffe || '' )} onChange={(e)=> form.setData('ffe',
                                    e.target.value)}
                                    />
                                    {form.errors.ffe && (
                                    <p className="text-sm text-red-500">{form.errors.ffe}</p>
                                    )}
                                    <div
                                        className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-xs text-yellow-800">
                                            Included in asking price.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="inventory_value" className="text-base font-medium text-gray-900">
                                        Inventory Value
                                    </Label>
                                    <Input id="inventory_value" name="inventory_value" type="text"
                                        placeholder="$0" value={String(form.data.inventory_value || '' )}
                                        onChange={(e)=> form.setData('inventory_value', e.target.value)}
                                    />
                                    {form.errors.inventory_value && (
                                    <p className="text-sm text-red-500">{form.errors.inventory_value}</p>
                                    )}
                                    <div
                                        className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-xs text-yellow-800">
                                            The value of the merchandise, raw materials, and finished and unfinished
                                            products which have not yet been sold.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input id="inventory_included_in_asking_price"
                                        name="inventory_included_in_asking_price" type="checkbox"
                                        checked={Boolean(form.data.inventory_included_in_asking_price)} onChange={(e)=>
                                    form.setData('inventory_included_in_asking_price', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <Label htmlFor="inventory_included_in_asking_price"
                                        className="text-sm text-gray-700">
                                        Inventory included in asking price
                                    </Label>
                                </div>
                            </div>

                            {/* Real Estate Section */}
                            <div className="space-y-2">
                                <Label htmlFor="real_estate_property_type"
                                    className="text-base font-medium text-gray-900">
                                    Real Estate*
                                </Label>
                                <Select value={String(form.data.real_estate_property_type || '' )}
                                    onValueChange={(value)=> form.setData('real_estate_property_type', value)}
                                    >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Is there any real estate associated with this business?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No real estate included</SelectItem>
                                        <SelectItem value="owned">Real estate is owned</SelectItem>
                                        <SelectItem value="leased">Real estate is leased</SelectItem>
                                        <SelectItem value="available_separately">Real estate available separately
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.real_estate_property_type && (
                                <p className="text-sm text-red-500">{form.errors.real_estate_property_type}</p>
                                )}
                            </div>

                            {/* Financing Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="financing_notes" className="text-base font-medium text-gray-900">
                                        Financing Notes
                                    </Label>
                                    <Input id="financing_notes" name="financing_notes" type="text" maxLength={80}
                                        placeholder="What kind of financing options can you offer?"
                                        value={String(form.data.financing_notes || '' )} onChange={(e)=>
                                    form.setData('financing_notes', e.target.value)}
                                    />
                                    {form.errors.financing_notes && (
                                    <p className="text-sm text-red-500">{form.errors.financing_notes}</p>
                                    )}
                                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-xs text-yellow-800">
                                            Add any financing notes you want to share with the buyer. Limit 80
                                            characters.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input id="seller_financing_available" name="seller_financing_available"
                                        type="checkbox" checked={Boolean(form.data.seller_financing_available)}
                                        onChange={(e)=> form.setData('seller_financing_available', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <Label htmlFor="seller_financing_available" className="text-sm text-gray-700">
                                        Seller financing available
                                    </Label>
                                </div>
                            </div>

                            {/* Additional Fields for compatibility */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="rent">Rent</Label>
                                    <Input id="rent" name="rent" type="number" value={String(form.data.rent
                                        || '' )} onChange={(e)=> form.setData('rent', e.target.value)}
                                    />
                                    {form.errors.rent && (
                                    <p className="text-sm text-red-500">{form.errors.rent}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="year_established">Year Established</Label>
                                    <Input id="year_established" name="year_established" type="number"
                                        value={String(form.data.year_established || '' )} onChange={(e)=>
                                    form.setData('year_established', e.target.value)}
                                    />
                                    {form.errors.year_established && (
                                    <p className="text-sm text-red-500">{form.errors.year_established}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Enhanced Business Details */}
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-gray-900">Business Details</h2>
                            <button type="button" onClick={()=>
                                setIsBusinessDetailsSectionCollapsed(!isBusinessDetailsSectionCollapsed)}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                <svg className={`w-4 h-4 transition-transform ${isBusinessDetailsSectionCollapsed
                                    ? 'rotate-0' : 'rotate-180' }`} fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                                <span className="hidden md:inline">
                                    {isBusinessDetailsSectionCollapsed ? 'Show' : 'Hide'} Section
                                </span>
                                <span className="md:hidden">
                                    {isBusinessDetailsSectionCollapsed ? 'Show' : 'Hide'}
                                </span>
                            </button>
                        </div>

                        {!isBusinessDetailsSectionCollapsed && (
                        <div className="space-y-8">
                            {/* Business Description */}
                            <div className="space-y-2">
                                <Label htmlFor="business_description" className="text-base font-medium text-gray-900">
                                    Business Description *
                                </Label>
                                <textarea id="business_description" name="business_description" rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={String(form.data.business_description || '' )} onChange={(e)=> form.setData('business_description', e.target.value)}
                                            required
                                        />
                                        {form.errors.business_description && (
                                            <p className="text-sm text-red-500">{form.errors.business_description}</p>
                                        )}
                                    </div>

                                    {/* Business Status Checkboxes */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Label className="text-base font-medium text-gray-900">Business is currently:</Label>
                                            <div className="group relative">
                                                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                                                    <p className="text-xs text-yellow-800">Select all that apply to describe your business operation type.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(form.data.absentee_owner)}
                                                        onChange={(e) => form.setData('absentee_owner', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Absentee owner</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(form.data.relocatable)}
                                                        onChange={(e) => form.setData('relocatable', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Relocatable</span>
                                                </label>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(form.data.home_based)}
                                                        onChange={(e) => form.setData('home_based', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Home-based</span>
                                                </label>
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(form.data.established_franchise)}
                                                        onChange={(e) => form.setData('established_franchise', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Established Franchise</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Number of Employees and Year Established */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="employees" className="text-base font-medium text-gray-900">
                                                Number of Employees
                                            </Label>
                                            <Input
                                                id="employees"
                                                name="employees"
                                                type="number"
                                                placeholder="eg. 25"
                                                value={String(form.data.employees || '')}
                                                onChange={(e) => form.setData('employees', e.target.value)}
                                            />
                                            {form.errors.employees && (
                                                <p className="text-sm text-red-500">{form.errors.employees}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="year_established" className="text-base font-medium text-gray-900">
                                                Year Established
                                            </Label>
                                            <Input
                                                id="year_established"
                                                name="year_established"
                                                type="number"
                                                placeholder="YYYY"
                                                value={String(form.data.year_established || '')}
                                                onChange={(e) => form.setData('year_established', e.target.value)}
                                            />
                                            {form.errors.year_established && (
                                                <p className="text-sm text-red-500">{form.errors.year_established}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Business Website */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Label htmlFor="business_website" className="text-base font-medium text-gray-900">
                                                Business Website
                                            </Label>
                                            <div className="group relative">
                                                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
                                                    <p className="text-xs text-yellow-800">Include your business website URL if you have one. This helps buyers understand your online presence.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            id="business_website"
                                            name="business_website"
                                            type="url"
                                            placeholder="https://site.com or http://www.site.com"
                                            value={String(form.data.business_website || '')}
                                            onChange={(e) => form.setData('business_website', e.target.value)}
                                        />
                                        {form.errors.business_website && (
                                            <p className="text-sm text-red-500">{form.errors.business_website}</p>
                                        )}
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(form.data.keep_website_confidential)}
                                                onChange={(e) => form.setData('keep_website_confidential', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700">Keep website confidential</span>
                                        </label>
                                    </div>

                                    {/* Facilities & Assets */}
                                    <div className="space-y-2">
                                        <Label htmlFor="facilities_assets" className="text-base font-medium text-gray-900">
                                            Facilities & Assets
                                        </Label>
                                        <textarea
                                            id="facilities_assets"
                                            name="facilities_assets"
                                            rows={3}
                                            placeholder="Describe the facilities and assets included with the business"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={String(form.data.facilities_assets || '')}
                                            onChange={(e) => form.setData('facilities_assets', e.target.value)}
                                            maxLength={560}
                                        />
                                        <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-xs text-yellow-800">
                                                Describe the significant physical assets included in the sale. This can include the size, furnishing, parking, age and condition of the facilities and, if leased, the terms of the lease.
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">{560 - (String(form.data.facilities_assets || '').length || 0)} Characters Remaining</p>
                                        {form.errors.facilities_assets && (
                                            <p className="text-sm text-red-500">{form.errors.facilities_assets}</p>
                                        )}
                                    </div>

                                    {/* Support & Training */}
                                    <div className="space-y-2">
                                        <Label htmlFor="support_training" className="text-base font-medium text-gray-900">
                                            Support & Training
                                        </Label>
                                        <textarea
                                            id="support_training"
                                            name="support_training"
                                            rows={3}
                                            placeholder="What type of support and training can you offer?"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={String(form.data.support_training || '')}
                                            onChange={(e) => form.setData('support_training', e.target.value)}
                                            maxLength={370}
                                        />
                                        <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-xs text-yellow-800">
                                                That you will provide the buyer.
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">{370 - (String(form.data.support_training || '').length || 0)} Characters Remaining</p>
                                        {form.errors.support_training && (
                                            <p className="text-sm text-red-500">{form.errors.support_training}</p>
                                        )}
                                    </div>

                                    {/* Market & Competition */}
                                    <div className="space-y-2">
                                        <Label htmlFor="market_competition" className="text-base font-medium text-gray-900">
                                            Market & Competition
                                        </Label>
                                        <textarea
                                            id="market_competition"
                                            name="market_competition"
                                            rows={3}
                                            placeholder="What is the current market condition for your business?"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={String(form.data.market_competition || '')}
                                            onChange={(e) => form.setData('market_competition', e.target.value)}
                                            maxLength={560}
                                        />
                                        <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-xs text-yellow-800">
                                                Detail facts about the market such as if the business's product/service is the only game in town, and if the business is in a prime location.
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">{560 - (String(form.data.market_competition || '').length || 0)} Characters Remaining</p>
                                        {form.errors.market_competition && (
                                            <p className="text-sm text-red-500">{form.errors.market_competition}</p>
                                        )}
                                    </div>

                                    {/* Growth/Expansion */}
                                    <div className="space-y-2">
                                        <Label htmlFor="growth_expansion" className="text-base font-medium text-gray-900">
                                            Growth/Expansion Pros and Cons
                                        </Label>
                                        <textarea
                                            id="growth_expansion"
                                            name="growth_expansion"
                                            rows={3}
                                            placeholder="What growth opportunities are there?"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={String(form.data.growth_expansion || '')}
                                            onChange={(e) => form.setData('growth_expansion', e.target.value)}
                                            maxLength={560}
                                        />
                                        <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-xs text-yellow-800">
                                                Explain the expansion possibilities for the business. Are there related services or products that could be added to the business's current offerings?
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">{560 - (String(form.data.growth_expansion || '').length || 0)} Characters Remaining</p>
                                        {form.errors.growth_expansion && (
                                            <p className="text-sm text-red-500">{form.errors.growth_expansion}</p>
                                        )}
                                    </div>

                                    {/* Reason for Selling */}
                                    <div className="space-y-2">
                                        <Label htmlFor="reason_for_selling" className="text-base font-medium text-gray-900">
                                            Reason for Selling
                                        </Label>
                                        <Input
                                            id="reason_for_selling"
                                            name="reason_for_selling"
                                            type="text"
                                            placeholder="Why are you selling your business?"
                                            value={String(form.data.reason_for_selling || '')}
                                            onChange={(e) => form.setData('reason_for_selling', e.target.value)}
                                        />
                                        {form.errors.reason_for_selling && (
                                            <p className="text-sm text-red-500">{form.errors.reason_for_selling}</p>
                                        )}
                                    </div>

                                    {/* Remaining Simple Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { field: 'inventory', label: 'Inventory', type: 'number' },
                                            { field: 'building_size', label: 'Building Size', type: 'number' },
                                            { field: 'financing_details', label: 'Financing Details', type: 'text' },
                                        ].map(({ field, label, type }) => (
                                            <div key={field} className="space-y-2">
                                                <Label htmlFor={field} className="text-base font-medium text-gray-900">
                                                    {label}
                                                </Label>
                                                <Input
                                                    id={field}
                                                    name={field}
                                                    type={type}
                                                    value={String(form.data[field as keyof FormData] || '')}
                                                    onChange={(e) => form.setData(field as keyof FormData, e.target.value)}
                                                />
                                                {form.errors[field as keyof FormData] && (
                                                    <p className="text-sm text-red-500">{form.errors[field as keyof FormData]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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

                        <div>
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
                            
                            <div className="flex justify-between mt-6">
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
                    </>
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
