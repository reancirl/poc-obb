import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import ListingForm, { type FormData } from '@/components/ListingForm';

type FileWithPreview = (File & {
  preview: string;
  isPrimary: boolean;
  id?: number;
  name: string; // Ensure name property is available
  type: string; // Ensure type property is available
  size: number; // Ensure size property is available
}) | {
  preview: string;
  isPrimary: boolean;
  id: number;
  url: string;
  is_primary: boolean;
};

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
    // State for file uploads
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    // Initialize form with listing data
    const form = useForm<FormData & { primary_image_index?: number }>({
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
        asking_price: listing.asking_price ?? '',
        cash_flow: listing.cash_flow ?? '',
        gross_revenue: listing.gross_revenue ?? '',
        ebitda: listing.ebitda ?? '',
        rent: listing.rent ?? '',
        year_established: listing.year_established ?? '',
        // seller_financing rule is commented out, but if you re-enable it:
        // seller_financing: listing.seller_financing ?? false,
        business_description: listing.business_description ?? '',
        ad_id: listing.ad_id ?? '',
        inventory: listing.inventory ?? '',
        real_estate_type: listing.real_estate_type ?? '',
        building_size: listing.building_size ?? '',
        lease_expiration: listing.lease_expiration ?? '',
        employees: listing.employees ?? '',
        facilities: listing.facilities ?? '',
        competition: listing.competition ?? '',
        growth_expansion: listing.growth_expansion ?? '',
        financing_details: listing.financing_details ?? '',
        support_training: listing.support_training ?? '',
        reason_for_selling: listing.reason_for_selling ?? '',
        listing_agent: listing.listing_agent ?? '',
        agent_phone_number: listing.agent_phone_number ?? '',
        status: listing.status ?? 'draft',
        primary_image_index: 0,
      });

    // Load existing images
    useEffect(() => {
        if (listing.image_urls && listing.image_urls.length > 0) {
            const existingImages = listing.image_urls.map((img: any) => ({
                preview: img.url,
                isPrimary: img.is_primary,
                id: img.id,
                url: img.url,
                is_primary: img.is_primary
            }));
            setFiles(existingImages);
            
            // Set primary image index
            const primaryIndex = existingImages.findIndex((img: any) => img.isPrimary);
            if (primaryIndex !== -1) {
                form.setData('primary_image_index', primaryIndex);
            }
        }
    }, [listing.image_urls]);

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

        // Handle file drop
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
                isPrimary: files.length === 0
            }));
            
            if (newFiles.length > 0) {
                setFiles(prevFiles => [...prevFiles, ...newFiles]);
                
                // If this is the first file, set it as primary
                if (files.length === 0) {
                    form.setData('primary_image_index', 0);
                }
            }
        }, [files.length]);

        // Remove a file
        const removeFile = (index: number) => {
            const fileToRemove = files[index];
            
            // If this is an existing image, add its ID to deletedImageIds
            if (fileToRemove.id !== undefined) {
                setDeletedImageIds(prev => [...prev, fileToRemove.id as number]);
            }
            
            // Remove the file from the files array
            const newFiles = files.filter((_, i) => i !== index);
            setFiles(newFiles);
            
            // If we removed the primary image and there are still files left, set the first one as primary
            if (fileToRemove.isPrimary && newFiles.length > 0) {
                setFiles(prev => {
                    const updated = [...prev];
                    updated[0] = { ...updated[0], isPrimary: true };
                    form.setData('primary_image_index', 0);
                    return updated;
                });
            }
        };

        // Set a file as primary
        const setPrimary = (index: number) => {
            setFiles(prevFiles => 
                prevFiles.map((file, i) => ({
                    ...file,
                    isPrimary: i === index,
                    is_primary: i === index
                }))
            );
            form.setData('primary_image_index', index);
        };

        // Clean up object URLs to avoid memory leaks
        useEffect(() => {
            return () => {
                files.forEach(file => URL.revokeObjectURL(file.preview));
            };
        }, [files]);

        const [isUploading, setIsUploading] = useState(false);

        const submit = async (e: React.FormEvent) => {
            e.preventDefault();
            
            if (isUploading) return;
            
            setIsUploading(true);
            
            try {
                // Direct approach: use the original form submit with a direct object
                const formObject = {
                    // Explicitly include all required fields
                    headline: form.data.headline || '',
                    industry: form.data.industry || '',
                    listing_type: form.data.listing_type || '',
                    location_name: form.data.location_name || '',
                    address: form.data.address || '',
                    city: form.data.city || '',
                    state: form.data.state || '',
                    zip: form.data.zip || '',
                    county: form.data.county || '',
                    location_confidentiality: form.data.location_confidentiality || '',
                    email: form.data.email || '',
                    phone_number: form.data.phone_number || '',
                    asking_price: form.data.asking_price ? Number(form.data.asking_price) : 0,
                    cash_flow: form.data.cash_flow ? Number(form.data.cash_flow) : null,
                    gross_revenue: form.data.gross_revenue ? Number(form.data.gross_revenue) : null,
                    ebitda: form.data.ebitda || null,
                    rent: form.data.rent || null,
                    year_established: form.data.year_established ? Number(form.data.year_established) : null,
                    seller_financing: form.data.seller_financing === 'true' || form.data.seller_financing === true,
                    business_description: form.data.business_description || '',
                    ad_id: form.data.ad_id || '',
                    inventory: form.data.inventory || '',
                    real_estate_type: form.data.real_estate_type || '',
                    building_size: form.data.building_size ? Number(form.data.building_size) : null,
                    lease_expiration: form.data.lease_expiration || null,
                    employees: form.data.employees ? Number(form.data.employees) : null,
                    facilities: form.data.facilities || '',
                    competition: form.data.competition || '',
                    growth_expansion: form.data.growth_expansion || '',
                    financing_details: form.data.financing_details || '',
                    support_training: form.data.support_training || '',
                    reason_for_selling: form.data.reason_for_selling || '',
                    listing_agent: form.data.listing_agent || '',
                    agent_phone_number: form.data.agent_phone_number || '',
                    status: form.data.status || 'draft',
                    _method: 'PUT', // Laravel method spoofing
                };

                // Handle image uploads separately if needed
                if (files.some(file => file instanceof File) || deletedImageIds.length > 0) {
                    const formData = new FormData();
                    
                    // Add all form data
                    Object.entries(formObject).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            formData.append(key, String(value));
                        }
                    });
                    
                    // Add deleted image IDs
                    deletedImageIds.forEach(id => {
                        formData.append('deleted_image_ids[]', id.toString());
                    });
                    
                    // Process files similar to Create.tsx
                    let newFileIndex = 0;
                    let hasPrimaryId = false;

                    // First handle existing images and primary selection
                    files.forEach((file) => {
                        if (!('id' in file)) return;
                        
                        if (file.isPrimary && file.id) {
                            formData.append('primary_image_id', file.id.toString());
                            hasPrimaryId = true;
                        }
                    });
                    
                    // Then handle new file uploads with the corrected array syntax
                    files.forEach((file) => {
                        // Only append new files (not the ones that were already uploaded)
                        if (file instanceof File && file.size > 0) {
                            try {
                                // The exact format Laravel expects - note the quotes around 'images[]'
                                formData.append('images[]', file);
                                
                                // If we don't have a primary image yet, use the first new file
                                if (!hasPrimaryId && newFileIndex === 0 && !form.data.primary_image_id) {
                                    formData.append('primary_image_index', '0');
                                }
                                
                                console.log(`Adding new file:`, {
                                    name: file.name,
                                    type: file.type,
                                    size: file.size
                                });
                                
                                newFileIndex++;
                            } catch (err) {
                                console.error('Error appending file:', err);
                            }
                        }
                    });
                    
                    // For debugging, check what's in the formData
                    console.log('File count:', files.length, 'New files:', newFileIndex);
                    for (const pair of formData.entries()) {
                        console.log(`${pair[0]}: ${pair[1]}`);
                    }
                    
                    console.log('Form data being submitted with files:', Object.fromEntries(formData.entries()));
                    
                    // Use the formData approach for file uploads
                    await router.post(`/seller/listings/${listing.id}`, formData, {
                        preserveState: false,  // Don't preserve the form state
                        preserveScroll: false, // Don't preserve scroll position
                        onSuccess: (page) => {
                            // Clean up object URLs to avoid memory leaks
                            files.forEach(file => {
                                if (file instanceof File) {
                                    URL.revokeObjectURL(file.preview);
                                }
                            });
                            
                            // Check if we're still on the edit page after submission
                            if (page.component === `Seller/Listings/Edit`) {
                                toast.success('Listing updated successfully!');
                                // Optionally redirect to show page or listings index
                                router.visit(route('seller.listings.show', listing.id));
                            }
                        },
                        onError: (errors: any) => {
                            console.error('Error updating listing:', errors);
                            toast.error('Failed to update listing. Please check the form for errors.');
                        },
                    });
                } else {
                    // No file uploads, use the simpler object approach
                    console.log('Form data being submitted without files:', formObject);
                    
                    await router.put(route('seller.listings.update', listing.id), formObject, {
                        onSuccess: () => {
                            toast.success('Listing updated successfully!');
                        },
                        onError: (errors: any) => {
                            console.error('Error updating listing:', errors);
                            toast.error('Failed to update listing. Please check the form for errors.');
                        },
                    });
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                toast.error('An error occurred while submitting the form.');
            } finally {
                setIsUploading(false);
            }
        };

        const cancel = () => {
        router.get(route('seller.listings.index'));
        };

        return (
        <AppLayout>

            <Head title={`Edit Listing: ${listing.headline}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Image Upload Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Listing Images</h2>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload files</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    onDrop(Array.from(e.target.files));
                                                }
                                            }}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        
                        {/* Image Previews */}
                        {files.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {files.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                                                (file as any).isPrimary ? 'border-indigo-500' : 'border-gray-200'
                                            }`}>
                                                <img
                                                    src={(file as any).preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPrimary(index)}
                                                            className="p-1.5 bg-white rounded-full shadow-md text-gray-700 hover:bg-indigo-50"
                                                            title="Set as primary"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="p-1.5 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50"
                                                            title="Remove image"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {(file as any).isPrimary && (
                                                <div className="absolute top-1 left-1 bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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
                                    <button type="submit" disabled={form.processing || isUploading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                        {form.processing || isUploading ? 'Saving…' : 'Save Listing'}
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
