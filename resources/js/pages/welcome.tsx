import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { User, Building, MapPin } from 'lucide-react';

interface Broker {
  id: number;
  name: string;
  company_name: string;
  serving_area: string;
  bio: string | null;
  profile_photo: string | null;
  phone: string;
}

interface Props {
  auth: any;
  brokers: Broker[];
  industries: string[];
  states: string[];
}

export default function Welcome({ auth, brokers, industries, states }: Props) {
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
            {/* Location Dropdown */}
            <div className="flex-1">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border-0 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Industry Dropdown */}
            <div className="flex-1">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border-0 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">All Industries</option>
                {industries.map((industryOption) => (
                  <option key={industryOption} value={industryOption}>
                    {industryOption}
                  </option>
                ))}
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

      {/* Recommended Brokers Section */}
      {brokers && brokers.length > 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Brokers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with verified business brokers who can help you buy or sell your business
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {brokers.map((broker) => (
                <Link key={broker.id} href={`/brokers/${broker.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                    {/* Broker Photo and Badge */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        {broker.profile_photo ? (
                          <img
                            src={broker.profile_photo}
                            alt={broker.name}
                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        {/* Premier Badge */}
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Premier
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{broker.name}</h3>
                        {broker.company_name && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <Building className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{broker.company_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Broker Info */}
                    <div className="space-y-2 mb-4">
                      {broker.serving_area && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{broker.serving_area}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bio Preview */}
                    {broker.bio && (
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {broker.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                href="/brokers"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#010079' }}
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
