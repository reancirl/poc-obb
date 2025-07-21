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
import { type FormFieldValue, type FormData } from '@/components/ListingForm';

interface BasicInfoStepProps {
  data: FormData;
  setData: (field: keyof FormData, value: FormFieldValue) => void;
  errors: Partial<Record<keyof FormData, string>>;
  processing: boolean;
  onNext: () => void;
  listingTypes: string[];
  industries: string[];
  locationConfidentialityOptions: string[];
  realEstateTypes: string[];
  user: User;
}

export default function BasicInfoStep({
  data,
  setData,
  errors,
  processing,
  onNext,
  listingTypes,
  industries,
  locationConfidentialityOptions,
  realEstateTypes,
  user,
}: BasicInfoStepProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;

    let processedValue: FormFieldValue = value;
    
    if (type === 'number') {
      processedValue = value === '' ? null : Number(value);
    } else if (type === 'checkbox') {
      processedValue = Boolean(value);
    } else if (name === 'ebitda' || name === 'rent' || name === 'inventory') {
      processedValue = String(value || '');
    }
    
    setData(name as keyof FormData, processedValue);
  };

  const handleSelect = (name: keyof FormData) => (value: string) => {
    let processedValue: FormFieldValue = value;
    
    if (name === 'ebitda' || name === 'rent' || name === 'inventory') {
      processedValue = String(value || '');
    } else if (name === 'seller_financing') {
      processedValue = value === 'true';
    }
    
    setData(name, processedValue);
  };

  const handleNext = () => {
    // Basic validation before proceeding
    const requiredFields = ['headline', 'industry', 'listing_type', 'location_name', 'city', 'state', 'zip', 'email', 'phone_number'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields before continuing.');
      return;
    }
    
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline">Headline *</Label>
            <Input
              id="headline"
              name="headline"
              value={(data.headline as string) || ''}
              onChange={handleChange}
              required
              placeholder="Enter a compelling headline for your listing"
            />
            {errors.headline && (
              <p className="text-sm text-red-500">{errors.headline}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <SearchableSelect
              options={industries}
              value={String(data.industry || '')}
              onChange={handleSelect('industry')}
              placeholder="Search and select industry..."
              required
            />
            {errors.industry && (
              <p className="text-sm text-red-500">{errors.industry}</p>
            )}
          </div>

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

          {/* Real Estate Type */}
          <div className="space-y-2">
            <Label htmlFor="real_estate_type">Real Estate Type</Label>
            <Select
              value={String(data.real_estate_type || '')}
              onValueChange={handleSelect('real_estate_type')}
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
            {errors.real_estate_type && (
              <p className="text-sm text-red-500">{errors.real_estate_type}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-6">Location Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['location_name', 'address', 'city', 'state', 'zip', 'county'].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>
                {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                {field !== 'county' && field !== 'address' ? ' *' : ''}
              </Label>
              <Input
                id={field}
                name={field}
                value={String(data[field] || '')}
                onChange={handleChange}
                required={field !== 'county' && field !== 'address'}
              />
              {errors[field as keyof FormData] && (
                <p className="text-sm text-red-500">{errors[field as keyof FormData]}</p>
              )}
            </div>
          ))}

          {/* Location Confidentiality */}
          <div className="space-y-2">
            <Label htmlFor="location_confidentiality">Location Confidentiality</Label>
            <Select
              value={String(data.location_confidentiality || '')}
              onValueChange={handleSelect('location_confidentiality')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select confidentiality level" />
              </SelectTrigger>
              <SelectContent>
                {locationConfidentialityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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
        <h3 className="text-lg font-medium mb-6">Contact Information</h3>
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

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={processing}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Continue to Choose Plan
        </button>
      </div>
    </div>
  );
}
