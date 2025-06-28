import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function SearchPage() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Business Listings" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex space-x-6 text-sm font-medium text-gray-700">
              <Link href={route('search-business')} className="hover:text-gray-900">Search a Business</Link>
              <Link href="#" className="hover:text-gray-900">Buy a Business</Link>
              <Link href="#" className="hover:text-gray-900">Sell a Business</Link>
              <Link href="#" className="hover:text-gray-900">Resources</Link>
              <Link href="#" className="hover:text-gray-900">Industries</Link>
            </div>
            <div className="flex space-x-4 text-sm font-medium text-gray-700">
              {auth.user ? (
                <Link href={route('dashboard')} className="hover:text-gray-900">Dashboard</Link>
              ) : (
                <>
                  <Link href={route('login')} className="hover:text-gray-900">Log in</Link>
                  <Link href={route('register')} className="hover:text-gray-900">Register</Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Filter Bar */}
        <div className="bg-white border-b shadow-sm fixed top-16 left-0 w-full z-40">
          <div className="container mx-auto px-6 py-3 flex space-x-3 overflow-x-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="California"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <button className="flex items-center space-x-1 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100">
              <span>Industries</span><span>▼</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100">
              <span>Listing Types (3)</span><span>▼</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100">
              <span>Price Range</span><span>▼</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100">
              <span>More Filters</span><span>▼</span>
            </button>
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
              Clear
            </button>
            <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-1">
              <span>Save Search</span><span>▼</span>
            </button>
          </div>
        </div>

        {/* Spacer (header + filter) */}
        <div className="h-32" />

        {/* Test Listing */}
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold mb-6">Businesses For Sale in California</h2>
          <div className="divide-y divide-gray-200">
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <img
                src="/images/home-hero-1.webp"
                alt="Sample Listing"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="md:col-span-1 md:col-start-2">
                <h3 className="text-lg font-semibold">Sample Business Listing</h3>
                <p className="text-gray-600">Sample City, CA</p>
                <p className="mt-2 text-gray-700">
                  This is a test listing to demonstrate the layout using a default image.
                </p>
              </div>
              <div className="flex flex-col items-end md:col-span-1">
                <span className="text-xl font-bold">$195,000</span>
                <span className="text-sm text-gray-500">Cash Flow: $230,000</span>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}