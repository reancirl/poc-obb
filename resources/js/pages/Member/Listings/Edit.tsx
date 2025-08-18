import React, { useState, useCallback, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { Stepper } from '@/components/ui/stepper';
import PlanSelection from '@/components/PlanSelection';
import ListingForm from '@/components/ListingForm';
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
  industries: string[];
  industryChildren: Record<string, Record<string, string>>;
}

export default function EditListing({ listing, auth, industries, industryChildren }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  // Define missing options arrays
  const locationConfidentialityOptions = [
    'Public',
    'City Only',
    'County Only',
    'State Only',
    'Confidential'
  ];

  const realEstateTypes = [
    'Commercial Building',
    'Retail Space',
    'Office Building',
    'Industrial Property',
    'Restaurant Space',
    'Warehouse',
    'Other'
  ];
  const [isUploading, setIsUploading] = useState(false);
  const [isFinancialSectionCollapsed, setIsFinancialSectionCollapsed] = useState(false);
  const [isBusinessDetailsSectionCollapsed, setIsBusinessDetailsSectionCollapsed] = useState(false);

  // File upload functions (matching Create.tsx)
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
      const fileToRemove = prevFiles[index];
      
      // If removing existing image, add to deleted list
      if ('id' in fileToRemove && fileToRemove.id && typeof fileToRemove.id === 'number') {
        setDeletedImageIds(prev => [...prev, fileToRemove.id as number]);
      }
      
      // Clean up object URL
      if ('preview' in fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      const newFiles = prevFiles.filter((_, i) => i !== index);
      
      // If we removed the primary image, set the first remaining image as primary
      if (fileToRemove.isPrimary && newFiles.length > 0) {
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

  // Initialize form with listing data
  const form = useForm<FormData>({
    headline: listing.headline ?? '',
    industry: listing.industry ?? '',
    industry_subcategory: listing.industry_subcategory ?? '',
    listing_type: listing.listing_type ?? '',
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
    console.log('=== DEBUGGING IMAGE LOADING ===');
    console.log('Loading existing images for listing:', listing.id);
    console.log('Full listing object:', listing);
    console.log('Listing image_urls:', listing.image_urls);
    console.log('Listing images:', (listing as any).images);
    console.log('Listing photos:', listing.photos);
    console.log('All listing keys:', Object.keys(listing));
    
    // Try multiple possible image property names
    let imageUrls: string[] = [];
    
    if (listing.image_urls && Array.isArray(listing.image_urls) && listing.image_urls.length > 0) {
      // Handle if image_urls contains Image objects with id, url, and is_primary properties (like Show.tsx)
      console.log('Raw image_urls data:', listing.image_urls);
      
      // Check if these are Image objects with database IDs
      const firstItem = listing.image_urls[0];
      if (typeof firstItem === 'object' && 'id' in firstItem && 'url' in firstItem) {
        // These are proper Image objects with database IDs
        const existingImages = listing.image_urls.map((img: any) => ({
          preview: img.url,
          isPrimary: img.is_primary || false,
          id: img.id, // Use real database ID
          url: img.url,
          is_primary: img.is_primary || false,
          isExisting: true
        }));
        
        console.log('Setting existing images with real IDs:', existingImages);
        setFiles(existingImages);
        return; // Exit early since we've handled the images
      } else {
        // Fallback: extract URLs from objects or use strings directly
        imageUrls = listing.image_urls.map((img: any) => 
          typeof img === 'string' ? img : img.url
        ).filter(Boolean);
      }
    } else if ((listing as any).images && Array.isArray((listing as any).images)) {
      // Handle if images come as objects with url property
      imageUrls = (listing as any).images.map((img: any) => 
        typeof img === 'string' ? img : img.url || img.image_url || img.path || img.file_path
      ).filter(Boolean);
    } else if (listing.photos && typeof listing.photos === 'string') {
      // Handle if photos is a JSON string
      try {
        const photosArray = JSON.parse(listing.photos);
        if (Array.isArray(photosArray)) {
          imageUrls = photosArray;
        }
      } catch (e) {
        console.warn('Failed to parse photos JSON:', e);
      }
    }
    
    console.log('Processed imageUrls:', imageUrls);
    console.log('ImageUrls details:', imageUrls.map((url, i) => ({ index: i, value: url, type: typeof url, isString: typeof url === 'string', isTruthy: !!url })));
    
    if (imageUrls.length > 0) {
      const filteredUrls = imageUrls.filter(url => {
        const isValid = url && typeof url === 'string';
        console.log('Filtering URL:', { url, type: typeof url, isValid });
        return isValid;
      });
      
      console.log('Filtered URLs:', filteredUrls);
      
      const existingImages = filteredUrls
        .map((url: string, index: number) => ({
          preview: url, // Use the URL directly like Show.tsx does
          isPrimary: index === 0,
          id: index + 1,
          url: url,
          is_primary: index === 0,
          isExisting: true
        }));
      
      console.log('Setting existing images:', existingImages);
      setFiles(existingImages);
    } else {
      console.log('No existing images found');
    }
  }, [listing.id, listing.image_urls, listing.photos]);

  const listingTypes = [
    'Established Business for Sale',
    'Asset Sale',
    'Business Real Estate for Sale (No Business Included)',
    'Business Real Estate for Lease (No Business Included)',
    'Startup Opportunity'
  ];

  // Industries are now passed from the backend via Industry constants
  const sortedIndustries = [...industries].sort();

  // Step-specific validation functions
  const validateStep1 = (): boolean => {
    console.log('🔍 Validating Step 1 (Edit)...');
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
    console.log('✅ Step 2 validation passed!');
    return true;
  };
  
  const validateStep3 = (): boolean => {
    console.log('🔍 Validating Step 3 (Edit)...');
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
  
  const validateStep4 = (): boolean => {
    console.log('🔍 Validating Step 4 (Edit)...');
    const errors: Record<string, string> = {};
    
    // Business description validation (optional but if provided should not be empty)
    if (form.data.business_description && typeof form.data.business_description === 'string' && form.data.business_description.trim() === '') {
      errors.business_description = 'Business description cannot be empty if provided';
    }
    
    if (Object.keys(errors).length > 0) {
      console.log('❌ Step 4 validation failed with errors:', errors);
      Object.keys(errors).forEach(key => {
        form.setError(key, errors[key]);
      });
      toast.error('Please fix the errors before submitting.');
      return false;
    }
    
    console.log('✅ Step 4 validation passed!');
    form.clearErrors();
    return true;
  };
  
  const validateStep = (step: number): boolean => {
    console.log('🚀 validateStep called for step:', step);
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return true;
    }
  };

  const nextStep = () => {
    console.log('🚀 nextStep called for step:', currentStep);
    const isValid = validateStep(currentStep);
    console.log('✨ Validation result:', isValid);
    if (isValid) {
      console.log('➡️ Moving to next step:', Math.min(currentStep + 1, 4));
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      console.log('⛔ Cannot proceed - validation failed');
    }
  };

  const prevStep = () => {
    console.log('⬅️ Going back from step:', currentStep, 'to step:', Math.max(currentStep - 1, 1));
    // Clear any validation errors when going back
    form.clearErrors();
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

    // Handle image files like Create.tsx does
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

    // Send deleted image IDs to backend
    if (deletedImageIds.length > 0) {
      deletedImageIds.forEach(id => {
        formData.append('deleted_image_ids[]', id.toString());
      });
      console.log('Deleted image IDs being sent:', deletedImageIds);
    }

    // Append files exactly as Laravel expects them
    // Laravel controller uses $request->file('images') which means we need 'images[]'
    files.forEach((file, index) => {
      // Check if this is a new file (has File properties) vs existing image (has url property)
      const isExistingImage = 'url' in file && !('size' in file);
      const isNewFile = 'size' in file && file.size > 0;
      
      if (isNewFile && !isExistingImage) {
        try {
          formData.append('images[]', file as File);
          console.log(`Adding new file ${index}:`, {
            name: (file as File).name,
            type: (file as File).type,
            size: (file as File).size,
            constructor: (file as File).constructor.name
          });
        } catch (err) {
          console.error(`Error appending file ${index}:`, err);
        }
      } else if (isExistingImage) {
        console.log(`Keeping existing image ${index}:`, (file as any).url);
      } else {
        console.warn(`Skipping invalid file at index ${index}`);
      }
    });

    console.log('Form data being submitted:', Object.fromEntries(formData.entries()));
    console.log('File count:', files.length);

    // For debugging, check what's in the formData
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

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



  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Business details and location',
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

  const cancel = () => {
    router.get(route('member.listings.index'));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ListingForm 
                data={form.data} 
                setData={form.setData} 
                errors={form.errors}
                processing={form.processing} 
                listingTypes={listingTypes} 
                industries={sortedIndustries}
                industryChildren={industryChildren}
                locationConfidentialityOptions={locationConfidentialityOptions}
                realEstateTypes={realEstateTypes} 
                user={auth.user} 
                onCancel={cancel} 
              />

              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={nextStep}
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
          <PlanSelection onNext={nextStep} onBack={prevStep} />
        );
      case 3:
        return (
          <>
            <div className="space-y-6">
              {/* Listing Images */}
              <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Listing Images</h3>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={(e) => {
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
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({files.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${file.isPrimary ? 'ring-2 ring-indigo-500' : 'border border-gray-200'}`}>
                            <img src={file.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setPrimary(index)}
                              className="p-1.5 bg-white rounded-full text-indigo-600 hover:bg-indigo-50"
                              title="Set as primary"
                            >
                              <span className="sr-only">Set as primary</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                              title="Remove image"
                            >
                              <span className="sr-only">Remove image</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          {file.isPrimary && (
                            <span className="absolute top-1 right-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">Primary</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            {/* Blue Info Box */}
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
                  <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
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
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="asking_price" className="text-base font-medium text-gray-900">
                      Asking Price
                    </Label>
                    <Input
                      id="asking_price"
                      name="asking_price"
                      type="text"
                      placeholder="$0"
                      value={String(form.data.asking_price || '')}
                      onChange={(e) => form.setData('asking_price', Number(e.target.value) || 0)}
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
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cash_flow" className="text-base font-medium text-gray-900">
                      Cash Flow (SDE)
                    </Label>
                    <Input
                      id="cash_flow"
                      name="cash_flow"
                      type="text"
                      placeholder="$0"
                      value={String(form.data.cash_flow || '')}
                      onChange={(e) => form.setData('cash_flow', Number(e.target.value) || 0)}
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
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="ebitda" className="text-base font-medium text-gray-900">
                      EBITDA
                    </Label>
                    <Input
                      id="ebitda"
                      name="ebitda"
                      type="text"
                      placeholder="$0"
                      value={String(form.data.ebitda || '')}
                      onChange={(e) => form.setData('ebitda', Number(e.target.value) || 0)}
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
                <Input
                  id="gross_revenue"
                  name="gross_revenue"
                  type="text"
                  placeholder="$0"
                  value={String(form.data.gross_revenue || '')}
                  onChange={(e) => form.setData('gross_revenue', Number(e.target.value) || 0)}
                />
                {form.errors.gross_revenue && (
                  <p className="text-sm text-red-500">{form.errors.gross_revenue}</p>
                )}
                <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
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
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Furniture, Fixtures & Equipment
                    </div>
                  </div>
                </div>
                <Input
                  id="ffe"
                  name="ffe"
                  type="text"
                  placeholder="$0"
                  value={String(form.data.ffe || '')}
                  onChange={(e) => form.setData('ffe', Number(e.target.value) || 0)}
                />
                {form.errors.ffe && (
                  <p className="text-sm text-red-500">{form.errors.ffe}</p>
                )}
                <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs text-yellow-800">
                    Included in asking price.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Business Financials - wrap existing financial section */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Business Financials</h2>
                <button
                  type="button"
                  onClick={() => setIsFinancialSectionCollapsed(!isFinancialSectionCollapsed)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isFinancialSectionCollapsed ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show <span className="hidden md:inline ml-1">Section</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
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
                        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
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
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          1
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="asking_price" className="text-base font-medium text-gray-900">
                            Asking Price
                          </Label>
                          <Input
                            id="asking_price"
                            name="asking_price"
                            type="text"
                            placeholder="$0"
                            value={String(form.data.asking_price || '')}
                            onChange={(e) => form.setData('asking_price', Number(e.target.value) || 0)}
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
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          2
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="cash_flow" className="text-base font-medium text-gray-900">
                            Cash Flow (SDE)
                          </Label>
                          <Input
                            id="cash_flow"
                            name="cash_flow"
                            type="text"
                            placeholder="$0"
                            value={String(form.data.cash_flow || '')}
                            onChange={(e) => form.setData('cash_flow', Number(e.target.value) || 0)}
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
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          3
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="ebitda" className="text-base font-medium text-gray-900">
                            EBITDA
                          </Label>
                          <Input
                            id="ebitda"
                            name="ebitda"
                            type="text"
                            placeholder="$0"
                            value={String(form.data.ebitda || '')}
                            onChange={(e) => form.setData('ebitda', Number(e.target.value) || 0)}
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
                      <Input
                        id="gross_revenue"
                        name="gross_revenue"
                        type="text"
                        placeholder="$0"
                        value={String(form.data.gross_revenue || '')}
                        onChange={(e) => form.setData('gross_revenue', Number(e.target.value) || 0)}
                      />
                      {form.errors.gross_revenue && (
                        <p className="text-sm text-red-500">{form.errors.gross_revenue}</p>
                      )}
                      <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
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
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Furniture, Fixtures & Equipment
                          </div>
                        </div>
                      </div>
                      <Input
                        id="ffe"
                        name="ffe"
                        type="text"
                        placeholder="$0"
                        value={String(form.data.ffe || '')}
                        onChange={(e) => form.setData('ffe', Number(e.target.value) || 0)}
                      />
                      {form.errors.ffe && (
                        <p className="text-sm text-red-500">{form.errors.ffe}</p>
                      )}
                      <div className="hidden md:block mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-xs text-yellow-800">
                          Included in asking price.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next: Describe Business
            </button>
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
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={form.processing || isUploading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {form.processing || isUploading ? 'Updating Listing...' : 'Update Listing'}
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
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={nextStep}
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
      <Head title="Edit Business Listing" />
      
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
