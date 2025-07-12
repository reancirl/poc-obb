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
  locationConfidentialityOptions: string[];
  realEstateTypes: string[];
}

export default function ListingForm({
  data,
  setData,
  errors,
  processing,
  onCancel,
  listingTypes,
  industries,
  locationConfidentialityOptions,
  realEstateTypes,
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
            />
            {errors.headline && (
              <p className="text-sm text-red-500">{errors.headline}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={String(data.industry || '')}
              onValueChange={handleSelect('industry')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {['location_name', 'address', 'city', 'state', 'zip', 'county'].map((field) => (
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
              value={String(data.email || '')}
              onChange={handleChange}
              required
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
              value={String(data.phone_number || '')}
              onChange={handleChange}
              required
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number}</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white shadow rounded-lg p-6">
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
                  data[field] !== undefined && data[field] !== null
                    ? String(data[field])
                    : ''
                }
                onChange={handleChange}
                required
              />
              {errors[field as keyof FormData] && (
                <p className="text-sm text-red-500">{errors[field as keyof FormData]}</p>
              )}
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="seller_financing" className="pr-2">Seller Financing</Label>
            <input
              type="checkbox"
              id="seller_financing"
              name="seller_financing"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={data.seller_financing === true}
              onChange={(e) => setData('seller_financing', e.target.checked)}
            />
            {errors.seller_financing && (
              <p className="text-sm text-red-500">{errors.seller_financing}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="business_description">Business Description *</Label>
            <Input
              id="business_description"
              name="business_description"
              value={String(data.business_description || '')}
              onChange={handleChange}
              required
            />
            {errors.business_description && (
              <p className="text-sm text-red-500">{errors.business_description}</p>
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
                value={String(data[field] || '')}
                onChange={handleChange}
              />
              {errors[field as keyof FormData] && (
                <p className="text-sm text-red-500">{errors[field as keyof FormData]}</p>
              )}
            </div>
          ))}

          {/* Real Estate Type */}
          <div className="space-y-2">
            <Label htmlFor="real_estate_type">Real Estate Type *</Label>
            <Select
              value={String(data.real_estate_type || '')}
              onValueChange={handleSelect('real_estate_type')}
              required
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

          {/* Lease Expiration */}
          <div className="space-y-2">
            <Label htmlFor="lease_expiration">Lease Expiration *</Label>
            <Input
              id="lease_expiration"
              name="lease_expiration"
              type="date"
              value={String(data.lease_expiration || '')}
              onChange={handleChange}
              required
            />
            {errors.lease_expiration && (
              <p className="text-sm text-red-500">{errors.lease_expiration}</p>
            )}
          </div>
        </div>
      </div>

      {/* Listing Agent */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Listing Agent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="listing_agent">Agent Name *</Label>
            <Input
              id="listing_agent"
              name="listing_agent"
              value={String(data.listing_agent || '')}
              onChange={handleChange}
              required
            />
            {errors.listing_agent && (
              <p className="text-sm text-red-500">{errors.listing_agent}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent_phone_number">Agent Phone Number *</Label>
            <Input
              id="agent_phone_number"
              name="agent_phone_number"
              type="tel"
              value={String(data.agent_phone_number || '')}
              onChange={handleChange}
              required
            />
            {errors.agent_phone_number && (
              <p className="text-sm text-red-500">{errors.agent_phone_number}</p>
            )}
          </div>
        </div>
      </div>

      </div>
  );
}