import { useForm } from '@inertiajs/react';
import { FormEventHandler, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Type for form field values
type FormFieldValue = string | number | boolean | File | File[] | null | undefined;
export type FormData = Record<string, FormFieldValue>;

// Helper type to convert FormData to a more specific type
type FormFieldProps<T = string> = {
  value: T;
  onChange: (value: T) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
};

interface ListingFormProps {
  listing?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isProcessing: boolean;
  listingTypes: string[];
  industries: string[];
  locationConfidentialityOptions: string[];
  realEstateTypes: string[];
}

export default function ListingForm({
  listing,
  onSubmit,
  onCancel,
  isProcessing,
  listingTypes,
  industries,
  locationConfidentialityOptions,
  realEstateTypes
}: ListingFormProps) {
  const { data, setData, errors } = useForm<FormData>({
    headline: listing?.headline || '',
    industry: listing?.industry || '',
    listing_type: listing?.listing_type || '',
    location_name: listing?.location_name || '',
    address: listing?.address || '',
    city: listing?.city || '',
    state: listing?.state || '',
    zip: listing?.zip || '',
    county: listing?.county || '',
    location_confidentiality: listing?.location_confidentiality || '',
    email: listing?.email || '',
    phone_number: listing?.phone_number || '',
    asking_price: listing?.asking_price || '',
    cash_flow: listing?.cash_flow || '',
    gross_revenue: listing?.gross_revenue || '',
    ebitda: listing?.ebitda || '',
    rent: listing?.rent || '',
    year_established: listing?.year_established || '',
    seller_financing: listing?.seller_financing || false,
    business_description: listing?.business_description || '',
    ad_id: listing?.ad_id || '',
    inventory: listing?.inventory || '',
    real_estate_type: listing?.real_estate_type || '',
    building_size: listing?.building_size || '',
    lease_expiration: listing?.lease_expiration || '',
    employees: listing?.employees || '',
    facilities: listing?.facilities || '',
    competition: listing?.competition || '',
    growth_expansion: listing?.growth_expansion || '',
    financing_details: listing?.financing_details || '',
    support_training: listing?.support_training || '',
    reason_for_selling: listing?.reason_for_selling || '',
    listing_agent: listing?.listing_agent || '',
    agent_phone_number: listing?.agent_phone_number || '',
    status: listing?.status || 'draft',
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  // Helper to safely get field value with proper type
  const getFieldValue = (name: string): FormFieldValue => {
    return data[name] ?? '';
  };

  // Helper to safely get a string value with a default
  const getStringValue = (key: string, defaultValue: string = ''): string => {
    const value = data[key];
    return value === null || value === undefined ? defaultValue : String(value);
  };

  // Helper to safely get a number value with a default
  const getNumberValue = (key: string, defaultValue: number | null = null): string => {
    const value = data[key];
    if (value === null || value === undefined || value === '') {
      return defaultValue === null ? '' : String(defaultValue);
    }
    return String(value);
  };

  // Helper to safely get a boolean value
  const getBooleanValue = (key: string, defaultValue: boolean = false): boolean => {
    const value = data[key];
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return value === true || value === 'true' || value === 1 || value === '1';
  };

  // Helper to handle value changes with proper typing
  const handleValueChange = (name: string, value: FormFieldValue) => {
    // Convert empty strings to null for consistency
    const normalizedValue = value === '' ? null : value;
    setData(name, normalizedValue);
  };

  // Handle string input changes
  const handleStringChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleValueChange(name, value);
  };

  // Handle number input changes
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleValueChange(name, value === '' ? null : Number(value));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleValueChange(name, checked);
  };

  // Handle input changes with proper typing
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    
    if (type === 'checkbox') {
      handleValueChange(name, target.checked);
    } else if (type === 'number') {
      handleValueChange(name, value === '' ? null : Number(value));
    } else {
      handleValueChange(name, value);
    }
  };



  // Helper to handle file uploads with proper typing
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      handleValueChange(name, files[0]);
    }
  };

  // Handle select changes with proper typing
  const handleSelectChange = (name: string) => (value: string) => {
    handleValueChange(name, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline *</Label>
            <Input
              id="headline"
              value={getStringValue('headline')}
              onChange={handleStringChange}
              name="headline"
              required
            />
            {errors.headline && <p className="text-sm text-red-500">{errors.headline}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={getStringValue('industry')}
              onValueChange={handleSelectChange('industry')}
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
            {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="listing_type">Listing Type *</Label>
            <Select
              value={getStringValue('listing_type')}
              onValueChange={handleSelectChange('listing_type')}
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
            {errors.listing_type && <p className="text-sm text-red-500">{errors.listing_type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={getStringValue('status')}
              onValueChange={handleSelectChange('status')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Location Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location_name">Location Name *</Label>
            <Input
              id="location_name"
              name="location_name"
              value={getStringValue('location_name')}
              onChange={handleStringChange}
              required
            />
            {errors.location_name && <p className="text-sm text-red-500">{errors.location_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={getStringValue('address')}
              onChange={handleStringChange}
              required
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              value={getStringValue('city')}
              onChange={handleStringChange}
              required
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              name="state"
              value={getStringValue('state')}
              onChange={handleStringChange}
              required
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code *</Label>
            <Input
              id="zip"
              name="zip"
              value={getStringValue('zip')}
              onChange={handleStringChange}
              required
            />
            {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              name="county"
              value={getStringValue('county')}
              onChange={handleStringChange}
            />
            {errors.county && <p className="text-sm text-red-500">{errors.county}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_confidentiality">Location Confidentiality *</Label>
            <Select
              value={getStringValue('location_confidentiality')}
              onValueChange={handleSelectChange('location_confidentiality')}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select confidentiality" />
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
        <h2 className="text-lg font-medium mb-6">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={getStringValue('email')}
              onChange={handleStringChange}
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={getStringValue('phone_number')}
              onChange={handleStringChange}
            />
            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Financial Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="asking_price">Asking Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="asking_price"
                name="asking_price"
                type="number"
                min="0"
                step="0.01"
                value={getNumberValue('asking_price')}
                onChange={handleNumberChange}
                className="pl-7"
                required
              />
            </div>
            {errors.asking_price && <p className="text-sm text-red-500">{errors.asking_price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cash_flow">Cash Flow</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="cash_flow"
                name="cash_flow"
                type="number"
                min="0"
                step="0.01"
                value={getNumberValue('cash_flow')}
                onChange={handleNumberChange}
                className="pl-7"
              />
            </div>
            {errors.cash_flow && <p className="text-sm text-red-500">{errors.cash_flow}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gross_revenue">Gross Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="gross_revenue"
                name="gross_revenue"
                type="number"
                min="0"
                step="0.01"
                value={getNumberValue('gross_revenue')}
                onChange={handleNumberChange}
                className="pl-7"
              />
            </div>
            {errors.gross_revenue && <p className="text-sm text-red-500">{errors.gross_revenue}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ebitda">EBITDA</Label>
            <Input
              id="ebitda"
              name="ebitda"
              type="number"
              value={getNumberValue('ebitda')}
              onChange={handleNumberChange}
            />
            {errors.ebitda && <p className="text-sm text-red-500">{errors.ebitda}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">Rent</Label>
            <Input
              id="rent"
              name="rent"
              type="number"
              min="0"
              step="0.01"
              value={getNumberValue('rent')}
              onChange={handleNumberChange}
            />
            {errors.rent && <p className="text-sm text-red-500">{errors.rent}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year_established">Year Established</Label>
            <Input
              id="year_established"
              name="year_established"
              type="number"
              min="1800"
              max={new Date().getFullYear() + 1}
              value={getNumberValue('year_established', new Date().getFullYear())}
              onChange={handleNumberChange}
            />
            {errors.year_established && (
              <p className="text-sm text-red-500">{errors.year_established}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="seller_financing"
              name="seller_financing"
              checked={getBooleanValue('seller_financing')}
              onCheckedChange={(checked) => handleValueChange('seller_financing', checked)}
            />
            <Label htmlFor="seller_financing">Seller Financing Available</Label>
          </div>
          {errors.seller_financing && (
            <p className="text-sm text-red-500">{errors.seller_financing}</p>
          )}
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Business Details</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description</Label>
            <Input
              id="business_description"
              name="business_description"
              value={getStringValue('business_description')}
              onChange={handleStringChange}
            />
            {errors.business_description && (
              <p className="text-sm text-red-500">{errors.business_description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ad_id">Ad ID</Label>
              <Input
                id="ad_id"
                name="ad_id"
                value={getStringValue('ad_id')}
                onChange={handleStringChange}
              />
              {errors.ad_id && <p className="text-sm text-red-500">{errors.ad_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory</Label>
              <Input
                id="inventory"
                name="inventory"
                value={getStringValue('inventory')}
                onChange={handleStringChange}
              />
              {errors.inventory && <p className="text-sm text-red-500">{errors.inventory}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="real_estate_type">Real Estate Type</Label>
              <Select
                value={getStringValue('real_estate_type')}
                onValueChange={handleSelectChange('real_estate_type')}
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

            <div className="space-y-2">
              <Label htmlFor="building_size">Building Size (sq ft)</Label>
              <Input
                id="building_size"
                name="building_size"
                type="number"
                min="0"
                value={getNumberValue('building_size')}
                onChange={handleNumberChange}
              />
              {errors.building_size && (
                <p className="text-sm text-red-500">{errors.building_size}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lease_expiration">Lease Expiration</Label>
              <Input
                id="lease_expiration"
                name="lease_expiration"
                type="date"
                value={getStringValue('lease_expiration')}
                onChange={handleStringChange}
              />
              {errors.lease_expiration && (
                <p className="text-sm text-red-500">{errors.lease_expiration}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees</Label>
              <Input
                id="employees"
                name="employees"
                type="number"
                min="0"
                value={getNumberValue('employees')}
                onChange={handleNumberChange}
              />
              {errors.employees && <p className="text-sm text-red-500">{errors.employees}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilities">Facilities</Label>
            <Input
              id="facilities"
              name="facilities"
              value={getStringValue('facilities')}
              onChange={handleStringChange}
            />
            {errors.facilities && <p className="text-sm text-red-500">{errors.facilities}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="competition">Competition</Label>
            <Input
              id="competition"
              name="competition"
              value={getStringValue('competition')}
              onChange={handleStringChange}
            />
            {errors.competition && <p className="text-sm text-red-500">{errors.competition}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="growth_expansion">Growth & Expansion</Label>
            <Input
              id="growth_expansion"
              name="growth_expansion"
              value={getStringValue('growth_expansion')}
              onChange={handleStringChange}
            />
            {errors.growth_expansion && (
              <p className="text-sm text-red-500">{errors.growth_expansion}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="support_transfer">Support & Training</Label>
            <Input
              id="support_transfer"
              name="support_transfer"
              value={getStringValue('support_transfer')}
              onChange={handleStringChange}
            />
            {errors.support_transfer && (
              <p className="text-sm text-red-500">{errors.support_transfer}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="selling_points">Selling Points</Label>
            <Input
              id="selling_points"
              name="selling_points"
              value={getStringValue('selling_points')}
              onChange={handleStringChange}
            />
            {errors.selling_points && (
              <p className="text-sm text-red-500">{errors.selling_points}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={getStringValue('website')}
              onChange={handleStringChange}
            />
            {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="financing_details">Financing Details</Label>
            <Input
              id="financing_details"
              name="financing_details"
              value={getStringValue('financing_details')}
              onChange={handleStringChange}
            />
            {errors.financing_details && (
              <p className="text-sm text-red-500">{errors.financing_details}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason_for_selling">Reason for Selling</Label>
            <Input
              id="reason_for_selling"
              name="reason_for_selling"
              value={getStringValue('reason_for_selling')}
              onChange={handleStringChange}
            />
            {errors.reason_for_selling && (
              <p className="text-sm text-red-500">{errors.reason_for_selling}</p>
            )}
          </div>
        </div>
      </div>

      {/* Listing Agent Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Listing Agent Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="listing_agent">Listing Agent</Label>
            <Input
              id="listing_agent"
              name="listing_agent"
              value={getStringValue('listing_agent')}
              onChange={handleStringChange}
            />
            {errors.listing_agent && (
              <p className="text-sm text-red-500">{errors.listing_agent}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent_phone_number">Agent Phone Number</Label>
            <Input
              id="agent_phone_number"
              name="agent_phone_number"
              type="tel"
              value={getStringValue('agent_phone_number')}
              onChange={handleStringChange}
            />
            {errors.agent_phone_number && (
              <p className="text-sm text-red-500">{errors.agent_phone_number}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Saving...' : 'Save Listing'}
        </Button>
      </div>
    </form>
  );
}
