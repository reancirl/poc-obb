import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

export default function Welcome({ auth }: { auth: any }) {
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [activeTab, setActiveTab] = useState('Businesses');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (location) queryParams.append('search', location);
    if (industry) queryParams.append('industry', industry);
    
    const queryString = queryParams.toString();
    window.location.href = `/listings${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <PublicLayout auth={auth}>
      <Head title="Find a business for sale" />
      
      {/* Hero Banner */}
      <div
        className="relative min-h-[650px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(/images/hero_banner_1.webp)` }}
      > 
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Find a business for sale
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            {/* Location Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="California"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-0 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              {location && (
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Industry Dropdown */}
            <div className="flex-1">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border-0 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">All Industries</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail & E-commerce">Retail & E-commerce</option>
                <option value="Education & Training">Education & Training</option>
                <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Finance & Insurance">Finance & Insurance</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Construction & Contractors">Construction & Contractors</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Automotive and Boat">Automotive and Boat</option>
                <option value="Beauty and Personal Care">Beauty and Personal Care</option>
                <option value="Communication and Media">Communication and Media</option>
                <option value="Pet Services">Pet Services</option>
                <option value="Service Businesses">Service Businesses</option>
                <option value="Transportation and Storage">Transportation and Storage</option>
                <option value="Wholesale and Distributors">Wholesale and Distributors</option>
              </select>
            </div>
            
            {/* Search Button */}
            <button
              type="submit"
              className="hover:bg-blue-900 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200 whitespace-nowrap"
              style={{ backgroundColor: '#010079', '--tw-ring-color': '#010079' } as React.CSSProperties}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
