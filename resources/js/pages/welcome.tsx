import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Building, MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CountUp from '@/components/CountUp';
import RecentBusinessesSold from '@/components/RecentBusinessesSold';

interface Listing {
  id: number;
  headline: string;
  asking_price: number;
  industry: string;
  location_name: string;
  image: string;
}

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
  latestListings: Listing[];
}

export default function Welcome({
  auth,
  brokers,
  industries,
  states,
  latestListings,
}: Props) {
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

          {/* Animated Stats Section */}
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#010079] mb-3">Recommended Brokers</h2>
            <p className="text-gray-700 text-lg">
              Connect with verified business brokers who can help you buy or sell your business
            </p>
          </div>

          {/* Broker Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {brokers.map((broker) => (
              <div
                key={broker.id}
                className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="absolute -top-3 left-5 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Premier
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={broker.profile_photo || '/images/default_broker.png'}
                      alt={broker.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{broker.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{broker.company_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{broker.serving_area}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700">{broker.bio}</p>
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

          <div className="text-center mt-12">
            <Link
              href="/brokers"
              className="bg-[#010079] text-white font-medium px-8 py-3 rounded-full hover:bg-blue-900 transition-all duration-200 inline-block"
            >
              See More Brokers
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Business Listings Section */}
      <section className="bg-[#010079] py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <h2 className="text-4xl font-bold mb-3">Latest Business Listings</h2>
    <p className="text-gray-200 text-lg mb-12">
      Discover the newest opportunities added to our marketplace
    </p>

    {latestListings && latestListings.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {latestListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col"
          >
            {/* Image with zoom effect */}
            <div className="w-full h-48 overflow-hidden rounded-2xl mb-4">
              <img
                src={listing.image}
                alt={listing.headline}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-[#010079] mb-1">
              {listing.headline}
            </h3>

            <p className="text-gray-600 text-sm mb-1">{listing.industry}</p>

            <p className="text-gray-700 text-base font-medium">
              {listing.location_name}
            </p>

            <p className="text-[#010079] font-bold mt-3">
              ${listing.asking_price?.toLocaleString()}
            </p>

            {/* Button */}
            <div className="mt-5">
              <Link
                href={route('listings.show', listing.id)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border border-[#010079] text-[#010079] hover:bg-[#010079] hover:text-white transition-all duration-200"
              >
                See More
              </Link>
            </div>
          </div>
        ))}
      </div>
    ) : latestListings === undefined ? (
      // Skeleton Loader
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 animate-pulse"
          >
            <div className="h-48 bg-gray-300 rounded-2xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-5 bg-gray-300 rounded w-1/3 mt-3"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-300 mt-8">No listings available right now.</p>
    )}

    <div className="text-center mt-12">
      <Link
        href="/listings"
        className="bg-white text-[#010079] font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 inline-block"
      >
        View All Listings
      </Link>
    </div>
  </div>
</section>



      <RecentBusinessesSold />
    </PublicLayout>
  );
}
