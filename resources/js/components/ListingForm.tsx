import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { type User } from '@/types';

// Type for form field values
export type FormFieldValue = string | number | boolean | File | File[] | null | undefined;
export type FormData = Record<string, FormFieldValue>;

interface ListingFormProps {
  data: FormData;
  setData: (field: keyof FormData, value: FormFieldValue) => void;
  errors: Partial<Record<keyof FormData, string>>;
  processing: boolean;
  onCancel: () => void;
  listingTypes: string[];
  industries: string[];
  industryChildren?: Record<string, Record<string, string>>;
  locationConfidentialityOptions: string[];
  realEstateTypes: string[];
  user: User;
}

export default function ListingForm({
  data,
  setData,
  errors,
  processing,
  onCancel,
  listingTypes,
  industries,
  industryChildren,
  locationConfidentialityOptions,
  realEstateTypes,
  user,
}: ListingFormProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;

    // Handle different field types
    let processedValue: FormFieldValue = value;
    
    if (type === 'number') {
      processedValue = value === '' ? null : Number(value);
    } else if (type === 'checkbox') {
      processedValue = Boolean(value);
    } else if (name === 'ebitda' || name === 'rent' || name === 'inventory') {
      // Ensure these fields are always strings
      processedValue = String(value || '');
    }
    
    setData(name as keyof FormData, processedValue);
  };

  const handleSelect = (name: keyof FormData) => (value: string) => {
    let processedValue: FormFieldValue = value;
    
    // Special handling for specific fields
    if (name === 'ebitda' || name === 'rent' || name === 'inventory') {
      processedValue = String(value || '');
    } else if (name === 'seller_financing') {
      processedValue = value === 'true';
    }
    
    setData(name, processedValue);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Basic Information</h2>
        {/* Headline - Full Width Row */}
        <div className="space-y-2 py-3">
          <Label htmlFor="headline">Headline *</Label>
          <Input
            id="headline"
            name="headline"
            value={(data.headline as string) || ''}
            onChange={handleChange}
            required
          />
          {errors.headline && (
            <p className="text-sm text-red-500">{errors.headline}</p>
          )}
        </div>

        {/* Industry and Subcategory - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry Category *</Label>
            <SearchableSelect
              options={industries}
              value={String(data.industry || '')}
              onChange={(value) => {
                handleSelect('industry')(value);
                // Clear subcategory when industry changes
                handleSelect('industry_subcategory')('');
              }}
              placeholder="Search and select industry..."
              required
            />
            {errors.industry && (
              <p className="text-sm text-red-500">{errors.industry}</p>
            )}
          </div>

          {/* Industry Subcategory */}
          <div className="space-y-2">
            <Label htmlFor="industry_subcategory">Industry Subcategory</Label>
            <SearchableSelect
              options={data.industry && industryChildren && industryChildren[data.industry as string] 
                ? Object.values(industryChildren[data.industry as string])
                : []
              }
              value={String(data.industry_subcategory || '')}
              onChange={handleSelect('industry_subcategory')}
              placeholder={data.industry ? "Select a subcategory..." : "First select an industry above"}
            />
            {errors.industry_subcategory && (
              <p className="text-sm text-red-500">{errors.industry_subcategory}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">

          {/* Listing Type */}
          <div className="space-y-2">
            <Label htmlFor="listing_type">Listing Type *</Label>
            <Select
              value={String(data.listing_type || '')}
              onValueChange={handleSelect('listing_type')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select listing type" />
              </SelectTrigger>
              <SelectContent>
                {listingTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.listing_type && (
              <p className="text-sm text-red-500">{errors.listing_type}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={String(data.status || '')}
              onValueChange={handleSelect('status')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {['draft', 'published', 'sold', 'inactive'].map((st) => (
                  <SelectItem key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Location Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['address', 'city', 'state', 'zip', 'county'].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>
                {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                {field !== 'county' ? ' *' : ''}
              </Label>
              <Input
                id={field}
                name={field}
                value={String(data[field] || '')}
                onChange={handleChange}
                required={field !== 'county'}
              />
              {errors[field as keyof FormData] && (
                <p className="text-sm text-red-500">{errors[field as keyof FormData]}</p>
              )}
            </div>
          ))}

          {/* Confidentiality */}
          <div className="space-y-2">
            <Label htmlFor="location_confidentiality">Location Confidentiality *</Label>
            <Select
              value={String(data.location_confidentiality || '')}
              onValueChange={handleSelect('location_confidentiality')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select confidentiality" />
              </SelectTrigger>
              <SelectContent>
                {locationConfidentialityOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location_confidentiality && (
              <p className="text-sm text-red-500">{errors.location_confidentiality}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={String(data.email || user.email || '')}
              onChange={handleChange}
              required
              placeholder={user.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={String(data.phone_number || user.phone || '')}
              onChange={handleChange}
              required
              placeholder={user.phone || 'Enter phone number'}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number}</p>
            )}
          </div>
        </div>
      </div>

      </div>
  );
}