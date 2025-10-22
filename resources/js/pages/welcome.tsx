import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { User, Building, MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CountUp from '@/components/CountUp';
import RecentBusinessesSold from "@/components/RecentBusinessesSold";

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
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Find a business for sale
          </h1>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-lg shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
          >
            {/* All States Dropdown */}
            <div className="relative flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 text-gray-900 border-0 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white"
                  >
                    {location || 'All States'}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                  {states.map((state) => (
                    <DropdownMenuItem
                      key={state}
                      onClick={() => setLocation(state)}
                      className="cursor-pointer"
                    >
                      {state}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* All Industries Dropdown */}
            <div className="relative flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3 text-gray-900 border-0 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white"
                  >
                    {industry || 'All Industries'}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                  {industries.map((ind) => (
                    <DropdownMenuItem
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className="cursor-pointer"
                    >
                      {ind}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="hover:bg-blue-900 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200 whitespace-nowrap"
              style={{
                backgroundColor: '#010079',
                '--tw-ring-color': '#010079',
              } as React.CSSProperties}
            >
              Search
            </button>
          </form>

          {/* ✅ Animated Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4 text-center">
            <div className="flex justify-center items-center gap-1 md:gap-2 whitespace-nowrap">
              <CountUp end={100} className="text-xl md:text-2xl lg:text-3xl font-bold" />
              <span className="text-xs md:text-sm lg:text-base text-white-200">Businesses Listed</span>
            </div>

            <div className="flex justify-center items-center gap-1 md:gap-2 whitespace-nowrap">
              <CountUp end={100} className="text-xl md:text-2xl lg:text-3xl font-bold" />
              <span className="text-xs md:text-sm lg:text-base text-white-200">Businesses Sold</span>
            </div>

            <div className="flex justify-center items-center gap-1 md:gap-2 whitespace-nowrap">
              <CountUp end={100} className="text-xl md:text-2xl lg:text-3xl font-bold" />
              <span className="text-xs md:text-sm lg:text-base text-white-200">Active Brokers</span>
            </div>
          </div>
          
      </div>
    </div>

      {/* Recommended Brokers Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#010079] mb-3">
              Recommended Brokers
            </h2>
            <p className="text-gray-700 text-lg">
              Connect with verified business brokers who can help you buy or
              sell your business
            </p>
          </div>

          {/* Broker Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Premier Badge */}
                <div className="absolute -top-3 left-5 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Premier
                </div>

                {/* Broker Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={`/images/broker_placeholder_${(i % 3) + 1}.jpg`}
                      alt="Broker"
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Reancirl Balaba
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>Craphify Inc.</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>LA, NY</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-4">
                  <span className="text-xs text-gray-700 border border-gray-300 rounded-full px-3 py-1">
                    Broker
                  </span>
                  <span className="text-xs text-gray-700 border border-gray-300 rounded-full px-3 py-1">
                    Programmer
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="text-center mt-12">
            <button className="bg-[#010079] text-white font-medium px-8 py-3 rounded-full hover:bg-blue-900 transition-all duration-200">
              See More Brokers
            </button>
          </div>
        </div>
      </section>

            {/* Latest Business Listings Section */}
      <section className="bg-[#010079] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Heading */}
          <h2 className="text-4xl font-bold mb-3">Latest Business Listings</h2>
          <p className="text-gray-200 text-lg mb-12">
            Connect with verified business brokers who can help you buy or sell your business
          </p>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: 'HVAC Business',
                image: '/images/Mask group.png',
                description:
                  'Connect with verified business brokers who can help you buy or sell your business',
              },
              {
                id: 2,
                title: 'HVAC Business',
                image: '/images/Mask group 2.png',
                description:
                  'Connect with verified business brokers who can help you buy or sell your business',
              },
              {
                id: 3,
                title: 'HVAC Business',
                image: '/images/Mask group 3.png',
                description:
                  'Connect with verified business brokers who can help you buy or sell your business',
              },
            ].map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-56 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {listing.description}
                </p>
                <button
                  className="border border-[#010079] text-[#010079] px-5 py-2 rounded-full font-medium hover:bg-[#010079] hover:text-white transition-all duration-200"
                >
                  See More
                </button>
              </div>
            ))}
          </div>

          {/* See More Brokers Button */}
          <div className="mt-12">
            <button
              className="bg-white text-[#010079] px-8 py-6 rounded-full font-medium hover:opacity-90 transition-all duration-200"
            >
              See More Brokers
            </button>
          </div>
        </div>
      </section>
    <RecentBusinessesSold />
    </PublicLayout>
  );
}
